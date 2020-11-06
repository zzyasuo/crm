layui.use(['form','jquery','jquery_cookie'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);

    /**
     * 表单的submit提交
     */
    form.on("submit(saveBtn)", function (data) {

        // TODO 参数的非空校验

        console.log(data.field);

        // 发送ajax请求
        $.ajax({
            type:"post",
            url: ctx + "/user/updatePwd",
            data:{
                oldPwd:data.field.old_password,
                newPwd:data.field.new_password,
                repeatPwd:data.field.again_password
            },
            success:function (result) {
                if (result.code == 200) {
                    // 修改成功后，用户自动退出系统
                    layer.msg("用户密码修改成功，系统将在3秒钟后退出...", function () {
                        // 退出系统后，删除对应的cookie
                        $.removeCookie("userIdStr", {domain:"localhost",path:"/crm"});
                        $.removeCookie("userName", {domain:"localhost",path:"/crm"});
                        $.removeCookie("trueName", {domain:"localhost",path:"/crm"});

                        // 跳转到登录页面 (父窗口跳转)
                        window.parent.location.href = ctx + "/index";

                    });
                } else {
                    layer.msg(result.msg,{icon:5})
                }
            }

        });

        return false;
    });


});