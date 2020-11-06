var zTreeObj;
$(document).ready(function(){
    // 加载资源树
    loadModule();
});

/**
 * 加载资源树
 */
function loadModule() {

    $.ajax({
        type:"get",
        url:ctx + "/module/queryAllModules?roleId=" + $("[name='roleId']").val(),
        success:function (result) {
            // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
            var setting = {
                // 启用选中效果
                check: {
                    enable: true
                },
                // 启用简单的JSON数据格式
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                // 回调函数
                callback: {
                    // 单选框/复选框 被勾选或取消勾选时触发的函数
                    onCheck: zTreeOnCheck
                }
            };
            zTreeObj = $.fn.zTree.init($("#myTree"), setting, result);
        }
    });
}


/**
 * 单选框/复选框 被勾选或取消勾选时触发的函数
 * @param event
 * @param treeId
 * @param treeNode
 */
function zTreeOnCheck(event, treeId, treeNode) {
    // alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
    // 获取输入框被勾选 或 未勾选的节点集合  true表示选中的，false表示未选中的
    var checked = zTreeObj.getCheckedNodes(true);
    console.log(checked);
    // 获取所有被选中的模块ID  mIds=1&mIds=2&mIds=3
    var mIds = "mIds=";
    // 判断选中的记录是否为空
    if (checked.length > 0) {
        for (var i= 0; i < checked.length; i++) {
            // 判断是否是最后一个
            if (i < checked.length -1) {
                mIds += checked[i].id + "&mIds=";
            } else {
                mIds += checked[i].id;
            }
        }
    }
    console.log(mIds);

    // 获取角色ID
    var roleId = $("[name='roleId']").val();

    // 发送ajax请求，给指定用户绑定资源
    $.ajax({
        type:"post",
        url: ctx + "/role/addGrant",
        // mIds=1&mIds=2&mIds=3&roleId=1
        data:mIds+"&roleId=" +roleId, // 传递数组参数与普通参数
        success:function (result) {
            console.log(result)
        }
    });
};

