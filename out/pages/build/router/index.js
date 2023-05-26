"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = require("vue-router");
const page1_vue_1 = require("../views/page1.vue");
const page2_vue_1 = require("../views/page2.vue");
const build_config_vue_1 = require("../views/demo/build-config.vue");
const hello_world_vue_1 = require("../views/demo/hello-world.vue");
// import() 不支持这样引入路由
const routerConfig = [
    {
        path: '/',
        redirect: '/page1'
    },
    {
        path: '/page1',
        name: 'page1',
        component: page1_vue_1.default
    },
    {
        path: '/page2',
        name: 'page2',
        component: page2_vue_1.default
    },
    {
        path: '/build-config',
        name: 'build-config',
        component: build_config_vue_1.default
    },
    {
        path: '/hello',
        name: 'hello',
        component: hello_world_vue_1.default
    },
];
const router = (0, vue_router_1.createRouter)({
    routes: routerConfig,
    history: (0, vue_router_1.createWebHashHistory)()
});
exports.default = router;
//# sourceMappingURL=index.js.map