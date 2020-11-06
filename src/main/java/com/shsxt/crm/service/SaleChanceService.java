package com.shsxt.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shsxt.crm.base.BaseService;
import com.shsxt.crm.dao.SaleChanceMapper;
import com.shsxt.crm.enums.DevResult;
import com.shsxt.crm.enums.StateStatus;
import com.shsxt.crm.query.SaleChanceQuery;
import com.shsxt.crm.utils.AssertUtil;
import com.shsxt.crm.utils.PhoneUtil;
import com.shsxt.crm.vo.SaleChance;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SaleChanceService extends BaseService<SaleChance,Integer> {

    @Resource
    private SaleChanceMapper saleChanceMapper;

    /**
     * 根据条件查询营销机会
     * @param saleChanceQuery
     * @return
     */
    public Map<String,Object> querySaleChanceByParams(SaleChanceQuery saleChanceQuery){
        Map<String,Object> map=new HashMap<>();
        map.put("code",0);
        map.put("msg","");

        //开启分页
        PageHelper.startPage(saleChanceQuery.getPage(),saleChanceQuery.getLimit());
        //得到营销机会的列表
        List<SaleChance> list = saleChanceMapper.querySaleChanceByParams(saleChanceQuery);
        //得到当前的分页对象
        PageInfo<SaleChance> pageInfo=new PageInfo<>(list);
        //总记录数
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());

        return map;
    }

    /**
     * 添加营销机会
     1. 非空判断
     customerName客户名  非空
     linkMan联系人       非空
     linkPhone联系号码   非空且格式正确
     2. 判断是否设置了指派人
     如果指派人为空 （未指派）
     assignTime分配时间  设置为null
     state分配状态       设置为未分配   1=已分配，0=未分配
     devResult开发状态   设置为未开发   0=未开发，1=开发中，2=开发成功，3=开发失败
     如果指派人不为空 （已指派）
     assignTime分配时间  设置为当前时间
     state分配状态       设置为已分配   1=已分配，0=未分配
     devResult开发状态   设置为开发中   0=未开发，1=开发中，2=开发成功，3=开发失败
     3. 设置默认值
     isValid是否有效     设置为1  1=有效，0=无效
     createDate创建时间  设置为当前时间
     updateDate修改时间  设置为当前时间
     4. 执行添加操作，判断受影响的行数
     * @param saleChance
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addSaleChance(SaleChance saleChance){
        //1.非空判断
        cherckSaleChanceParams(saleChance.getCustomerName(),saleChance.getLinkMan(),saleChance.getLinkPhone());

        //2.判断是否设置了指派人
        if (StringUtils.isBlank(saleChance.getAssignMan())){
            //如果指派人为空
            saleChance.setAssignTime(null);

            //state分配状态  设置为未分屏
            saleChance.setState(StateStatus.UNSTATE.getType());
            //decResult开发状态  设置为未开发
            saleChance.setState(DevResult.UNDEV.getStatus());
        }else{
            saleChance.setAssignTime(new Date());
            saleChance.setState(StateStatus.STATED.getType());
            saleChance.setDevResult(DevResult.DEVING.getStatus());
        }
        saleChance.setIsValid(1);
        saleChance.setCreateDate(new Date());
        saleChance.setUpdateDate(new Date());

        AssertUtil.isTrue(saleChanceMapper.insertSelective(saleChance)<1,"营销机会数据添加失败");
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void updateSaleChance(SaleChance saleChance){
        //id 主键非空  且id对应的数据存在
        AssertUtil.isTrue(null==saleChance.getId(),"待更新记录不存在");
        SaleChance temp=saleChanceMapper.selectByPrimaryKey(saleChance.getId());
        AssertUtil.isTrue(null==temp,"待更新记录不存在");
        //非空校验
        cherckSaleChanceParams(saleChance.getCustomerName(),saleChance.getLinkMan(),saleChance.getLinkPhone());

        //设置默认值  修改时间  设置为当前系统时间
        saleChance.setUpdateDate(new Date());

        //设置相关字段
        //判断原来的指派人是否为空
        if (StringUtils.isBlank(temp.getAssignMan())){
            //原来为空
            if (!StringUtils.isBlank(saleChance.getAssignMan())){
                // 修改后不为空
                //设置指派时间 分配状态 开发状态
                saleChance.setAssignTime(new Date());
                saleChance.setState(StateStatus.STATED.getType());//已分配
                saleChance.setDevResult(DevResult.DEVING.getStatus());//开发中
            }
        }else {
            //原来 不为空
            if (StringUtils.isBlank(saleChance.getAssignMan())){
                //修改后为空
                //设置指派时间 分配状态 开发状态
                saleChance.setAssignTime(null);//没有指派时间
                saleChance.setState(StateStatus.UNSTATE.getType());//未分配
                saleChance.setDevResult(DevResult.UNDEV.getStatus());//未开发
            }else {
                //修改后 不为空
                //修改前后指派人是否改变
                if (!temp.getAssignMan().equals(saleChance.getAssignMan())){
                    //如果指派人改变，则修改指派时间
                    saleChance.setAssignTime(new Date());
                }else {
                    saleChance.setAssignTime(temp.getAssignTime());
                }
            }
        }
        //执行更新
        AssertUtil.isTrue(saleChanceMapper.updateByPrimaryKeySelective(saleChance)<1,"营销机会修改失败！");
    }


    /**
     * 判断必填字段是否为空
     * @param customerName
     * @param linkMan
     * @param linkPhone
     */
    private void cherckSaleChanceParams(String customerName, String linkMan, String linkPhone) {

        //客户名
        AssertUtil.isTrue(StringUtils.isBlank(customerName),"客户名不能为空");
        AssertUtil.isTrue(StringUtils.isBlank(linkMan),"联系人不能为空");
        AssertUtil.isTrue(StringUtils.isBlank(linkPhone),"联系号码不能为空");
        //手机号是否合法
        AssertUtil.isTrue(!PhoneUtil.isMobile(linkPhone),"联系号码格式不对");

    }


}
