layui.use(['form','jquery','jquery_cookie'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);

    /**
     * 监听表单submit提交
     *      格式：
     *          form.on("submit(按钮的lay-filter属性值)",function (data) {

                });
     */
    form.on("submit(login)",function (data) {
        console.log(data);

        // TODO 参数的非空校验

        // 发送ajax请求，传递用户名和密码
        $.ajax({
            type:"post",
            url: ctx + "/user/login",
            data:{
                // 参数的key要与后台方法的形参名保持一致
                userName:data.field.username,
                userPwd:data.field.password
            },
            success:function (result) {
                // 判断是否登录成功
                if (result.code == 200) {
                    layer.msg("登录成功！", {icon:6});
                    // 2秒后跳转到首页
                    setTimeout(function () {
                        window.location.href = ctx + "/main"
                    },2000);

                    // 判断用户是否选择记住密码
                    if ($("#rememberMe").prop("checked")) { // 判断复选框是否被选中
                        // 将用户信息设置到cookie中 (7天失效)
                        $.cookie("userIdStr", result.result.userIdStr,{expires:7});
                        $.cookie("userName", result.result.userName,{expires:7});
                        $.cookie("trueName", result.result.trueName,{expires:7});
                    } else {
                        // 将用户信息设置到cookie中
                        $.cookie("userIdStr", result.result.userIdStr);
                        $.cookie("userName", result.result.userName);
                        $.cookie("trueName", result.result.trueName);
                    }

                } else {
                    layer.msg(result.msg, {icon:5});
                }
            }
        });

        // 阻止表单提交
        return false;
    });
    
    
});