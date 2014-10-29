define(function(require, exports, module) {

	var init = function() {
		var $calendar = $("#calendar").find(".date")


	}
	init()

	module.exports = {

		output: function() {
			console.log("calendar.js output")
		},

		createCalendar: function() {

			// 得到本月第一天是星期几
			var firstDate = new Date()
			firstDate.setDate(1)
			var firstDate = firstDate.getDay()

			// 本月1号是星期几
			console.log("本月1号是星期",firstDate )
			// 本月一共多少天


		}

	}
})


