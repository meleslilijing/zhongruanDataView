define(function(require, exports, module) {

	var BASE_URL = "http://localhost:8080/Deliverable/service"


	var allDeliverableType = function() {
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: "http://localhost:8080/Deliverable/service/admin/allDeliverableType ",
			success: function(data) {
				console.log(data)
			}
		})
	}

	// 添加表格中的选项 参数： group, 
	var addOption = function(selectType, callback) {

		// console.log("selectType:")
		// console.log(selectType)

		var selector = "#" + selectType

		// console.log("selector:")
		// console.log(selector)

		// 在 $selector 中添加 option
		var $selector = $(".mod-table .wrap-content").find(selector)

		var selector_url

		switch (selectType) {

			case "group":
				selector_url = "/employee/allGroup"
				break

			case "workGroup":
				selector_url = "/employee/allWorkgroup"
				break

			case "deliveralbe-type":
				selector_url = "/employee/allDeliverableType"
				break

			case "market":
				selector_url = "/employee/allMarket"
				break

			default:
				console.error("添加表格选项 addOption 的参数出错！")
				return
		}

		selector_url = BASE_URL + selector_url

		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: selector_url,
			success: function(data) {

				var option = ""

				// 只显示前 5 个选项
				for (var i = 0; i < data.length; i++) {

					// 过滤空数据
					if (data[i]) {
						option += "<option value = " + data[i] + ">" + data[i] + "</option>"	
					}

					
					// console.log(data[i])
				}

				$selector.append(option)

				// 选项加载完毕
				if(callback) {

					var group_val = $("#group").val()
					var workGroup_val = $("#workGroup").val()
					var deliveralbe_type_val = $("#deliveralbe-type").val()
					var market_val = $("#market").val()

					if(group_val && workGroup_val && deliveralbe_type_val && market_val) {
						callback()	
					}
				}

			}
		}) // end $.ajax()


		// console.log("selector_url:")
		// console.log(selector_url)

	} // addOption()

	var addTableItem = function () {

		var employeeName = "/" + window.USER_NAME

		var group = "/" + $("#group").val()
		var workGroup = "/" + $("#workGroup").val()
		var deliveralbe_type = "/" + $("#deliveralbe-type").val()
		var market = "/" + $("#market").val()

		// console.log("group:", group)
		// console.log("workGroup:", workGroup)
		// console.log("deliveralbe_type:", deliveralbe_type)
		// console.log("market:", market)

		var BASE_URL = "http://192.168.0.141:8080/Deliverable/service"

		var url = BASE_URL + "/employee/statusByTime" + employeeName + group + workGroup + deliveralbe_type + market
		// console.log("表格url:", url)

		$.ajax({
			type: "GET",
			dataType: "jsonp",
			// url: "http://localhost:8080/Deliverable/service/employer/statusByTime/cmc/all",
			// url: url,
			success: function (data) {
				
				/*
				*	将获得的数据显示在表格中
				*	因为，Market 的数值的最后一个字符是 “;”.
				*	所以今天干不完了
				*/
				console.log("表格每一行的 data:")
				console.log(data)
				console.log("\n")


			}

		})
	}

	var initTable = function() {

		var $table = $(".mod-table .wrap-content")

		$table.html("")

		var form =
			'<form action="">' +
			'<label for="group">Group: </label>' +
			'<select id="group"></select>' +

			'<label for="workGroup">Workgroup: </label>' +
			'<select id="workGroup"></select>' +

			'<label for="deliveralbe-type">Deliveralbe Type: </label>' +
			'<select id="deliveralbe-type"></select>' +

			'<label for="market">Market: </label>' +
			'<select id="market"></select>' +
			'</form>'

		var tableBox =
			'<div class="table-box">' +
			'<table class="table">' +
			'<tbody>' +
			'<tr>' +
			'<th class="Deliverable-ID">Deliverable Title</th>' +
			'<th class="Deliveralbe-Type">DocFlow Status</th>' +
			'<th class="RP-Start-Date">Next Milestone Date </th>' +
			'<th class="General-Comments">PDO</th>' +
			'</tr>' +
			'</tbody>' +
			'</table>' +
			'</div>'

		$table.append(form)
		$table.append(tableBox)

		addOption("group", addTableItem)
		addOption("workGroup", addTableItem)
		addOption("deliveralbe-type", addTableItem)
		addOption("market", addTableItem)

		// 阻止底部表格事件冒泡
		touch.on(".table-box", "drag swipe hold", function(ev) {
			ev.stopPropagation()
		})
	}

	module.exports = {

		create: function() {

			// 初始化表格
			initTable()

		}, // end create()

	} // end module.exports{}
})