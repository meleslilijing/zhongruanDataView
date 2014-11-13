define(function(require, exports, module) {

	var pie = require("./pie.js")
	var line = require("./line.js")
	var column_slide = require("./column_slide.js")
	var table = require("./table.js")

	module.exports = {

		administrator: function() {

			var isColor = true

			// 点击 pie 图
			touch.on(".pie", "tap", ".legen-item rect, .legen-item text, .arc path, .arc text", function(ev) {

				var index = $(this).parent().index()

				// 筛选表格内容
				table.filter(SORT_ARR[index])

				pie.pathAnimation(index)
				pie.legenAnimation(index)
				line.lengenAnimation(index)
				line.pathAnimation(index)

				isColor = false

				ev.stopPropagation()

			})

			// 点击 line 图例
			touch.on(".line", "tap", ".legen-item rect, .legen-item text", function(ev) {

				var index = $(this).parent().index()

				// 筛选表格内容
				table.filter(SORT_ARR[index])

				pie.pathAnimation(index)
				pie.legenAnimation(index)
				line.lengenAnimation(index)
				line.pathAnimation(index)

				isColor = false

				ev.stopPropagation()
			})

			// recolor
			touch.on(".pie .wrap-content", "tap", function(ev) {

				if (!isColor) {

					// 显示所有表格项
					table.showAll()

					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

			touch.on(".line .wrap-content", "tap", function(ev) {

				if (!isColor) {

					// 显示所有表格项
					table.showAll()

					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

		},	// end administrator()

		manager: function() {

			var isColor = true

			console.log(isColor)

			// 点击 pie 图例: pie 图内部交互
			touch.on(".pie", "tap", ".legen-item rect, .legen-item text, .arc path, .arc text", function(ev) {

				console.log("pie rect")

				var index = $(this).parent().index()

				// 筛选表格内容
				table.filter(SORT_ARR[index])

				pie.pathAnimation(index)
				pie.legenAnimation(index)

				isColor = false

				console.log(isColor)

				ev.stopPropagation()

			})

			// 点击 column_slide 图例: 仅column_slide 内部交互
			touch.on(".column_slide", "tap", ".legen-item rect, .legen-item text", function(ev) {

				console.log("column_slide rect")

				var index = $(this).parent().index()

				// 筛选表格内容
				table.filter(SORT_ARR[index])

				column_slide.legenAnimation(index)

				isColor = false

				console.log(isColor)

				ev.stopPropagation()
			})

			//	点击 column_slide 柱: column_slide 内部交互，重绘 pie 图
			touch.on(".column_slide .wrap-content", "tap", ".chart_content rect, .x .tick text", function(ev) {

				var index = $(this).parent().index()

				column_slide.rectAnimation(index)

				// 重绘 pie 图
				// do.something()
				console.log("重绘 pie 图")

				isColor = false

				console.log(isColor)

				ev.stopPropagation()
			})

			// recolor
			touch.on(".pie svg", "tap", function(ev) {

				console.log("pie recolor")

				if (!isColor) {

					// 显示所有表格项
					table.showAll()

					pie.recolorAnimation()

					isColor = true

					console.log(isColor)


				}

			})

			touch.on(".column_slide .wrap-content", "tap", function(ev) {

				console.log("column_slide recolor")

				if (!isColor) {

					// 显示所有表格项
					table.showAll()

					pie.recolorAnimation()
					column_slide.recolorAnimation()

					isColor = true

					console.log(isColor)

				}

			})

			/*
				以下是分组柱图的轮播效果
			*/
			! function() {

				var column_slide = require("./column_slide.js")

				var addColumnSlide = function() {

					++CHART_NO

					column_slide.addChart()
				}

				var page = 0 // 当前显示页数
				var range = [0, 5] // 一次显示 5 页

				var width = d3.select(".column_slide .wrap-content").style("width")

				var step = parseInt(width) // 滚动步长

				touch.on(".column_slide .wrap-content", "swipeleft swiperight", function(ev) {

					/*
					现在有个问题： swipe 可能在一次滑动被触发多次
				*/
					var chart = d3.selectAll(".column_slide svg .chart_content")

					var x = chart.attr("X")

					if (ev.type == "swipeleft") {

						// if (page < range[1] - 1) {

						// 	page++

						// 	// 返回新创建的 分组柱图 
						// 	addColumnSlide()
						// 	console.log("当前计数器：", CHART_NO)

						// 	x -= step

						// 	chart.transition().duration(window.DURATION)
						// 		.attr("x", x)
						// 		.attr("transform", "translate(" + x + ", 0)")
						// }

					} else {

						// if (page > range[0]) {

						// 	page--

						// 	x += step

						// 	chart.transition().duration(window.DURATION)
						// 		.attr("x", x)
						// 		.attr("transform", "translate(" + x + ", 0)")
						// }
					}

				})	// end touch.on


			} // end !function()
		}, // end manager()

		employee: function () {

			touch.on(".mod-table", "tap", "tr", function (ev) {
				
				// var $this = $(this).parent()

				// var $siblings = $this.siblings().removeClass("selected")

				// $(this).parent().addClass("selected")

				// var next_data = $(".mod-table .selected .next_data").text()
				// console.log("next_data:", next_data)

			})

		}


	} // end module.exports

})