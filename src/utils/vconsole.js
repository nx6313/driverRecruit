const VConsole = require('vconsole')
const regC = /^[\s\S]*((%c)[\s\S]*)+$/

export default {
	// eslint-disable-next-line
	install: function (Vue, options) {
		let vconsole = new VConsole()
		initConsoleMethod(vconsole)

		let vuexPlugin = new VConsole.VConsolePlugin('plugin_vuex', 'Vuex')
		vuexPlugin.on('renderTab', function(callback) {
			let vuexDataTreeHtml = getVuexDataTreeHtml(vconsole, options.vuexStore.state)
			let html = `<div id="vuexVConsoleDataWrap" style="padding: 10px 10px 0;">${vuexDataTreeHtml}</div`
			callback(html)
		})
		vuexPlugin.on('addTool', function(callback) {
			callback([
				{
					name: 'Refresh',
					global: false,
					onClick: function() {
						let vuexVConsoleDataWrap = vconsole.$dom.querySelector('div#vuexVConsoleDataWrap')
						let vuexDataTreeHtml = getVuexDataTreeHtml(vconsole, options.vuexStore.state)
						vuexVConsoleDataWrap.innerHTML = vuexDataTreeHtml
					}
				}
			])
		})
		vuexPlugin.on('show', function() {
			let vuexVConsoleDataWrap = vconsole.$dom.querySelector('div#vuexVConsoleDataWrap')
			let vuexDataTreeHtml = getVuexDataTreeHtml(vconsole, options.vuexStore.state)
			vuexVConsoleDataWrap.innerHTML = vuexDataTreeHtml
		})
		vconsole.addPlugin(vuexPlugin)

		vconsole.setOption('onReady', ()=> {
			let consoleLogCmd = vconsole.$dom.querySelector('form.vc-cmd')
			if (consoleLogCmd) consoleLogCmd.parentNode.removeChild(consoleLogCmd)
			if (process.env.NODE_ENV == 'production') {
				// 生产环境，隐藏日志面板控制开关
				vconsole.hideSwitch()
				// 添加一个很小的隐藏区域用于打开日志面板
				let minSwitchArea = document.createElement('div')
				minSwitchArea.id = '__minVcSwitch'
				minSwitchArea.style = `position: fixed; left: 0; bottom: 0; width: 10px; height: 10px; border-radius: 0 50px 50px 0;`
				document.body.parentNode.appendChild(minSwitchArea)
				let clickMinSwitchTime = null
				let clickMinSwitchCount = 0
				vconsole.$.bind(minSwitchArea, 'click', function(event) {
					event.preventDefault()
					clearTimeout(clickMinSwitchTime)
					clickMinSwitchTime = setTimeout(() => {
						clickMinSwitchCount = 0
					}, 400)
					clickMinSwitchCount++
					if (clickMinSwitchCount > 9) {
						vconsole.show()
						clickMinSwitchCount = 0
						clearTimeout(clickMinSwitchTime)
					}
				})
			}
			initSpecialVConsole(vconsole)
		})

		Vue.prototype.$vconsole = vconsole
		Vue.prototype.$vctool = vconsole.tool
		Vue.prototype.$vcdom = vconsole.$
	}
}

// 在vconsole准备完成后，初始化一次vconsole中的特殊样式输出
let initSpecialVConsole = function(vconsole) {
	let vcItemContentDoms = vconsole.$dom.querySelectorAll('.vc-item-content')
	for (let itemContentDomIndex in vcItemContentDoms) {
		try {
			let currentVcSpans = vcItemContentDoms[itemContentDomIndex].querySelectorAll('span')
			let conLogs = []
			let isC = false
			for (let spanIndex in currentVcSpans) {
				let thisSpanText = currentVcSpans[spanIndex].innerText
				if (thisSpanText) {
					if (spanIndex == 0 && regC.test(thisSpanText)) {
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

// 获取vuex数据树
let getVuexDataTreeHtml = function(vconsole, vuexData) {
	let dataTreeHtml = ''
	for (let key in vuexData) {
		let dataType = ''
		let hasNext = false
		if (vconsole.tool.isString(vuexData[key]) || vconsole.tool.isBoolean(vuexData[key]) || vconsole.tool.isNumber(vuexData[key])) {
			dataType = `<span style="color: #0D7F25;">${vuexData[key]}</span>`
		} else if (vconsole.tool.isNull(vuexData[key])) {
			dataType = '<span style="color: #7D7D7D;">null</span>'
		} else if (vconsole.tool.isUndefined(vuexData[key])) {
			dataType = '<span style="color: #7D7D7D;">undefined</span>'
		} else if (vconsole.tool.isArray(vuexData[key])) {
			dataType = '<span style="color: #BA1054;">Array</span>'
			hasNext = true
		} else if (vconsole.tool.isElement(vuexData[key])) {
			dataType = '<span style="color: #BA1054;">Element</span>'
		} else if (vconsole.tool.isFunction(vuexData[key])) {
			dataType = '<span style="color: #BA1054;">Function</span>'
		} else if (vconsole.tool.isObject(vuexData[key])) {
			dataType = '<span style="color: #BA1054;">Object</span>'
			hasNext = true
		} else if (vconsole.tool.isSymbol(vuexData[key])) {
			dataType = '<span style="color: #BA1054;">Symbol</span>'
		} else {
			dataType = Object.prototype.toString.call(vuexData[key])
		}
		dataTreeHtml += `<tr style="background: #ABEDF3; color: #2c2c2c;"><td style="padding: 3px 10px; font-weight: bold; border-radius: 3px;">${hasNext ? '✣' : '●'} ${key}：${dataType}</td></tr>`
		if (hasNext) {
			dataTreeHtml += getObjectNextDataHtml(vconsole, vuexData[key], 1)
		}
	}
	return `<table border="0" cellspacing="2" style="width: 100%;">${dataTreeHtml}</table>`
}
let getObjectNextDataHtml = function(vconsole, data, level) {
	let dataTreeHtml = ''
	let nextKeyIndex = 0
	for (let nextKey in data) {
		let dataType = ''
		let iconBefore = nextKeyIndex < Object.keys(data).length - 1 ? '┣' : '┗'
		let hasNext = false
		if (vconsole.tool.isString(data[nextKey]) || vconsole.tool.isBoolean(data[nextKey]) || vconsole.tool.isNumber(data[nextKey])) {
			dataType = `<span style="color: #0D7F25;">${data[nextKey]}</span>`
		} else if (vconsole.tool.isNull(data[nextKey])) {
			dataType = '<span style="color: #9A9A9A;">null</span>'
		} else if (vconsole.tool.isUndefined(data[nextKey])) {
			dataType = '<span style="color: #9A9A9A;">undefined</span>'
		} else if (vconsole.tool.isArray(data[nextKey])) {
			dataType = '<span style="color: #771080;">Array</span>'
			hasNext = true
			iconBefore = '┡'
		} else if (vconsole.tool.isElement(data[nextKey])) {
			dataType = '<span style="color: #771080;">Element</span>'
		} else if (vconsole.tool.isFunction(data[nextKey])) {
			dataType = '<span style="color: #771080;">Function</span>'
		} else if (vconsole.tool.isObject(data[nextKey])) {
			dataType = '<span style="color: #771080;">Object</span>'
			hasNext = true
			iconBefore = '┡'
		} else if (vconsole.tool.isSymbol(data[nextKey])) {
			dataType = '<span style="color: #771080;">Symbol</span>'
		} else {
			dataType = Object.prototype.toString.call(data[nextKey])
		}
		dataTreeHtml += `<tr style="background: #fff; color: #2c2c2c;"><td style="padding: 0 10px 0 ${10 + (level * 20)}px;">${iconBefore} ${nextKey}：${dataType}</td></tr>`
		if (hasNext) {
			dataTreeHtml += getObjectNextDataHtml(vconsole, data[nextKey], level + 1)
		}
		nextKeyIndex++
	}
	return dataTreeHtml
}

// 初始化改写console方法
let initConsoleMethod = function(vconsole) {
	// eslint-disable-next-line
	const conLog = console.log
	// eslint-disable-next-line
	console.log = function() {
		conLog.apply(this, arguments)
		if (vconsole != null && !vconsole.$dom) return
		let isC = false
		let spanCHtml = ''
		let spanHtmlCount = 0
		let cStyles = []
		let currentTexts = []
		for (let index in arguments) {
			try {
				currentTexts.push(arguments[index])
				if (index == 0 && arguments[index] && regC.test(arguments[index].trim())) {
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
}
