layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;


    /**
     * 监听表单的submit
     */
    form.on('submit(addOrUpdateSaleChance)',function (data) {

        // console.log(data.field);
        // 提交数据时的加载层 （https://layer.layui.com/）
        var index = layer.msg("数据提交中,请稍后...",{
            icon:16, // 图标
            time:false, // 不关闭
            shade:0.8 // 设置遮罩的透明度
        });

        // 请求的地址
        var url = ctx + "/sale_chance/add";

        // 判断营销机会的主键是否为空；如果不为空，则为修改操作
        if ($("#saleChanceId").val()) {
            url = ctx + "/sale_chance/update";
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
     * 加载指派人下拉框的数据
     */
    $.post(ctx + "/user/queryAllSales",function (result) {
        console.log(result);
        // 判断数据是否存在
        if (result.length > 0) {
            // 得到下拉框
            var sel = $("#assignMan");
            // 获取隐藏域中指派人的ID
            var assignManId = $('#assignManId').val();
            // 遍历集合
            for (var i =0; i < result.length; i++) {

                // 拼接option标签
                var opt = "";
                if (result[i].id == assignManId) { // 需要被选中的
                    opt = "<option value='"+result[i].id+"' selected>"+result[i].uname+"</option>";
                } else {
                    opt = "<option value='"+result[i].id+"'>"+result[i].uname+"</option>";
                }

                // 设置到下拉框中
                sel.append(opt);
            }
            // 重新渲染下拉框内容
            layui.form.render("select");
        }
    });


});