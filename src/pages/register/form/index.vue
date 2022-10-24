<template>
  <el-form
    label-position="top"
    style="width: 400px; margin: 100px auto 150px"
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    class="demo-ruleForm"
    :size="formSize"
    :status-icon="true"
    :show-message="true"
  >
    <!-- 手机号 -->
    <el-form-item label="手机号" prop="phone" :required="true">
      <el-input style="width: 300px" v-model="ruleForm.phone" />
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item label="验证码" prop="authcode" :required="true">
      <el-input style="width: 300px" v-model.number="ruleForm.authcode" />
      <el-button style="margin-left: 10px" type="danger" plain @click="getCode"
        >点击发送</el-button
      >
    </el-form-item>
    <!-- 密码 -->
    <el-form-item label="设置密码" prop="pass" :required="true">
      <el-input
        style="width: 300px"
        v-model="ruleForm.pass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <!-- 确认密码 -->
    <el-form-item label="确认密码" prop="checkPass" :required="true">
      <el-input
        style="width: 300px"
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <!-- 提交按钮 -->
    <el-form-item>
      <el-button type="primary" plain @click="submitForm(ruleFormRef)"
        >提交注册</el-button
      >
      <el-button plain @click="resetForm(ruleFormRef)">清空所填内容</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { useStore } from "vuex";
import { reactive, ref } from "vue";
export default {
  name: "Form",
  setup() {
    const store = useStore();
    // 获取验证码
    async function getCode() {
      try {
        // 必须填写手机号才可以发送请求
        ruleForm.phone &&
          (await store.dispatch("user/getCode", ruleForm.phone));
        ruleForm.authcode = store.state.user.registerCode; //自动填上验证码
      } catch (error) {
        alert(error);
      }
    }
    async function completeRegister() {
      try {
        if (password.value == password1.value && isAgree.value && phone.value) {
          await store.dispatch("user/registerUser", {
            phone: phone.value,
            pwd: password.value,
            code: code.value,
          });
          router.push("/login");
        } else {
          alert("输入有误");
        }
      } catch (error) {
        alert(error);
      }
    }
    const formSize = ref("default"); //	用于控制该表单内组件的尺寸
    const ruleFormRef = ref("");

    // ‘密码’验证规则
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (ruleForm.checkPass !== "") {
          if (!ruleFormRef.value) return;
          ruleFormRef.value.validateField("checkPass", () => null);
        }
        callback();
      }
    };

    // ‘确认密码’验证规则
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== ruleForm.pass) {
        callback(new Error("请确认密码一致"));
      } else {
        callback();
      }
    };

    // ‘手机号’验证规则
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!value.match(/^\d{11}$/)) {
        callback(new Error("请输入11位手机号"));
      } else {
        callback();
      }
    };
    // ‘验证码’验证规则
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };

    const ruleForm = reactive({
      phone: "",
      authcode: "",
      pass: "",
      checkPass: "",
    });

    const rules = reactive({
      pass: [{ validator: validatePass, trigger: "blur" }],
      checkPass: [{ validator: validatePass2, trigger: "blur" }],
      phone: [{ validator: validatePhone, trigger: "blur" }],
      authcode: [{ validator: validateCode, trigger: "blur" }],
    });

    const submitForm = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const resetForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const options = Array.from({ length: 10000 }).map((_, idx) => ({
      value: `${idx + 1}`,
      label: `${idx + 1}`,
    }));

    return {
      getCode,
      ruleForm,
      formSize,
      ruleFormRef,
      rules,
      submitForm,
      resetForm,
      options,
      completeRegister,
    };
  },
};
</script>

<style scoped>
</style>