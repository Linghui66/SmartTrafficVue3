<template>
  <div class="homePageHeader" :style="{ height: height }">
    <!-- 顶端左侧搜索 -->
    <div class="headerLeft">
      <HeaderLeftInput></HeaderLeftInput>
    </div>
    <span
      class="title"
      :style="{
        'font-size': Math.round(screenWidth / 70) + 'px',
      }"
      >光谷智慧交通可视化平台</span
    >
    <!-- 导航栏右侧 -->
    <div class="headerRight">
      <HeaderRightUse></HeaderRightUse>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 左面的组件
import HeaderLeftInput from "./components/HeaderLeftInput.vue";
// 右面的组件
import HeaderRightUse from "./components/HeaderRightUse.vue";
// 从父组件中引入过来的高度参数
const props = defineProps({
  navHeight: Number,
  navScreenWidth: Number,
});

const height = ref("");
const screenWidth = ref("");
height.value = `${props.navHeight}px`;
screenWidth.value = props.navScreenWidth;
</script>

<style lang="scss" scoped>
.homePageHeader {
  position: relative;
  top: 0.5vw;
  width: 100%;
  background: url("/src/assets/images/title.png") no-repeat;
  background-size: 100%;
  text-align: center;
  margin-left: 0;
  display: flex;
  justify-content: space-between;
  .headerLeft {
    display: flex;
    align-items: center;
    margin-left: 2%;
  }
  .title {
    position: absolute;
    left: 42.5%;
    margin-top: 0.4%;
  }
  .headerRight {
    display: flex;
    align-items: center;
    margin-right: 2%;
  }
}

// 标题自定义修改
</style>
