define(function(require, exports, module) {

	// 阻止事件冒泡
	!function() {

		// 阻止侧边栏的事件冒泡
		touch.on(".menu-list", "drag swipe hold", function (ev) {
			ev.stopPropagation()
		})

		// 阻止底部表格事件冒泡
		touch.on(".table-box", "drag swipe hold", function (ev) {
			ev.stopPropagation()
		})
	}
	
 	var _touchMenu = function () {

		touch.on(".menu-list", "tap", function (ev) {
			$(".menu-list .selected").removeClass("selected")
			$(this).addClass("selected")
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

			if ( type == 'nameList' ) {

				if (!departmentName) {
					console.error("获取某部门姓名列表，需要提供部门名称 departmentName。")
					return
				}

				console.log("添加某部门员工列表 nameList...")

				// 某个部门的员工列表
				var INTERMEDIATE = "/employer/employees/" + departmentName

			} else if (type == 'departmentList') {
				
				console.log("添加所有部门名称 departmentList...")

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

					if(!list) {
						return console.error("menuList 数据加载为空！")
					} 

					var $menu_list = $(".menu-list")
					var li = "<li class='item selected'>ALL</li>"

					for (var i = 1; i < list.length; i++) {
						if (!list[i]) {
							continue
						}

						var str = (type == "nameList") ? list[i] : list[i].Department

						li += "<li class='item'>" + str + "</li>"
					}

					$menu_list.append(li)

				},
				error: function() {
					return console.error("数据加载出错！")
				}
			}) // end $.ajax

			_touchMenu()

		}, // end addMenu

		// copy array
		copyArray: function(oldArray) {
			var newArray = []
			for(var i = 0; i < oldArray.length; i++) {
				newArray[i] = oldArray[i]
			}
			return newArray
		}	// end copyArray

	} // end module.exports
})