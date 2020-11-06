layui.use(['table', 'treetable','layer'], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer;
    var $ = layui.jquery;
    var table = layui.table;
    var treeTable = layui.treetable;

    // 渲染表格
    treeTable.render({
        treeColIndex: 1,
        treeSpid: -1,
        treeIdName: 'id', // 当前节点的id
        treePidName: 'parentId', // 当前节点对应的父节点的ID
        elem: '#munu-table', // 容器的ID属性值
        url: ctx+'/module/list', // 数据请求的地址
        toolbar: "#toolbarDemo", // 绑定头部工具栏
        treeDefaultClose:true,
        page: true,
        cols: [[
            {type: 'numbers'},
            {field: 'moduleName', minWidth: 100, title: '菜单名称'},
            {field: 'optValue', title: '权限码', width:100},
            {field: 'url', title: '菜单url'},
            {field: 'createDate', title: '创建时间'},
            {field: 'updateDate', title: '更新时间'},
            {
                field: 'grade', width: 80, align: 'center', templet: function (d) {
                    if (d.grade == 0) {
                        return '<span class="layui-badge layui-bg-blue">目录</span>';
                    }
                    if(d.grade==1){
                        return '<span class="layui-badge-rim">菜单</span>';
                    }
                    if (d.grade == 2) {
                        return '<span class="layui-badge layui-bg-gray">按钮</span>';
                    }
                }, title: '类型'
            },
            {templet: '#auth-state', width: 220, align: 'center', title: '操作'}
        ]],
        done: function () {
            layer.closeAll('loading');
        }
    });


    //监听头部工具栏
    table.on('tool(munu-table)', function (obj) {
        console.log(obj);
       if (obj.event == "del") {
           // 删除资源记录
           deleteModule(obj.data.id);
       } else if (obj.event == "add") {
           if(obj.data.grade==2){
               layer.msg("暂不支持四级菜单添加操作!",{icon:5});
               return;
           }
           // 添加子菜单 = 当前层级+1
           // 子菜单的父菜单= 当前菜单
           openAddModuleDialog(obj.data.grade + 1, obj.data.id)
       } else if (obj.event === 'edit') {
           // 记录修改
           openUpdateModuleDialog(obj.data.id);
       }
    });


    /**
     * 头部工具栏
     */
    table.on('toolbar(munu-table)', function (obj) {
        if (obj.event == "add") {
           // 打开资源对话框
            openAddModuleDialog(0,-1); // 一级菜单0，无父菜单-1
        } else if (obj.event == "expand") {
            treeTable.expandAll('#munu-table');
        } else if (obj.event == "fold") {
            treeTable.foldAll('#munu-table');
        }
    });

    /**
     *
     * @param grade  0=一级菜单，1=二级菜单，2=三级菜单
     * @param parentId 父菜单ID
     */
    function openAddModuleDialog(grade, parentId) {
        var url  =  ctx+"/module/addModulePage?grade="+grade+"&parentId="+parentId;
        var title="菜单添加";
        layui.layer.open({
            title : title,
            type : 2,
            area:["700px","450px"],
            maxmin:true,
            content : url
        });
    }


    /**
     * 删除资源
     * @param moduleId
     */
    function deleteModule(moduleId) {
        // 监听删除事件
        layer.confirm('确定删除当前资源吗？', {icon: 3, title: "资源管理"}, function (index) {
            // 如果确认删除，则发送ajax请求
            var url = ctx + "/module/delete";
            var param = {moduleId:moduleId};
            $.post(url, param, function (result) {
                if (result.code == 200) {
                    layer.msg("删除成功！",{icon:6});
                    // 关闭确认框
                    layer.close(index);
                    // 刷新页面
                    parent.location.reload();
                } else {
                    layer.msg(result.msg,{icon:5});
                }
            });
        });
    }


    /**
     * 更新资源
     * @param moduleId
     */
    function openUpdateModuleDialog(moduleId) {
        var url  =  ctx+"/module/updateModulePage?moduleId="+moduleId;
        var title="菜单更新";
        layui.layer.open({
            title : title,
            type : 2,
            area:["700px","450px"],
            maxmin:true,
            content : url
        });
    }
});