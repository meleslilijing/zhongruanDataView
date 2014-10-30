define(function(require, exports, module) {

	// 是否闰年
	var isLeapYear = function(year) {
		if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
			return true
		} else {
			return false
		}
	}

	// 本月有多少天
	var returnDayNum = function(year, month) {

		var month = month + 1
		var dayNum = 30	// 默认当前月有30天

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
				if(isLeapYear(year)) {
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

	// return 本月的第一天是星期几 0 ~ 6
	var firstDateToDay = function(date) {

		date.setDate(1)

		return date.getDay()
	}



	module.exports = {

		init: function() {

			// 输出 caption
			var thisDate = new Date()
			var thisYear = thisDate.getFullYear() // 当前年
			var thisMonth = thisDate.getMonth() // 当前月
			var thisDay = thisDate.getDay()

			var strYear = thisYear.toString()
			var strMonth = monthToString(thisMonth)

			var caption = strMonth+" "+strYear

			$("#calendar caption").text(caption)

			// 初始化表格日期
			var dayNum = 1
			var monthNum = returnDayNum(thisYear, thisMonth)	// 当前月有多少天
			var tr = ""

			for (var week = 0; week < 5; week++) {

				var td = ""

				for(var day = 0; day < 7; day++) {

					if( week == 0 && day < firstDateToDay(thisDate) || dayNum > monthNum) {
						
						td += "<td></td>"

					} else {

						td += "<td>"+(dayNum++)+"</td>"

					}

				}	// end for(day)

				tr += "<tr>"+td+"</tr>"

			} // end for(week)

			// 在 caption 后添加 tr
			$("#calendar table").append(tr)
		}

	}	// end module.exports


})