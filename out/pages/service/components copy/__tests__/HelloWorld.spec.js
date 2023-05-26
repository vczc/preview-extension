"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_utils_1 = require("@vue/test-utils");
const HelloWorld_vue_1 = require("../HelloWorld.vue");
(0, vitest_1.describe)('HelloWorld', () => {
    (0, vitest_1.it)('renders properly', () => {
        const wrapper = (0, test_utils_1.mount)(HelloWorld_vue_1.default, { props: { msg: 'Hello Vitest' } });
        (0, vitest_1.expect)(wrapper.text()).toContain('Hello Vitest');
    });
});
//# sourceMappingURL=HelloWorld.spec.js.map