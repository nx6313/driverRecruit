import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cardInfo',
      name: 'cardInfo',
      component: () => import('./views/CardInfo.vue'),
      beforeEnter: (to, from, next) => {
        if (!router.app.$store || router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
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
      path: '/baseInfo',
      name: 'baseInfo',
      component: () => import('./views/BaseInfo.vue'),
      beforeEnter: (to, from, next) => {
        if (!router.app.$store || router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
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
      path: '/baseInfoComplete',
      name: 'baseInfoComplete',
      component: () => import('./views/BaseInfoComplete.vue'),
      beforeEnter: (to, from, next) => {
        if (!router.app.$store || router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
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
      path: '/auditResult',
      name: 'auditResult',
      component: () => import('./views/AuditResult.vue'),
      meta: {
        title: '信息审核'
      }
    },
    {
      path: '/complete',
      name: 'complete',
      component: () => import('./views/Complete.vue'),
      meta: {
        title: '加入大昌出行'
      }
    },
    {
      path: '/policyRuleList',
      name: 'policyRuleList',
      component: () => import('./views/PolicyRuleList.vue'),
      meta: {
        title: '政策声明'
      }
    },
    {
      path: '/policy/emolumentSecrecy',
      name: 'emolumentSecrecy',
      component: () => import('./views/policy/EmolumentSecrecy.vue'),
      meta: {
        title: '薪酬保密承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/entryNotice',
      name: 'entryNotice',
      component: () => import('./views/policy/EntryNotice.vue'),
      meta: {
        title: '入职须知'
      }
    },
    {
      path: '/policy/leaveDeclare',
      name: 'leaveDeclare',
      component: () => import('./views/policy/LeaveDeclare.vue'),
      meta: {
        title: '无法提交《离职证明》申明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/noCrimeRecord',
      name: 'noCrimeRecord',
      component: () => import('./views/policy/NoCrimeRecord.vue'),
      meta: {
        title: '无犯罪记录声明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/noCrimeRecordDec',
      name: 'noCrimeRecordDec',
      component: () => import('./views/policy/NoCrimeRecordDec.vue'),
      meta: {
        title: '申请无犯罪流程图',
        pageBg: '#1090e9'
      }
    },
    {
      path: '/policy/noPartTimeJob',
      name: 'noPartTimeJob',
      component: () => import('./views/policy/NoPartTimeJob.vue'),
      meta: {
        title: '无兼职工作申明',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/qualification',
      name: 'qualification',
      component: () => import('./views/policy/Qualification.vue'),
      meta: {
        title: '申报网约车驾驶员资格证承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/signContract',
      name: 'signContract',
      component: () => import('./views/policy/SignContract.vue'),
      meta: {
        title: '专职司机文件签约单',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/trafficSafety',
      name: 'trafficSafety',
      component: () => import('./views/policy/TrafficSafety.vue'),
      meta: {
        title: '驾驶人员交通安全承诺书',
        pageBg: '#f0eed7'
      }
    },
    {
      path: '/policy/workClothes',
      name: 'workClothes',
      component: () => import('./views/policy/WorkClothes.vue'),
      meta: {
        title: '工衣西服费用申明',
        pageBg: '#f0eed7'
      }
    }
  ]
})
router.beforeResolve((to, from, next) => {
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
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = document.querySelector('meta[name="web-describe"]').getAttribute('content')
  }
  next()
})
export default router
