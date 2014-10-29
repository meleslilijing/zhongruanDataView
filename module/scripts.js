define(function(require, exports, module) {

	require.async("./calendar.js", function(calendar) {
		calendar.output()
		calendar.createCalendar()
	})

})