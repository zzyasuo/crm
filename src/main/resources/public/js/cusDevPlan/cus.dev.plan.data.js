layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    /**
     * 计划项数据展示
     */
    var  tableIns = table.render({
        elem: '#cusDevPlanList',
        url : ctx+'/cus_dev_plan/list?saleChanceId='+$("input[name='id']").val(),
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "cusDevPlanListTable",
        cols : [[
            {type: "checkbox", fixed:"center"},
            {field: "id", title:'编号',fixed:"true"},
            {field: 'planItem', title: '计划项',align:"center"},
            {field: 'exeAffect', title: '执行效果',align:"center"},
            {field: 'planDate', title: '执行时间',align:"center"},
            {field: 'createDate', title: '创建时间',align:"center"},
            {field: 'updateDate', title: '更新时间',align:"center"},
            {title: '操作',fixed:"right",align:"center", minWidth:150,templet:"#cusDevPlanListBar"}
        ]]
    });


    /**
     * 绑定头部工具栏
     */
    table.on('toolbar(cusDevPlans)', function (obj) {
        if (obj.event == "add") {
            // 打开计划项的对话框
            openAddOrUpdateCusDevPlanDialog();
        } else if (obj.event == "success") {
            // 开发成功
            updateSaleChanceDevResult(2);
        } else if (obj.event == "failed") {
            // 开发失败
            updateSaleChanceDevResult(3);
        }
    });

    /**
     * 绑定行工具栏
     */
    table.on('tool(cusDevPlans)',function (obj) {
        if (obj.event == "edit") {
            // 打开计划项的对话框
            openAddOrUpdateCusDevPlanDialog(obj.data.id);
        } else if (obj.event = "del") {
            // 删除计划项
            deleteCusDevPlan(obj.data.id);
        }
    });

    /**
     * 打开添加或修改 对话框
     */
    function openAddOrUpdateCusDevPlanDialog(cusDevPlanId) {
        var title = "客户开发计划 - 计划项添加";
        var url = ctx + "/cus_dev_plan/toCusDevPlanPage";

        // 得到计划项对应的营销机会的主键
        var saleChanceId = $("[name='id']").val();
        url += "?saleChanceId=" + saleChanceId;


        // 判断id是否为空，不为空则为修改操作
        if (cusDevPlanId != null && cusDevPlanId != '') {
            title = "客户开发计划 - 计划项更新";
            url += "&cusDevPlanId=" + cusDevPlanId;
        }
        layui.layer.open({
            title : title,
            type : 2,
            area:["500px","300px"],
            maxmin:true,
            content : url
        });
    }

    /**
     * 删除计划项
     * @param cusDevPlanId
     */
    function deleteCusDevPlan(cusDevPlanId) {
        // 询问是否确认删除
        layer.confirm("确定要删除这条记录吗？", {icon: 3, title:"计划项数据"}, function (index) {
            // 关闭确认框
            layer.close(index);

            // 发送ajax请求
            $.ajax({
                type:"post",
                url: ctx + "/cus_dev_plan/delete",
                data:{
                    cusDevPlanId:cusDevPlanId
                },
                success:function (result) {
                    if (result.code = 200) {
                        // 提醒成功
                        layer.msg("删除成功！", {icon:6});
                        // 刷新表格
                        tableIns.reload();
                    } else {
                        layer.msg(result.msg, {icon:5});
                    }
                }
            });

        });
    }

    /**
     * 修改营销机会的开发状态
     * @param devResult
     */
    function updateSaleChanceDevResult(devResult) {
        // 得到营销机会的id （隐藏域）
        var saleChanceId = $("[name='id']").val();

        // 弹出提示框询问用户
        layer.confirm("确认执行当前操作？", {icon:3, title:"计划项维护"}, function (index) {
            // 发送ajax请求
            $.ajax({
                type:"post",
                url:ctx+"/sale_chance/updateDevResult",
                data:{
                    saleChanceId:saleChanceId,
                    devResult:devResult
                },
                success:function (result) {
                    if (result.code == 200) {
                        layer.msg("操作成功！",{icon:6});
                        // 关闭弹出层
                        layer.closeAll("iframe");
                        // 刷新父页面
                        parent.location.reload();
                    } else {
                        layer.msg(result.msg, {icon:5});
                    }
                }
            });
        });

    }


});
