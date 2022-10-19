import { reqSearchLists } from "@/api/index";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,

  state() {
    return {
      searchList: {},
    };
  },

  actions: {
    async getSearchLists(context, params = {}) {
      let result = await reqSearchLists(params);
      if (result.code === 200) {
        context.commit("GETSEARCHLISTS", result.data);
      }
    },
  },

  mutations: {
    GETSEARCHLISTS(state, value) {
      state.searchList = value;
    },
  },

  getters: {
    goodsList(state) {
      // 防止网络不好时报错（undefined不能被遍历）
      return state.searchList.goodsList || [];
    },
    trademarkList(state) {
      return state.searchList.trademarkList || [];
    },
    attrsList(state) {
      return state.searchList.attrsList || [];
    },
  },
};
