define(function(require, exports, module) {


	var altMenu = function() {

		var mode_1, mode_2, mode_3, mode_4

		if (window.USERTYPE == "administrator") {

			seajs.use(

				["./module/pie.js", "./module/line.js", "./module/table.js", "./module/animation.js"],

				function(pie_mod, line_mod, table_mod, animation) {

					mode_1 = pie_mod
					mode_2 = line_mod
					mode_3 = table_mod
					mode_4 = animation
				})

		} else if (window.USERTYPE == "manager") {

			seajs.use(

				["./module/pie.js", "./module/column_slide.js", "./module/table.js", "./module/animation.js"],

				function(pie_mod, column_slide_mod, table_mod, animation) {

					mode_1 = pie_mod
					mode_2 = column_slide_mod
					mode_3 = table_mod
					mode_4 = animation
				})
		}

		// var animation = require("./animation.js")

		touch.on(".menu-list", "tap", function(ev) {

			$(".menu-list .selected").removeClass("selected")
			$(this).addClass("selected")

			if (window.USERTYPE == "administrator") {

				// 更改全局变量				
				window.DEPARTMENTNAME = "/" + $(this).text()

				// 重新绘制图表
				mode_1.create(USERTYPE, DEPARTMENTNAME, YEAR)
				mode_2.create(DEPARTMENTNAME, YEAR)
				mode_3.init()

				// 重新绑定 animation 事件
				mode_4.administrator()



			} else if (window.USERTYPE == "manager") {

				window.USER_NAME = "/" + $(this).text()

				mode_1.create(USERTYPE, DEPARTMENTNAME, YEAR, USER_NAME)
				mode_2.create(DEPARTMENTNAME, YEAR, USER_NAME)
				mode_3.init()

				// animation
				mode_4.manager()

			}

			ev.stopPropagation()

		})

		touch.on(".menu-list", "drag swipe hold", function(ev) {
			ev.stopPropagation()
		})
	}

	module.exports = {

		// 为折线图 和 slide分组柱图 添加用于选择年份的select标签
		addYearsSelect: function(type, selector, departmentName) {

			var BASE_URL = "http://localhost:8080/Deliverable/service"
			var url

			var departmentName = departmentName || "/cmc"

			if (type == "administrator") {

				url = BASE_URL + "/admin/departmentYear" + departmentName	

			} else if (type == "manager") {

				url = BASE_URL + "/employer/departmentYear" + departmentName
			}

			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: url,
				success: function (data) {

					if (data) {

						// 将 data 中的数据筛选为数组， 并排序
						years = data.map(function (d) { return d.year }).sort()	

					} else {

						console.error("没有年份数据。")
						
					}

					var select = ""
					var option = ""

					for (var i = 0; i < years.length; i++) {

						var year = years[i]

						if (i == years.length - 1) {
							option += "<option selected='selected' value = " + year + ">" + year + "</option>"
						} else {
							option += "<option value = " + year + ">" + year + "</option>"
						}
					}

					select = "<select>" + option + "</select>"

					$(selector).append(select)
				}
			})


		},

		// 加载左侧列表
		addMenu: function(type, departmentName) {

			var BASE_URL = "http://localhost:8080/Deliverable/service"

			if (type == 'manager') {

				if (!departmentName) {
					console.error("获取某部门姓名列表，需要提供部门名称 departmentName。")
					return
				}

				// 某个部门的员工列表
				var INTERMEDIATE = "/employer/employees" + departmentName

			} else if (type == 'administrator') {

				// 所有部门名称
				var INTERMEDIATE = "/admin/departments"
			}

			var url = BASE_URL + INTERMEDIATE

			$.ajax({
				type: "GET",
				dataType: 'jsonp',
				url: url,
				// url: "http://192.168.0.167:8080/Deliverable/service/admin/departments",
				success: function(list) {

					if (!list) {
						return console.error("menuList 数据加载为空！")
					}

					var $menu_list = $(".menu-list")
					var li = "<li class='item selected'>ALL</li>"

					for (var i = 1; i < list.length; i++) {
						if (!list[i]) {
							continue
						}

						// 两种页面返回的数据格式不一样
						var str = (type == "manager") ? list[i] : list[i].Department

						li += "<li class='item'>" + str + "</li>"
					}

					$menu_list.append(li)

				},
				error: function() {
					return console.error("数据加载出错！")
				}
			}) // end $.ajax

			altMenu()

		}, // end addMenu

		// copy array
		copyArray: function(oldArray) {
			var newArray = []
			for (var i = 0; i < oldArray.length; i++) {
				newArray[i] = oldArray[i]
			}
			return newArray
		} // end copyArray

	} // end module.exports
})