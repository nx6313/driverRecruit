import Vue from 'vue'
import 'es6-promise/auto'
import App from './App.vue'
import appConfig from './router'
import VueUi from '@vue/ui'
import '@vue/ui/dist/vue-ui.css'
import ComFun from '@/utils/comfun.js'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueUi)
Vue.use(ComFun)

const router = appConfig.router
const store = appConfig.store

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  }
}).$mount('#app')
