layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;


    /**
     * 营销机会数据列表
     */
    var tableIns = table.render({
        elem: '#saleChanceList', // 表格绑定的ID
        url : ctx + '/sale_chance/list', // 访问数据的地址
        cellMinWidth : 95,
        page : true, // 开启分页
        height : "full-125",
        limits : [10,15,20,25], // 可以选择每页显示的数量
        limit : 10, // 默认每页显示的数量
        toolbar: "#toolbarDemo", // 头部工具栏
        id : "saleChanceListTable",
        cols : [[
            {type: "checkbox", fixed:"center"}, // 复选框
            {field: "id", title:'编号',fixed:"true"},
            {field: 'chanceSource', title: '机会来源',align:"center"},
            {field: 'customerName', title: '客户名称',  align:'center'},
            {field: 'cgjl', title: '成功几率', align:'center'},
            {field: 'overview', title: '概要', align:'center'},
            {field: 'linkMan', title: '联系人',  align:'center'},
            {field: 'linkPhone', title: '联系电话', align:'center'},
            {field: 'description', title: '描述', align:'center'},
            {field: 'createMan', title: '创建人', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center'},
            {field: 'uname', title: '指派人', align:'center'},
            {field: 'assignTime', title: '分配时间', align:'center'},
            {field: 'state', title: '分配状态', align:'center',templet:function(d){
                    return formatterState(d.state);
                }},
            {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                    return formatterDevResult(d.devResult);
                }},
            // 行工具栏
            {title: '操作', templet:'#saleChanceListBar',fixed:"right",align:"center", minWidth:150}
        ]]
    });




    /**
     * 格式化分配状态
     *  0 - 未分配
     *  1 - 已分配
     *  其他 - 未知
     * @param state
     * @returns {string}
     */
    function formatterState(state){
        if(state==0) {
            return "<div style='color: yellow'>未分配</div>";
        } else if(state==1) {
            return "<div style='color: green'>已分配</div>";
        } else {
            return "<div style='color: red'>未知</div>";
        }
    }

    /**
     * 格式化开发状态
     *  0 - 未开发
     *  1 - 开发中
     *  2 - 开发成功
     *  3 - 开发失败
     * @param value
     * @returns {string}
     */
    function formatterDevResult(value){
        if(value == 0) {
            return "<div style='color: yellow'>未开发</div>";
        } else if(value==1) {
            return "<div style='color: #00FF00;'>开发中</div>";
        } else if(value==2) {
            return "<div style='color: #00B83F'>开发成功</div>";
        } else if(value==3) {
            return "<div style='color: red'>开发失败</div>";
        } else {
            return "<div style='color: #af0000'>未知</div>"
        }

    }


    /**
     * 表格重载
     *  营销机会的条件搜索
     */
    $(".search_btn").click(function () {
        tableIns.reload({
            where: { // 设定异步数据接口的额外参数，任意设
                // 客户名
                customerName:$("#customerName").val(),
                // 创建人
                createMan:$("[name='createMan']").val(),
                // 分配状态
                state:$("#state").val()
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });


    /**
     * 绑定头部工具栏
     *  table.on('toolbar(表格的lay-filter属性值)', function(obj){
     *
     *  });
     */
    table.on('toolbar(saleChances)',function (obj) {
        //console.log(obj);
        // 判断事件类型
        switch (obj.event) {
            case "add": // 添加操作
                openAddOrUpdateSaleChanceDialog();
                break;
            case "del": // 删除操作
                // 获取数据表格被选中的记录
                var checkStatus = table.checkStatus(obj.config.id);
                console.log(checkStatus);
                // 删除营销机会
                deleteSaleChanceList(checkStatus.data);
                break;

        }
    });


    /**
     * 批量删除营销机会
     *  1. 判断是否选中记录
     *  2. 询问用户是否确认删除
     *  3. 遍历选中记录，得到用户ID，拼接id参数 （ids=1&ids=2&ids=3）
     *  4. 发送ajax请求
     * @param dataList
     */
    function deleteSaleChanceList(dataList) {
        // 判断是否选中记录
        if (dataList.length < 1) {
            layer.msg("请选择要删除的记录！",{icon:5});
            return;
        }

        // 询问用户是否确认删除
        layer.confirm("您确定要删除选中的记录吗？",{
            btn:["确认","取消"],
        },function (index) {
            // 关闭确认框
            layer.close(index);

            // 遍历选中记录，得到用户ID，拼接id参数 （ids=1&ids=2&ids=3）
            var ids = "ids=";
            for (var i = 0; i < dataList.length; i++) {
                var saleChance = dataList[i];
                // 判断是否是最后一个元素
                if (i < dataList.length - 1) {
                    ids += saleChance.id + '&ids=';
                } else {
                    ids += saleChance.id;
                }
            }
            // 发送ajax请求
            $.ajax({
                type:"post",
                url:ctx + "/sale_chance/delete",
                data:ids, // 参数传递的是数组
                success:function (result) {
                    if (result.code == 200) {
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
     * 绑定行工具栏
     *  table.on('tool(表格的lay-filter属性值)', function(obj){
     *
     *  });
     */
    table.on('tool(saleChances)', function (obj) {
        console.log(obj);
        if (obj.event == "edit") {
            // 打开营销机会更新的对话框
            openAddOrUpdateSaleChanceDialog(obj.data.id);
        } else if (obj.event == "del") {
            // 删除营销机会
            deleteSaleChance(obj.data.id);
        }
    });


    /**
     * 打开添加或修改营销机会对话框
     *      添加时，saleChanceId的值为空
     *      更新时，saleChanceId的值是待更新记录的主键
     */
    function openAddOrUpdateSaleChanceDialog(saleChanceId) {
        // 判断id是否为空  如果为空，表示添加操作；否则是修改操作
        var title = "营销机会管理 - 机会添加"; // 标题
        var url = ctx + '/sale_chance/toAddOrUpdatePage';

        if (saleChanceId != null && saleChanceId != "") {
            title = "营销机会管理 - 机会更新";
            url += '?saleChanceId=' + saleChanceId;
        }

        layui.layer.open({
            type: 2, // iframe层
            title: title, // 标题
            area:["500px","620px"], // 弹出框的宽高
            maxmin:true, // 可最大化最小化
            content: url // url地址
        });
    }


    /**
     * 删除营销机会
     * @param saleChanceId
     */
    function deleteSaleChance(saleChanceId) {
        // 询问是否确认删除
        layer.confirm("确定要删除这条记录吗？", {icon: 3, title:"营销机会数据管理"}, function (index) {
            // console.log(saleChanceId);
            // 关闭确认框
            layer.close(index);

            // 发送ajax请求
            $.ajax({
                type:"post",
                url: ctx + "/sale_chance/delete",
                data:{
                    ids:saleChanceId
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




});
