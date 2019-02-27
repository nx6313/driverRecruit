import Vue from 'vue'
import Vuex from 'vuex'
import VConsole from '@/utils/vconsole.js'
import { SOME_MUTATION } from '@/utils/mutation-types'

Vue.use(Vuex)

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
        baseInfoComplete: {
          personName: null,
          personSex: null,
          idcarNo: null,
          addressDetail: null,
          driverlicenseNo: null,
          phone: null,
          smsCode: null
        },
        auditState: {
          state: null,
          auditPass: null,
          personName: null,
          phone: null,
          idcarNo: null,
          personSex: null,
          time: null
        },
        policyList: null,
        policyDataInfo: {
          userPhoto: null,
          salaryCard: null,
          accountCard: null,
          liver: null,
          heart: null,
          xLight: null,
          noCrimeRecord: null,
          signContract: null,
          leaveDeclare: null
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
        [SOME_MUTATION.setDriverRecruitData_BaseInfoComplete] (state, payload) {
          state.baseInfoComplete = payload.baseInfoComplete
        },
        [SOME_MUTATION.setDriverRecruitData_AuditState] (state, payload) {
          state.auditState = payload.auditState
        },
        [SOME_MUTATION.setDriverRecruitData_PolicyList] (state, payload) {
          state.policyList = payload.policyList
        },
        [SOME_MUTATION.setDriverRecruitData_PolicyListUpdateReadStatus] (state, payload) {
          state.policyList[payload.index][payload.key] = payload.value
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
        },
        // eslint-disable-next-line
        clearDriverRecruitData_BaseInfoComplete({ commit, state }) {
          state.baseInfoComplete = null
        }
      }
    }
  }
})

Vue.use(VConsole, { vuexStore: store })

export default store
