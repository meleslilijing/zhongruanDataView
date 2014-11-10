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
				for (var i = 0; i < valueArr.length; i++) {

					if (valueArr[i]) {
						isAllZero = false
						break
					}

				}

				// isAllZero = true ==> 生成随机数
				for (var i = 0; i < valueArr.length; i++) {
					valueArr[i] = parseInt(Math.random() * 100)
				}

			}

			return dataset
		} // end format

	var extentData = function(data) {

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

	var clean = function () {
		$(".line .wrap-content").html(function () {
			return ""
		})
	}

	var draw = function(url) {

			// 添加select
			var selectStr = ".line .wrap-content"
			others.addSelect(selectStr)

			// 添加图表
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

			var x = 79 // 图表坐标
			var y = 132

			var width = 745 // 图表尺寸
			var height = 245

			var svg = d3.select(".line .wrap-content").append("svg")
			var chart = svg.append("g").classed("chart", true)
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
				url: url,
				success: function(data) {

					data = formatData(data)

					var extent = extentData(data)

					xScale.domain(months)
					yScale.domain(extent)

					chart.append("g").classed("x axis", true).call(xAxis)
						.attr("transform", "translate(0," + height + ")")

					chart.append("g").classed("y axis", true).call(yAxis)

					d3.selectAll(".chart .y .tick line").attr({
						x2: 0,
						y2: 0,
					})
						.transition()
						.duration(window.DURATION)
						.attr("x2", width)

					d3.selectAll(".chart .x .tick line").attr({
						x2: 0,
						y2: 0,
					})
						.transition()
						.duration(window.DURATION)
						.attr("y2", -height)

					// 折线图内容
					var chart_content = chart.append("g")
						.classed("chart-content", true)


					for (var lineName in data) {

						var data_line = data[lineName].value // 当前折线数据				
						var lineDatas = [] // 处理后的折线数据

						for (var i = 0; i < months.length; i++) {

							var obj = {}

							obj.data = data_line[i]
							obj.month = months[i]

							lineDatas.push(obj)
						}

						chart_content.append("path")
							.attr({
								d: line(lineDatas),
								stroke: function(d, i) {
									return COLORS(lineName)
								},
								"stroke-width": 2,
								fill: "none",
								name: lineName,
								color: function(d, i) {
									return COLORS(lineName)
								},
								opacity: 0
							})
							.transition()
							.duration(window.DURATION)
							.attr("opacity", 1)
					}

					// 添加图例
					var legenArr = []
					for (var legen_tmp in data) {
						legenArr.push(legen_tmp)
					}

					var legen_coordinate = [{
						x: 218,
						y: 35
					}, {
						x: 328,
						y: 35
					}, {
						x: 435,
						y: 35
					}, {
						x: 541,
						y: 35
					}, {
						x: 638,
						y: 35
					}, {
						x: 748,
						y: 35
					}, {
						x: 218,
						y: 65
					}, {
						x: 328,
						y: 65
					}, {
						x: 435,
						y: 65
					}]



					var legen_item = svg.append("g").classed("legen", true)
						.selectAll(".legen-item")
						.data(data).enter()
						.append("g").classed("legen-item", true)
						.attr({
							"transform": function(d, i) {
								var x = legen_coordinate[i].x
								var y = legen_coordinate[i].y

								return "translate(" + x + "," + y + ")"
							},
							color: function(d) {
								return COLORS(d.key)
							}
						})

					legen_item.append("rect")
						.attr({
							width: legen_rect.width,
							height: legen_rect.height,
							fill: function(d, i) {
								return COLORS(d.key)
							},
							opacity: 0,
						})
						.transition()
						.duration(window.DURATION)
						.attr("opacity", 1)

					legen_item.append("text")
						.text(function(d) {
							return d.key
						})
						.attr("transform", "translate(22, 13)")
						.attr("opacity", 0)
						.transition()
						.duration(window.DURATION)
						.attr("opacity", 1)

					// // 交互
					// animationLine()
				} // end success
			}) // end $.ajax

		} // end draw

	module.exports = {

		create: function(departmentName, year) {

			var departmentName = departmentName || "/all"
			var year = year || "/2014"

			var BASE_URL = "http://localhost:8080/Deliverable/service"

			var url = BASE_URL + "/admin/departmentMonth" + departmentName + year

			clean()
			draw(url)
		}, // end create

		lengenAnimation: function(index) {

			var index = index || 0

			var point = d3.selectAll(".line .legen-item").filter(function(d, i) {
					return i == index
				})
				// .transition()
				// .duration(window.DURATION)

			var siblings = d3.selectAll(".line .legen-item").filter(function(d, i) {
					return i != index
				})
				// .transition()
				// .duration(window.DURATION)

			var color = point.attr("color")

			point.select("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", color)

			point.select("text")
				.transition()
				.duration(window.DURATION)
				.style("fill", "#ffffff")

			siblings.select("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", "#333")

			siblings.select("text")
				.transition()
				.duration(window.DURATION)
				.style("fill", "#333")
		},

		pathAnimation: function(index) {

			var index = index || 0

			point = d3.selectAll(".line .chart-content path").filter(function(d, i) {
				return i == index
			})

			siblings = d3.selectAll(".line .chart-content path").filter(function(d, i) {
				return i != index
			})

			var color = point.attr("color")

			point
				.transition()
				.duration(window.DURATION)
				.attr({
					"stroke": color,
					"opacity": 1
				})

			siblings
				.transition()
				.duration(window.DURATION)
				.attr({
					"opacity": 0.1,
					"stroke": "#333"
				})
			// $this.find("text").css("fill", "#ffffff")	// 还未显示文字

			// $siblings.find("text").css("fill", "#333")
		},

		recolorAnimation: function() {

			d3.selectAll(".line path")
				.transition()
				.duration(window.DURATION)

			.attr({
				stroke: function(d) {
					return d3.select(this).attr("color")
				},
				opacity: 1
			})

			var legen = d3.selectAll(".line .legen-item")
				.transition()
				.duration(window.DURATION)


			legen.select("rect")
				.attr("fill", function(d) {
					return COLORS(d.key)
				})

			legen.select("text")
				.style("fill", "#ffffff")
		},

	}
})