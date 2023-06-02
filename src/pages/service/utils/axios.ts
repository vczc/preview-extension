import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5173/api',
  baseURL: 'http://127.0.0.1:9090',
  // baseURL: 'http://10.114.148.55:9090',
  timeout: 60000,
  headers: {}
});

instance.interceptors.response.use(
  function (response) {
    // 返回data内信息
    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export const post = async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
  const res = await instance.post(url, data, config);
  return res;
};

export const get = (url: string, config: AxiosRequestConfig = {}) => {
  return instance.get(url, config);
};
