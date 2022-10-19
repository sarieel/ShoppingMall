import { reqDetail, reqAddShopcar } from "@/api/index";
import { getUUID } from "@/utils/detail";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,
  state() {
    return {
      detailList: {}, // 初始值类型不能错
      uuid_token: getUUID(), // 存储uuid
    };
  },
  actions: {
    async detailList(context, id) {
      let result = await reqDetail(id);
      if (result.code === 200) {
        context.commit("DETAILLIST", result.data);
      }
    },
    // 修改购物车数据也用这个函数
    async addShopCar(context, { skuId, skuNum }) {
      let result = await reqAddShopcar(skuId, skuNum);
      if (result.code == 200) {
        return "ok";
      } else {
        return Promise.reject("fail to shopcart");
      }
    },
  },
  mutations: {
    DETAILLIST(state, value) {
      state.detailList = value;
    },
  },
  getters: {
    categoryView(state) {
      return state.detailList.categoryView || {};
    },
    skuInfo(state) {
      return state.detailList.skuInfo || {};
    },
    spuSaleAttrList(state) {
      return state.detailList.spuSaleAttrList || [];
    },
  },
};
