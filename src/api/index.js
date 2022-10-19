// 默认导出所以不需要加大括号
import request from "./ajax";
import mockReq from "./mockAjax";

// 三级联动商品数据
export const reqCategoryList = () => {
  return request({
    url: "/product/getBaseCategoryList",
    method: "get",
  });
};
// 首页banner地址
export const reqBanner = () => {
  return mockReq({
    url: "/banner",
    method: "get",
  });
};
// 首页floor组件
export const reqFloors = () => {
  return mockReq({
    url: "/floors",
    method: "get",
  });
};
// 搜索页面
export const reqSearchLists = (params) => {
  return request({
    url: "/list",
    method: "post",
    data: params,
  });
};
// 商品详情页
export const reqDetail = (id) => {
  return request({
    url: `/item/${id}`,
    method: "get",
  });
};
// 加入购物车/修改购物车列表
export const reqAddShopcar = (skuId, skuNum) => {
  return request({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: "post",
  });
};
// 获得购物车列表
export const reqShopcart = () => {
  return request({
    url: "/cart/cartList",
    method: "get",
  });
};
// 删除购物车数据
export const updateShopcart = (skuId) => {
  return request({
    url: `/cart/deleteCart/${skuId}`,
    method: "delete",
  });
};
// 切换商品选中状态
export const changeProductStatic = (skuId, isChecked) => {
  return request({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: "get",
  });
};
// 获取注册验证码
export const registerCode = (phone) => {
  return request({
    url: `/user/passport/sendCode/${phone}`,
    method: "get",
  });
};
// 注册用户
export const registerUser = (params) => {
  return request({
    url: "/user/passport/register",
    method: "post",
    data: params,
  });
};
// 登陆用户
export const loginUser = (params) => {
  return request({
    url: "/user/passport/login",
    method: "post",
    data: params,
  });
};
// 获取用户信息（token在header中传递
export const tokenCheck = () => {
  return request({
    url: "/user/passport/auth/getUserInfo",
    method: "get",
  });
};
// 退出登陆
export const logout = () => {
  return request({
    url: "/user/passport/logout",
    method: "get",
  });
};
// 获得结算页面数据
export const tradeList = () => {
  return request({
    url: "/order/auth/trade",
    method: "get",
  });
};
// 提交订单
export const reqSubmitOrder = (tradeNo, params) => {
  return request({
    url: `/order/auth/submitOrder/?tradeNo=${tradeNo}`,
    method: "post",
    data: params,
  });
};
// 获得订单页面数据
export const reqOrderInfo = (orderId) => {
  return request({
    url: `/payment/weixin/createNative/${orderId}`,
    method: "get",
  });
};
// 查询订单支付状态
export const reqOrderPay = (orderId) => {
  return request({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: "get",
  });
};
// 获取我的订单列表
export const reqMyOrder = (page, limit) => {
  return request({
    url: `/order/auth/${page}/${limit}`,
    method: "get",
  });
};
