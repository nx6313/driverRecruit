const VConsole = require('vconsole')
const regC = /^[\s\S]*((%c)[\s\S]*)+$/
const isTest = true

export default {
	// eslint-disable-next-line
	install: function (Vue, options) {
		console.log('开始装载日志插件')
		let vconsole = new VConsole({defaultPlugins: ['system', 'network']}) // ['system', 'network', 'element', 'storage']
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

		let testPlugin = new VConsole.VConsolePlugin('plugin_test', '测试')
		testPlugin.on('renderTab', function(callback) {
			let testDomHtml = getTestDomHtml(options.vuexStore.state)
			let html = `<div id="testVConsoleDataWrap" style="padding: 10px 10px 0;">${testDomHtml}</div`
			callback(html)
		})
		testPlugin.on('addTool', function(callback) {
			callback([
				{
					name: '重置测试数据',
					global: false,
					onClick: function() {
						let curServerType = options.vuexStore.state.serviceType.type
						options.vuexStore.dispatch('clearAll')
						options.vuexStore.commit('updateServiceType', {
							type: curServerType
						})
						options.router.replace('/')
						setTimeout(() => {
							let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
							testUserPhone.value = options.vuexStore.state.userBaseInfo.phone || ''
						}, 100)
						options.showToast({
							msg: '测试数据重置完成，并已跳转至首页'
						})
					}
				}
			])
		})
		testPlugin.on('show', function() {
			let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
			testUserPhone.value = options.vuexStore.state.userBaseInfo.phone || ''
			let btnSaveUserPhone = vconsole.$dom.querySelector('input#btnSaveUserPhone')
			btnSaveUserPhone.addEventListener('click', () => {
				let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
				if (testUserPhone.value != '') {
					options.vuexStore.commit('updateUserBaseInfoPhone', {
						phone: testUserPhone.value
					})
				} else {
					options.vuexStore.commit('updateUserBaseInfoPhone', {
						phone: null
					})
				}
				options.showToast({
					msg: '数据更新成功'
				})
				vconsole.hide()
			}, false)
			let btntoIndex = vconsole.$dom.querySelector('input#btntoIndex')
			btntoIndex.addEventListener('click', () => {
				options.router.replace('/')
				setTimeout(() => {
					let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
					testUserPhone.value = options.vuexStore.state.userBaseInfo.phone || ''
				}, 100)
				options.showToast({
					msg: '已跳转至首页'
				})
				vconsole.hide()
			}, false)
			let btnChangeToRentCar = vconsole.$dom.querySelector('input#btnChangeToRentCar')
			btnChangeToRentCar.addEventListener('click', () => {
				if (!options.vuexStore.state.userBaseInfo.phone) {
					options.showToast({
						msg: '请先填写测试用户手机号'
					})
					return false
				}
        options.vuexStore.commit('updateUserBaseInfoDType', {
          dType: '4'
        })
				options.router.replace('/rentCarHome')
				options.showToast({
					msg: '已跳转至租车加盟首页'
				})
				vconsole.hide()
			}, false)
			let btnChangeToBuyCar = vconsole.$dom.querySelector('input#btnChangeToBuyCar')
			btnChangeToBuyCar.addEventListener('click', () => {
				if (!options.vuexStore.state.userBaseInfo.phone) {
					options.showToast({
						msg: '请先填写测试用户手机号'
					})
					return false
				}
        options.vuexStore.commit('updateUserBaseInfoDType', {
          dType: '2'
        })
				options.router.replace('/buyCarHome')
				options.showToast({
					msg: '已跳转至购车加盟首页'
				})
				vconsole.hide()
			}, false)
			let btnChangeToFullTime = vconsole.$dom.querySelector('input#btnChangeToFullTime')
			btnChangeToFullTime.addEventListener('click', () => {
				if (!options.vuexStore.state.userBaseInfo.phone) {
					options.showToast({
						msg: '请先填写测试用户手机号'
					})
					return false
				}
        options.vuexStore.commit('updateUserBaseInfoDType', {
          dType: '1'
        })
				options.router.replace('/fullTimeHome')
				options.showToast({
					msg: '已跳转至自营专职司机招募首页'
				})
				vconsole.hide()
			}, false)
			let btnChangeToHaveCar = vconsole.$dom.querySelector('input#btnChangeToHaveCar')
			btnChangeToHaveCar.addEventListener('click', () => {
				if (!options.vuexStore.state.userBaseInfo.phone) {
					options.showToast({
						msg: '请先填写测试用户手机号'
					})
					return false
				}
        options.vuexStore.commit('updateUserBaseInfoDType', {
          dType: '3'
        })
				options.router.replace('/haveCarHome')
				options.showToast({
					msg: '已跳转至带车加盟首页'
				})
				vconsole.hide()
			}, false)
		})
		vconsole.addPlugin(testPlugin)

		vconsole.setOption({
			onReady: ()=> {
				let consoleLogCmd = vconsole.$dom.querySelector('form.vc-cmd')
				if (consoleLogCmd) consoleLogCmd.parentNode.removeChild(consoleLogCmd)
				if (!isTest && process.env.NODE_ENV == 'production') {
					// 生产环境，隐藏日志面板控制开关
					vconsole.hideSwitch()
					// 添加一个很小的隐藏区域用于打开日志面板
					let minSwitchArea = document.createElement('div')
					minSwitchArea.id = '__minVcSwitch'
					minSwitchArea.style = `position: fixed; left: 0; bottom: calc(50vh - 50px); width: 20px; height: 100px; border-radius: 0 50px 50px 0; z-index: 999999; touch-action: none;`
					document.body.parentNode.appendChild(minSwitchArea)
					let minSwitchClickArea = document.createElement('div')
					minSwitchClickArea.id = '__minVcClickSwitch'
					minSwitchClickArea.style = `position: fixed; left: calc(50vw - 15px); bottom: 60px; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 10px; font-weight: bold; border-radius: 50px; z-index: 999999; touch-action: none; background-color: rgba(0, 0, 0, .4); display: none; color: #ffffff;`
					document.body.parentNode.appendChild(minSwitchClickArea)
					let touchDistanceX = 0
					let touchDistanceY = 0
					let startTouchX = null
					let startTouchY = null
					let hasShowVcClickSpan = false
					let clickMinClickSwitchTimer = null
					let hideClickSpanTime = 1400
					vconsole.$.bind(minSwitchArea, 'touchstart', function(event) {
						touchDistanceX = 0
						touchDistanceY = 0
						startTouchX = null
						startTouchY = null
						hasShowVcClickSpan = false
						minSwitchClickArea.innerText = ''
						clearTimeout(clickMinClickSwitchTimer)
						if (event.touches.length == 1) {
							startTouchX = event.touches[0].pageX
							startTouchY = event.touches[0].pageY
						}
					})
					vconsole.$.bind(minSwitchArea, 'touchmove', function(event) {
						event.preventDefault()
						event.stopPropagation()
						if (event.touches.length == 1) {
							touchDistanceX = event.touches[0].pageX - startTouchX
							touchDistanceY = event.touches[0].pageY - startTouchY
							if (hasShowVcClickSpan === false && touchDistanceX > document.body.clientWidth - 10 && Math.abs(touchDistanceY) < 10) {
								hasShowVcClickSpan = true
								minSwitchClickArea.style.display = 'block'
								minSwitchClickArea.innerText = ''
								clearTimeout(clickMinClickSwitchTimer)
								clickMinClickSwitchTimer = setTimeout(() => {
									minSwitchClickArea.style.display = 'none'
								}, hideClickSpanTime)
							}
						}
					})
					vconsole.$.bind(minSwitchArea, 'touchend', function(event) {
						event.preventDefault()
						touchDistanceX = 0
						touchDistanceY = 0
						startTouchX = null
						hasShowVcClickSpan = false
						minSwitchClickArea.innerText = ''
					})
					let clickMinSwitchTime = null
					let clickMinSwitchCount = 0
					vconsole.$.bind(minSwitchClickArea, 'touchmove', function(event) {
						event.preventDefault()
						clearTimeout(clickMinSwitchTime)
						clickMinSwitchTime = setTimeout(() => {
							clickMinSwitchCount = 0
						}, 400)
						clearTimeout(clickMinClickSwitchTimer)
						clickMinClickSwitchTimer = setTimeout(() => {
							minSwitchClickArea.style.display = 'none'
							minSwitchClickArea.innerText = ''
						}, hideClickSpanTime)
						clickMinSwitchCount++
						minSwitchClickArea.innerText = clickMinSwitchCount
						if (clickMinSwitchCount > 20) {
							vconsole.show()
							clickMinSwitchCount = 0
							minSwitchClickArea.style.display = 'none'
							minSwitchClickArea.innerText = ''
							clearTimeout(clickMinSwitchTime)
							clearTimeout(clickMinClickSwitchTimer)
						}
					})
					vconsole.$.bind(minSwitchClickArea, 'touchend', function(event) {
						event.preventDefault()
						clearTimeout(clickMinSwitchTime)
						clickMinSwitchCount = 0
						clearTimeout(clickMinClickSwitchTimer)
						minSwitchClickArea.style.display = 'none'
						minSwitchClickArea.innerText = ''
					})
					vconsole.$.bind(minSwitchClickArea, 'touchcancel', function(event) {
						event.preventDefault()
						clearTimeout(clickMinSwitchTime)
						clickMinSwitchCount = 0
						clearTimeout(clickMinClickSwitchTimer)
						minSwitchClickArea.style.display = 'none'
						minSwitchClickArea.innerText = ''
					})
				}
				initSpecialVConsole(vconsole)
			}
		})

		// Vue.prototype.$vconsole = vconsole
		Vue.prototype.$vctool = vconsole.tool
		// Vue.prototype.$vcdom = vconsole.$
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

// 获取测试DOM树
let getTestDomHtml = function(vuexData) {
	let labelStyle = `style="margin-right: 6px; color: #052937;"`
	let inputStyle = `style="border: none; padding: 4px 10px; color: #052937;"`
	let lineStyle = `style="width: 100%; height: 1px; background: #B4B4B4; margin: 0.6rem 0;"`
	let btnStyle = `style="border: 1px solid #303030; padding: 0.2rem 0.4rem; border-radius: 4px; background: #E4E9ED; color: #353535; font-weight: bold;"`
	let inputListHtml = `<div><label for="testUserPhone" ${labelStyle}>测试用户手机号</label><input id="testUserPhone" type="text" placeholder="输入测试用户手机号" value="${vuexData.userBaseInfo.phone != null ? vuexData.userBaseInfo.phone : ''}" ${inputStyle}/></div>`
	inputListHtml += `<div><input id="btnSaveUserPhone" type="button" value="保存数据" ${btnStyle}/></div>`
	inputListHtml += `<div ${lineStyle}></div>`
	inputListHtml += `<div><input id="btntoIndex" type="button" value="跳转至司机招募首页" ${btnStyle}/></div>`
	inputListHtml += `<div ${lineStyle}></div>`
	inputListHtml += `<div>用户手机号不为空时，可成功进行切换操作。此操作不会判断该用户是否已经是司机。</div>`
	inputListHtml += `<div><input id="btnChangeToRentCar" type="button" value="切换为 租车加盟" ${btnStyle}/>&nbsp;&nbsp;<input id="btnChangeToBuyCar" type="button" value="切换为 购车加盟" ${btnStyle}/>&nbsp;&nbsp;
		<input id="btnChangeToFullTime" type="button" value="切换为 专职自营司机招募" ${btnStyle}/>&nbsp;&nbsp;<input id="btnChangeToHaveCar" type="button" value="切换为 带车加盟" ${btnStyle}/></div>`
	return `<div style="line-height: 30px;">${inputListHtml}</div>`
}


// 初始化改写console方法
let initConsoleMethod = function(vconsole) {
	// eslint-disable-next-line
	const conLog = console.log
	// eslint-disable-next-line
	console.log = function() {
		try {
			conLog.apply(this, arguments)
		} catch(er) {
			// eslint-disable-next-line
		}
		if (vconsole != null && !vconsole.$dom) return
		let isC = false
		let spanCHtml = ''
		let spanHtmlCount = 0
		let cStyles = []
		let currentTexts = []
		try {
			for (let index in arguments) {
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
			}
		} catch(e) {
			// eslint-disable-next-line
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
