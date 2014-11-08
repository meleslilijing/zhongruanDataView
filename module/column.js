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

						dataset.push(obj)
					}

				}

			}

			// 判断是否所有值均为0
			for (var item in dataset) {

				if (dataset[item].value) {
					isAllNum = false
				}

			}
			console.log(isAllNum)

			// 生成随机数据
			if (isAllNum) {

				for (var i = 0; i < dataset.length; i++) {
					dataset[i].value = parseInt(Math.random() * RANDOM_RANGE)
				}

			}

			return dataset

		} // end formatData

	// 找出 data 的 domain
	var extentData = function(data) {
		console.log("extent() 找出 data 的 domain :")

		var max = min = data[0].value

		for (var i = 0; i < data.length; i++) {

			max = Math.max(data[i].value, max)
			min = Math.min(data[i].value, min)

		}

		return [min, max]
	}

	module.exports = {
		init: function() {

			var svg = d3.select(".column .wrap-content").append("svg")

			var colors = d3.scale.ordinal()
				.range(["#ed514d", "#85d678", "#6de5e1", "#ff651a", "#ff861a", "#ffb61a", "#ffe11a", "#e1ff56", "#e0ffaf"])

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

			// var tip = d3.tip()
			// 	.attr('class', 'tips')
			// 	.offset([-10, 0])
			// 	.html(function(d) {
			// 		return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
			// 	})

			// $.ay: function(data) {

			! function() {

				// 示例数据
				var data = {
					"Discontinued": 0,
					"Scheduled": 0,
					"Assigned": 0,
					"Initiated": 0,
					"Authoring": 0,
					"Review": 0,
					"Approval": 0,
					"Completed": 0,
					"Call for Contributions": 0
				}

				// 格式化数据
				data = formatData(data)

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
					.selectAll(".bar")
					.data(data).enter()
					.append("rect").classed("bar", true)
					.attr({
						x: function(d) {
							return xScale(d.key)
						},
						y: function(d) {
							return height - yScale(d.value)
						},
						width: 11,
						height: function(d) {
							return yScale(d.value)
						},
						fill: function(d) {
							return colors(d.key)
						}
					})

				// 添加图例
				var legen = svg.append("g").classed("legen", true)

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
												name: function(d) { return d }
											})

				legen_item.append("rect")
						.attr({
							width: legen_rect.width,
							height: legen_rect.height,
							fill: function(d, i) {
								return colors(d.key)
							}
						})

				legen_item.append("text")
						.text(function(d) {
							return d.key
						})
						.attr("transform", "translate(22, 13)")

			}() // end !function()
		}
	}


})