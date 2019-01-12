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
        if (router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/baseInfo',
      name: 'baseInfo',
      component: () => import('./views/BaseInfo.vue'),
      beforeEnter: (to, from, next) => {
        if (router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/baseInfoComplete',
      name: 'baseInfoComplete',
      component: () => import('./views/BaseInfoComplete.vue'),
      beforeEnter: (to, from, next) => {
        if (router.app.$store.state.driverRecruitData.auditState.state == null || router.app.$store.state.driverRecruitData.auditState.state === true) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/auditResult',
      name: 'auditResult',
      component: () => import('./views/AuditResult.vue')
    },
    {
      path: '/policyRuleList',
      name: 'policyRuleList',
      component: () => import('./views/PolicyRuleList.vue')
    },
    {
      path: '/policy/emolumentSecrecy',
      name: 'emolumentSecrecy',
      component: () => import('./views/policy/EmolumentSecrecy.vue')
    },
    {
      path: '/policy/entryNotice',
      name: 'entryNotice',
      component: () => import('./views/policy/EntryNotice.vue')
    },
    {
      path: '/policy/leaveDeclare',
      name: 'leaveDeclare',
      component: () => import('./views/policy/LeaveDeclare.vue')
    },
    {
      path: '/policy/noCrimeRecord',
      name: 'noCrimeRecord',
      component: () => import('./views/policy/NoCrimeRecord.vue')
    },
    {
      path: '/policy/noPartTimeJob',
      name: 'noPartTimeJob',
      component: () => import('./views/policy/NoPartTimeJob.vue')
    },
    {
      path: '/policy/qualification',
      name: 'qualification',
      component: () => import('./views/policy/Qualification.vue')
    },
    {
      path: '/policy/signContract',
      name: 'signContract',
      component: () => import('./views/policy/SignContract.vue')
    },
    {
      path: '/policy/trafficSafety',
      name: 'trafficSafety',
      component: () => import('./views/policy/TrafficSafety.vue')
    },
    {
      path: '/policy/workClothes',
      name: 'workClothes',
      component: () => import('./views/policy/WorkClothes.vue')
    }
  ]
})
export default router
