import Vue from 'vue'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'wheel-picker/dist/wheelpicker.min.css'
import '@/plugins/comm.css'
import '@/plugins/animate.css'
import Dialogbox from '@/plugins/dialogBox/index.js'
import DialogMsg from '@/plugins/dialogBox/msg.js'
// import html2Canvas from 'html2canvas'
// import JsPDF from 'jspdf'
import { BASE_URL } from '@/utils/constants'

const Axios = axios.create({
  transformRequest: [function (data) {
    // 将数据转换为表单数据
    let ret = ''
    for (let it in data) {
      if (data[it]) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
    }
    return ret != '' ? ret.substr(0, ret.length - 1) : ret
  }],
  timeout: 10000
})
Axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  loadingManager.forEach((loader) => {
    loader.hide()
  })
  loadingManager.clear()
  if (error.message.includes('timeout')) {
    DialogMsg.installMsg({
      msg: '请求超时',
      duration: 2000
    })
  } else {
    // eslint-disable-next-line
    console.log(error)
    DialogMsg.installMsg({
      msg: '请求出错',
      duration: 2000
    })
  }
  if (loginDialog != null) {
    loginDialog.destory()
    loginDialog = null
  }
  return Promise.reject(error)
})
const FileAxios = axios.create({
  timeout: 10000
})
FileAxios.interceptors.response.use((response) => {
  return response
}, (error) => {
  loadingManager.forEach((loader) => {
    loader.hide()
  })
  loadingManager.clear()
  if (error.message.includes('timeout')) {
    DialogMsg.installMsg({
      msg: '文件上传超时',
      duration: 2000
    })
  } else {
    DialogMsg.installMsg({
      msg: '文件上传出错',
      duration: 2000
    })
  }
  return Promise.reject(error)
})

Vue.use(CryptoJS)
Vue.use(Loading)
Vue.use(Dialogbox)
const dialogAlert = require('react-confirm-alert')
const WheelPicker = require('wheel-picker')

var key = CryptoJS.enc.Utf8.parse("123456789zxcvbnm")
var iv = CryptoJS.enc.Utf8.parse("123456789zxcvbnm")

var loadingManager = new Map() // 管理loading对象
var loginDialog = null // 用户登录弹窗
var dialogPrompt = null // 带有输入框的dialog弹出框
var picker = null // picker选择器

export default {
  install: function (Vue) {
    var ComFun = {
      http_get: function (context, url, params) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'GET',
          headers: headers
        }
        if (this.getServiceType(context) === 't') {
          axiosOptions.url = BASE_URL.server_address_test + url
        } else if (this.getServiceType(context) === 'd') {
          axiosOptions.url = BASE_URL.server_address_development + url
        } else {
          axiosOptions.url = BASE_URL.server_address_production + url
        }
        if (params) {
          axiosOptions.params = params
        }
        return Axios(axiosOptions)
      },
      http_post: function (context, url, params) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        var axiosOptions = {
          method: 'POST',
          headers: headers
        }
        if (this.getServiceType(context) === 't') {
          axiosOptions.url = BASE_URL.server_address_test + url
        } else if (this.getServiceType(context) === 'd') {
          axiosOptions.url = BASE_URL.server_address_development + url
        } else {
          axiosOptions.url = BASE_URL.server_address_production + url
        }
        if (params) {
          axiosOptions.data = params
        }
        return Axios(axiosOptions)
      },
      http_file: function (context, url, file) {
        let token = null
        let secret = null
        if (this.hasAuthInfoInUrl()) {
          token = this.getRequestAuto('token')
          secret = this.getRequestAuto('secret')
          context.$store.commit('updateAuth', {
            secret: secret,
            token: token
          })
        }
        var headers = {
          'appType': 2, // 请求的类型 1：司机、2：普通会员
          'devicetype': 5
        }
        if (this.hasAuthInfoInUrl() || (context.$store.state.auth.token != null && context.$store.state.auth.secret != null)) {
          headers['token'] = token || context.$store.state.auth.token
          headers['secret'] = secret || context.$store.state.auth.secret
        }
        headers['Content-Type'] = 'multipart/form-data'
        var axiosOptions = {
          method: 'POST',
          headers: headers,
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            // eslint-disable-next-line
            console.log(`文件【${file.name}】上传进度：${percentCompleted} %`)
          }
        }
        if (this.getServiceType(context) === 't') {
          axiosOptions.url = BASE_URL.server_address_test + url
        } else if (this.getServiceType(context) === 'd') {
          axiosOptions.url = BASE_URL.server_address_development + url
        } else {
          axiosOptions.url = BASE_URL.server_address_production + url
        }
        let formData = new FormData()
        formData.append('file', file)
        axiosOptions.data = formData
        return FileAxios(axiosOptions)
      },
      // 判断当前是否为测试服访问
      getServiceType: function (context) {
        let serviceType = this.getRequestAuto('serviceType') || context.$store.state.serviceType.type
        if (serviceType === 't') {
          context.$store.commit('updateServiceType', {
            type: 't'
          })
          return 't'
        } else if (serviceType === 'd') {
          context.$store.commit('updateServiceType', {
            type: 'd'
          })
          return 'd'
        } else {
          context.$store.commit('updateServiceType', {
            type: 'p'
          })
          return 'p'
        }
      },
      // 判断url中是否包含用户登陆认证信息
      hasAuthInfoInUrl: function () {
        let token = this.getRequestAuto('token')
        let secret = this.getRequestAuto('secret')
        if (token && secret) {
          return true
        }
        return false
      },
      // 判断当前是否有用户登陆认证信息
      hasAuthInfo: function (context) {
        return this.hasAuthInfoInUrl() || (context.$store.state.auth.token && context.$store.state.auth.secret)
      },
      // 显示loading
      showLoading: function (context, tag, canCancelFlag, container, onCancelCallBack) {
        if (canCancelFlag === undefined) canCancelFlag = true
        if (onCancelCallBack === undefined) onCancelCallBack = () => {}
        let loader = context.$loading.show({
          container: container,
          canCancel: canCancelFlag,
          onCancel: onCancelCallBack,
          color: '#C51A20',
          loader: 'bars', // spinner 、 dots 、 bars
          backgroundColor: '#2C2C2C',
          opacity: 0.4
        })
        loadingManager.set(tag, loader)
      },
      // 隐藏loading
      hideLoading: function (tag) {
        let loader = loadingManager.get(tag)
        loader.hide()
        loadingManager.delete(tag)
      },
      // 显示dialog弹出框
      showDialog: function (title, message, okCallBack) {
        if (title === undefined) title = '未定义标题'
        if (message === undefined) message = '未定义内容'
        if (okCallBack === undefined) okCallBack = () => {}
        let btns = [
          {
            label: '取消',
            onClick: () => {}
          },
          {
            label: '确认',
            onClick: () => {
              okCallBack()
            }
          }
        ]
        dialogAlert.confirmAlert({
          title: title,
          message: message,
          buttons: btns
        })
      },
      // 显示带有输入框的dialog弹出框
      showDialogWithPrompt: function (context, title, message, showCancel, hint, rule, ruleOkTip, ruleErrorTip, okCallBack, ruleCallBack, isMultiline) {
        if (title === undefined) title = '未定义标题'
        if (showCancel === undefined) showCancel = true
        if (hint === undefined) hint = ''
        if (okCallBack === undefined) okCallBack = () => {}
        if (isMultiline === undefined) isMultiline = false
        let btns = [
          {
            label: '取消',
            onClick: () => {}
          },
          {
            label: '确认',
            onClick: (promptInput) => {
              return okCallBack(promptInput)
            }
          }
        ]
        dialogPrompt = context.$dialog_prompt({
          title: title,
          msg: message,
          showCancel: showCancel,
          hint: hint,
          rule: rule,
          ruleOkTip: ruleOkTip,
          ruleErrorTip: ruleErrorTip,
          buttons: btns,
          ruleCallBack: ruleCallBack,
          isMultiline: isMultiline
        })
        return dialogPrompt
      },
      // 显示提示用户登陆的dialog弹出框
      showDialogForLogin: function (context, title, message, rule, ruleOkTip, ruleErrorTip, sendSmsCodeCallBack, okCallBack) {
        if (title === undefined) title = '未定义标题'
        if (sendSmsCodeCallBack === undefined) sendSmsCodeCallBack = () => {}
        if (okCallBack === undefined) okCallBack = () => {}
        let btns = [
          {
            label: '取消登录',
            onClick: () => {}
          },
          {
            label: '确认登录',
            onClick: (phone, code) => {
              loginDialog = null
              return okCallBack(phone, code)
            }
          }
        ]
        loginDialog = context.$dialog_prompt({
          title: title,
          msg: message,
          showCancel: true,
          rule: rule,
          ruleOkTip: ruleOkTip,
          ruleErrorTip: ruleErrorTip,
          buttons: btns,
          sendSmsCodeCallBack: sendSmsCodeCallBack,
          isLogin: true
        })
        return loginDialog
      },
      // 显示Toast
      showToast: function(context, msg, duration) {
        if (msg === undefined) msg = 'toast 内容未定义'
        if (duration === undefined) duration = 2200
        context.$dialog_msg({
          msg: msg,
          duration: duration
        })
      },
      // 显示签名面板
      showSignPanel: function(context, callBack) {
        if (callBack === undefined) callBack = () => {}
        context.$dialog_sign({
          callBack: callBack
        })
      },
      // 弹出picker选择
      // data 为双层数组结构
      showPicker: function(title, data, onSelect, onChange) {
        picker = new WheelPicker({
          title: title,
          data: data,
          hideOnBackdrop: true,
          onSelect: (result) => {
            onSelect(result)
            setTimeout(() => {
              picker.destory()
              picker = null
            }, 300)
          },
          onCancel: () => {
            setTimeout(() => {
              picker.destory()
              picker = null
            }, 300)
          },
          onChange: onChange
        })
        picker.show()
        return picker
      },
      // 日期格式转字符串，指定格式
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
      formatDate: function (date, fmt) {
        if (date) {
          var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
          }
          return fmt
        }
        return null
      },
      // 获取指定日期几天前或几天后的日期，未指定日期按照当前日期计算
      getTargetDate (diff, date) {
        var today = new Date()
        if (date !== undefined) {
          today = date
        }
        var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * Number(diff)
        var targetday = new Date()
        targetday.setTime(targetdayMilliseconds)
        return targetday
      },
      // 获取指定周的起止日期
      getWeekStartEnd (addWeekCount) {
        if (!addWeekCount) {
          addWeekCount = 0
        }
        var startEnd = []
        var milliSecond = 1000 * 60 * 60 * 24
        var currentDate = new Date()
        currentDate = new Date(currentDate.getTime() + (milliSecond * 7 * addWeekCount))
        var week = currentDate.getDay()
        var minusDay = week !== 0 ? week - 1 : 6
        var currentWeekFirstDay = new Date(currentDate.getTime() - (milliSecond * minusDay))
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (milliSecond * 6))
        startEnd.push(currentWeekFirstDay)
        startEnd.push(currentWeekLastDay)
        return startEnd
      },
      // 获取指定月的起止日期
      getMonthStartEnd (addMonthCount) {
        if (!addMonthCount) {
          addMonthCount = 0
        }
        var startEnd = []
        var currentDate = new Date()
        currentDate.setDate(1)
        currentDate.setMonth(currentDate.getMonth() + addMonthCount)
        var year = currentDate.getFullYear()
        var month = currentDate.getMonth()
        var currentMonthLastDay = null
        if (year === new Date().getFullYear() && month === new Date().getMonth()) {
          currentMonthLastDay = new Date()
        } else {
          currentMonthLastDay = this.getLastDay(year, month + 1)
        }
        startEnd.push(currentDate)
        startEnd.push(currentMonthLastDay)
        return startEnd
      },
      // 获取指定年的起止日期
      getYearStartEnd (addYearCount) {
        if (!addYearCount) {
          addYearCount = 0
        }
        var startEnd = []
        var currentDate = new Date()
        currentDate.setDate(1)
        currentDate.setFullYear(currentDate.getFullYear() + addYearCount)
        var year = currentDate.getFullYear()
        var currentYearLastDay = null
        if (year === new Date().getFullYear()) {
          currentYearLastDay = new Date()
        } else {
          currentYearLastDay = this.getLastDay(year, 12)
        }
        startEnd.push(currentDate)
        startEnd.push(currentYearLastDay)
        return startEnd
      },
      // 获取某月最后一天日期
      getLastDay (year, month) {
        var newYear = year
        var newMonth = month++
        if (newMonth > 12) {
          newMonth -= 12
          newYear++
        }
        var newDate = new Date(newYear, newMonth, 1)
        return new Date(newDate.getTime() - 1000 * 60 * 60 * 24)
      },
      // 将相差的毫秒数转为时间
      formatDiffMilliseconds (diffMilliseconds) {
        let dayMill = 24 * 60 * 60 * 1000
        let hourMill = 60 * 60 * 1000
        let minuteMill = 60 * 1000
        let secondMill = 1000
        let day = Math.floor(diffMilliseconds / dayMill)
        let dayResidue = diffMilliseconds % dayMill
        let hour = Math.floor(dayResidue / hourMill)
        let hourResidue = dayResidue % hourMill
        let minute = Math.floor(hourResidue / minuteMill)
        let minuteResidue = hourResidue % minuteMill
        let second = Math.floor(minuteResidue / secondMill)
        let returnVal = ''
        if (day > 0) {
          returnVal += day + ' 天 '
        }
        if (hour > 0) {
          returnVal += hour + ' 小时 '
        }
        if (minute > 0) {
          returnVal += minute + ' 分钟 '
        }
        if (day === 0 && hour === 0 && minute === 0) {
          returnVal = second + ' 秒 '
        }
        return returnVal
      },
      // 判断设备类型
      isAndroidIos: function () {
        var p = navigator.platform
        var u = navigator.userAgent
        var app = navigator.appVersion
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        return {
          isAndroid: isAndroid,
          isiOS: isiOS,
          platform: p,
          isMobile: !(p.toLowerCase().indexOf('win') >= 0 || p.toLowerCase().indexOf('mac') >= 0),
          deviceInfo: app
        }
      },
      // 自动判断是以普通方式跳转页面传值还是通过hash值方式，并获取网址中的参数
      getRequestAuto: function (key) {
        let url = location.href
        if (url.indexOf('?') !== -1) {
          let safe = true
          if (this.decryptedData(decodeURIComponent(url.split('?')[1])) == '') safe = false
          return this.getRequest(key, safe)
        } else {
          // hash 模式默认按照加密处理
          return this.getRequestHash(key, true)
        }
      },
      // 获取网址中的参数
      getRequest: function (key, safe) {
        var url = location.href
        var theRequest = {}
        if (url.indexOf('?') !== -1) {
          var str = decodeURIComponent(url.split('?')[1])
          if (safe) {
            str = this.decryptedData(str)
          }
          var strs = str.split('&')
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
          }
        }
        if (key) {
          return theRequest[key]
        }
        return theRequest
      },
      // 获取网址中的hash值
      getRequestHash: function (key, safe) {
        var hash = window.location.hash
        var theRequest = {}
        if (hash.indexOf('#/') !== -1) {
          try {
            var str = decodeURIComponent(hash.split('#/')[1])
            if (safe) {
              str = this.decryptedData(str)
            }
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
              theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
            }
          } catch (error) {
            return null
          }
        }
        if (key) {
          return theRequest[key]
        }
        return theRequest
      },
      // aes加密
      encryptedData(data) {
        var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return encrypted.toString()
      },
      // aes解密
      decryptedData(data) {
        var decrypt = CryptoJS.AES.decrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return decrypt.toString(CryptoJS.enc.Utf8)
      },
      // 生成uuid
      guid () {
        return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1))
      },
      // 根据指定键返回json的数组中与所查找的值相同的数据位置
      getIndexInJsonArr (jsonArr, key, search) {
        var index = -1
        for (let i = 0; i < jsonArr.length; i++) {
          if (jsonArr[i][key] === search) {
            index = i
            break
          }
        }
        return index
      },
      // 判断是否为空对象
      isEmptyObject: function(obj) {
        // eslint-disable-next-line
        for (let key in obj) {
          return false
        }
        return true
      },
      // 关闭当前带有输入框的dialog弹出框
      closeCurDialogPrompt: function() {
        if (picker != null) {
          picker.destory()
          picker = null
        }
        if (dialogPrompt != null) {
          dialogPrompt.destory()
          dialogPrompt = null
        }
      }
      // convertPdf: function(pdfFileName, toPdfDom) {
      //   if (toPdfDom == undefined) toPdfDom = document.body.parentElement
      //   html2Canvas(toPdfDom, {
      //     // useCORS: true,
      //     allowTaint: true,
      //     logging: false
      //   }).then(canvas => {
      //     let contentWidth = canvas.width
      //     let contentHeight = canvas.height
      //     let pageHeight = contentWidth / 592.28 * 841.89
      //     let leftHeight = contentHeight
      //     let position = 0
      //     let imgWidth = 595.28
      //     let imgHeight = 592.28 / contentWidth * contentHeight
      //     let pageData = canvas.toDataURL('image/jpeg', 1.0)
      //     let PDF = new JsPDF('', 'pt', 'a4')
      //     if (leftHeight < pageHeight) {
      //       PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      //     } else {
      //       while (leftHeight > 0) {
      //         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
      //         leftHeight -= pageHeight
      //         position -= 841.89
      //         if (leftHeight > 0) {
      //           PDF.addPage()
      //         }
      //       }
      //     }
      //     PDF.save(pdfFileName + '.pdf')
      //   })
      // }
    }

    Object.defineProperty(Vue.prototype, '$comfun', { value: ComFun })
  }
}
