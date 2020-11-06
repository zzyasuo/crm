package com.shsxt.crm;

import com.alibaba.fastjson.JSON;
import com.shsxt.crm.base.ResultInfo;
import com.shsxt.crm.exceptions.NoLoginException;
import com.shsxt.crm.exceptions.ParamsException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PipedWriter;
import java.io.PrintWriter;

/**
 * 非法访问拦截  拦截器
 *      继承HandlerInterceptorAdapter适配器
 *
 * 实现步骤：
 *      1. 实现拦截器
 *          在拦截器中判断用混是否登录，未登录抛出未登录异常
 *      2. 全局异常处理
 *          在异常处理类中，判断未登录异常，重定向到登录页面
 *      3. 设置拦截器生效
 *          设置需要拦截的资源及放行的资源
 *
 *  判断用户是否是登录状态
 *      判断Cookie中是否有用户ID
 *          如果用户ID不存在，或用户对象不存在，抛出未登录异常
 *
 */
@Component
public class GlobalExceptionResolver implements HandlerExceptionResolver {

    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object handler, Exception e) {

        /**
         * 判断是否是未登录异常
         * 如果是，则重定向到登录页面
         */
        if (e instanceof NoLoginException){
            ModelAndView mv=new ModelAndView("redirect:index");
            return mv;
        }


        /**
         * 设置默认的异常处理
         */
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error");
        modelAndView.addObject("code",500);
        modelAndView.addObject("msg","系统异常");

        /**
         * 判断方法的返回值
         */
        if (handler instanceof HandlerMethod){
            HandlerMethod handlerMethod= (HandlerMethod) handler;
            //得到方法上@ResponseBody注解
            ResponseBody responseBody=handlerMethod.getMethod().getDeclaredAnnotation(ResponseBody.class);

            //判断注解是否为空,返回视图,如果不为空，返回JSON
            if (null==responseBody){
                /**
                 * 返回视图
                 */
                //判断自定义异常
                if (e instanceof ParamsException){
                    ParamsException p= (ParamsException) e;
                    modelAndView.addObject("code",p.getCode());
                    modelAndView.addObject("msg",p.getMsg());

                }else if (e instanceof NoLoginException){
                    NoLoginException n= (NoLoginException) e;
                    modelAndView.addObject("code",n.getCode());
                    modelAndView.addObject("msg",n.getMsg());
                }
                return modelAndView;
            }else {
                /**
                 * 返回JSON
                 */
                ResultInfo resultInfo=new ResultInfo();
                resultInfo.setCode(500);
                resultInfo.setMsg("系统异常，请重试!!");

                //处理自定义异常
                if (e instanceof ParamsException){
                    ParamsException p= (ParamsException) e;
                    resultInfo.setCode(p.getCode());
                    resultInfo.setMsg(p.getMsg());
                }

                //设置响应类型及编码格式
                response.setContentType("application/json;charset=UTF-8");

                //得到字符输出流
                PrintWriter writer=null;
                try {
                    writer=response.getWriter();
                    //将对象（JavaBean、list、map等）转换成JSON格式的字符串
                    String json=JSON.toJSONString(resultInfo);
                    //输出字符串
                    writer.write(json);
                    writer.flush();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }finally {
                    if (writer!=null){
                        writer.close();
                    }
                }
            }
        }
        return null;
    }
}
