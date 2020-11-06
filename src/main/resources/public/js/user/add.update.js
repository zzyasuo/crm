layui.use(['form', 'layer','formSelects'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    // 引入 formSelects 模块
    var  formSelects = layui.formSelects;


    /**
     * 监听表单的submit
     */
    form.on('submit(addOrUpdateUser)',function (data) {

        // console.log(data.field);
        // 提交数据时的加载层 （https://layer.layui.com/）
        var index = layer.msg("数据提交中,请稍后...",{
            icon:16, // 图标
            time:false, // 不关闭
            shade:0.8 // 设置遮罩的透明度
        });

        // 请求的地址
        var url = ctx + "/user/add";

        // 判断用户的主键是否为空；如果不为空，则为修改操作
        if ($("[name='id']").val()) {
            url = ctx + "/user/update";
        }

        // 请求的参数
        var param = data.field;

        // 发送ajax请求
        $.post(url, param, function (result) {
            // 判断结果
            if (result.code == 200) {
                // 提示用户
                layer.msg("操作成功！",{icon:6});
                // 关闭加载层
                layer.close(index);
                // 关闭所有的iframe层
                layer.closeAll("iframe");
                // 刷新页面
                parent.location.reload();
            } else {
                layer.msg(result.msg, {icon:5});
            }
        });

        return false; // 阻止表单提交
    });


    /**
     * 关闭弹出层
     */
    $("#closeBtn").click(function () {
        // 先得到当前iframe层的索引
        var index = parent.layer.getFrameIndex(window.name);
        // 再执行关闭
        parent.layer.close(index);
    });


    /**
     * 加载下角色拉框
     *      formSelects.config('下拉框的id', {

            },true);
     */
    // 从隐藏域中获取用户ID
    var userId = $("[name='id']").val();
    formSelects.config('selectId', {
        type:"post", // 请求方式
        searchUrl:ctx + "/role/queryAllRoles?userId=" + userId, // 请求路径
        keyName:'roleName',  // 对应数据中的键
        keyVal:'id' // 对应数据中的值
    },true);

});