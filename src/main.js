import Vue from 'vue'
import 'es6-promise/auto'
import App from './App.vue'
import appConfig from './router'
import VueLazyload from "vue-lazyload"
import VueUi from '@vue/ui'
import '@vue/ui/dist/vue-ui.css'
import ComFun from '@/utils/comfun.js'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueLazyload)
Vue.use(VueUi)
Vue.use(ComFun)

const router = appConfig.router
const store = appConfig.store

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
