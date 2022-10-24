<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <!-- 地址 -->
      <div class="address clearFix" v-for="a in userAddressList" :key="a.id">
        <span
          class="username"
          :class="{ selected: a.isDefault == 1 }"
          @click="changeDefault(a, userAddressList)"
          >{{ a.consignee }}</span
        >
        <p @click="changeDefault(a, userAddressList)">
          <span class="s1">{{ a.fullAddress }}</span>
          <span class="s2">{{ a.phoneNum }}</span>
          <span class="s3" v-show="a.isDefault == 1">默认地址</span>
        </p>
      </div>
      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left: 5px">货到付款</span>
      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="detail">
        <h5>商品清单</h5>
        <ul class="list clearFix" v-for="d in detailArrayList" :key="d.skuId">
          <li>
            <img :src="d.imgUrl" alt="" />
          </li>
          <li id="two">
            <p>{{ d.skuName }}</p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{ d.orderPrice }}</h3>
          </li>
          <li>X{{ d.skuNum }}</li>
          <li>有货</li>
        </ul>
      </div>
      <!-- 商品备注 -->
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea
          placeholder="建议留言前先与商家沟通确认"
          class="remarks-cont"
          v-model="msg"
        ></textarea>
      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b>
            <i>{{ totalNum }}</i>
            件商品，总商品金额
          </b>
          <span>¥{{ totalAmount }}</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <!-- 订单总价与收件地址 -->
    <div class="trade">
      <div class="price">
        应付金额:　<span>¥{{ totalAmount }}</span>
      </div>
      <div class="receiveInfo" v-if="defaultAddress">
        寄送至:
        <span>{{ defaultAddress.fullAddress }}</span>
        收货人：<span>{{ defaultAddress.consignee }}</span>
        <span>{{ defaultAddress.phoneNum }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a class="subBtn" @click.prevent="submitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//获取当前组建实例
import { computed, onMounted, ref, getCurrentInstance } from "vue";

export default {
  name: "Trade",
  setup() {
    // 在setup函数中获取实例对象并定义bus
    const instance = getCurrentInstance();
    const API = instance.appContext.config.globalProperties.$API;
    const router = useRouter();
    const store = useStore();
    onMounted(() => {
      // 获取trade数据
      store.dispatch("trade/getTradeList");
    });
    let userAddressList = computed(
      () => store.getters["trade/userAddressList"]
    );
    let totalAmount = computed(() => store.getters["trade/totalAmount"]);
    let totalNum = computed(() => store.getters["trade/totalNum"]);
    let tradeNo = computed(() => store.getters["trade/tradeNo"]);
    let detailArrayList = computed(
      () => store.getters["trade/detailArrayList"]
    );
    // 默认地址值
    let defaultAddress = computed(() => {
      let address = userAddressList.value;
      for (let k in address) {
        if (address[k].isDefault == 1) {
          return address[k];
        }
      }
    });
    // 点击改变默认地址
    function changeDefault(a, address) {
      //computed返回值不能修改...所以必须传参数address。
      for (let key in address) {
        address[key].isDefault = 0;
      }
      a.isDefault = 1;
    }
    // 提交订单
    async function submitOrder() {
      let data = {
        consignee: defaultAddress.value.consignee,
        consigneeTel: defaultAddress.value.phoneNum,
        deliveryAddress: defaultAddress.value.fullAddress,
        paymentWay: "ONLINE",
        orderComment: msg.value,
        orderDetailList: detailArrayList.value,
      };
      try {
        let result = await API.reqSubmitOrder(tradeNo.value, data);
        if (result.code == 200) {
          router.push(`/pay/${result.data}`); //传递订单号
        }
      } catch (error) {
        alert("提交失败");
        console.log(error);
      }
    }
    let msg = ref("");
    return {
      userAddressList,
      totalAmount,
      totalNum,
      tradeNo,
      detailArrayList,
      changeDefault,
      defaultAddress,
      msg,
      submitOrder,
    };
  },
};
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
        cursor: pointer;
      }

      .username::after {
        content: "";
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;
        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-between; //两端布局

        li {
          line-height: 30px;

          img {
            width: 85px;
            height: 85px;
          }
          p {
            margin-bottom: 20px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {
            color: #e12228;
          }
        }
        #two {
          width: 450px;
        }
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px "微软雅黑";
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;
    }
  }
}
</style>