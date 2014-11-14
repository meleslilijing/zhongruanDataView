define(function(require, exports, module) {

	var others = require("./others.js")

	// 默认加载
	window.USERTYPE = "administrator"
	window.DEPARTMENTNAME = "/all"
	window.YEAR = "/2014"

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

	window.legen_rect = {
		"width": 13,
		"height": 13,
	}

	window.DURATION = 1000 // 动画持续时间
	

	// 添加所有 员工列表
	others.addMenu('administrator')

	// 关闭表格 事件冒泡
	touch.on(".table-box", "tap hold drag swif", function(ev) {
		ev.stopPropagation()
	})


	require.async(["./pie.js", "./line.js", "./table.js", "./animation.js"], function(pie, line, table, animation) {

		pie.create(USERTYPE, DEPARTMENTNAME, YEAR)

		line.create(DEPARTMENTNAME, YEAR)

		table.create()

		animation.administrator()

	})



	// require.async("./line.js", function(line) {
	// 	line.create(DEPARTMENTNAME, YEAR)
	// })

	// require.async("./table.js", function(table) {
	// 	table.init()
	// })


})