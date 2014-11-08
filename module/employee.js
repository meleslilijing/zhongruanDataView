define(function(require, exports, module) {

	!function() {

		// 默认加载
		window.userType = "administrator"
		window.departmentName = "/all"
		window.year = "/2014"

		// 数据与颜色间映射
		window.colors = d3.scale.ordinal()
				.range([
					"#ed514d", "#46affe", "#ff7a38",
					"#ff9a38", "#ffb638", "#ffcf3e",
					"#ffd967", "#ffde95", "#85d678"
				])

		window.SORT_ARR =
			[
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

	}()


	// employee
	require.async("./calendar.js", function(calendar) {
		calendar.init()
	})

	require.async("./column.js", function(column) {
		column.init()
	})

})