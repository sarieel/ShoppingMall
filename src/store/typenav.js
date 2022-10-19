import { reqCategoryList } from "@/api/index";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,
  state() {
    return {
      categorylist: [],
    };
  },
  actions: {
    async CategoryList(context) {
      let result = await reqCategoryList();
      if (result.code === 200) {
        context.commit("CATEGORYLIST", result.data);
      }
    },
  },
  mutations: {
    CATEGORYLIST(state, value) {
      state.categorylist = value;
    },
  },
  getters: {},
};
