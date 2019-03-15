import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Index from './views/Index.vue'

Vue.use(Router)
Vue.use(store)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        pageBg: '#E4E9ED'
      }
    },
    {
      path: '/fullTimeHome',
      name: 'fullTimeHome',
      component: () => import('./views/FullTimeHome.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '自营专职加盟',
        isFullPage: true,
        pageBg: {
          backgroundColor: '#303030',
          backgroundImage: `url(${require('@/assets/black_point_bg.png')})`
        }
      }
    },
    {
      path: '/rentCarHome',
      name: 'rentCarHome',
      component: () => import('./views/RentCarHome.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '租车加盟',
        isFullPage: true,
        pageBg: {
          backgroundColor: '#303030',
          backgroundImage: `url(${require('@/assets/black_point_bg.png')})`
        }
      }
    },
    {
      path: '/buyCarHome',
      name: 'buyCarHome',
      component: () => import('./views/BuyCarHome.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '购车加盟',
        isFullPage: true,
        pageBg: {
          backgroundColor: '#303030',
          backgroundImage: `url(${require('@/assets/black_point_bg.png')})`
        }
      }
    },
    {
      path: '/haveCarHome',
      name: 'haveCarHome',
      component: () => import('./views/HaveCarHome.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '带车加盟',
        isFullPage: true,
        pageBg: {
          backgroundColor: '#303030',
          backgroundImage: `url(${require('@/assets/black_point_bg.png')})`
        }
      }
    },
    /** 专职自营司机相关页面 */
    {
      path: '/fullTime/baseInfoComplete',
      name: 'baseInfoComplete',
      component: () => import('./views/fullTime/BaseInfoComplete.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null || store.state.driverRecruitData.auditState.state == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '基础信息'
      }
    },
    {
      path: '/fullTime/cardInfo',
      name: 'cardInfo',
      component: () => import('./views/fullTime/CardInfo.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null || store.state.driverRecruitData.auditState.state == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '上传证件'
      }
    },
    {
      path: '/fullTime/baseInfo',
      name: 'baseInfo',
      component: () => import('./views/fullTime/BaseInfo.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null || store.state.driverRecruitData.auditState.state == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '完善信息'
      }
    },
    {
      path: '/fullTime/auditResult',
      name: 'auditResult',
      component: () => import('./views/fullTime/AuditResult.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '信息审核'
      }
    },
    {
      path: '/fullTime/complete',
      name: 'complete',
      component: () => import('./views/fullTime/Complete.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '加入大昌出行'
      }
    },
    {
      path: '/isDriver',
      name: 'isDriver',
      component: () => import('./views/IsDriver.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '欢迎加入大昌出行'
      }
    },
    {
      path: '/fullTime/policyRuleList',
      name: 'policyRuleList',
      component: () => import('./views/fullTime/PolicyRuleList.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone != null) {
          if (store.state.driverRecruitData.policyList != null) {
            let allIsRead = true
            let notNeedUpdate = true
            for (let policyIndex in store.state.driverRecruitData.policyList) {
              if (!store.state.driverRecruitData.policyList[policyIndex].read) {
                allIsRead = false
                break
              }
              if (store.state.driverRecruitData.policyList[policyIndex].needUpdate) {
                notNeedUpdate = false
                break
              }
            }
            if (allIsRead && notNeedUpdate) {
              next('/')
            } else {
              next()
            }
          } else {
            next()
          }
        } else {
          next('/')
        }
      },
      meta: {
        title: '政策声明'
      }
    },
    // 政策文件说明开始
    {
      path: '/fullTime/policy/emolumentSecrecy',
      name: 'emolumentSecrecy',
      component: () => import('./views/fullTime/policy/EmolumentSecrecy.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '薪酬保密承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/entryNotice',
      name: 'entryNotice',
      component: () => import('./views/fullTime/policy/EntryNotice.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '入职须知'
      }
    },
    {
      path: '/fullTime/policy/leaveDeclare',
      name: 'leaveDeclare',
      component: () => import('./views/fullTime/policy/LeaveDeclare.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '提交《离职证明》申明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/noCrimeRecord',
      name: 'noCrimeRecord',
      component: () => import('./views/fullTime/policy/NoCrimeRecord.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '无犯罪记录声明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/noCrimeRecordDec',
      name: 'noCrimeRecordDec',
      component: () => import('./views/fullTime/policy/NoCrimeRecordDec.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '申请无犯罪流程图',
        pageBg: '#1090e9'
      }
    },
    {
      path: '/fullTime/policy/noPartTimeJob',
      name: 'noPartTimeJob',
      component: () => import('./views/fullTime/policy/NoPartTimeJob.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '无兼职工作申明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/qualification',
      name: 'qualification',
      component: () => import('./views/fullTime/policy/Qualification.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '申报网约车驾驶员资格证承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/signContract',
      name: 'signContract',
      component: () => import('./views/fullTime/policy/SignContract.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '专职司机文件签约单',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/trafficSafety',
      name: 'trafficSafety',
      component: () => import('./views/fullTime/policy/TrafficSafety.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '驾驶人员交通安全承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/fullTime/policy/workClothes',
      name: 'workClothes',
      component: () => import('./views/fullTime/policy/WorkClothes.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '工衣西服费用申明',
        pageBg: '#f0eed7'
      }
    },
    // 政策文件说明结束
    {
      path: '/datumShow',
      name: 'datumShow',
      component: () => import('./views/DatumShow.vue'),
      meta: {
        title: '司机招募已提交资料预览'
      }
    },
    /** 带车加盟相关页面 */
    {
      path: '/haveCar/baseInfo1',
      name: 'haveCarBaseInfo1',
      component: () => import('./views/haveCar/BaseInfo1.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '基础信息',
        keepAliveName: 'haveCarFlow'
      }
    },
    {
      path: '/haveCar/baseInfo2',
      name: 'haveCarBaseInfo2',
      component: () => import('./views/haveCar/BaseInfo2.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '证件上传'
      }
    },
    {
      path: '/haveCar/flow',
      name: 'haveCarFlow',
      component: () => import('./views/haveCar/Flow.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '网约车从业资格证办理流程',
        pageBg: '#ffffff'
      }
    },
    /** 购车加盟相关页面 */
    {
      path: '/buyCar/intention',
      name: 'buyCarIntention',
      component: () => import('./views/buyCar/Intention.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '购车意向提交'
      }
    },
    {
      path: '/buyCar/baseInfo1',
      name: 'buyCarBaseInfo1',
      component: () => import('./views/buyCar/BaseInfo1.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '基础信息',
        keepAliveName: 'buyCarFlow'
      }
    },
    {
      path: '/buyCar/baseInfo2',
      name: 'buyCarBaseInfo2',
      component: () => import('./views/buyCar/BaseInfo2.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '证件上传'
      }
    },
    {
      path: '/buyCar/flow',
      name: 'buyCarFlow',
      component: () => import('./views/buyCar/Flow.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '网约车从业资格证办理流程',
        pageBg: '#ffffff'
      }
    },
    /** 租车加盟相关页面 */
    {
      path: '/rentCar/intention',
      name: 'rentCarIntention',
      component: () => import('./views/rentCar/Intention.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '租车意向提交'
      }
    },
    {
      path: '/rentCar/baseInfo1',
      name: 'rentCarBaseInfo1',
      component: () => import('./views/rentCar/BaseInfo1.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '基础信息',
        keepAliveName: 'rentCarFlow'
      }
    },
    {
      path: '/rentCar/baseInfo2',
      name: 'rentCarBaseInfo2',
      component: () => import('./views/rentCar/BaseInfo2.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '证件上传'
      }
    },
    {
      path: '/rentCar/flow',
      name: 'rentCarFlow',
      component: () => import('./views/rentCar/Flow.vue'),
      beforeEnter: (to, from, next) => {
        refForVuexData()
        if (store.state.userBaseInfo.phone == null) {
          next('/')
        } else {
          next()
        }
      },
      meta: {
        title: '网约车从业资格证办理流程',
        pageBg: '#ffffff'
      }
    }
  ]
})
router.beforeResolve((to, from, next) => {
  if (to.meta.keepAliveName) {
    if (from.name == to.meta.keepAliveName) {
      to.meta.keepData = true
    } else {
      to.meta.keepData = false
    }
  }
  refForVuexData()
  document.body.parentNode.style['backgroundImage'] = ''
  document.body.parentNode.style['backgroundRepeat'] = ''
  document.body.parentNode.style['backgroundSize'] = ''
  document.body.parentNode.style['backgroundPosition'] = ''
  if (to.meta.pageBg) {
    if (router.app.$vctool.isObject(to.meta.pageBg)) {
      for (let styleKey in to.meta.pageBg) {
        document.body.parentNode.style[styleKey] = to.meta.pageBg[styleKey]
      }
    } else {
      document.body.parentNode.style.backgroundColor = to.meta.pageBg
    }
  } else {
    document.body.parentNode.style.backgroundColor = '#F5F5F5'
  }
  if (to.meta.isFullPage === true) {
    document.body.parentNode.style.overflow = 'hidden'
  } else {
    document.body.parentNode.style.overflow = 'auto'
  }
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  next()
})

let refForVuexData = function() {
  router.app.$store.replaceState(Object.assign({}, router.app.$store.state, JSON.parse(sessionStorage.getItem('store'))))
  sessionStorage.clear()
}

export default {
  router: router,
  store: store
}
