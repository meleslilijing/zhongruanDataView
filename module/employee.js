define(function(require, exports, module) {

	// 默认加载
	window.USERTYPE = "administrator"
	window.DEPARTMENTNAME = "/all"
	window.YEAR = "/2014"
	window.USER_NAME = "AMERsawans12"

	// 数据与颜色间映射
	window.COLORS = d3.scale.ordinal()
		.range([
			"#ed514d", "#46affe", "#ff7a38",
			"#ff9a38", "#ffb638", "#ffcf3e",
			"#ffd967", "#ffde95", "#85d678"
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
	require.async(["./calendar.js", "./column.js", "./table.js"], function(calendar, column, table) {

		calendar.init()
		column.create(USER_NAME)
		table.create()


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