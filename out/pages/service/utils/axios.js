"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.post = void 0;
const axios_1 = require("axios");
const instance = axios_1.default.create({
    // baseURL: 'http://localhost:5173/api',
    baseURL: 'http://127.0.0.1:9090',
    // baseURL: 'http://10.114.148.55:9090',
    timeout: 40000,
    headers: {}
});
instance.interceptors.response.use(function (response) {
    // 返回data内信息
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
const post = async (url, data, config) => {
    const res = await instance.post(url, data, config);
    return res;
};
exports.post = post;
const get = (url, config = {}) => {
    return instance.get(url, config);
};
exports.get = get;
//# sourceMappingURL=axios.js.map