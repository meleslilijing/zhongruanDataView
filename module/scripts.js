define(function(require, exports, module) {

	// // employee
	// require.async("./calendar.js", function(calendar) {
	// 	calendar.init()
	// })

	// require.async("./column.js", function(column) {
	// 	column.init()
	// })

	// administrator
	require.async("./pie.js", function(pie) {
		pie.init()
	})

	require.async("./line.js", function(line) {
		line.init()
	})

	require.async("./deliverable.js", function(deliverable) {
		deliverable.init()
	})

})