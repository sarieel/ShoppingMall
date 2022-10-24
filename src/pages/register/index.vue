<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <formblock></formblock>
    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
    </div>
  </div>
</template>

<script>
import formblock from "./form/index.vue";
export default {
  name: "Register",
  components: { formblock },
  setup() {},
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #d4237a;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 25px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 30px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: d4237a;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: d4237a;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 25px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #d4237a;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
        border: 0;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;
    border-top: 1px solid #e6e6e6;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>