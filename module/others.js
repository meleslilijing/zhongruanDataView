define(function(require, exports, module) {



	! function() {

		// 阻止底部表格事件冒泡
		touch.on(".table-box", "drag swipe hold", function(ev) {
			ev.stopPropagation()
		})

	}()

	var altMenu = function() {

		var mode_1, mode_2, mode_3

		if (window.USERTYPE == "administrator") {

			seajs.use(["./module/pie.js", "./module/line.js", "./module/deliverable.js"], function(pie_mod, line_mod, deliverable_mod) {
				mode_1 = pie_mod
				mode_2 = line_mod
				mode_3 = deliverable_mod
			})

		} else if (window.USERTYPE == "manager") {

			seajs.use(["./module/pie.js", "./module/column.js", "./module/deliverable.js"], function(pie_mod, column_mod, deliverable_mod) {
				mode_1 = pie_mod
				mode_2 = column_mod
				mode_3 = deliverable_mod
			})
		}

		touch.on(".menu-list", "tap", function(ev) {

			$(".menu-list .selected").removeClass("selected")
			$(this).addClass("selected")

			// // 更改全局变量
			window.DEPARTMENTNAME = "/" + $(this).text()
			console.log("DEPARTMENTNAME:", DEPARTMENTNAME)

			// // 重绘图表
			mode_1.create(USERTYPE, DEPARTMENTNAME, YEAR)
			mode_2.create(DEPARTMENTNAME, YEAR)
			mode_3.init()

			ev.stopPropagation()

		})

		// 阻止侧边栏的事件冒泡
		touch.on(".menu-list", "drag swipe hold", function(ev) {
			ev.stopPropagation()
		})
	}

	module.exports = {

		// 为折线图 和 slide分组柱图 添加用于选择年份的select标签
		addSelect: function(selector) {

			var select = ""
			var option = ""

			years = require("../data/years.js")

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
				var INTERMEDIATE = "/employer/employees/" + departmentName

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