define(function(require, exports, module) {

	var others = require("./others.js")
	
	// 返回格式化后的数据
	var formatData = function(data) {

		// 排序
		var sortArr = [
			"Discontinued", "Scheduled", "Assigned",
			"Initiated", "Authoring", "Review",
			"Approval", "Completed", "Call for Contributions"
		]

		var dataset = []
		// var isAllZero = true

		console.log("pie format:")
		for (var i = 0; i < sortArr.length; i++) {

			var target = sortArr[i]
			var obj = {}

			for (var dataPoint in data) {

				if (dataPoint == target) {
					console.log(data[dataPoint])
					obj.key = dataPoint
					obj.value = data[dataPoint]

					dataset.push(obj)
					break
				}

			} // end for dataPoint in data

			// if (obj.value) {
			// 	isAllZero = false
			// }
		} // end for sortArr

		// 如果数据均为空, 将数据都改为 1, 并提示
		// if (isAllZero) {
		// 	for (var i = 0; i < dataset.length; i++) {
		// 		dataset[i].value = 1
		// 	}
		// }

		return dataset
	} // end format

	var findMaxAndMin = function(data) {

		var max = 0,
			min = 0

		for (var arr in data) {

			for (var i = 0; i < data[arr].length; i++) {
				max = Math.max(data[arr][i], max)
				min = Math.min(data[arr][i], min)
			}

		}

		return [min, max]
	}

	module.exports = {

		init: function() {

			// 添加select
			var selectStr = "#line .wrap-content"
			others.addSelect(selectStr)

			// 添加图表
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

			var colors = [
						"#ed514d", "#46affe", "#ff7a38",
						"#ff9a38", "#ffb638", "#ffcf3e",
						"#ffd967", "#ffde95", "#85d678"
					]

			var x = 79	// 图表坐标
			var y = 132

			var width = 745	// 图表尺寸
			var height = 245

			var svg = d3.select("#line .wrap-content").append("svg")
			var	chart = svg.append("g").classed("chart", true)
				.attr({
					"transform": "translate(" + x + "," + y + ")"
				})

			var xScale = d3.scale.ordinal()
				.rangePoints([0, width], 0)
				
			var yScale = d3.scale.linear()
				.range([height, 0])

			var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
			var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5)

			// var legen = svg.append("g").classed("legen", true)

			// 折线图路径处理函数
			var line = d3.svg.line()
					.x(function(d, i) {
						return xScale(d.month)
					})
					.y(function(d) {
						return yScale(d.data)
					})

			///////////////////////////////////////

			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: "http://localhost:8080/Deliverable/service/admin/departmentMonth/all/2014 ",
				success: function(data) {

					console.log("加载数据：")
					console.log(data)

					// 加载数据
					var data = require("../data/department.js")

					data = formatData(data)

					console.log("示例数据：")
					console.log(data)

					var extent = findMaxAndMin(data)

					xScale.domain(months)
					yScale.domain(extent)

					chart.append("g").classed("x axis", true).call(xAxis)
						.attr("transform", "translate(0," + height + ")")
					chart.append("g").classed("y axis", true).call(yAxis)
					
					d3.selectAll(".chart .y .tick line").attr({
						x2: width,
						y2: 0,
					})
					d3.selectAll(".chart .x .tick line").attr({
						x2: 0,
						y2: -height,
					})

					// 折线图内容
					var chart_content = chart.append("g").classed("chart-content", true)

					var colorNum = 0
					for(var lineName in data) {

						var data_line = data[lineName]
						var lineDatas = []

						for (var i = 0; i < months.length; i++) {
							
							var obj = {}

							obj.data = data_line[i]
							obj.month = months[i]

							lineDatas.push(obj)
						}

						chart_content.append("path")
						.attr({
							"d": line(lineDatas),
							"stroke": "black",
							"stroke-width": 2,
							"fill": "none",
							"color": function() {
								return colors[colorNum++]	
							},
							"name": lineName
						})


					}

					// 添加图例
					var legenArr = []
					for (var legen_tmp in data) {
						legenArr.push(legen_tmp)
					}

					var legen_coordinate = [
												{x:218, y:35}, {x:328, y:35}, {x:435, y:35}, {x:541, y:35}, {x:638, y:35}, {x:748, y:35},
												{x:218, y:65}, {x:328, y:65}, {x:435, y:65}
											]

					// 图例 标签属性
					var legen_rect = {
						"width":13, 
						"height":13, 
					}

					var legen_item = svg.append("g").classed("legen", true)
										.selectAll()
											.data(legenArr).enter()
										.append("g").classed("legen-item", true)
											.attr({
												"transform": function(d, i) {
													var x = legen_coordinate[i].x
													var y = legen_coordinate[i].y

													return "translate("+x+","+y+")"
												},
												name: function(d) { return d }
											})

					legen_item.append("rect")
						.attr({
							width: legen_rect.width,
							height: legen_rect.height,
							fill: function(d, i) {
								return colors[i]
							}
						})

					legen_item.append("text")
						.text(function(d) {
							return d
						})
						.attr("transform", "translate(22, 13)")
					
				}	// end success
			})	// end $.ajax
			

			///////////////////////////////////////

			// 引入department 数据
			! function() {

			}()


		},

	}
})