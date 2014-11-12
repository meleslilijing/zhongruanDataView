define(function(require, exports, module) {

	var pie = require("./pie.js")
	var line = require("./line.js")
	var column_slide = require("./column_slide.js")

	module.exports = {

		administrator: function() {

			var isColor = true

			// 点击 pie 图例
			touch.on(".pie", "tap", ".legen-item rect, .legen-item text, .arc path, .arc text", function(ev) {

				console.log("pie rect")

				var index = $(this).parent().index()

				pie.pathAnimation(index)
				pie.legenAnimation(index)
				line.lengenAnimation(index)
				line.pathAnimation(index)

				isColor = false

				ev.stopPropagation()

			})

			// 点击 line 图例
			touch.on(".line", "tap", ".legen-item rect, .legen-item text", function(ev) {

				console.log("line rect")

				var index = $(this).parent().index()

				pie.pathAnimation(index)
				pie.legenAnimation(index)
				line.lengenAnimation(index)
				line.pathAnimation(index)

				isColor = false

				ev.stopPropagation()
			})

			// recolor
			touch.on(".pie svg", "tap", function(ev) {

				console.log("pie recolor")

				if (!isColor) {
					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

			touch.on(".line svg", "tap", function(ev) {

				console.log("pie recolor")

				if (!isColor) {
					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

		},

		manager: function() {

			var isColor = true

			// 点击 pie 图例: pie 图内部交互
			touch.on(".pie", "tap", ".legen-item rect, .legen-item text, .arc path, .arc text", function(ev) {

				console.log("pie rect")

				var index = $(this).parent().index()

				pie.pathAnimation(index)
				pie.legenAnimation(index)

				isColor = false

				ev.stopPropagation()

			})

			// 点击 column_slide 图例: 仅column_slide 内部交互
			touch.on(".column_slide", "tap", ".legen-item rect, .legen-item text", function(ev) {

				console.log("column_slide rect")

				var index = $(this).parent().index()

				column_slide.legenAnimation(index)

				isColor = false

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

				ev.stopPropagation()
			})

			// recolor
			touch.on(".pie svg", "tap", function(ev) {

				console.log("pie recolor")

				if (!isColor) {

					pie.recolorAnimation()

					isColor = true

				}

			})

			touch.on(".column_slide .wrap-content", "tap", function(ev) {

				console.log("column_slide recolor")

				if (!isColor) {

					pie.recolorAnimation()
					column_slide.recolorAnimation()

					isColor = true
				}

			})

			/*
				以下是分组柱图的轮播效果
			*/
			var column_slide = require("./column_slide.js")

			var addColumnSlide = function() {

				++CHART_NO

				column_slide.addChart()
			}

			var x = 0

			var point = 0 // 当前显示页数
			var range = [0, 5] // 一次显示 5 页

			var width = d3.select(".column_slide .wrap-content").style("width")

			var step = parseInt(width) // 滚动步长

			touch.on(".column_slide .wrap-content", "swipeleft swiperight", function(ev) {

				/*
					现在有个问题： swipe 可能在一次滑动被触发多次
				*/
				var chart = d3.select(".column_slide svg .chart_content")

				if (ev.type == "swipeleft") {

					if (point < range[1] - 1) {

						point++

						// 返回新创建的 分组柱图 
						addColumnSlide()

						x -= step

						chart.transition().duration(window.DURATION).attr("transform", "translate(" + x + ", 0)")
					}

				} else {

					if (point > range[0]) {

						point--



						x += step

						chart.transition().duration(window.DURATION).attr("transform", "translate(" + x + ", 0)")
					}
				}

				console.log("point:", point)

			})


		},


	} // end module.exports

})