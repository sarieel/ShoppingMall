import axios from "axios";
// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";
import store from "@/store/index";

// 创建一个新的axios对象（必须放在最前面）
const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
});
// 请求拦截器
request.interceptors.request.use((config) => {
  // 传递游客uuid
  if (store.state.detail.uuid_token) {
    config.headers.userTempId = store.state.detail.uuid_token;
  }
  // 传递登陆token
  if (store.state.user.token) {
    config.headers.token = store.state.user.token;
  }
  nprogress.start();
  return config;
});
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    nprogress.done();
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
