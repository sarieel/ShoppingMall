import { reqShopcart, updateShopcart, changeProductStatic } from "@/api/index";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,

  state() {
    return {
      shopcartList: [],
    };
  },

  actions: {
    // 获得购物车数据
    async getShopcart(context) {
      let result = await reqShopcart();
      if (result.code === 200) {
        context.commit("GETSHOPCART", result.data);
      }
    },
    // 删除部分商品
    async getNewShopcart(context, skuId) {
      let result = await updateShopcart(skuId);
      if (result.code === 200) {
        return result.ok;
      } else {
        return Promise.reject("fail to delete");
      }
    },
    // 切换商品选中状态
    async checkProduct(context, { skuId, isChecked }) {
      let result = await changeProductStatic(skuId, isChecked);
      if (result.code === 200) {
        return result.ok;
      } else {
        return Promise.reject("fail to change isChecked");
      }
    },
    // 删除全部选中商品
    async deleteCheckedProduct(context) {
      let promiseList = [];
      let cartInfoList = context.getters.cartInfoList; // 为啥cartInfoList变成对象了？？
      for (const key in cartInfoList) {
        let promise =
          cartInfoList[key].isChecked == 1
            ? await context.dispatch("getNewShopcart", cartInfoList[key].skuId)
            : "";
        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    },
    // 全选所有商品
    async checkAllProduct(context, isCheckedNum) {
      let promiseList = [];
      let cartInfoList = context.getters.cartInfoList; // 为啥cartInfoList变成对象了？？
      for (const key in cartInfoList) {
        let promise =
          cartInfoList[key].isChecked != isCheckedNum
            ? await context.dispatch("checkProduct", {
                skuId: cartInfoList[key].skuId,
                isChecked: isCheckedNum,
              })
            : "";
        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    },
  },

  mutations: {
    GETSHOPCART(state, value) {
      state.shopcartList = value;
    },
  },

  getters: {
    shopcartList(state) {
      return state.shopcartList[0] || {};
    },
    cartInfoList(state) {
      return state.shopcartList[0].cartInfoList || [];
    },
  },
};
