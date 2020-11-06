layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    /**
     * 用户列表展示
     */
    var  tableIns = table.render({
        elem: '#userList',
        url : ctx + '/user/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'userName', title: '用户名', minWidth:50, align:"center"},
            {field: 'email', title: '用户邮箱', minWidth:100, align:'center'},
            {field: 'phone', title: '用户电话', minWidth:100, align:'center'},
            {field: 'trueName', title: '真实姓名', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });



    /**
     * 表格重载
     *  用户列表的条件搜索
     */
    $(".search_btn").click(function () {
        tableIns.reload({
            where: { // 设定异步数据接口的额外参数，任意设
                userName:$("[name='userName']").val(),
                email:$("[name='email']").val(),
                phone:$("[name='phone']").val()
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

    /**
     * 头部工具栏
     */
    table.on('toolbar(users)', function (obj) {
        if (obj.event == "add") {
            // 打开添加或更新用户对话框
            openAddOrUpdateUserDialog();
        } else if (obj.event == "del") {
            // 得到指定表格选中的数据
            var checkData = table.checkStatus(obj.config.id);
            // 删除用户
            deleteUsers(checkData.data);
        }
    });

    /**
     * 行工具栏
     */
    table.on('tool(users)', function (obj) {
        if (obj.event == "edit") {
            // 打开添加或更新用户对话框
            openAddOrUpdateUserDialog(obj.data.id);
        } else if (obj.event == "del") {
            // 删除操作
            deleteUser(obj.data.id);
        }
    });

    /**
     * 打开添加或更新用户对话框
     * @param userId
     */
    function openAddOrUpdateUserDialog(userId) {
        var url  =  ctx + "/user/addOrUpdateUserPage";
        var title = "用户管理-用户添加";
        if(userId){
            url = url + "?id="+userId;
            title = "用户管理-用户更新";
        }
        layui.layer.open({
            title : title,
            type : 2,
            area:["650px","400px"],
            maxmin:true,
            content : url
        });
    }

    /**
     * 行工具栏的删除操作
     * @param userId
     */
    function deleteUser(userId) {
        // 监听删除事件
        layer.confirm('确定删除当前用户？', {icon: 3, title: "用户管理"}, function (index) {
            // 如果确认删除，则发送ajax请求
            var url = ctx + "/user/delete";
            var param = {ids:userId};
            $.post(url, param, function (result) {
                if (result.code == 200) {
                    layer.msg("删除成功！",{icon:6});
                    // 关闭确认框
                    layer.close(index);
                    // 刷新表格
                    tableIns.reload();
                } else {
                    layer.msg(result.msg,{icon:5});
                }
            });
        });
    }

    /**
     * 删除用户
     * @param data
     */
    function deleteUsers(data) {
        // 判断是否选中记录
        if (data.length < 1) {
            layer.msg("请选择要删除的记录！",{icon:5});
            return;
        }

        layer.confirm('确定删除选中的用户记录？', {
            btn: ['确定','取消'] //按钮
        }, function(index){
            // 关闭确认框
            layer.close(index);
            // 发送ajax请求
            var url = ctx + "/user/delete";
            var ids = "ids=";
            // 遍历数组
            for (var i = 0 ; i < data.length; i++) {
                var id = data[i].id;
                if (i < data.length - 1) {
                    ids += id  +"&ids="
                } else {
                    ids += id;
                }
            }

            $.ajax({
                type:"post",
                url:url,
                data:ids, // 数组参数
                success:function (result) {
                    if (result.code == 200) {
                        layer.msg("删除成功！",{icon:6});
                        // 刷新表格
                        tableIns.reload();
                    } else {
                        layer.msg(result.msg,{icon:5});
                    }
                }
            });
        });

    }



});