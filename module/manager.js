define(function(require, exports, module) {

	console.log("manager.js")
	var others = require("./others.js")

	// 添加部门员工列表
	// others.addMenu('nameList', 'cmc')

	require.async("./pie.js", function(pie) {
		pie.init()
	})

	require.async("./column_slide.js", function(column_slide) {
		column_slide.init()
	})

	require.async("./deliverable.js", function(deliverable) {
		deliverable.init()
	})


})