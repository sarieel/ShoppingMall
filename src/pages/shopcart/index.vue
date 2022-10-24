<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="c in cartInfoList" :key="c.id">
          <!-- 勾选框 -->
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="c.isChecked == 1"
              @change="updateStatic(c, $event)"
            />
          </li>
          <!-- 产品介绍 -->
          <li class="cart-list-con2">
            <img :src="c.imgUrl" />
            <div class="item-msg">
              {{ c.skuName }}
            </div>
          </li>
          <!-- 产品单价 -->
          <li class="cart-list-con4">
            <span class="price">{{ c.skuPrice }}</span>
          </li>
          <!-- 产品数量 -->
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="changeNum('down', -1, c)"
            >
              -
            </a>
            <!-- 这里的value只能单向绑定 -->
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="c.skuNum"
              @change="changeNum('change', $event.target.value * 1, c)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="changeNum('up', 1, c)"
            >
              +
            </a>
          </li>
          <!-- 产品总价 -->
          <li class="cart-list-con6">
            <span class="sum">{{ parseInt(c.skuNum * c.skuPrice) }}</span>
          </li>
          <!-- 产品操作 -->
          <li class="cart-list-con7">
            <a
              href="#none"
              class="sindelet"
              @click.prevent="deleteProduct(c.skuId)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked"
          @change="updateAllStatic($event)"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click.prevent="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择<span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价(不含运费): </em>
          <i class="summoney">{{ totalSum }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade"> 结算 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import throttle from "lodash/throttle";

export default {
  name: "ShopCart",
  setup() {
    const store = useStore();
    // 加载购物车数据
    function getData() {
      store.dispatch("shopcart/getShopcart");
    }
    // 挂载时加载数据
    onMounted(() => {
      getData();
    });
    let shopcartList = computed(() => store.getters["shopcart/shopcartList"]); //对象
    let cartInfoList = computed(() => shopcartList.value.cartInfoList || []); //数组
    // 计算购物车总价
    let totalSum = computed(() => {
      let sum = 0;
      cartInfoList.value.forEach((c) => {
        sum += c.skuPrice * c.skuNum;
      });
      return sum;
    });
    // 购物车全选
    let isAllChecked = computed(() => {
      return cartInfoList.value.every((c) => c.isChecked == 1);
    });
    // 改变商品数量【节流】
    // 1、判断情况（删/减/改）确定变化值  2、向服务器发送修改数据请求，请求成功后，发送更新页面数据的请求
    let changeNum = throttle(async function (type, num, cart) {
      let disNum = 0;
      switch (type) {
        case "down":
          // 数量大于1才可以减少
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "up":
          disNum = 1;
          break;
        case "change":
          if (isNaN(num) || num <= 0) {
            disNum = 0;
          } else {
            disNum = parseInt(num) - cart.skuNum; //输入框内容单向绑定，只能在vue中改变，所以cart.skuNum为修改前的值
          }
          break;
      }
      try {
        await store.dispatch("detail/addShopCar", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        getData();
      } catch (error) {
        alert(error);
      }
    }, 500);
    // 删除商品
    async function deleteProduct(skuId) {
      try {
        await store.dispatch("shopcart/getNewShopcart", skuId);
        getData();
      } catch (error) {
        alert(error);
      }
    }
    // 切换商品状态
    async function updateStatic(c, event) {
      try {
        await store.dispatch("shopcart/checkProduct", {
          skuId: c.skuId,
          isChecked: event.target.checked ? 1 : 0,
        });
        getData();
      } catch (error) {
        alert(error);
      }
    }
    // 删除全部选中商品
    async function deleteAllChecked() {
      try {
        await store.dispatch("shopcart/deleteCheckedProduct");
        getData();
      } catch (error) {
        alert(error.message);
      }
    }
    // 点击全选
    async function updateAllStatic(event) {
      let isChecked = event.target.checked ? 1 : 0;
      try {
        await store.dispatch("shopcart/checkAllProduct", isChecked);
        getData();
      } catch (error) {
        alert(error);
      }
    }
    return {
      shopcartList,
      cartInfoList,
      totalSum,
      isAllChecked,
      changeNum,
      deleteProduct,
      updateStatic,
      deleteAllChecked,
      updateAllStatic,
    };
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;
      border-bottom: 0px solid #000;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            height: 17px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            height: 17px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        display: inline-block;
        vertical-align: middle;
        padding-left: 5px;
        height: 18px;
      }

      input {
        vertical-align: middle;
        height: 18px;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        height: 18px;
        color: #666;
      }
    }

    .money-box {
      float: right;
      padding: 10px;

      .chosed {
        line-height: 18px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 18px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #d4237a;
          // font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #d4237a;
          overflow: hidden;
        }
      }
    }
  }
}
</style>