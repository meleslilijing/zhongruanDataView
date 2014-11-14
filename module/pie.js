define(function(require, exports, module) {

	var others = require('./others.js')

	// 返回格式化后的数据
	var formatData = function(data) {

			// 排序
			var sortArr = [
				"Discontinued", "Scheduled", "Assigned",
				"Initiated", "Authoring", "Review",
				"Approval", "Completed", "Call for Contributions"
			]

			var dataset = []
			var isAllZero = true

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

				if (obj.value) {
					isAllZero = false
				}

			} // end for sortArr

			// 如果数据均为空, 将数据都改为 1, 并提示
			if (isAllZero) {
				for (var i = 0; i < dataset.length; i++) {
					dataset[i].value = 1
				}
			}

			return dataset
		} // end format

	var draw = function(url) {

		// pie config
		var svg = d3.select(".pie .wrap-content").append("svg")

		var x = 111
		var y = 76

		var width = 163
		var height = 163

		var radiuRatio = 0.7 // 内外半径比例
		var textRatio = 1.7 // 文字距离比例

		var outerRadius = parseInt(Math.min(width, height) / 2)
		var innerRadius = parseInt(outerRadius * radiuRatio)

		var pieSvg = svg.append("g").classed("pieSvg", true)
			.attr("transform", "translate(" + (x + outerRadius) + "," + (y + outerRadius) + ")")

		// var legenSvg = svg.append("g").classed("legen", true)
		var arc = d3.svg.arc()
			.outerRadius(outerRadius)
			.innerRadius(innerRadius)

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) {
				return d.value
			})

		var formatPercent = d3.format(".2%")

		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: url,
			success: function(data) {

				// 格式化数据
				var data = formatData(data)

				var sum = 0

				data.forEach(function(d) {
					sum += d.value
				})

				var g = pieSvg.selectAll(".arc")
					.data(pie(data))
					.enter()
					.append("g").classed("arc", true)
					.attr({
						"name": function(d) {
							return d.data.key
						},
						color: function(d) {
							return COLORS(d.data.key)
						}
					})

				g.append("path")
					.attr({
						d: arc,
						opacity: 0
					})
					.attr("fill", function(d) {
						return COLORS(d.data.key)
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				g.append("text")
					.attr({
						transform: function(d) {

							var coordinate = arc.centroid(d)

							var x = coordinate[0] * textRatio
							var y = coordinate[1] * textRatio

							return "translate(" + x + "," + y + ")";
						},
						fill: "#ffffff",
						dy: ".35em",
						opacity: 0
					})
					.style({
						"text-anchor": "middle",
						"font-size": "14px"
					})
					.text(function(d) {
						d.value = d.value / sum
						return formatPercent(d.value)
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", function(d) {

						if (!d.value) {return 0}

						return 1
					})

				var legen_coordinate = [{
					x: 451,
					y: 35
				}, {
					x: 580,
					y: 35
				}, {
					x: 705,
					y: 35
				}, {
					x: 451,
					y: 119
				}, {
					x: 580,
					y: 119
				}, {
					x: 705,
					y: 119
				}, {
					x: 451,
					y: 209
				}, {
					x: 580,
					y: 209
				}, {
					x: 705,
					y: 209
				}]

				var legen_rect = {
					width: 13,
					height: 13,
				}

				var legen_item = svg.append("g").classed("legen", true)
					.selectAll()
					.data(data).enter()
					.append("g").classed("legen-item", true)
					.attr({
						"transform": function(d, i) {
							var x = legen_coordinate[i].x
							var y = legen_coordinate[i].y

							return "translate(" + x + "," + y + ")"
						},
						name: function(d) {
							return d.key
						},
						color: function(d) {
							return COLORS(d.key)
						},
					})


				legen_item
					.append("rect")
					.attr({
						width: legen_rect.width,
						height: legen_rect.height,
						fill: function(d) {
							return COLORS(d.key)
						},
						opacity: 0
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				legen_item.append("text")
					.text(function(d) {
						return d.key
					})
					.attr({
						transform: "translate(22, 13)",
						opacity: 0
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				legen_item.append("text")
					.text(function(d, i) {
						return d.value
					})
					.attr({
						transform: "translate(28,43)",
						opacity: 0
					})
					.style({
						"font-size": "18px"
					})
					.transition()
					.duration(window.DURATION)
					.attr("opacity", 1)

				// Pie图的交互效果
				// animation()

				window.FLAG++	// 加载完毕，增加flag量
				console.log("FLAG:", FLAG)
				// 关闭 loading DOM
				if (FLAG == FLAG_OVER) {
					window.CLOSE_LOADING()
				}

			} // end success
		}) // end $.ajax
	}

	var clean = function () {
		$(".pie .wrap-content").html(function () {
			return ""
		})
	}

	module.exports = {

		create: function(type, departmentName, year, employeeName) {

			

			if (!type) {
				console.error("加载Pie图失败。需要输入Pie图的类型: administrator | manager")
			}

			var departmentName = departmentName || "/all" // 部门名称
			var year = year || "/2014" // 年份 默认应该为最新一年
			var employeeName = employeeName

			var BASE_URL = "http://localhost:8080/Deliverable/service"

			if (type == "administrator") {
				url = BASE_URL + "/admin/departmentYear" + departmentName + year
			} else if (type == "manager") {
				url = BASE_URL + "/employer/employees" + departmentName + year + employeeName
			}

			clean()
			draw(url)



		},
		legenAnimation: function(index) {

			var index = index || 0

			var point = d3.select(".pie .legen")
				.selectAll(".legen-item")
				.filter(function(d, i) {
					return i == index
				})

			var siblings = d3.select(".pie .legen")
				.selectAll(".legen-item")
				.filter(function(d, i) {
					return i != index
				})

			var color = point.attr("color")

			// 选择节点上色
			point.select("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", color)

			point.select("text")
				.transition()
				.duration(window.DURATION)
				.style("fill", "#ffffff")

			// 兄弟节点黑白
			siblings.select("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", BG_COLORS)

			siblings.selectAll("text")
				.transition()
				.duration(window.DURATION)
				.style("fill", BG_COLORS)
		},
		pathAnimation: function(index) {

			var index = index || 0

			var point = d3.select(".pie .pieSvg")
				.selectAll(".arc").filter(function(d, i) {
					return i == index
				})


			var siblings = d3.select(".pie .pieSvg")
				.selectAll(".arc").filter(function(d, i) {
					return i != index
				})

			var color = point.attr("color")

			point.select("path")
				.transition()
				.duration(window.DURATION)
				.attr("fill", color)

			point.select("text")
				.transition()
				.duration(window.DURATION)
				.attr("fill", "#ffffff")

			siblings.select("path")
				.transition()
				.duration(window.DURATION)
				.attr("fill", BG_COLORS)

			siblings.select("text")
				.transition()
				.duration(window.DURATION)
				.attr("fill", BG_COLORS)
		},
		recolorAnimation: function() {

			var path = d3.selectAll(".pie .pieSvg .arc")
			var legen = d3.selectAll(".pie .legen .legen-item")

			path.select("path")
				.transition()
				.duration(window.DURATION)
				.attr("fill", function(d, j) {
					return COLORS(j)
				})

			path.select("text")
				.transition()
				.duration(window.DURATION)
				.attr("fill", "#ffffff")

			legen.select("rect")
				.transition()
				.duration(window.DURATION)
				.attr("fill", function(d, j) {
					return COLORS(j)
				})

			legen.selectAll("text")
				.transition()
				.duration(window.DURATION)
				.style("fill", "#ffffff")
		}

	} // end exports

}) // end define