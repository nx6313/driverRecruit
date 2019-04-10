import Vue from 'vue'
import 'es6-promise/auto'
import App from './App.vue'
import appConfig from './router'
import VueLazyload from "vue-lazyload"
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import ComFun from '@/utils/comfun.js'
import Directives from '@/utils/directives.js'
import VConsole from '@/utils/vconsole.js'
import Api from '@/utils/api.js'
import DialogMsg from '@/plugins/dialogBox/msg.js'

import 'babel-polyfill' // IE兼容

import { APP_CONFIG } from '@/utils/constants'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueLazyload)
Vue.use(VueAwesomeSwiper)
Vue.use(ComFun)
Vue.use(Directives)
Vue.prototype.$api = Api

const router = appConfig.router
const store = appConfig.store

let currentBaseUrl
if (location.host.endsWith('.com')) {
  currentBaseUrl = location.origin + '/'
  Vue.prototype.$BASE_URL = location.origin + '/'
  Vue.prototype.$BASE_HOST = location.host
  Vue.prototype.$SHOW_TEST_TOOL = location.host.startsWith('test.') ? true : false
} else {
  currentBaseUrl = APP_CONFIG.localhostServerBaseUrl
  Vue.prototype.$BASE_URL = APP_CONFIG.localhostServerBaseUrl
  Vue.prototype.$BASE_HOST = '本地调试：' + APP_CONFIG.localhostServerBaseUrl
  Vue.prototype.$SHOW_TEST_TOOL = true
}

Vue.use(VConsole, { vuexStore: store, showToast: DialogMsg.installMsg, router: router, baseUrl: currentBaseUrl })

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}).$mount('#app')
