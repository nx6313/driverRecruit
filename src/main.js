import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import ComFun from '@/utils/comfun.js'
import { SOME_MUTATION } from '@/utils/mutation-types'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(Vuex)
Vue.use(ComFun)

const store = new Vuex.Store({
  actions: {
    // eslint-disable-next-line
    clearAll({ commit, state }) {
      for (let mudule in state) {
        for (let key in state[mudule]) {
          state[mudule][key] = null
        }
      }
    }
  },
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
    },
    // 用户司机招募相关状态
    driverRecruit: {
      state: {
        state: null,
        stateRule: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateDriverRecruitState] (state, payload) {
          state.state = payload.state
        },
        [SOME_MUTATION.setDriverRecruitStateRule] (state, payload) {
          state.stateRule = payload.stateRule
        }
      },
      actions: {}
    }
  }
})

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
