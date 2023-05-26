"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentInstance = void 0;
const vue_1 = require("vue");
function useCurrentInstance() {
    const { appContext, proxy } = (0, vue_1.getCurrentInstance)();
    const _this = appContext.config.globalProperties;
    return [
        _this,
        proxy
    ];
}
exports.useCurrentInstance = useCurrentInstance;
//# sourceMappingURL=common.js.map