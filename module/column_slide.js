define(function(require, exports, module) {

	var others = require("./others.js")

	var formatData = function(data) {
		// formatData
		return data
	}

	var extentData = function(data) {

		var min = max = 0

		for (var i = 0; i < data.length; i++) {

			var data_min = Math.min(data[i].complete, data[i].notComplete)
			var data_max = Math.max(data[i].complete, data[i].notComplete)

			min = Math.min(min, data_min)
			max = Math.max(max, data_max)
		}
		min = parseInt(min)
		max = parseInt(max)

		return [min, max]
	}

	var animation = function() {

		var isColor = true

		touch.on(".column_slide .legen-item rect, .column_slide .legen-item text", "tap", function(ev) {

			var index = $(this).parent().index()

			legenAnimation(index)

			isColor = false

			ev.stopPropagation()
		})

		touch.on(".column_slide .chart_content rect, .column_slide .x .tick text", "tap", function(ev) {

			var index = $(this).parent().index()

			rectAnimation(index)

			isColor = false

			ev.stopPropagation()
		})

		touch.on(".column_slide svg", "tap", function(ev) {

			if (!isColor) {

				recolorAnimation()

				isColor = true
			}

			ev.stopPropagation()
		})


		// 分组柱图，滑动事件
		// touch.on(".column_slide svg", "swipeleft swiperight", function (ev) {

		// 	console.log(ev.type)

		// 	if(ev.type=="swipeleft") {

		// 		d3.select(".column_slide svg .chart_content")
		// 			.transition()
		// 			.duration(window.DURATION)
		// 			.attr("transform", "translate(-790, 0)")

		// 	} else {

		// 		d3.select(".column_slide svg .chart_content")
		// 			.transition()
		// 			.duration(window.DURATION)
		// 			.attr("transform", "translate(790, 0)")

		// 	}

		// 	ev.stopPropagation()
		// })

	}

	var darw = function(url) {

		// 添加select
		var selectStr = ".column_slide .wrap-content"
		others.addSelect(selectStr)

		var left = 79
		var top = 112

		var width = 743
		var height = 243

		var COLORS = d3.scale.ordinal()
			.range(["#ed514d", "#85d678"])


		// 比例尺
		var x0 = d3.scale.ordinal()
			.rangeRoundBands([0, width], .5);

		var x1 = d3.scale.ordinal()

		var y = d3.scale.linear()
			.range([height, 10])

		// 数轴
		var xAxis = d3.svg.axis()
			.scale(x0).orient("bottom")

		var yAxis = d3.svg.axis()
			.scale(y).orient("left").ticks(5)

		var svg = d3.select(".column_slide .wrap-content").append("svg")

		var chart = svg.append("g").classed("chart", true)
			.attr("transform", "translate(" + left + "," + top + ")")

		var legen = svg.append("g").classed("legen", true)
			.attr("transform", "translate(" + 218 + "," + 36 + ")")

		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: url,
			success: function(data) {

				console.log("加载 data:")
				console.log(data)

				console.error("现在还用示例数据：column_slide")

				var data = [{
					name: "Ailsa",
					notComplete: 20,
					complete: 10,
				}, {
					name: "Barbara",
					notComplete: 30,
					complete: 30,
				}, {
					name: "Becky",
					notComplete: 60,
					complete: 70,
				}, {
					name: "Carry",
					notComplete: 90,
					complete: 10,
				}, {
					name: "Darcy",
					notComplete: 50,
					complete: 50,
				}, {
					name: "Jenny",
					notComplete: 20,
					complete: 40,
				}]

				data = formatData(data)

				// 将所有数据的 name属性，映射为一个数组 => [name1, name2, ... , name5]
				var nameList = data.map(function(d) {
					return d.name
				})
				var extent = extentData(data)

				// 筛选 data 的 key => ["complete", "notComplete"]
				var staticInformation = d3.keys(data[0]).filter(function(key) {
					return key != "name"
				})

				data.forEach(function(d) {
					d.value = staticInformation.map(function(key) {
						return {
							key: key,
							value: d[key]
						}
					})
				})

				x0.domain(nameList)
				x1.domain(staticInformation)
					.rangeRoundBands([0, x0.rangeBand()], .3)
				y.domain(extent)

				chart.append("g")
					.classed("x axis", true)
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)

				chart.append("g")
					.classed("y axis", true)
					.call(yAxis)

				// 添加背景
				//   d3.selectAll(".chart .y .tick line").attr({
				// 	x2: width,
				// 	y2: 0,
				// })
				// d3.selectAll(".chart .x .tick line").attr({
				// 	x2: 0,
				// 	y2: -height,
				// })

				var chart_content = chart.append("g").classed("chart_content", true)

				var employeeName = chart_content.selectAll(".employeeName")
					.data(data)
					.enter().append("g")
					.classed("g", true)
					.attr({
						transform: function(d) {
							return "translate(" + x0(d.name) + ",0)";
						}
					})

				employeeName.selectAll("rect")
					.data(function(d) {
						return d.value
					})
					.enter().append("rect")
					.attr({
						x: function(d) {
							return x1(d.key)
						},
						y: function(d) {
							return height
						},
						width: x1.rangeBand(),
						height: function(d) {
							return 0
						},
						fill: function(d) {
							return COLORS(d.key)
						},
						color: function(d) {
							return COLORS(d.key)
						}
					})
					.transition()
					.duration(window.DURATION)
					.attr({
						y: function(d) {
							return height - y(d.value)
						},
						height: function(d) {
							return y(d.value)
						},
					})


				legen.selectAll("g")
					.data(staticInformation).enter()
					.append("g").classed("legen-item", true)
					.attr({
						transform: function(d, i) {
							return "translate(" + (i * 100) + "," + 0 + ")"
						},
						color: function(d) {
							return COLORS(d)
						}
					})


				legen.selectAll("g")
					.append("rect")
					.attr({
						fill: function(d) {
							return COLORS(d)
						},
						width: window.legen_rect.width,
						height: window.legen_rect.height,
						opacity: 0
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				legen.selectAll("g")
					.append("text")
					.attr({
						x: window.legen_rect.width + 5,
						y: window.legen_rect.height,
						dy: "-.25em",
						opacity: 0
					})
					.style("text-anchor", "star")
					.text(function(d) {
						return d
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				animation()

			} // end success()
		}) // end $.ajax()
	}

	var clean = function() {
		$(".column_slide .wrap-content").html("")
	}

	module.exports = {

		create: function(departmentName, year, employeeName) {

			var departmentName = departmentName || "/cmc"
			var year = year || "/2014"
			var employeeName = employeeName || "/AMERsawans12"

			var BASE_URL = "http://localhost:8080/Deliverable/service"

			var url = BASE_URL + "/employer/employees" + departmentName + year + employeeName

			clean()
			darw(url)
		}, // end create()
		legenAnimation: function(index) {

			var index = index || 0

			var point = d3.selectAll(".column_slide .legen-item")
				.filter(function(d, i) {
					return i == index
				})

			var siblings = d3.selectAll(".column_slide .legen-item")
				.filter(function(d, i) {
					return i != index
				})

			var color = point.attr("color")
			var packetNum = point.size() + 1 // 每组条形图的个数

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

			d3.select(".column_slide .chart_content")
				.selectAll("g rect")
				.filter(function(d, i) {
					return i % packetNum == index
				})
				.transition()
				.duration(window.DURATION)
				.attr("fill", color)

			d3.select(".column_slide .chart_content")
				.selectAll("g")
				.selectAll("rect")
				.filter(function(d, i) {
					return i % packetNum != index
				})
				.transition()
				.duration(window.DURATION)
				.attr("fill", "#333")
		},	// end legenAnimation()

		rectAnimation: function(index) {

			var index = index || 0

			var point = d3.select(".column_slide .chart_content")
				.selectAll(".g")
				.filter(function(d, i) {
					return i == index
				})

			var siblings = d3.select(".column_slide .chart_content").selectAll(".g")
				.filter(function(d, i) {
					return i != index
				})

			point.selectAll("rect")
				.transition()
				.duration(window.DURATION)
				.attr({
					fill: function(d) {
						return d3.select(this).attr("color")
					}
				})

			siblings.selectAll("rect")
				.transition()
				.duration(window.DURATION)
				.attr({
					fill: "#333"
				})
		},	// end rectAnimation()

		recolorAnimation: function() {

			var COLORS = d3.scale.ordinal()
				.range(["#ed514d", "#85d678"])

			legen = d3.selectAll(".column_slide .legen-item")

			legen.selectAll("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", function(d, i) {
					return COLORS(d)
				})

			legen.selectAll("text")
				.style("fill", "#ffffff")

			d3.select(".column_slide .chart_content").selectAll(".g")
				.selectAll("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", function(d, i) {
					return COLORS(d.key)
				})
		},	// end recolorAnimation()

	}	// end module.exports
})