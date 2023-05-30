import { createRouter,  createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import BuildConfig from '../views/demo/build-config.vue';

const routerConfig: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'buildConfig',
    component: BuildConfig
  },
];

const router = createRouter({
  routes: routerConfig,
  history: createWebHashHistory()
});

export default router;
