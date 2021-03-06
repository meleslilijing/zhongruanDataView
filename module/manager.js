define(function(require, exports, module) {

	var others = require("./others.js")

	// 默认加载
	window.BASE_URL = "http://localhost:8080/Deliverable/service"

	window.USERTYPE = "manager" // "administrator", "manager"
	window.DEPARTMENTNAME = "/cmc" // 部门名称
	window.YEAR = "/2014" // 年份
	window.USER_NAME = "/all" // 用户名称

	// 数据与颜色间映射
	window.COLORS = d3.scale.ordinal()
		.range([
			"#c13531", "#c95400", "#cf7f00",
			"#e7ad00", "#c9f263", "#9bdc00",
			"#1adfbd", "#20b476", "#e3d100"
		])
	window.BG_COLORS = "#004d82"

	// 异步管理器
	window.FLAG = 0
	window.FLAG_OVER = 3

	// 关闭 loading DOM
	window.CLOSE_LOADING = function () {
		$("#loading").css("display", "none")
	}

	window.NAME_LIST_POINT = 0	// 姓名列表计数
	window.CHART_POINT_NO
	window.CHART_NO = 0			// 图表计数

	window.SORT_ARR = [
		"Discontinued",
		"Scheduled",
		"Assigned",
		"Initiated",
		"Authoring",
		"Review",
		"Approval",
		"Completed",
		"Call for Contributions"
	]

	// 图例 标签属性
	window.legen_rect = {
		"width": 13,
		"height": 13,
	}

	window.DURATION = 1000 // 动画持续时间

	// 添加部门员工列表
	others.addMenu('manager', DEPARTMENTNAME)

	touch.on(".table-box", "tap hold drag swif", function(ev) {
		ev.stopPropagation()
	})


	require.async(["./pie.js", "./column_slide.js", "./table.js", "./animation.js"], function(pie, column_slide, table, animation) {

		pie.create(USERTYPE, DEPARTMENTNAME, YEAR, USER_NAME)

		column_slide.create(DEPARTMENTNAME, YEAR, USER_NAME)

		table.create()

		animation.manager()

	})

})