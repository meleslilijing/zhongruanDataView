define(function(require, exports, module){

	var others = require("./others.js")

	var formatData = function(data) {
		// formatData
		return data
	}

	var extentData = function(data) {

		var min = max = 0

		console.log(data)
		
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

	// 
	var creatNameList = function(data) {

		var nameList = []

		for(var i = 0; i < data.length; i++) {
			nameList.push(data[i].name)
		}

		return nameList

	}

	module.exports = {
		init: function() {

			// 添加select
			var selectStr = ".column_slide .wrap-content"
			others.addSelect(selectStr)

			var left = 79
			var top = 112

			var width = 743
			var height = 243

			var colors = d3.scale.ordinal()
							.range(["#ed514d", "#85d678"])

			var x0 = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .5);

			var x1 = d3.scale.ordinal()

			var y = d3.scale.linear()
			    .range([height, 0])

			var xAxis = d3.svg.axis()
							.scale(x0).orient("bottom")
			var yAxis = d3.svg.axis()
							.scale(y).orient("left").ticks(5)

			var svg = d3.select(".column_slide .wrap-content").append("svg")
			
			var chart = svg.append("g").classed("chart", true)
							.attr("transform", "translate("+left+","+top+")")

			var legen = svg.append("g").classed("legen", true)
							.attr("transform", "translate("+218+","+36+")")

			!function() {

				var data = [
					{name:"Ailsa", complete: 10, notComplete: 20},
					{name:"Barbara", complete: 30, notComplete: 30},
					{name:"Becky", complete: 70, notComplete: 60},
					{name:"Carry", complete: 10, notComplete: 90},
					{name:"Darcy", complete: 50, notComplete: 50},
					{name:"Jenny", complete: 40, notComplete: 20}
				]

				data = formatData(data)

				// 将所有数据的 name属性，映射为一个数组 => [name1, name2, ... , name5]
				var nameList = data.map(function(d){ return d.name })
				var extent = extentData(data)

				// 筛选 data 的 key => ["complete", "notComplete"]
				var staticInformation = d3.keys(data[0]).filter(function(key) {
					return key != "name"
				})

				console.log("nameList:")
				console.log(nameList)

				console.log("staticInformation:")
				console.log(staticInformation)

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
			    		.data(function(d){return d.value})
			    	.enter().append("rect")
			    		.attr({
			    			x: function (d) {
			    				return x1(d.key)
			    			},
			    			y: function (d) {
			    				return y(d.value)
			    			},
			    			width: x1.rangeBand(),
			    			height: function (d) {
			    				return height - y(d.value)
			    			},
			    			fill: function (d) {
			    				return colors(d.key)
			    			}
			    		})


			    legen.selectAll("g")
			    	.data(staticInformation).enter()
			    	.append("g")
			    	.attr("transform", function (d, i) {
			    		return "translate(" + ( i * 100 ) + "," + 0 + ")"
			    	})


			    legen.selectAll("g")
			    	.append("rect")
			    	.attr({
			    		fill: function(d) {
				    		return colors(d)
				    	},
				    	width: window.legen_rect.width,
				    	height: window.legen_rect.height

			    	})

			    legen.selectAll("g")
			    	.append("text")
			    	.attr({
			    		x: window.legen_rect.width+5,
			    		y: window.legen_rect.height,
			    		"dy": "-.25em"
			    	})
			    	.style("text-anchor", "star")
			    	.text(function(d) {
			    		return d
			    	})


			}()	// end !function()

		} // end init()
	}
})

