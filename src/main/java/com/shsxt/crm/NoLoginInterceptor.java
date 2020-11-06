package com.shsxt.crm;

import com.shsxt.crm.exceptions.NoLoginException;
import com.shsxt.crm.service.UserService;
import com.shsxt.crm.utils.LoginUserUtil;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 非法访问拦截 拦截器
 *      继承一个HandlerInterceptor适配器
 *
 *  实现步骤
 *          1.实现拦截器
 *              在拦截器中判断用户是否登录
 *
 *      判断用户登录状态
 *          判断Cookie中是否有用户ID
 *              如果不存在，组织目标方法执行
 */
public class NoLoginInterceptor extends HandlerInterceptorAdapter {

    @Resource
    private UserService userService;


    //在目标方法执行前
    //return true:表示允许目标方法执行
    //return false:阻止目标方法执行
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //获取用户Id（从cookie中获取）
        Integer userId= LoginUserUtil.releaseUserIdFromCookie(request);
        //判断Cookie中是否有用户id
        if(null==userId||null==userService.selectByPrimaryKey(userId)){
            //抛出未登录异常
            throw new NoLoginException();
        }

        return true;
    }
}
