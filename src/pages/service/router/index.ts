import { createRouter,  createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import ServiceCheckStep1 from '../views/ServiceCheckStep1.vue';
import ServiceCheckStep2 from '../views/ServiceCheckStep2.vue';
import ServiceCheckWrap from '../components/ServiceCheckWrap.vue';

const routerConfig: RouteRecordRaw[] = [
  {
    path: '/',
    component: ServiceCheckWrap,
    children: [
      {
        path: '',
        name: 'ServiceCheckStep1',
        component: ServiceCheckStep1
      },
      {
        path: '/step2',
        name: 'ServiceCheckStep2',
        component: ServiceCheckStep2
      }
    ]
  },
];

const router = createRouter({
  routes: routerConfig,
  history: createWebHashHistory()
});

export default router;
