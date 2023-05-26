"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = require("vue-router");
const ServiceCheckStep1_vue_1 = require("../views/ServiceCheckStep1.vue");
const ServiceCheckStep2_vue_1 = require("../views/ServiceCheckStep2.vue");
const ServiceCheckWrap_vue_1 = require("../components/ServiceCheckWrap.vue");
const routerConfig = [
    {
        path: '/',
        component: ServiceCheckWrap_vue_1.default,
        children: [
            {
                path: '',
                name: 'ServiceCheckStep1',
                component: ServiceCheckStep1_vue_1.default
            },
            {
                path: '/step2',
                name: 'ServiceCheckStep2',
                component: ServiceCheckStep2_vue_1.default
            }
        ]
    },
];
const router = (0, vue_router_1.createRouter)({
    routes: routerConfig,
    history: (0, vue_router_1.createWebHashHistory)()
});
exports.default = router;
//# sourceMappingURL=index.js.map