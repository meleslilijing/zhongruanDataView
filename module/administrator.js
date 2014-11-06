define(function(require, exports, module) {

	var others = require("./others.js")

	// administrator 初始化
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
	}()

	// 添加所有员工列表
	others.addMenu('departmentList')

	require.async("./pie.js", function(pie) {
		pie.createPie(userType, departmentName, year)
	})

	require.async("./line.js", function(line) {
		line.init()
	})

	require.async("./deliverable.js", function(deliverable) {
		deliverable.init()
	})


})