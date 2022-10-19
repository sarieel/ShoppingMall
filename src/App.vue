<template>
  <myheader></myheader>
  <router-view></router-view>
  <myfooter v-show="$route.meta.isShow"></myfooter>
</template>

<script>
// 组件名不能和html标签名重复
import myheader from "./components/header/index";
import myfooter from "./components/footer/index";
import { onMounted } from "vue";
import { useStore } from "vuex";
export default {
  components: { myheader, myfooter },
  name: "App",
  // 为优化资源配置，在app.vue中发送请求（只会请求一次）
  setup() {
    let store = useStore();
    onMounted(() => {
      store.dispatch("typenav/CategoryList");
      store.dispatch("bannerblcok/bannerImgs");
    });
  },
};
</script>
