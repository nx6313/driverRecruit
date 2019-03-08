import Vue from 'vue'
import 'es6-promise/auto'
import App from './App.vue'
import appConfig from './router'
import VueLazyload from "vue-lazyload"
import VueUi from '@vue/ui'
import '@vue/ui/dist/vue-ui.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import ComFun from '@/utils/comfun.js'
import Directives from '@/utils/directives.js'
import VConsole from '@/utils/vconsole.js'
import Api from '@/utils/api.js'
import DialogMsg from '@/plugins/dialogBox/msg.js'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueLazyload)
Vue.use(VueUi)
Vue.use(VueAwesomeSwiper)
Vue.use(ComFun)
Vue.use(Directives)
Vue.prototype.$api = Api

const router = appConfig.router
const store = appConfig.store

Vue.use(VConsole, { vuexStore: store, showToast: DialogMsg.installMsg, router: router })

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
