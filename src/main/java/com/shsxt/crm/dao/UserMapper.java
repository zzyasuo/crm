package com.shsxt.crm.dao;

import com.shsxt.crm.base.BaseMapper;
import com.shsxt.crm.vo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface UserMapper extends BaseMapper<User,Integer> {

    //通过用户名查询用户对象，返回用户对象
    User queryUserByName(String userName);

    //修改密码
    int updateUserPwd(@Param("userId") Integer userId,@Param("userPwd") String newPwd);

    //查询所有的销售人员
    List<Map<String,Object>> queryAllSales();
}