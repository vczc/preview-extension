import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HelloWorld from "../views/HelloWorld.vue";

const routerConfig: RouteRecordRaw[] = [
  {
    path: "/",
    name: "HelloWorld",
    component: HelloWorld,
  },
];

const router = createRouter({
  routes: routerConfig,
  history: createWebHashHistory(),
});

export default router;
