define(function(require, exports, module) {

	var others = require("./others.js")

	// 默认加载
	window.USERTYPE = "administrator"
	window.DEPARTMENTNAME = "/all"
	window.YEAR = "/2014"

	// 数据与颜色间映射
	window.COLORS = d3.scale.ordinal()
		.range([
			"#ed514d", "#46affe", "#ff7a38",
			"#ff9a38", "#ffb638", "#ffcf3e",
			"#ffd967", "#ffde95", "#85d678"
		])

	window.legen_rect = {
		"width": 13,
		"height": 13,
	}

	window.DURATION = 1000 // 动画持续时间

	// 添加所有 员工列表
	others.addMenu('administrator')

	// 关闭表格 事件冒泡
	touch.on(".table-box", "tap hold drag swif", function(ev) {
		ev.stopPropagation()
	})



	require.async(["./pie.js", "./line.js", "./deliverable.js"], function(pie, line, deliverable) {

		pie.create(USERTYPE, DEPARTMENTNAME, YEAR)
		line.create(DEPARTMENTNAME, YEAR)
		deliverable.init()

		var animation = function() {
			
			var isColor = true

			// 点击 pie 图例
			touch.on(".pie", "tap", ".legen-item rect, .legen-item text, .arc path, .arc text", function(ev) {

				console.log("--------")

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

				if (!isColor) {
					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

			touch.on(".line svg", "tap", function(ev) {

				if (!isColor) {
					pie.recolorAnimation()
					line.recolorAnimation()
					isColor = true
				}

			})

		}()

	})



	// require.async("./line.js", function(line) {
	// 	line.create(DEPARTMENTNAME, YEAR)
	// })

	// require.async("./deliverable.js", function(deliverable) {
	// 	deliverable.init()
	// })


})