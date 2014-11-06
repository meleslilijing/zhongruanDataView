define(function(require, exports, module) {

	// 是否闰年
	var isLeapYear = function(year) {
		if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
			return true
		} else {
			return false
		}
	}

	// date(1~31)  year(4位数字)  month(0~11)
	var isToday = function(date, month, year) {

		var result = false

		var today = new Date()

		if (today.getDate() == date && today.getFullYear() == year && today.getMonth() == month) {
			result = true
		}

		return result
	}

	// 根据输入的年份和月份，判断本月有多少天，需要考虑到闰年
	var returnDayNum = function(year, month) {

		var month = month + 1
		var dayNum = 30 // 默认当前月有30天

		switch (month) {

			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				dayNum = 31
				break
			case 4:
			case 6:
			case 9:
			case 11:
				dayNum = 30
				break
			case 2:
				if (isLeapYear(year)) {
					dayNum = 29
				} else {
					dayNum = 28
				}
				break
			default:
				console.error("Date数据出错！")
		}

		return dayNum
	}

	// 把输入的月份转为相应的字符串名称
	var monthToString = function(month) {
		var string = ''
		month = month + 1

		switch (month) {
			case 1:
				string = "January"
				break
			case 2:
				string = "Feberuary"
				break
			case 3:
				string = "March"
				break
			case 4:
				string = "April"
				break
			case 5:
				string = "May"
				break
			case 6:
				string = "June"
				break
			case 7:
				string = "July"
				break
			case 8:
				string = "August"
				break
			case 9:
				string = "September"
				break
			case 10:
				string = "October"
				break
			case 11:
				string = "November"
				break
			case 12:
				string = "December"
				break
			default:
				string = "err: Month data is wrong!"
		}

		return string;
	}

	// 某月(0~11)第一天是星期几 0 ~ 6
	var firstDateToDay = function(year, month) {

		var date = new Date()

		date.setFullYear(year, month, 1)

		return date.getDay()
	}

	// 输出日历
	var showMonth = function(year, month) {

		// 清空 table
		$("#calendar table")[0].innerHTML = ""

		// 输出标题
		var strYear = year.toString()
		var strMonth = monthToString(month)
		var caption = strMonth + " " + strYear

		$("#calendar table")[0].innerHTML="<caption>"+caption+"</caption>"

		// $("#calendar caption").text(caption)

		// 初始化表格日期
		var dateNum = 1
		var totalDay = returnDayNum(year, month) // 当前月有多少天

		var calendarTitle = ["S", "M", "T", "W", "R", "F", "S"]

		var tr = "<tr>"
		for(var i = 0; i < 7; i++) {
			tr += "<th>"+calendarTitle[i]+"</th>"
		}
		tr += "</tr>"

		// 日历显示 6星期/月
		for (var week = 0; week < 6; week++) {

			var td = ""

			// 7天/周
			for (var day = 0; day < 7; day++) {
				if (week == 0 && day < firstDateToDay(year, month) || dateNum > totalDay) {

					td += "<td></td>"

				} else {
					var todayClass = isToday(dateNum, month, year) ? 'today' : ''
					td += "<td class=" + todayClass + ">" + (dateNum++) + "</td>"
				}

			} // end for(day)

			tr += "<tr>" + td + "</tr>"

		} // end for(week)

		// 在 caption 后添加 tr
		$("#calendar table").append(tr)
	}

	// 初始化日历
	var initCalendar = function() {
		// 输出 caption
		var thisDate = new Date()
		var nowYear = thisDate.getFullYear() // 当前年
		var nowMonth = thisDate.getMonth() // 当前月 0~11

		// 根据 year 和 month 输出日历

		showMonth(nowYear, nowMonth)
		swipeCalendar(nowYear, nowMonth)
	}

	// 滑动日历
	var swipeCalendar = function(year, month) {
		touch.on(".wrap-content .date", "swipeleft swiperight", function(ev) {

			// 改变年月
			if (ev.type == "swiperight") {
				month--
				if(month < 0) {
					year--
					month = 11
				}
				showMonth(year, month)
			} else if (ev.type == "swipeleft") {
				month++
				if(month > 11) {
					year++
					month = 0
				}
				showMonth(year, month)
			}
			// 动画

			// 更新日历

		})
	}

	module.exports = {

		// 日历组件初始化
		init: function() {
			initCalendar()
		}

	} // end module.exports


})