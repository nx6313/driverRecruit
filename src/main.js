import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import ComFun from '@/utils/comfun.js'
import { SOME_MUTATION } from '@/utils/mutation-types'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ComFun)

const store = new Vuex.Store({
  modules: {
    // 用户auth登陆认证信息
    auth: {
      state: {
        secret: null,
        token: null,
        serviceType: null // 服务器类型 正式服:www or 测试服:dev
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateAuth] (state, payload) {
          state.secret = payload.secret
          state.token = payload.token
          state.serviceType = payload.serviceType
        }
      },
      actions: {}
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
