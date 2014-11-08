define(function(require, exports, module) {

	var others = require("./others.js")

	!function() {
		
		// 默认加载
		window.userType = "manager"		// "administrator", "manager"
		window.departmentName = "/all"	// 部门名称
		window.year = "/2014"			// 年份
		window.userName = "/all"			// 用户名称

		// 数据与颜色间映射
		window.colors = d3.scale.ordinal()
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
	}()

	// 添加部门员工列表
	others.addMenu('nameList', 'cmc')

	require.async("./pie.js", function(pie) {
		pie.createPie(userType, departmentName, year, userName)
	})

	require.async("./column_slide.js", function(column_slide) {
		column_slide.init()
	})

	require.async("./deliverable.js", function(deliverable) {
		deliverable.init()
	})


})