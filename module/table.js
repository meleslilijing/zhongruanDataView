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

			var selector = "#" + selectType

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
					if (callback) {

						var group_val = $("#group").val()
						var workGroup_val = $("#workGroup").val()
						var deliveralbe_type_val = $("#deliveralbe-type").val()
						var market_val = $("#market").val()

						if (group_val && workGroup_val && deliveralbe_type_val && market_val) {
							callback()
						}
					}

				}
			}) // end $.ajax()

		} // addOption()

	var addTableItem = function() {

		var employeeName = "/" + window.USER_NAME

		var group = "/" + $("#group").val()
		var workGroup = "/" + $("#workGroup").val()
		var deliveralbe_type = "/" + $("#deliveralbe-type").val()
		var market = "/" + $("#market").val()

		var BASE_URL = "http://192.168.0.141:8080/Deliverable/service"

		// var url = BASE_URL + "/employee/statusByTime" + employeeName + group + workGroup + deliveralbe_type + market

		var url = "http://localhost:8080/Deliverable/service" + "/employer/statusByTime/cmc/all" // 测试用数据


		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: "http://localhost:8080/Deliverable/service/admin/departmentYear/cmc/2014",
			url: url,
			success: function(data) {

				/*
				 *	每一行结果
				 *	<tr>
				 *		<td>Diltiaz
				 *		<td><i></i>
				 *		<td>2013-4-
				 *		<td></td>
				 *	</tr>
				 */
				for (var type in data) {

					var data_key = type
					var data_class = data_key.replace(/\s/g, "_")

					var bg_color = COLORS(data_key)

					// 因为数据太多，暂时每一种状态只显示 6 条数据
					for (var i = 0; i < 6 && i < data[type].length; i++) {

						var data_Value = data[type][i]

						var Deliverable_Title = data_Value["Title"]
						var DocFlow_Status = data_key
						var Next_Milestone_Date = data_Value["Reporting Period Cut-off Date"]
						var PDO = data_Value["Primary Deliverable Owner"]

						/*
						 *	表格对应的值
						 *	Deliverable Title		key[i].Title
						 *	DocFlow Status  		key
						 *	Next Milestone Date 	Reporting Period Cut-off Date
						 *	PDO						Primary Deliverable Owner
						 */
						var td = '<td>' + Deliverable_Title + '</td>' +
							'<td class="status" style="color:' + bg_color + '"><i style="background-color:' + bg_color + '"></i>' + data_key + '</td>' +
							'<td class="next_data">' + Next_Milestone_Date + '</td>' +
							'<td>' + PDO + '</td>'

						var tr = '<tr class="' + data_class + '">' + td + '</tr>'

						$(".mod-table .table-box tbody").append(tr)
					}

				}



			}

		})
	}

	var initTable = function() {

		var $table = $(".mod-table .wrap-content")

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
			'</form>';

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
			'</div>';

		$table.append(form)
		$table.append(tableBox)

		addOption("group", addTableItem)
		addOption("workGroup", addTableItem)
		addOption("deliveralbe-type", addTableItem)
		addOption("market", addTableItem)

		window.FLAG++ // 加载完毕，增加flag量
		console.log("FLAG:", FLAG)
		// 关闭 loading DOM
		if (FLAG == FLAG_OVER) {
			window.CLOSE_LOADING()
		}

		// 阻止底部表格事件冒泡
		touch.on(".table-box", "drag swipe hold", function(ev) {
			ev.stopPropagation()
		})
	}

	var clean = function() {

		var $table = $(".mod-table .wrap-content")

		$table.html("")
	}

	module.exports = {

		create: function() {

			// 清空表格
			clean()

			// 初始化表格
			initTable()

		}, // end create()
		filter: function(status, special) {

			status = "." + status.replace(/\s/g, "_")

			if (!special) {

				d3.selectAll(".mod-table .table-box tbody td")
					.style("display", "none")

				d3.select(".mod-table .table-box").selectAll(status).selectAll("td")
					.style("display", "block")

			} else {

				var discontinued = $(".mod-table .table-box tbody").find(".discontinued")
				var others = discontinued.siblings()

				if (status == "discontinued") {

					// discontinued.css("display", "block")
					// others.css("display", "none")

					$(".mod-table .table-box tbody").find("tr").css("display", "none")

				} else {

					discontinued.css("display", "none")
					others.css("display", "block")

				}

			}



		},
		showAll: function() {
			$(".mod-table .table-box tbody tr").removeClass("selected")
			$(".mod-table .table-box tbody td").css("display", "block")
		},
		alterSelected: function() {

			console.log("!!!")

			var $this = $(this).parent()

			$this.addClass("selected")

			$this.siblings().removeClass("selected")

			var status = $this.find(".status").text()
			var next_time = $this.find(".next_time").text()

			return {
				status: status,
				next_time: next_time
			}
		}

	} // end module.exports{}
})