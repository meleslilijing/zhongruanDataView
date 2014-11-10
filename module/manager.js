define(function(require, exports, module) {

	var others = require("./others.js")

	// 默认加载
	window.USERTYPE = "manager" // "administrator", "manager"
	window.DEPARTMENTNAME = "/all" // 部门名称
	window.YEAR = "/2014" // 年份
	window.USER_NAME = "/all" // 用户名称

	// 数据与颜色间映射
	window.COLORS = d3.scale.ordinal()
		.range([
			"#ed514d", "#46affe", "#ff7a38",
			"#ff9a38", "#ffb638", "#ffcf3e",
			"#ffd967", "#ffde95", "#85d678"
		])

	// 图例 标签属性
	window.legen_rect = {
		"width": 13,
		"height": 13,
	}

	window.DURATION = 1000 // 动画持续时间

	touch.on(".table-box", "tap hold drag swif", function(ev) {
		ev.stopPropagation()
	})


	// 添加部门员工列表
	others.addMenu('manager', 'cmc')

	require.async("./pie.js", function(pie) {
		pie.create(USERTYPE, DEPARTMENTNAME, YEAR, USER_NAME)
	})

	require.async("./column_slide.js", function(column_slide) {
		column_slide.create(DEPARTMENTNAME, YEAR, USER_NAME)
	})

	require.async("./deliverable.js", function(deliverable) {
		deliverable.init()
	})


})