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

		// 将数据对象，按顺序排序。
		for (var i = 0; i < sortArr.length; i++) {

			var target = sortArr[i]
			var obj = {}

			for (var dataPoint in data) {

				if (dataPoint == target) {
					obj.key = dataPoint
					obj.value = data[dataPoint]

					dataset.push(obj)
					break
				}

			} // end for dataPoint in data
			
		} // end for sortArr

		// 如果某条数据，数组中的所有元素均为0，生成随机数据
		for (var obj in dataset) {
			
			var isAllZero = true

			var valueArr = dataset[obj].value

			// 判断当前对象数组是否都为0
			for (var i = 0; i < valueArr.length; i ++) {
				
				if(valueArr[i]) {
					isAllZero = false
					break
				}

			}

			// isAllZero = true ==> 生成随机数
			for (var i = 0; i < valueArr.length; i++) {
				valueArr[i] = parseInt(Math.random()*100)
			}

		}
		
		return dataset
	} // end format

	var findMaxAndMin = function(data) {

		var max = 0,
			min = 0

		for (var arr in data) {

			for (var i = 0; i < data[arr].value.length; i++) {
				max = Math.max(data[arr].value[i], max)
				min = Math.min(data[arr].value[i], min)
			}

		}

		return [min, max]
	}

	var animationPie = function () {

		touch.on("", "tap", function(ev) {

		})
		
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
					.y(function(d, i) {
						return yScale(d.data)
					})

			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: "http://localhost:8080/Deliverable/service/admin/departmentMonth/all/2014 ",
				success: function(data) {

					data = formatData(data)

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
					var chart_content = chart.append("g")
							.classed("chart-content", true)


					for(var lineName in data) {

						var data_line = data[lineName].value	// 当前折线数据				
						var lineDatas = []				// 处理后的折线数据

						for (var i = 0; i < months.length; i++) {
							
							var obj = {}

							obj.data = data_line[i]
							obj.month = months[i]

							lineDatas.push(obj)
						}

						chart_content.append("path")
						.attr({
							"d": line(lineDatas),
							"stroke": colors[lineName],
							"stroke-width": 2,
							"fill": "none",
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

					

					var legen_item = svg.append("g").classed("legen", true)
										.selectAll()
											.data(data).enter()
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
							return d.key
						})
						.attr("transform", "translate(22, 13)")
					
				}	// end success
			})	// end $.ajax

		},

	}
})