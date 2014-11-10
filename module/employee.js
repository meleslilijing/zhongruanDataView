define(function(require, exports, module) {

	!function() {

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

		window.DURATION = 1000		// 动画持续时间

		touch.on(".table-box", "tap hold drag swif", function (ev) {
			ev.stopPropagation()
		})

	}()

	// employee
	require.async("./calendar.js", function(calendar) {
		calendar.init()
	})

	require.async("./column.js", function(column) {
		column.create(USER_NAME)
	})

})