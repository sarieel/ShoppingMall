import {
  registerCode,
  registerUser,
  loginUser,
  tokenCheck,
  logout,
} from "@/api/index";
import { setToken, getToken, removeToken } from "@/utils/token";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,
  state() {
    return {
      registerCode: "",
      token: getToken(), //【刷新】后的初始值
      userInfo: {},
    };
  },
  actions: {
    // 获取验证码
    async getCode(context, phone) {
      let result = await registerCode(phone);
      if (result.code === 200) {
        context.commit("GETCODE", result.data);
        return "ok";
      } else {
        return Promise.reject("fail to get code");
      }
    },
    // 注册
    async registerUser(context, { phone, pwd, code }) {
      let result = await registerUser({ phone, password: pwd, code });
      if (result.code == 200) {
        return "ok";
      } else {
        return Promise.reject("fail to register");
      }
    },
    // 登陆
    async loginUser(context, { phone, pwd }) {
      let result = await loginUser({ phone, password: pwd });
      if (result.code == 200) {
        alert("登陆成功");
        context.commit("LOGINUSER", result.data.token);
        setToken(result.data.token); //持久存储token
        return "ok";
      } else {
        return Promise.reject("fail to login");
      }
    },
    // 获得用户信息（有token才可以）
    async getUserInfo(context) {
      let result = await tokenCheck();
      if (result.code == 200) {
        alert("获取用户信息成功");
        context.commit("GETUSERINFO", result.data);
      }
    },
    // 登出
    async logoutUser(context) {
      let result = await logout(); //让服务器清除token
      if (result.code == 200) {
        context.commit("LOGOUTUSER");
        return "ok"; //actions不能操作state
      } else {
        return Promise.reject("fail to logout"); //需要判断成功失败，决定是否跳转到主页，所以要加return
      }
    },
  },
  mutations: {
    GETCODE(state, code) {
      state.registerCode = code;
    },
    LOGINUSER(state, token) {
      state.token = token;
    },
    GETUSERINFO(state, data) {
      state.userInfo = data;
    },
    LOGOUTUSER(state) {
      state.userInfo = "";
      // state.token = getToken();
      state.token = ""; //在这里改完，刷新之后依然是getToken()
      removeToken();
    },
  },
  getters: {},
};
