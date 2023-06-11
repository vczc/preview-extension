import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Index from '../views/index.vue'

const routerConfig: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: Index
  }
]

const router = createRouter({
  routes: routerConfig,
  history: createWebHashHistory()
})

export default router
