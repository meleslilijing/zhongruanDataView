define(function(require, exports, module) {

	console.log("employee.js")

	// employee
	require.async("./calendar.js", function(calendar) {
		calendar.init()
	})

	require.async("./column.js", function(column) {
		column.init()
	})

})