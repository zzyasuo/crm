package com.shsxt.crm.controller;

import com.shsxt.crm.base.BaseController;
import com.shsxt.crm.base.ResultInfo;
import com.shsxt.crm.query.SaleChanceQuery;
import com.shsxt.crm.service.SaleChanceService;
import com.shsxt.crm.utils.CookieUtil;
import com.shsxt.crm.utils.LoginUserUtil;
import com.shsxt.crm.vo.SaleChance;
import com.shsxt.crm.vo.User;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("sale_chance")
public class SaleChanceController extends BaseController {

    @Resource
    private SaleChanceService saleChanceService;


    /**
     * 多条件查询营销机会列表
     * @param saleChanceQuery
     * @return
     */
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryByParams(SaleChanceQuery saleChanceQuery){

        return saleChanceService.querySaleChanceByParams(saleChanceQuery);
    }

    /**
     * 进入营销机会界面
     * @return
     */
    @RequestMapping("index")
    public String toSaleChancePage(){
        return "saleChance/sale_chance";
    }

    @RequestMapping("add")
    @ResponseBody
    public ResultInfo addSaleChance(SaleChance saleChance, HttpServletRequest request){

        //得到cookie中的用户对象
        String userName = CookieUtil.getCookieValue(request,"userName");
        saleChance.setCreateMan(userName);

        //调用Service层
        saleChanceService.addSaleChance(saleChance);

        return success();
    }

    /**
     * 进入添加或修改营销机会的界面
     * @return
     */
    @RequestMapping("toAddOrUpdatePage")
    public String toAddOrUpdatePage(HttpServletRequest request,Integer saleChanceId){

        //判断saleChanceId是否为空，如果不为空，则通过id查询营销机会对象
        if (saleChanceId!=null){
            //通过id查询营销机会对象
            SaleChance saleChance = saleChanceService.selectByPrimaryKey(saleChanceId);
            //设置请求域
            request.setAttribute("saleChance",saleChance);
        }

        return "saleChance/add_update";
    }

    /**
     * 修改营销机会
     * @param saleChance
     * @param request
     * @return
     */
    @RequestMapping("update")
    @ResponseBody
    public ResultInfo updateSaleChance(SaleChance saleChance, HttpServletRequest request){


        //调用Service层
        saleChanceService.updateSaleChance(saleChance);

        return success();
    }


}
