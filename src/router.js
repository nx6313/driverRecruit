import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/baseInfo',
      name: 'baseInfo',
      component: () => import('./views/BaseInfo.vue')
    },
    {
      path: '/baseInfoComplete',
      name: 'baseInfoComplete',
      component: () => import('./views/BaseInfoComplete.vue')
    }
  ]
})
