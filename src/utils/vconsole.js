const VConsole = require('vconsole')
const vconsole = new VConsole()

let vuexPlugin = new VConsole.VConsolePlugin('plugin_vuex', 'Vuex')
vuexPlugin.on('renderTab', function(callback) {
	var html = `<div style="text-align: center; padding: 10px 0;"><span style="background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; padding: 2px 6px; font-size: 12px;"> vuex </span>
	<span style=" background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; padding: 2px 6px; font-size: 12px;"> Detected Vue v2.5.21 </span></div>`
	callback(html)
})
vconsole.addPlugin(vuexPlugin)

export default {
	install: function (Vue) {
		console.log(Vue.$store)
		vuexPlugin.on('ready', function(callback) {
			console.log(34534)
			var html = '<div>Click the tool button below!sssss</div>'
			callback(html)
		})

		Object.defineProperty(Vue.prototype, vconsole)
	}
}

vconsole.setOption('onReady', ()=> {
	setTimeout(() => {
		initSpecialVConsole()
	}, 100)
})

const reg = /^[\s\S]*((%c)[\s\S]*)+$/
// 在vconsole准备完成后，初始化一次vconsole中的特殊样式输出
let initSpecialVConsole = function() {
	let vcItemContentDoms = vconsole.$dom.querySelectorAll('.vc-item-content')
	for (let itemContentDomIndex in vcItemContentDoms) {
		try {
			let currentVcSpans = vcItemContentDoms[itemContentDomIndex].querySelectorAll('span')
			let conLogs = []
			let isC = false
			for (let spanIndex in currentVcSpans) {
				let thisSpanText = currentVcSpans[spanIndex].innerText
				if (thisSpanText) {
					if (spanIndex == 0 && reg.test(thisSpanText)) {
						conLogs.push(thisSpanText)
						isC = true
					} else if (spanIndex > 0 && isC) {
						conLogs.push(thisSpanText)
					}
				}
			}
			if (conLogs.length > 0) {
				let spanCHtml = ''
				for (let conLogIndex in conLogs) {
					if (conLogIndex == 0) {
						let spans = conLogs[conLogIndex].split('%c')
						for (let spanIndex in spans) {
							if (spanIndex == 0) {
								spanCHtml += `${spans[spanIndex]}`
							} else {
								if (spans[spanIndex]) {
									spanCHtml += `<span style="STYLE_${spanIndex - 1}">${spans[spanIndex]}</span>`
								}
							}
						}
					} else {
						spanCHtml = spanCHtml.replace(`STYLE_${conLogIndex - 1}`, conLogs[conLogIndex] + '; padding: 2px 6px; font-size: 12px;')
					}
				}
				vcItemContentDoms[itemContentDomIndex].innerHTML = spanCHtml
			}
		} catch(e) {
			// eslint-disable-next-line
		}
	}
}

// eslint-disable-next-line
const conLog = console.log
// eslint-disable-next-line
console.log = function() {
	conLog.apply(this, arguments)
	if (!vconsole.$dom) return
	let isC = false
	let spanCHtml = ''
	let spanHtmlCount = 0
	let cStyles = []
	let currentTexts = []
	for (let index in arguments) {
		try {
			currentTexts.push(arguments[index])
			if (index == 0 && arguments[index] && reg.test(arguments[index].trim())) {
				isC = true
				let spans = arguments[index].split('%c')
				for (let spanIndex in spans) {
					if (spanIndex == 0) {
						spanCHtml += `${spans[spanIndex]}`
					} else {
						if (spans[spanIndex]) {
							spanCHtml += `<span style="STYLE_${spanIndex - 1}">${spans[spanIndex]}</span>`
							spanHtmlCount++
						}
					}
				}
			} else if (index > 0 && isC) {
				cStyles.push(arguments[index])
			}
		} catch(e) {
			// eslint-disable-next-line
		}
	}
	if (isC) {
		for (let styleIndex = 0; styleIndex < spanHtmlCount; styleIndex++) {
			spanCHtml = spanCHtml.replace(`STYLE_${styleIndex}`, cStyles[styleIndex] + '; padding: 2px 6px; font-size: 12px;')
		}
		let vcItemContentDoms = vconsole.$dom.querySelectorAll('.vc-item-content')
		let replaceDom = null
		for (let itemContentDomIndex in vcItemContentDoms) {
			for (let currentTextIndex in currentTexts) {
				if (vcItemContentDoms[itemContentDomIndex].innerText && vcItemContentDoms[itemContentDomIndex].innerText.indexOf(currentTexts[currentTextIndex]) > 0) {
					replaceDom = vcItemContentDoms[itemContentDomIndex]
				}
			}
		}
		if (replaceDom != null) replaceDom.innerHTML = spanCHtml
	}
}
