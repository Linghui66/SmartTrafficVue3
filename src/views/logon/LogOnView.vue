<!-- 使用须知：要在本机运行后台，才能正常登录 !!!
  后台下载网址 https://gitee.com/woshiaaaa/smart-transportation-backend.git
  vs-code打开
  打开终端
  pnpm i
  pnpm install -g nodemon
  pnpm dev
-->
<template>
  <div class="log-item">
    <!--如果!register，显示登录卡片  -->
    <div v-if="!register">
      <login-page :register="register" @add="add"></login-page>
    </div>
    <!-- 如果register为true显示注册卡片 -->
    <div v-else>
      <register-card
        :register="register"
        @add="add"
        :key="cardId"
      ></register-card>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useCounterStore } from "../../stores/index";
import LoginPage from "./components/LoginPage.vue";
import RegisterCard from "./components/RegisterCard.vue";
const counterStore = useCounterStore();
// register的值为假显示登录页面，为真显示注册页面，初始值设为假显示登录页面
let register = ref(false);
const cardId = ref(1);
let {time}=storeToRefs(counterStore)
// 通过修改 register的值，实现登录卡片和注册卡片之间的切换
function add() {
  register.value = !register.value;
}
</script>

<style lang="scss" scoped>
.log-item {
  width: 100vw;
  height: 100vh;
  background-color: rgb(3, 0, 19);
  background-image: url("../../assets/images/bg1.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
