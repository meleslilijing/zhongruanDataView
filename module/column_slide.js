define(function(require, exports, module) {

	var others = require("./others.js")

	// 	是否有数轴
	var haveAxis = false

	// 分组柱图 颜色映射
	var COLORS = d3.scale.ordinal()
		.range(["#ed514d", "#85d678"])

	var formatData = function(data) {

		var array = []

		for (item in data) {


			var obj = {}

			obj.name = item

			obj.notComplete = data[item].Discontinued

			obj.complete = 0

			for (var key in data[item]) {

				obj.complete += (key != "Discontinued") ? data[item][key] : 0
			}

			array.push(obj)

		}

		// formatData
		return array
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

	var darw = function(url, addLegen) {

		var COLORS = d3.scale.ordinal()
			.range(["#ed514d", "#85d678"])

		var width = 743
		var height = 243

		// 比例尺
		var x0 = d3.scale.ordinal()
			.rangeRoundBands([0, width], .5);

		var x1 = d3.scale.ordinal()

		var y = d3.scale.linear()
			.range([height , 0])

		// 数轴
		var xAxis = d3.svg.axis()
			.scale(x0).orient("bottom")

		var yAxis = d3.svg.axis()
			.scale(y).orient("left").ticks(5)

		var chart = d3.select(".column_slide .wrap-content .chart")

		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: url,
			success: function(data) {

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
				y.domain([0, extent[1]])

				// 如果没有数轴，添加数轴
				if (!haveAxis) {

					haveAxis = true

					chart.append("g")
						.classed("x axis", true)
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis)

					chart.append("g")
						.classed("y axis", true)
						.call(yAxis)

				}

				var chart_no_class = "no_" + window.CHART_NO

				var chart_content = chart.append("g").classed("chart_content", true)
					.classed(chart_no_class, true).attr("x", 0)

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
							return y(d.value)
						},
						height: function(d) {
							return height - y(d.value)
						},
					})

				employeeName.selectAll("text")
					.data(function(d) {
						return d.value
					}).enter()
					.append("text").classed("tips", true)
					.attr({
						x: function(d) {
							return x1(d.key) + x1.rangeBand() / 2
						},
						y: function(d) {
							return y(d.value) - 5 // 5 为偏移量
						},
						"text-anchor": "middle",
						fill: "#ffffff"
					})
					.text(function(d, i) {
						return d.value
					})

				employeeName
					.append("text")
					.text(function(d) {
						return d.name
					})
					.attr({
						"text-anchor": "middle",
						x: function(d) {
							return x0.rangeBand(d.name) / 2
						},
						y: height,
						dy: "1.3em",
						fill: "#ffffff"
					})



				// animation()

			} // end success()
		}) // end $.ajax()

		if (addLegen) {
			addLegen()
		}

	}

	var addLegen = function(url) {

		var legen = d3.select(".column_slide .wrap-content svg")
			.append("g").classed("legen", true)
			.attr("transform", "translate(" + 218 + "," + 36 + ")")

		legen.selectAll("g")
			.data(["notComplete", "complete"]).enter()
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
	}

	var clean = function() {
		$(".column_slide .wrap-content").html("")
	}

	module.exports = {

		create: function(departmentName, year, employeeName) {

			// 添加 years select
			others.addYearsSelect("manager", ".column_slide .wrap-content", departmentName)

			// 清空图表区域
			clean()

			var left = 79
			var top = 112

			var width = 743
			var height = 243

			// 比例尺
			var x0 = d3.scale.ordinal()
				.rangeRoundBands([0, width], .5);

			var x1 = d3.scale.ordinal()

			var y = d3.scale.linear()
				.range([height - 5, 0])

			var svg = d3.select(".column_slide .wrap-content").append("svg")

			var chart = svg.append("g").classed("chart", true)
				.attr("transform", "translate(" + left + "," + top + ")")

			this.addChart(departmentName, year, employeeName)
			addLegen()
		}, // end create()
		addChart: function(departmentName, year, employeeName) {

			var departmentName = departmentName || "/cmc"
			var year = year || "/2014"
			var employeeName = employeeName || "/all"

			var url = BASE_URL + "/employer/employees" + departmentName

			console.log("addChart")

			// 获取用户名列表
			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: url,
				success: function(nameList) {

					var nameArr = [] // 当前页数据
					var name_count = 6 // 当前加载数据量

					for (var i = 0; i < name_count; i++) {

						if (!nameList[i] ) {
							NAME_LIST_POINT
							name_count++
							continue

						} else {

							nameArr.push(nameList[NAME_LIST_POINT])
							NAME_LIST_POINT++

						}

					} // end 

					nameArr = "/" + nameArr.toString()

					// 绘制图表的 url
					var url = BASE_URL + "/employer/employees" + departmentName + year + nameArr

					darw(url)
				}

			}) // end $.ajax()
		},
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

		}, // end legenAnimation()

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
		}, // end rectAnimation()

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
		}, // end recolorAnimation()

	} // end module.exports
})