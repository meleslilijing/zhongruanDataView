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

	var drawPie = function(url) {

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

				// console.log("pie color:")
				g.append("path")
					.attr("d", arc)
					.style("fill", function(d) {
						// console.log("key:%s, color:%s", d.data.key, colors(d.data.key))
						return colors(d.data.key)
					})

				g.append("text")
					.attr({
						transform: function(d) {

							var coordinate = arc.centroid(d)

							var x = coordinate[0] * textRatio
							var y = coordinate[1] * textRatio

							return "translate(" + x + "," + y + ")";
						},
						dy: ".35em",
					})
					.style({
						"text-anchor": "middle",
						fill: "#ffffff",
						"font-size": "14px"
					})
					.text(function(d) {
						d.value = d.value / sum
						return formatPercent(d.value)
					})

				var legen_coordinate = [
						{x: 451,y: 35}, {x: 580,y: 35}, {x: 705,y: 35},
						{x: 451,y: 119}, {x: 580,y: 119}, {x: 705,y: 119}, 
						{x: 451,y: 209}, {x: 580,y: 209}, {x: 705,y: 209}
					]

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
							}
						})

				// console.log("rect color:")
				legen_item
					.append("rect")
					.attr({
						width: legen_rect.width,
						height: legen_rect.height,
						fill: function(d) {
							// console.log("key:%s, color:%s", d.key, colors(d.key))
							return colors(d.key)
						}
					})

				legen_item.append("text")
					.text(function(d) {
						return d.key
					})
					.attr("transform", "translate(22, 13)")

				legen_item.append("text")
					.text(function(d, i) {
						return d.value
					})
					.attr({
						"transform": "translate(28,43)",
					})
					.style({
						"font-size": "18px"
					})
			} // end success
		}) // end $.ajax
	}

	module.exports = {
		createPie: function(type, name, year, employeeName) {

			if(!type) {
				console.error("加载Pie图失败。需要输入Pie图的类型: administrator | manager")
			}
				
			var name = name || "/all" 	// 部门名称
			var year = year || "/2014"	// 年份 默认应该为最新一年
			var employeeName = employeeName

			var BASE_URL = "http://localhost:8080/Deliverable/service"

			if(type == "administrator") {
				url = BASE_URL + "/admin/departmentYear"	+ name + year 
			} else if(type == "manager") {
				url = BASE_URL + "/employer/employees/" + name + year + employeeName
			}

			// 加载数据
			drawPie(url)
		},

	} // end exports

}) // end define