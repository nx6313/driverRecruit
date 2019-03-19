import Vue from 'vue'
import Vuex from 'vuex'
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
    // 服务器类型 生产服务器:d 、 预生产服务器:p 、 测试服:t
    serviceType: {
      state: {
        type: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateServiceType] (state, payload) {
          state.type = payload.type
        }
      },
      actions: {}
    },
    // 用户auth登陆认证信息
    auth: {
      state: {
        secret: null,
        token: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateAuth] (state, payload) {
          state.secret = payload.secret
          state.token = payload.token
        }
      },
      actions: {}
    },
    // 用户选择司机招募的类型以及用户手机号信息
    userBaseInfo: {
      state: {
        phone: null,
        dType: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateUserBaseInfoPhone] (state, payload) {
          state.phone = payload.phone
        },
        [SOME_MUTATION.updateUserBaseInfoDType] (state, payload) {
          state.dType = payload.dType
        }
      },
      actions: {
        // eslint-disable-next-line
        clearUserBaseInfo({ commit, state }) {
          state.phone = null
          state.dType = null
        }
      }
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
          driveCardB: null,
          runCardA: null,
          runCardB: null,
          peopleCarPhoto: null
        },
        baseInfo: null,
        baseInfoComplete: {
          personName: null,
          personSex: null,
          idcarNo: null,
          addressDetail: null,
          driverlicenseNo: null,
          phone: null,
          driverType: null,
          certificationType: null,
          certificationCard: null,
          needHelpGetcertification: null
        },
        intentionInfo: {
          city: null,
          company: null,
          principal: null,
          contact: null,
          useCarCause: null,
          userName: null,
          introducePeople: null,
          introduceOther: null
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
        },
        cardIsCompleteForJoinIn(state) {
          return state.cardInfo.idCardA != null && state.cardInfo.idCardB != null && state.cardInfo.driveCardA != null && state.cardInfo.driveCardB != null && 
            state.cardInfo.runCardA != null && state.cardInfo.runCardB != null && state.cardInfo.peopleCarPhoto != null
        }
      },
      mutations: {
        [SOME_MUTATION.setDriverRecruitData_CardInfo] (state, payload) {
          state.cardInfo = payload.cardInfo
        },
        [SOME_MUTATION.setDriverRecruitData_CardInfoByKey] (state, payload) {
          state.cardInfo[payload.key] = payload.value
        },
        [SOME_MUTATION.setDriverRecruitData_BaseInfo] (state, payload) {
          state.baseInfo = payload.baseInfo
        },
        [SOME_MUTATION.setDriverRecruitData_BaseInfoComplete] (state, payload) {
          state.baseInfoComplete = payload.baseInfoComplete
        },
        [SOME_MUTATION.setDriverRecruitData_BaseInfoCompleteByKey] (state, payload) {
          state.baseInfoComplete[payload.key] = payload.value
        },
        [SOME_MUTATION.setDriverRecruitData_IntentionInfo] (state, payload) {
          state.intentionInfo = payload.intentionInfo
        },
        [SOME_MUTATION.setDriverRecruitData_IntentionInfoByKey] (state, payload) {
          state.intentionInfo[payload.key] = payload.value
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
    },
    // 页面缓存数据
    pageData: {
      state: {
        data: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.setPageData] (state, payload) {
          state.data = payload.data
        }
      },
      actions: {
        // eslint-disable-next-line
        clearPageData({ commit, state }) {
          state.data = null
        }
      }
    }
  }
})

export default store
