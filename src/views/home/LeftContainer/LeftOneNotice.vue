<template>
  <div class="leftOneContainer">
    <el-carousel
      ref="refLeft"
      :style="{ height: height + 'px' }"
      :interval="10000"
    >
      <el-carousel-item
        v-for="item in noticeData"
        :key="item.id"
        :style="{ height: height + 'px' }"
      >
        <h2 class="noticeName" text="2xl">{{ item.noticeName }}</h2>
        <h5 class="noticeTime">
          {{ item.noticeTime }}&nbsp;此公告持续{{ item.noticeSurvivalDay }}天
        </h5>
        <h4 class="noticeInfo">{{ item.noticeInfo }}</h4>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref
} from "vue";
import { getMockHttp } from "../../../request/MockNoticeRequest/index";
const refLeft = ref();
const noticeData = ref([]);

// 高宽自适应模块
const height = ref();
const screenHeight = ref(
  window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
);
let screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);
const getScreenHeight = () => {
  screenHeight.value =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // 四舍五入取整数
  height.value = Math.round(screenHeight.value * 0.43);
};
const getScreenWidth = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
};
const resizeScreen = () => {
  getScreenHeight();
  getScreenWidth();
};
onBeforeMount(() => {
  
  // 移除页面大小改变时触发事件
  window.removeEventListener("resize", getScreenHeight);
  // 高度自适应
  height.value = Math.round(screenHeight.value * 0.43);
});

let timer = null;
let getNoticeInfo = () => {
  timer = setInterval(async () => {
    const res = await getMockHttp();
    for (let i = 0; i < res.length; i++) {
      if (res[i].isOnline) {
        let exists = noticeData.value.some((obj) => obj.id === res[i].id);
        if (!exists) {
          noticeData.value.push(res[i]);
        }
      }
    }
  }, 2000);
};
onMounted(() => {
  getNoticeInfo();
  //生命周期内部高宽自适应模块
  getNoticeInfo();
  window.removeEventListener("resize", getScreenHeight);
  window.removeEventListener("resize", getScreenWidth);
  resizeScreen();

});
// onActivated(() => {
//   console.log("start");
//   getNoticeInfo();
// });

// onDeactivated(() => {
//   console.log("end");
//   clearInterval(timer);
// });
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.leftOneContainer {
  word-wrap: break-word;
  .noticeName {
    text-align: center;
    margin-top: 0.7em;
  }
  .noticeTime {
    text-align: center;
    margin-top: 1em;
  }
  .noticeInfo {
    margin-top: 1em;
    padding-left: 1em;
    padding-right: 1em;
    text-indent: 2em;
    line-height: 2em;
    overflow: hidden; /* 隐藏超出div框的文字 */
    text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
  }
}
</style>
