import { tradeList } from "@/api/index";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,

  state() {
    return {
      tradeData: {},
    };
  },

  actions: {
    // 获得页面订单数据
    async getTradeList(context) {
      let result = await tradeList();
      if (result.code == 200) {
        context.commit("GETTRADELIST", result.data);
      }
    },
  },

  mutations: {
    GETTRADELIST(state, data) {
      state.tradeData = data;
    },
  },

  getters: {
    userAddressList(state) {
      return state.tradeData.userAddressList || [];
    },
    totalAmount(state) {
      return state.tradeData.totalAmount;
    },
    detailArrayList(state) {
      return state.tradeData.detailArrayList || [];
    },
    tradeNo(state) {
      return state.tradeData.tradeNo;
    },
    totalNum(state) {
      return state.tradeData.totalNum;
    },
  },
};
