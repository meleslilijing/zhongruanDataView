define(function(require, exports, module) {

	
	
	// 格式化数据： 
	// 		如果data的所有值均为0，生成随机数据
	//		将data的属性按照顺序排序
	var formatData = function(data) {

			var isAllNum = true
			var RANDOM_RANGE = 100 // 随机范围
			var SORT_ARR =
				[
					"Discontinued",
					"Scheduled",
					"Assigned",
					"Initiated",
					"Authoring",
					"Review",
					"Approval",
					"Completed",
					"Call for Contributions"
				] // 排序顺序

			var dataset = [] // 存放排序后的数组

			// 排序
			for (var i = 0; i < SORT_ARR.length; i++) {

				for (var item in data) {

					if (SORT_ARR[i] == item) {

						var obj = {}
						obj.key = item
						obj.value = data[item]

						console.log(typeof obj.value)

						dataset.push(obj)
					}

				}

			}

			// 计算员工文件各状态总数
			for (var item in dataset) {

				var sum = 0

				for( var i = 0; i < dataset[item].length; i++) {
					sum += dataset[item]
				}

				dataset[item].value = sum

			}

			// 判断是否所有值均为0
			for (var item in dataset) {

				if (dataset[item].value) {
					isAllNum = false
				}

			}

			// 生成随机数据
			if (isAllNum) {

				console.log("column_slide 所有数据为0.  生成随机数据...")

				for (var i = 0; i < dataset.length; i++) {
					dataset[i].value = parseInt(Math.random() * RANDOM_RANGE)
				}

			}

			return dataset
	} // end formatData()

	// 找出 data 的 domain
	var extentData = function(data) {

		var max = min = data[0].value

		for (var i = 0; i < data.length; i++) {

			max = Math.max(data[i].value, max)
			min = Math.min(data[i].value, min)

		}
		
		return [min, max]
	}

	var animation = function () {

		var isColor = true

		touch.on(".column .legen-item text, .column .legen-item rect", "tap", function (ev) {
			
			var index = $(this).parent().index()

			lengenAnimation(index)
			pathAnimation(index)

			isColor = false

			ev.stopPropagation()

		})

		touch.on(".column .chart-content rect", "tap", function (ev) {
			
			var index = $(this).index()
			
			lengenAnimation(index)
			pathAnimation(index)

			isColor = false

			ev.stopPropagation()

		})

		touch.on(".column svg", "tap", function (ev) {
			
			if (!isColor) {

				recolorAnimation()	
				
				isColor = true

			}

			ev.stopPropagation()

		})
	}

	var lengenAnimation = function (index) {
		
		var index = index || 0

		// $this = $(".column .legen-item").eq(index)
		// $siblings = $this.siblings()

		// var color = $this.attr("color")

		// // 选择节点上色
		// $this.find("rect").css("fill", color)
		// $this.find("text").css("fill", "#ffffff")

		// // 兄弟节点黑白
		// $siblings.find("rect").css("fill", "#333")
		// $siblings.find("text").css("fill", "#333")

		var point = d3.selectAll(".column .legen-item").filter(function (d, i) {
					return i == index
				})

		var siblings = d3.selectAll(".column .legen-item").filter(function (d, i) {
					return i != index
				})

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
	}

	var pathAnimation = function (index) {

		var index = index || 0

		d3.selectAll(".column .chart-content rect").filter(function (d, i) {
					return i == index
				})
				.transition()
				.duration(window.DURATION)
				.attr("fill", function (d) {
					return d3.select(this).attr("color")
				})

		d3.selectAll(".column .chart-content rect").filter(function (d, i) {
					return i != index
				})
				.transition()
				.duration(window.DURATION)
				.attr("fill", "#333")
	}

	var recolorAnimation = function () {

		d3.selectAll(".column .chart-content rect")
			.transition()
			.duration(window.DURATION)
			.attr("fill", function (d) {
				return COLORS(d.key)
			})

		var legen = d3.selectAll(".column .legen .legen-item")
			.transition()
			.duration(window.DURATION)

		legen.select("rect")
			.attr("fill", function (d) {
				return COLORS(d.key)
			})

		legen.select("text")
			.style("fill", "#ffffff")
	}

	var drawColumn = function(url) {

			var svg = d3.select(".column .wrap-content").append("svg")

			// 图表位置
			var x = 50
			var y = 130

			// 图表尺寸
			var width = 410
			var height = 130

			// 比例尺
			var xScale = d3.scale.ordinal()
				.rangeBands([0, width], .7)

			var yScale = d3.scale.linear()
				.range([height, 10])

			// 数轴
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(5)

			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url:url,
				success: function(data) {

					console.log("载入 data:")
					console.log(data)

					// 格式化数据
					data = formatData(data)

					console.log("格式化后 data:")
					console.log(data)

					// 示例数据
					// var data = {
					// 	"Discontinued": 0,
					// 	"Scheduled": 0,
					// 	"Assigned": 0,
					// 	"Initiated": 0,
					// 	"Authoring": 0,
					// 	"Review": 0,
					// 	"Approval": 0,
					// 	"Completed": 0,
					// 	"Call for Contributions": 0
					// }

					var extent = extentData(data)

					// 输入值域
					xScale.domain(window.SORT_ARR)
					yScale.domain(extent)

					var chart = svg.append("g")
						.classed("chart", true)
						.attr({
							"transform": "translate(" + x + "," + y + ")"
						})

					chart.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis)

					chart.append("g")
						.attr("class", "y axis")
						.call(yAxis)

					// 背景横线
					chart.select(".y").selectAll("line")
						.attr({
							"x2": width,
						})


					chart.append("g")
						.classed("chart-content", true)
						.selectAll("rect")
						.data(data).enter()
						.append("rect")
						.attr({
							x: function(d) {
								return xScale(d.key)
							},
							y: function(d) {
								return height
							},
							width: 11,
							height: function(d) {
								return 0
							},
							fill: function(d) {
								return COLORS(d.key)
							},
							color: function (d) {
								return COLORS(d.key)
							}
						})
						.transition()
						.duration(window.DURATION)
						.attr({
							y: function(d) {
								return yScale(d.value)
							},
							height: function(d) {
								return height - yScale(d.value)
							}
						})

					// 添加标签
					// chart.append("g")
					// 	.classed("tips", true)
					// 	.selectAll("text")
					// 	.data(data).enter()
					// 	.append("text")
					// 	.attr({
					// 		x: function(d) {
					// 			return xScale(d.key)
					// 		},
					// 		y: function(d) {
					// 			return yScale(d.value)
					// 		},
					// 		fill: "#ffffff"
					// 	})
					// 	// .style("text-an")
					// 	.text(function(d) {
					// 		return d.value
					// 	})


					// 添加图例
					var legen_coordinate = [
												{x:17, y:20}, {x:128, y:20}, {x:235, y:20}, {x:343, y:20}, 
												{x:17, y:52}, {x:128, y:52}, {x:235, y:52}, {x:343, y:52}, 
												{x:17, y:83}
											]

					// 图例 标签属性
					var legen_rect = {
						"width":13, 
						"height":13, 
					}

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
													name: function(d) { return d },
													color: function (d, i) {
														return COLORS(d.key)
													},
												})
												
					legen_item.append("rect")
							.attr({
								width: legen_rect.width,
								height: legen_rect.height,
								fill: function(d, i) {
									return COLORS(d.key)
								},
								
								opacity: 0
							})
							.transition()
							.duration(window.DURATION)
							.attr({
								opacity: 1
							})

					legen_item.append("text")
							.text(function(d) {
								return d.key
							})
							.attr({
								transform: "translate(22, 13)",
								opacity: 0,
							})
							.transition()
							.duration(window.DURATION)
							.attr({
								opacity: 1
							})


					animation()
				}	// end success

			})	// end $.ajax

	}	// end init

	module.exports = {
		create: function (employeeName) {

			var employeeName = employeeName || "AMERsawans12"

			var BASE_URL = "http://localhost:8080/Deliverable/service"
			var url = BASE_URL + "/employee/status/" + employeeName

			drawColumn(url)
		}
	
	}	// end modle


})