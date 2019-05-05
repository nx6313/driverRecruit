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
    // 用户auth登陆认证信息
    auth: {
      state: {
        secret: null,
        token: null,
        byLogin: null
      },
      getters: {},
      mutations: {
        [SOME_MUTATION.updateAuth] (state, payload) {
          state.secret = payload.secret
          state.token = payload.token
        },
        [SOME_MUTATION.updateAuthLoginType] (state, payload) {
          state.byLogin = payload
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
          needHelpGetcertification: null,
          recommendName: null,
          recommendPhone: null
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
          salaryCardAddress: null,
          accountCard: null,
          liver: null,
          heart: null,
          xLight: null,
          noCrimeRecord: null,
          signContract: null,
          leaveDeclare: null,
          leaveYear: null,
          leaveMonth: null,
          leaveDay: null,
          leaveCompany: null,
          leaveReason: null,
          hasLeaveDeclare: null
        },
        dataProAbout: {
          idcarda_birthday: null,
          idcarda_sex: null,
          idcarda_address: null,
          idcarda_name: null,
          idcarda_image: null,
          idcarda_idcard: null,
          idcarda_nation: null,
          idcardb_authority: null,
          idcardb_timelimit: null,
          drivecarda_address: null,
          drivecarda_begin_date: null,
          drivecarda_birthday: null,
          drivecarda_end_date: null,
          drivecarda_firstGetDocDate: null,
          drivecarda_idcard: null,
          drivecarda_name: null,
          drivecarda_nationality: null,
          drivecarda_sex: null,
          drivecarda_type: null,
          drivecardb_record: null,
          drivecardb_file_number: null,
          drivecardb_name: null,
          drivecardb_barcode: null,
          drivecardb_idcard: null,
          runcarda_carType: null,
          runcarda_model: null,
          runcarda_address: null,
          runcarda_engine: null,
          runcarda_register_date: null,
          runcarda_use_Property: null,
          runcarda_vin: null,
          runcarda_carNumber: null,
          runcarda_owner: null,
          runcarda_issue_date: null,
          runcardb_recordId: null,
          runcardb_passengers: null,
          runcardb_overall_dimension: null,
          runcardb_load_weight: null,
          runcardb_curb_weight: null,
          runcardb_cross_weight: null,
          runcardb_carNumber: null,
          runcardb_barcode: null,
          runcardb_towing_capacity: null,
          runcardb_inspection_record: null,
          runcardb_note: null
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
        },
        [SOME_MUTATION.setDriverRecruitData_DataProAbout] (state, payload) {
          for (let key in payload) {
            state.dataProAbout[key] = payload[key]
          }
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
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_idCardA({ commit, state }) {
          state.dataProAbout.idcarda_birthday = null
          state.dataProAbout.idcarda_sex = null
          state.dataProAbout.idcarda_address = null
          state.dataProAbout.idcarda_name = null
          state.dataProAbout.idcarda_image = null
          state.dataProAbout.idcarda_idcard = null
          state.dataProAbout.idcarda_nation = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_idCardB({ commit, state }) {
          state.dataProAbout.idcardb_authority = null
          state.dataProAbout.idcardb_timelimit = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_idCard({ commit, state }) {
          state.dataProAbout.idcarda_birthday = null
          state.dataProAbout.idcarda_sex = null
          state.dataProAbout.idcarda_address = null
          state.dataProAbout.idcarda_name = null
          state.dataProAbout.idcarda_image = null
          state.dataProAbout.idcarda_idcard = null
          state.dataProAbout.idcarda_nation = null
          state.dataProAbout.idcardb_authority = null
          state.dataProAbout.idcardb_timelimit = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_driveCardA({ commit, state }) {
          state.dataProAbout.drivecarda_address = null
          state.dataProAbout.drivecarda_begin_date = null
          state.dataProAbout.drivecarda_birthday = null
          state.dataProAbout.drivecarda_end_date = null
          state.dataProAbout.drivecarda_firstGetDocDate = null
          state.dataProAbout.drivecarda_idcard = null
          state.dataProAbout.drivecarda_name = null
          state.dataProAbout.drivecarda_nationality = null
          state.dataProAbout.drivecarda_sex = null
          state.dataProAbout.drivecarda_type = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_driveCardB({ commit, state }) {
          state.dataProAbout.drivecardb_record = null
          state.dataProAbout.drivecardb_file_number = null
          state.dataProAbout.drivecardb_name = null
          state.dataProAbout.drivecardb_barcode = null
          state.dataProAbout.drivecardb_idcard = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_driveCard({ commit, state }) {
          state.dataProAbout.drivecarda_address = null
          state.dataProAbout.drivecarda_begin_date = null
          state.dataProAbout.drivecarda_birthday = null
          state.dataProAbout.drivecarda_end_date = null
          state.dataProAbout.drivecarda_firstGetDocDate = null
          state.dataProAbout.drivecarda_idcard = null
          state.dataProAbout.drivecarda_name = null
          state.dataProAbout.drivecarda_nationality = null
          state.dataProAbout.drivecarda_sex = null
          state.dataProAbout.drivecarda_type = null
          state.dataProAbout.drivecardb_record = null
          state.dataProAbout.drivecardb_file_number = null
          state.dataProAbout.drivecardb_name = null
          state.dataProAbout.drivecardb_barcode = null
          state.dataProAbout.drivecardb_idcard = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_runCardA({ commit, state }) {
          state.dataProAbout.runcarda_carType = null
          state.dataProAbout.runcarda_model = null
          state.dataProAbout.runcarda_address = null
          state.dataProAbout.runcarda_engine = null
          state.dataProAbout.runcarda_register_date = null
          state.dataProAbout.runcarda_use_Property = null
          state.dataProAbout.runcarda_vin = null
          state.dataProAbout.runcarda_carNumber = null
          state.dataProAbout.runcarda_owner = null
          state.dataProAbout.runcarda_issue_date = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_runCardB({ commit, state }) {
          state.dataProAbout.runcardb_recordId = null
          state.dataProAbout.runcardb_passengers = null
          state.dataProAbout.runcardb_overall_dimension = null
          state.dataProAbout.runcardb_load_weight = null
          state.dataProAbout.runcardb_curb_weight = null
          state.dataProAbout.runcardb_cross_weight = null
          state.dataProAbout.runcardb_carNumber = null
          state.dataProAbout.runcardb_barcode = null
          state.dataProAbout.runcardb_towing_capacity = null
          state.dataProAbout.runcardb_inspection_record = null
          state.dataProAbout.runcardb_note = null
        },
        // eslint-disable-next-line
        clearDriverRecruitData_DataProAbout_runCard({ commit, state }) {
          state.dataProAbout.runcarda_carType = null
          state.dataProAbout.runcarda_model = null
          state.dataProAbout.runcarda_address = null
          state.dataProAbout.runcarda_engine = null
          state.dataProAbout.runcarda_register_date = null
          state.dataProAbout.runcarda_use_Property = null
          state.dataProAbout.runcarda_vin = null
          state.dataProAbout.runcarda_carNumber = null
          state.dataProAbout.runcarda_owner = null
          state.dataProAbout.runcarda_issue_date = null
          state.dataProAbout.runcardb_recordId = null
          state.dataProAbout.runcardb_passengers = null
          state.dataProAbout.runcardb_overall_dimension = null
          state.dataProAbout.runcardb_load_weight = null
          state.dataProAbout.runcardb_curb_weight = null
          state.dataProAbout.runcardb_cross_weight = null
          state.dataProAbout.runcardb_carNumber = null
          state.dataProAbout.runcardb_barcode = null
          state.dataProAbout.runcardb_towing_capacity = null
          state.dataProAbout.runcardb_inspection_record = null
          state.dataProAbout.runcardb_note = null
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
