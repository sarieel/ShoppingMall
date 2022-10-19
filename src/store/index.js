// vue3新语法，不能再用Vue.use(vuex)
import { createStore } from "vuex";
import typenav from "./typenav";
import bannerblcok from "./bannerblcok";
import floorslist from "./floorslist";
import search from "./search";
import detail from "./detail";
import shopcart from "./shopcart";
import user from "./user";
import trade from "./trade";

export default createStore({
  // modules是复数...
  modules: {
    typenav,
    bannerblcok,
    floorslist,
    search,
    detail,
    shopcart,
    user,
    trade,
  },
});
