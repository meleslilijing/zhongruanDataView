define(function(require, exports, module){

	var others = require("./others.js")

	module.exports = {
		init: function() {

			var url = ""

			// 添加select
			var selectStr = ".column_slide .wrap-content"
			others.addSelect(selectStr)

			var x = 79
			var y = 112

			var width = 743
			var height = 243

			var xScale = d3.scale.ordinal().rangeRoundBands([0, width])
			var yScale = d3.scale.linear().range([height, 0])

			var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
			var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5)

			var svg = d3.select(".column_slide .wrap-content").append("svg")
			
			var chart = svg.append("g").classed("chart", true)
			var legen = svg.append("g").classed("legen", true)

			// d3.json(url, function() {

			// })
		}
	}
})

