<html>
<head>
	<link rel="stylesheet" href="${ctx}/js/zTree_v3/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<script type="text/javascript" src="${ctx}/js/jquery-3.5.1.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/zTree_v3/js/jquery.ztree.core.js"></script>
	<script type="text/javascript" src="${ctx}/js/zTree_v3/js/jquery.ztree.excheck.js"></script>
	<script type="text/javascript">
		var ctx="${ctx}";
	</script>
</head>
<body>
<#-- 隐藏域：设置角色的ID -->
<input type="hidden" name="roleId" value="${roleId!}"/>

<div id="myTree" class="ztree"></div>

<script type="text/javascript" src="${ctx}/js/role/grant.js"></script>
</body>
</html>