<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>shopping mall欢迎您！</p>
          <p v-if="!username">
            <span>请</span>
            <router-link to="/login">
              <a href="###">登录</a>
            </router-link>
            <router-link to="/register">
              <a href="###" class="register">免费注册</a>
            </router-link>
          </p>
          <p v-if="username">
            <a>{{ username }}，你好</a>
            <a href="" class="register" @click.prevent="logout">退出登陆</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的shopping mall</a>
          <a href="###">shopping mall会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注shopping mall</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom" v-if="route.path !== '/register'">
      <h1 class="logoArea">
        <router-link to="/home">
          <a class="logo" title="shopping mall" href="###" target="_blank">
            <img src="./images/logo.png" alt="" />
          </a>
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="searchTest"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "MyHeader",
  // setup在beforeCreate前执行，this为undefined，且context无法调用到$router，所以决定使用vue2语法（一开始），后来偶然在官方文档里看到了解决方案：
  setup() {
    let searchTest = ref(""); //搜索框内容
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    // 跳转至search页面
    function goSearch() {
      let location = {
        name: "Search",
        params: { keyword: searchTest.value },
      };
      if (route.query) {
        location.query = route.query;
      }
      router.push(location);
    }
    //获取用户信息，不能对生命周期函数使用async|await，所以封装函数
    async function getUserInfo() {
      await store.dispatch("user/getUserInfo");
    }
    const instance = getCurrentInstance();
    const bus = instance.appContext.config.globalProperties.$bus;
    // 全局事件总线
    onMounted(() => {
      bus.on("clear", () => {
        searchTest.value = "";
      });
      getUserInfo(); //获取用户信息
    });
    // 登出
    async function logout() {
      try {
        await store.dispatch("user/logoutUser");
        alert("已退出登录");
        router.push("/home");
      } catch (error) {
        alert(error);
      }
    }
    let username = computed(() => store.state.user.userInfo.loginName);
    return { route, searchTest, goSearch, username, logout };
  },
};
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #d4237a;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #d4237a;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>>