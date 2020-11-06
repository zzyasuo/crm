layui.use(['table','layer'],function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //角色列表展示
    var  tableIns = table.render({
        elem: '#roleList',
        url : ctx+'/role/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "roleListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'roleName', title: '角色名', minWidth:50, align:"center"},
            {field: 'roleRemark', title: '角色备注', minWidth:100, align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#roleListBar',fixed:"right",align:"center"}
        ]]
    });

    /**
     * 表格重载
     *  角色列表的条件搜索
     */
    $(".search_btn").click(function () {
        tableIns.reload({
            where: { // 设定异步数据接口的额外参数，任意设
                roleName:$("[name='roleName']").val()
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });


    /**
     * 头部工具栏
     */
    table.on('toolbar(roles)', function (obj) {
        if (obj.event == "add") {
            // 打开添加或更新角色对话框
            openAddOrUpdateRoleDialog();
        } else if(obj.event == "grant") {
            // 获取选中的信息
            var checkData = table.checkStatus(obj.config.id)
            // 角色授权
            openRoleGrantDialog(checkData.data);
        }
    });

    /**
     * 行工具栏
     */
    table.on('tool(roles)', function (obj) {
        if (obj.event == "edit") {
            // 打开添加或更新角色对话框
            openAddOrUpdateRoleDialog(obj.data.id);
        } else if (obj.event == "del") {
            // 删除操作
            deleteRole(obj.data.id);
        }
    });

    /**
     * 打开添加或更新角色对话框
     * @param roleId
     */
    function openAddOrUpdateRoleDialog(roleId) {
        var url  =  ctx + "/role/addOrUpdateRolePage";
        var title = "角色管理-角色添加";
        if(roleId){
            url = url + "?roleId="+roleId;
            title = "角色管理-角色更新";
        }
        layui.layer.open({
            title : title,
            type : 2,
            area:["600px","280px"],
            maxmin:true,
            content : url
        });
    }

    /**
     * 行工具栏的删除操作
     * @param roleId
     */
    function deleteRole(roleId) {
        // 监听删除事件
        layer.confirm('确定删除当前角色？', {icon: 3, title: "角色管理"}, function (index) {
            // 如果确认删除，则发送ajax请求
            var url = ctx + "/role/delete";
            var param = {roleId:roleId};
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
     * 打开角色授权页面
        1. 判断用户是否选择角色
        2. 判断角色是否多选
        3. 打开窗口
     * @param data
     */
    function openRoleGrantDialog(data) {
        // 判断用户是否选择角色
        if (data.length == 0) {
            layer.msg("请选择要授权的角色！", {icon:5});
            return;
        }
        // 判断角色是否多选
        if (data.length > 1) {
            layer.msg("暂不支持批量操作！！", {icon:5});
            return;
        }

        var url  =  ctx+"/role/toAddGrantPage?roleId="+data[0].id;
        var title="角色管理-角色授权";
        layui.layer.open({
            title : title,
            type : 2,
            area:["600px","350px"],
            maxmin:true,
            content : url
        });
    }



});