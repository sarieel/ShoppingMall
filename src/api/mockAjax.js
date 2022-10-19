import axios from "axios";
// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";

// 创建一个新的axios对象（必须放在最前面）
const mockReq = axios.create({
  baseURL: "/mock",
  timeout: 5000,
});
// 请求拦截器
mockReq.interceptors.request.use((config) => {
  nprogress.start();
  return config;
});
// 响应拦截器
mockReq.interceptors.response.use(
  (response) => {
    nprogress.done();
    return response.data;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default mockReq;
