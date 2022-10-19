import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store/index"; //注意这里不是useStore...

// 引入路由组件
import Home from "@/pages/homepage/index";
import Login from "@/pages/login/index";
import Register from "@/pages/register/index";
import Search from "@/pages/search/index";
import Detail from "@/pages/detail/index";
import Addcartsuccess from "@/pages/addcartsuccess/index";
import Shopcart from "@/pages/shopcart/index";
import Trade from "@/pages/trade/index";
import Pay from "@/pages/pay/index";
import Paysuccess from "@/pages/paysuccess/index";
import Center from "@/pages/center/index";
import MyOrder from "@/pages/center/myorder/index";
import GroupOrder from "@/pages/center/grouporder/index";
// 配置路由器
let router = createRouter({
  history: createWebHashHistory(),
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
  // 配置路由
  routes: [
    {
      path: "/home",
      component: Home,
      meta: { isShow: true },
    },
    {
      path: "/login",
      component: Login,
      meta: { isShow: false },
    },
    {
      path: "/register",
      component: Register,
      meta: { isShow: false },
    },
    {
      name: "Search",
      // 问号表示可以没有params参数
      path: "/search/:keyword?",
      component: Search,
      meta: { isShow: true },
    },
    {
      name: "Detail",
      path: "/detail/:productId",
      component: Detail,
      meta: { isShow: true },
    },
    {
      name: "Addcartsuccess",
      path: "/addcartsuccess/:skuNum",
      component: Addcartsuccess,
      meta: { isShow: false },
    },
    {
      name: "Shopcart",
      path: "/shopcart",
      component: Shopcart,
      meta: { isShow: false },
    },
    {
      name: "Trade",
      path: "/trade",
      component: Trade,
      meta: { isShow: false },
      // 路由独享守卫
      beforeEnter: (to, from, next) => {
        if (from.path == "/shopcart") {
          next();
        } else {
          router.push(from.path);
          next();
        }
      },
    },
    {
      name: "Pay",
      path: "/pay/:tradeNo",
      component: Pay,
      meta: { isShow: false },
      beforeEnter: (to, from, next) => {
        if (from.path == "/trade") {
          next();
        } else {
          router.push(from.path);
          next();
        }
      },
    },
    {
      name: "Paysuccess",
      path: "/Paysuccess",
      component: Paysuccess,
      meta: { isShow: false },
      //组件内路由的前置守卫，没有组合式API版本
      beforeEnter: (to, from, next) => {
        if (from.path == "/pay") {
          next();
        } else {
          router.push(from.path);
          next();
        }
      },
    },
    {
      name: "Center",
      path: "/center",
      component: Center,
      meta: { isShow: false },
      // 二级路由组件
      children: [
        {
          path: "myorder",
          component: MyOrder,
        },
        {
          path: "grouporder",
          component: GroupOrder,
        },
        {
          // 重定向
          path: "/center",
          redirect: "/center/myorder",
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
    },
  ],
});

// 全局路由前置守卫
router.beforeEach(async (to, from, next) => {
  let token = store.state.user.token;
  let name = store.state.user.userInfo.name;
  // 1、已登录时
  if (token) {
    // 1-1 不能进入登录界面
    if (to.path == "/login") {
      router.push("/home"); //啊啊啊啊啊，这里promise会报错，不能直接写next('/home')
      next();
    } else {
      if (name) {
        next();
      } else {
        // 1-2 进入其他界面时，如果没有用户信息，需要重新加载
        try {
          await store.dispatch("user/getUserInfo");
          next();
        } catch (error) {
          // 1-3 如果token失效，需要重新登录
          await store.dispatch("user/logoutUser");
          router.push("/login");
          next();
        }
      }
    }
  } else {
    // 2、未登录时
    if (
      // 2-1 不能进入交易、付款页面和个人中心（-1的布尔值为true
      to.path.indexOf("/trade") == -1 &&
      to.path.indexOf("/pay") == -1 &&
      to.path.indexOf("/center") == -1
    ) {
      next();
    } else {
      router.push("/login");
      next();
    }
  }
});

export default router;
