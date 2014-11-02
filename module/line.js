define(function(require, exports, module) {

	var findMaxAndMin = function(data) {

		var max = 0,
			min = 0

		var Scheduled = data.Scheduled

		for (var arr in data) {

			for (var i = 0; i < data[arr].length; i++) {
				max = Math.max(data[arr][i], max)
				min = Math.min(data[arr][i], min)
			}

		}

		return {
			max: max,
			min: min
		}

	}

	var addSelect = function() {
		
		var select = ""
		var option = ""

		years = require("../data/years.js")
		
		for(var i = 0; i < years.length; i++) {

			var year = years[i]

			if(i == years.length-1) {
				option += "<option selected='selected' value = "+year+">"+year+"</option>"
			} else {
				option += "<option value = "+year+">"+year+"</option>"
			}
		}
		select = "<select>"+option+"</select>"

		$("#line .wrap-content").append(select)
	}

	module.exports = {

		init: function() {

			console.log("加载 line.js")

			// 添加select
			addSelect()

			// 添加图表
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

			var colors = [
						"#ed514d", "#eeffa8", "#ffe492",
						"#f4da00", "#ff9a38", "#46affe", 
						"#ff7a38", "#85d678", "#e7b74b"
					]

			var x = 79
			var y = 132

			var width = 745
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

			var legen = svg.append("g").classed("legen", true)

			// 引入department 数据
			! function() {

				// 加载数据
				var data = require("../data/department.js")

				var limit = findMaxAndMin(data)
				var max = limit.max
				var min = limit.min

				xScale.domain(months)
				yScale.domain([min, max])

				chart.append("g").classed("x axis", true).call(xAxis)
					.attr("transform", "translate(0," + height + ")")
				chart.append("g").classed("y axis", true).call(yAxis)

				var chart_content = chart.append("g").classed("chart-content", true)

				// 折线图内容
				tmp_data = data.Authoring
				tmp_data.forEach(function(d) {
					d = +d
				})

				var line = d3.svg.line()
					.x(function(d, i) {
						console.log("x:", xScale(months[i]))
						return xScale(months[i])
					})
					.y(function(d) {
						console.log("y:", yScale(d.data))
						return yScale(d.data)
					})
						
				var test = [{data:100, month:"Jan"}, {data:20, month:"Feb"}, {data:60, month:"Mar",}, {data:60, month:"Apr"},
				 {data:40, month:"May"}, {data:5, month:"Jun"}, {data:7, month:"Jul"}, {data:10, month:"Aug"}, {data:12, month:"Sep"}, 
				 {data:6, month: "Oct"}, {data:4, month:"Nov"}, {data:8, month:"Dec"}]

				chart_content.append("path")
					.data(test)
					.attr("d", line(test))
					.attr("stroke", "red")
					.attr("fill", "none")
					

				// 添加图例
				var legenArr = []
				for (var legen_tmp in data) {
					legenArr.push(legen_tmp)
				}

				// 图例 标签属性
				var legen_rect = {
					"width":13, 
					"height":13, 
				}

				var legen_coordinate = [
								{x:218, y:35}, {x:328, y:35}, {x:435, y:35}, {x:541, y:35}, {x:638, y:35}, {x:748, y:35},
								{x:218, y:65}, {x:328, y:65}, {x:435, y:65}
					]

				var legen_item = legen.selectAll()
									.data(legenArr).enter()
								.append("g").classed("legen-item", true)
									.attr({
										"transform": function(d, i) {
											var x = legen_coordinate[i].x
											var y = legen_coordinate[i].y
											return "translate("+x+","+y+")"
										}
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
			}()


		},

	}
})