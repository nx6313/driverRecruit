import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import VueUi from '@vue/ui'
import '@vue/ui/dist/vue-ui.css'
import ComFun from '@/utils/comfun.js'
import VConsole from '@/utils/vconsole.js'
import { SOME_MUTATION } from '@/utils/mutation-types'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(Vuex)
Vue.use(VueUi)
Vue.use(ComFun)

const store = new Vuex.Store({
  actions: {
    // eslint-disable-next-line
    clearAll({ commit, state }) {
      for (let mudule in state) {
        if (Object.prototype.toString.call(state[mudule]) == '[object Object]') {
          for (let key in state[mudule]) {
            if (Object.prototype.toString.call(state[mudule][key]) == '[object Object]') {
              for (let nextKey in state[mudule][key]) {
                state[mudule][key][nextKey] = null
              }
            } else {
              state[mudule][key] = null
            }
          }
        } else {
          state[mudule] = null
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
    },
    // 用户司机招募相关信息
    driverRecruitData: {
      state: {
        cardInfo: {
          idCardA: null,
          idCardB: null,
          driveCardA: null,
          driveCardB: null
        },
        baseInfo: null,
        auditState: {
          state: null,
          auditPass: null,
          personName: null,
          phone: null,
          personSex: null,
          time: null
        },
        policyDataInfo: {
          salaryCard: null,
          noCrimeRecord: null
        }
      },
      getters: {
        cardIsComplete(state) {
          return state.cardInfo.idCardA != null && state.cardInfo.idCardB != null && state.cardInfo.driveCardA != null && state.cardInfo.driveCardB != null
        }
      },
      mutations: {
        [SOME_MUTATION.setDriverRecruitData_CardInfo] (state, payload) {
          state.cardInfo = payload.cardInfo
        },
        [SOME_MUTATION.setDriverRecruitData_BaseInfo] (state, payload) {
          state.baseInfo = payload.baseInfo
        },
        [SOME_MUTATION.setDriverRecruitData_AuditState] (state, payload) {
          state.auditState = payload.auditState
        },
        [SOME_MUTATION.setDriverRecruitData_PolicyDataInfo] (state, payload) {
          state.policyDataInfo[payload.key] = payload.value
        }
      },
      actions: {
        // eslint-disable-next-line
        clearDriverRecruitData_CardInfo({ commit, state }) {
          state.cardInfo = {
            idCardA: null,
            idCardB: null,
            driveCardA: null,
            driveCardB: null
          }
        },
        // eslint-disable-next-line
        clearDriverRecruitData_BaseInfo({ commit, state }) {
          state.baseInfo = null
        }
      }
    }
  }
})

Vue.use(VConsole, { vuexStore: store })

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
