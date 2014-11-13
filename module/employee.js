define(function(require, exports, module) {

	// 默认加载
	window.USERTYPE = "administrator"
	window.DEPARTMENTNAME = "/all"
	window.YEAR = "/2014"
	window.USER_NAME = "AMERsawans12"

	// 数据与颜色间映射
	window.COLORS = d3.scale.ordinal()
		.range([
			"#c13531", "#c95400", "#cf7f00",
			"#e7ad00", "#c9f263", "#9bdc00",
			"#1adfbd", "#20b476", "#e3d100"
		])

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

	window.DURATION = 1000 // 动画持续时间
	window.isColor = true


	touch.on(".table-box", "tap hold drag swif", function(ev) {
		ev.stopPropagation()
	})

	// employee
	require.async(["./calendar.js", "./column.js", "./table.js", "./animation.js"], function(calendar, column, table, animation) {

		calendar.init()
		column.create(USER_NAME)
		table.create()
		animation.employee()


	})

	// AMERsawans12", "AMERkananis", "EMEAsmith_ma", "AMERneymani", "AMERgribkog", "AMERmokhav
	$.ajax({
		type: "GET", 
		dataType: "jsonp",
		url:"http://localhost:8080/Deliverable/service/employer/employees/cmc/2014/AMERsawans12,AMERkananis,EMEAsmith_ma,AMERneymani,AMERgribkog,AMERmokhav",
		success: function (data) {
			console.log("data ---：")
			console.log(data)
		}

	})



})