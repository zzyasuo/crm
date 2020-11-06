package com.shsxt.crm.service;

import com.shsxt.crm.base.BaseService;
import com.shsxt.crm.dao.UserMapper;
import com.shsxt.crm.model.UserModel;
import com.shsxt.crm.utils.AssertUtil;
import com.shsxt.crm.utils.Md5Util;
import com.shsxt.crm.utils.UserIDBase64;
import com.shsxt.crm.vo.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class UserService extends BaseService<User,Integer> {

    @Resource
    private UserMapper userMapper;

    /**
     * 用户登录
     * @param userName
     * @param userPwd
     */
    public UserModel userLogin(String userName, String userPwd){
        //判断用户名密码不能为空
        AssertUtil.isTrue(StringUtils.isBlank(userName)||StringUtils.isBlank(userPwd),"用户名或密码不能为空");
        //通过用户名查询用户对象
        User user=userMapper.queryUserByName(userName);
        //判断用户对象是否为空
        AssertUtil.isTrue(user==null,"该用户不存在");
        //将前台传递的密码，通过MD5加密
        String pwd= Md5Util.encode(userPwd);
        //将加密后的密码与数据库密码比较
        AssertUtil.isTrue(!pwd.equals(user.getUserPwd()),"用户密码不正确");
        //构建用户模型并返回
        return buildUserModel(user);

    }

    /**
     * 构建用户模型
     * @param user
     * @return
     */
    @Transactional(propagation = Propagation.REQUIRED)
    private UserModel buildUserModel(User user) {
        UserModel userModel=new UserModel();
        userModel.setUserIdStr(UserIDBase64.encoderUserID(user.getId()));
        userModel.setUserName(user.getUserName());
        userModel.setTrueName(user.getTrueName());
        return userModel;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void updateUserPwd(Integer userId, String oldPwd, String newPwd,String repeatPwd) {

        //判断用户ID
        AssertUtil.isTrue(userId==null,"待更新用户不存在");
        //调用Dao层，通过用户ID查询用户对象
        User user=userMapper.selectByPrimaryKey(userId);
        //判断用户对象是否为空
        AssertUtil.isTrue(user==null,"待更新用户不存在");
        //判断原始密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(oldPwd),"原始密码不能为空");
        //判断原始密码是否正确
        AssertUtil.isTrue(!Md5Util.encode(oldPwd).equals(user.getUserPwd()),"原始密码不正确");
        //判断新密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(newPwd),"原始密码不能为空");
        //新旧密码不能相同
        AssertUtil.isTrue(oldPwd.equals(newPwd),"新密码与旧密码不能相同");
        //判断重复密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(repeatPwd),"重复密码不能为空");
        //判断重复密码与新密码是否一致
        AssertUtil.isTrue(!newPwd.equals(repeatPwd),"重复密码与新密码不一致");
        //执行更新操作
        AssertUtil.isTrue(userMapper.updateUserPwd(userId,Md5Util.encode(newPwd))<1,"修改密码失败");
    }

    /**
     * 查询所有的销售人员
     * @return
     */
    public List<Map<String,Object>> queryAllSales(){
        return userMapper.queryAllSales();
    }
}
