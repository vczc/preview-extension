import { createRouter,  createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import MainPage from '../views/main/index.vue';
import BuildConfig from '../views/demo/build-config.vue';
import HelloWorld from '../views/demo/hello-world.vue';


// import() 不支持这样引入路由

const routerConfig: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/build-config'
  },
  {
    path: '/build-config',
    name: 'build-config',
    component: BuildConfig
  },
  {
    path: '/hello',
    name: 'hello',
    component: HelloWorld
  },
];

const router = createRouter({
  routes: routerConfig,
  history: createWebHashHistory()
});

export default router;
