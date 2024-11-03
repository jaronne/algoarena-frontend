<template>
  <div id="userLoginView">
    <h1 class="title-1">AlgoArena</h1>
    <h2 class="title-2">用户登录</h2>
    <a-form
      class="form"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px">
            登录
          </a-button>
          <a-link href="/user/register">新用户注册</a-link>
        </div>
      </a-form-item>
    </a-form>
    <a-link class="return" href="/">返回首页</a-link>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();
/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登录失败，" + res.message);
  }
};
</script>

<style>
#userLoginView .title-1 {
  margin-bottom: 50px;
}

#userLoginView .form {
  max-width: 480px;
  margin: 0 auto;
  width: 100%; /* 使表单宽度自适应 */
  padding: 20px; /* 添加内边距 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background-color: #fff; /* 表单背景颜色 */
}

#userLoginView .return {
  margin-top: 20px;
}
</style>
