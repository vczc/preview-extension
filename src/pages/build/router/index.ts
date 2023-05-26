import { createRouter,  createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import MainPage from '../views/main/index.vue';
import page1 from '../views/page1.vue';
import page2 from '../views/page2.vue';
import BuildConfig from '../views/demo/build-config.vue';
import HelloWorld from '../views/demo/hello-world.vue';


// import() 不支持这样引入路由

const routerConfig: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/page1'
  },
  {
    path: '/page1',
    name: 'page1', // name 必填，用压路由跳转
    component: page1
  },
  {
    path: '/page2',
    name: 'page2', // name 必填，用压路由跳转
    component: page2
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
