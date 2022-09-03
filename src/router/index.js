import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const adminManagement = () => import('@/views/adminManagement/index.vue')

const routes = [
  {
    path: '',
    redirect: '/adminManagement'
  },
  {
    path: '/adminManagement',
    name: 'adminManagement',
    component:adminManagement
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
