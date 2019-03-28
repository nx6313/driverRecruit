import axios from 'axios'
import DialogMsg from '@/plugins/dialogBox/msg.js'
import ClipboardJS from 'clipboard'
import { BASE_URL, APP_CONFIG } from '@/utils/constants'
const Shake = require('shake.js')
const VConsole = require('vconsole')
const regC = /^[\s\S]*((%c)[\s\S]*)+$/

const Axios = axios.create({
  transformRequest: [function (data) {
    // 将数据转换为表单数据
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }],
  timeout: 10000
})
Axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.message.includes('timeout')) {
    DialogMsg.installMsg({
      msg: '请求超时',
      duration: 2000
    })
  } else {
    DialogMsg.installMsg({
      msg: '请求出错',
      duration: 2000
    })
  }
  return Promise.reject(error)
})

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
							let secretText = vconsole.$dom.querySelector('span#secretText')
							let tokenText = vconsole.$dom.querySelector('span#tokenText')
							secretText.innerText = '未登录'
							tokenText.innerText = '未登录'
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
			let secretText = vconsole.$dom.querySelector('span#secretText')
			let tokenText = vconsole.$dom.querySelector('span#tokenText')
			if (options.vuexStore.state.auth.secret != null && options.vuexStore.state.auth.token != null) {
				secretText.innerText = '********'
				tokenText.innerText = '********'
			} else {
				secretText.innerText = '未登录'
				tokenText.innerText = '未登录'
			}
			let btnTestSendSmsCode = vconsole.$dom.querySelector('input#btnTestSendSmsCode')
			btnTestSendSmsCode.addEventListener('click', () => {
				let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
				if (testUserPhone.value.trim() != '') {
					btnTestSendSmsCode.disabled = true
					Axios(getAxiosOptions(getBaseUrl(options.vuexStore.state.serviceType.type) + 'account/api/getSms', {
						phone: testUserPhone.value.trim()
					})).then(res => {
						if (res.data.status == 'OK') {
							options.showToast({
								msg: '短信验证码发送成功，请注意查收'
							})
						} else {
							btnTestSendSmsCode.disabled = false
							options.showToast({
								msg: res.data.msg
							})
						}
					})
					// options.vuexStore.commit('updateUserBaseInfoPhone', {
					// 	phone: testUserPhone.value
					// })
					// vconsole.hide()
				} else {
					options.showToast({
						msg: '请输入测试登录手机号'
					})
				}
			}, false)
			let btnTestLogin = vconsole.$dom.querySelector('input#btnTestLogin')
			btnTestLogin.addEventListener('click', () => {
				let testUserPhone = vconsole.$dom.querySelector('input#testUserPhone')
				let testUserSmsCode = vconsole.$dom.querySelector('input#testUserSmsCode')
				if (testUserPhone.value.trim() != '' && testUserSmsCode.value.trim() != '') {
					Axios(getAxiosOptions(getBaseUrl(options.vuexStore.state.serviceType.type) + 'account/api/loginBySms', {
						phone: testUserPhone.value.trim(),
						smsCode: testUserSmsCode.value.trim()
					})).then(res => {
						if (res.data.status == 'OK') {
							let secretText = vconsole.$dom.querySelector('span#secretText')
							let tokenText = vconsole.$dom.querySelector('span#tokenText')
							options.showToast({
								msg: '模拟登录成功'
							})
							secretText.innerText = '********'
							tokenText.innerText = '********'
							options.vuexStore.commit('updateUserBaseInfoPhone', {
								phone: testUserPhone.value
							})
							options.vuexStore.commit('updateAuth', {
								secret: res.data.data.secret,
								token: res.data.data.token
							})
						} else {
							options.showToast({
								msg: res.data.msg
							})
						}
					})
					// vconsole.hide()
				} else {
					if (testUserPhone.value.trim() == '') options.showToast({ msg: '测试登录手机号不能为空' })
					if (testUserSmsCode.value.trim() == '') options.showToast({ msg: '登录验证码不能为空' })
				}
			}, false)
			let btnCopyHeaderParams = vconsole.$dom.querySelector('button#btnCopyHeaderParams')
			let clipboard = new ClipboardJS(btnCopyHeaderParams, {
				text: function() {
					return `?secret=${options.vuexStore.state.auth.secret}&token=${options.vuexStore.state.auth.token}`
				}
			})
			clipboard.on('success', function(e) {
				options.showToast({
					msg: '头信息复制成功'
				})
			})
			clipboard.on('error', function(e) {
				options.showToast({
					msg: '头信息复制失败'
				})
			})
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
				if (!APP_CONFIG.isTest && process.env.NODE_ENV == 'production') {
					// 生产环境，隐藏日志面板控制开关
					vconsole.hideSwitch()
					// let mShakeEvent = new Shake({
					// 	threshold: 10,
					// 	timeout: 20000
					// })
					// mShakeEvent.start()
					// window.addEventListener('shake', () => {
					// 	shakeEventDidOccur(vconsole)
					// }, false)
				}
				initSpecialVConsole(vconsole)
			}
		})

		Vue.prototype.$vconsole = vconsole
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
	let btnStyle = `style="border: 1px solid #303030; padding: 0.2rem 0.4rem; border-radius: 4px; background: #E4E9ED; color: #353535; font-weight: bold; margin-right: 10px;"`
	let inputListHtml = `<div><label for="testUserPhone" ${labelStyle}>测试用户手机号</label><input id="testUserPhone" type="text" placeholder="输入测试用户手机号" value="${vuexData.userBaseInfo.phone != null ? vuexData.userBaseInfo.phone : ''}" ${inputStyle}/></div>`
	inputListHtml += `<div><label for="testUserSmsCode" ${labelStyle}>收到的短信验证码</label><input id="testUserSmsCode" type="text" placeholder="输入收到的短信验证码" ${inputStyle}/></div>`
	inputListHtml += `<div>secret：<span id="secretText"></span>&nbsp;&nbsp;&nbsp;&nbsp;token：<span id="tokenText"></span></div>`
	inputListHtml += `<div><input id="btnTestSendSmsCode" type="button" value="发送短信验证码" ${btnStyle}/><input id="btnTestLogin" type="button" value="登录" ${btnStyle}/><button id="btnCopyHeaderParams" ${btnStyle}>复制相关头信息</button></div>`
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
	console.log = (function(conLog) {
		return function() {
			conLog.apply(console, arguments)
			if (vconsole != null && !vconsole.$dom) return
			let isC = false
			let spanCHtml = ''
			let spanHtmlCount = 0
			let cStyles = []
			let currentTexts = []
			for (let index in arguments) {
				currentTexts.push(arguments[index])
				if (index == 0 && arguments[index] && vconsole.tool.isString(arguments[index]) && regC.test(arguments[index].trim())) {
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
	})(console.log)
}

// 摇一摇触发事件
let shakeEventDidOccur = function(vconsole) {
	vconsole.show()
}

let getBaseUrl = function(serviceType) {
	let baseUrl = BASE_URL.server_address_production
	if (serviceType == 'p') {
		baseUrl = BASE_URL.server_address_production
	} else if (serviceType == 'd') {
		baseUrl = BASE_URL.server_address_development
	} else if (serviceType == 't') {
		baseUrl = BASE_URL.server_address_test
	}
	return baseUrl
}

let getAxiosOptions = function(url, params) {
	var headers = {
		'appType': 2, // 请求的类型 1：司机、2：普通会员
		'devicetype': 5
	}
	headers['Content-Type'] = 'application/x-www-form-urlencoded'
	var axiosOptions = {
		method: 'POST',
		headers: headers
	}
	axiosOptions.url = url
	if (params) {
		axiosOptions.params = params
	}
	return axiosOptions
}
