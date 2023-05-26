"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = exports.start = exports.getFieldDetail = exports.getFields = exports.getAppInfo = exports.envInit = exports.getVersionPlatform = void 0;
const axios_1 = require("../utils/axios");
// 获取支持的ZKOS版本信息
async function getVersionPlatform() {
    return (await (0, axios_1.post)('/verify/get_version_platform'));
}
exports.getVersionPlatform = getVersionPlatform;
// 发送初始化信息接口 /verify/env_init
async function envInit(data) {
    return (0, axios_1.post)('/verify/env_init', data);
}
exports.envInit = envInit;
// 获取应用信息接口 /verify/get_appinfo
async function getAppInfo(data) {
    return (0, axios_1.post)('/verify/get_appinfo', data);
}
exports.getAppInfo = getAppInfo;
// 获取publish列表接口 /verify/get_fields
async function getFields(data) {
    return (0, axios_1.post)('/verify/get_fields', data);
}
exports.getFields = getFields;
// 获取publish详情接口 /verify/get_field_detail
async function getFieldDetail(data) {
    return (0, axios_1.post)('/verify/get_field_detail', data);
}
exports.getFieldDetail = getFieldDetail;
// 启动构建接口 /verify/start
async function start(data) {
    return (0, axios_1.post)('/verify/start', data);
}
exports.start = start;
// 按钮选择信息接口 /verify/commit
async function commit(data) {
    return (0, axios_1.post)('/verify/commit', data);
}
exports.commit = commit;
//# sourceMappingURL=serviceCheck.js.map