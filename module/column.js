define(function(require, exports, module) {

	// 返回data中，value的最大值和最小值
	var findMaxAndMin = function(data) {
		
		var max,min

		for (var arr in data) {
			max = Math.max(data[arr], max) || data[arr]
			min = Math.min(data[arr], min) || data[arr]
		}
		return [min, max]
	}

	var creatKeyArray = function(data) {

		var KeyArray = []

		for (var arr in data) {
			KeyArray.push(arr)
		}

		return KeyArray
	}

	$.ajax({
		type: "GET",
		dataType: "jsonp",
		url:"http://localhost:8080/Deliverable/service/employee/allWorkgroup",
		success: function(data) {
			console.log("输出所有员工姓名")
			console.log(data)
		}
	})


	module.exports = {
		init: function() {

			var svg = d3.select(".column .wrap-content").append("svg")

			var colors = d3.scale.ordinal()
					.range(["#ed514d","#85d678","#6de5e1","#ff651a","#ff861a","#ffb61a","#ffe11a","#e1ff56","#e0ffaf"])

			// 图表尺寸
			var width = 410
			var height = 130

			// 比例尺
			var xScale = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1)

			var yScale = d3.scale.linear()
				.range([height, 0])

			// 数轴
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")

			// var tip = d3.tip()
			// 	.attr('class', 'tips')
			// 	.offset([-10, 0])
			// 	.html(function(d) {
			// 		return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
			// 	})

			// $.ay: function(data) {

					var data = {
						"Discontinued": 1,
						"Scheduled": 2,
						"Assigned": 3,
						"Initiated": 4,
						"Approval": 5,
						"Completed": 6,
						"Call for Contributions": 7,
						"Authoring": 8,
						"Review": 9
					}

					xScale.domain(findMaxAndMin(data))

					yScale.domain(creatKeyArray(data))
			// 	},
			// 	error: function() {
			// 		console.error("")
			// 	}

			// }

			// d3.json("url", function(data) {

			// 	// 输入值域
			// 	xScale.domain()
			// 	yScale.domain([0, d3.max(data, function(d) {
			// 		return d.数据段
			// 	})])

			// 	svg.append("g")
			// 		.attr("class", "x axis")
			// 		.attr("transform", "translate(0," + height + ")")
			// 		.call(xAxis)

			// 	svg.append("g")
			// 		.attr("class", "y axis")
			// 		.call(yAxis)

			// 	svg.selectAll(".bar")
			// 	      .data(data)
			// 	    .enter().append("rect")
			// 	      .attr("class", "bar")
			// 	      .attr("x", function(d) { return x(d.letter); })
			// 	      .attr("width", x.rangeBand())
			// 	      .attr("y", function(d) { return y(d.frequency); })
			// 	      .attr("height", function(d) { return height - y(d.frequency); })
			// 	      .on('mouseover', tip.show)
			// 	      .on('mouseout', tip.hide)
			// })

		}
	}


})