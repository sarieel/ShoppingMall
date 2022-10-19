import { reqFloors } from "@/api";

export default {
  // 通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  // 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。
  namespaced: true,
  state() {
    return {
      floors: [],
    };
  },
  actions: {
    async FloorsLists(context) {
      let result = await reqFloors();
      if (result.code === 200) {
        context.commit("FLOORSLISTS", result.data);
      }
    },
  },
  mutations: {
    FLOORSLISTS(state, value) {
      state.floors = value;
    },
  },
  getters: {},
};
