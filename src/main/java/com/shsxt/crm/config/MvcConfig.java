package com.shsxt.crm.config;

import com.shsxt.crm.NoLoginInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * 配置类
 */
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {

    //设置Bean对象，交给IOC容器维护
    @Bean
    public NoLoginInterceptor noLoginInterceptor(){
        return new NoLoginInterceptor();
    }

    /**
     * 设置拦截器
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(noLoginInterceptor())
                //设置需要拦截的资源
                .addPathPatterns("/**")//拦截所有
                //设置需要放行的资源
                //登录页面、登录操作、静态资源（js、css、images、lib插件）
                .excludePathPatterns("/index","/user/login","/js/**","/css/**","/images/**","/lib/**");
    }
}
