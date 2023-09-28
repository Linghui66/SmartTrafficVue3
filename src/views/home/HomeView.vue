<template>
  <div class="homePageBox" id="homeIndex">
    <!-- 加载loading动画 -->
    <dv-loading v-if="loading" :style="{ 'font-weight': 'bold' }">Loading...</dv-loading>
    <!-- 总体布局 -->
    <div class="homePageBodyBox">
      <!-- 头部部分 -->
      <div v-if="isShow" class="navBox">
        <HeaderIndex :navHeight="navHeight" :navScreenWidth="navScreenWidth"></HeaderIndex>
      </div>
      <!-- 内容布局使用 element layout -->
      <div class="homPageLayout">
        <el-row>
          <el-col :span="6">
            <div :style="{ height: params.height.YHLeftOne + 'px' }"
              class="leftNotice animate__animated animate__backInDown">
              <dv-border-box-12 style="padding: 12px">
                <LeftOneNotice></LeftOneNotice>
              </dv-border-box-12>
            </div>

            <div :style="{ height: params.height.YHLeftTwo + 'px' }" class="animate__animated animate__backInUp">
              <dv-border-box-12 style="padding: 12px">
                <LeftTwoChart></LeftTwoChart>
              </dv-border-box-12>
            </div>
          </el-col>

          <el-col :span="12">
            <div :style="{ height: params.height.YHCenterOne + 'px' }" id="btnSave">
              <dv-border-box-12 style="padding: 12px">
                <!-- <centerchart1></centerchart1> -->
                <div v-if="isShow" class="map-box">
                  <BoxMapInit :mapHeight="mapHeight"></BoxMapInit>
                  <BoxMapJson></BoxMapJson>
                  <MapBoxTurf :loading="loading"></MapBoxTurf>
                  <BoxMapControl :loading="loading"></BoxMapControl>
                  <BoxMapPopup></BoxMapPopup>

                  <BoxMapThreeD></BoxMapThreeD>
                  <BoxMapLineAnimation></BoxMapLineAnimation>
                  <BoxMapPullSearch></BoxMapPullSearch>
                </div>
              </dv-border-box-12>
            </div>
          </el-col>

          <el-col :span="6">
            <div :style="{ height: params.height.YHRightOne + 'px' }" class="animate__animated animate__rotateInDownLeft">
              <dv-border-box-12 style="padding: 12px">
                <div v-if="isShow">
                  <BoxMapVhangeLayer></BoxMapVhangeLayer>
                  <BoxMapTrafficFlow></BoxMapTrafficFlow>
                  <BoxMapHeat></BoxMapHeat>
                  <BoxMapMeasure></BoxMapMeasure>
                  <BoxMapAddEvent></BoxMapAddEvent>
                  <TrafficDeletEvent></TrafficDeletEvent>
                </div>
              </dv-border-box-12>
            </div>
            <div :style="{ height: params.height.YHRightTwo + 'px' }" class="animate__animated animate__rotateInDownLeft">
              <dv-border-box-12 style="padding: 12px; text-align: center;  ">
                <!-- <rightchart2></rightchart2> -->
                <div v-if="isShow">
                  <TrafficAddEvent></TrafficAddEvent>

                </div>
                <div v-if="getSeesion().type == 'common' ">
                  <RightTuwCard></RightTuwCard>
                </div>
              </dv-border-box-12>
            </div>
            <div :style="{ height: params.height.YHRightThree + 'px' }"
              class="animate__animated animate__rotateInDownLeft">
              <dv-border-box-12 style="padding: 12px">
                <div v-if="isShow">
                  <RightEchart></RightEchart>
                </div>
              </dv-border-box-12>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, watch, h, ref } from "vue";
// 引入 ElementPlus 的 ElNotification 消息提示
import { ElNotification } from "element-plus";
//引入组件
import BoxMapInit from "./components/BoxMapInit.vue";
import BoxMapJson from "./components/BoxMapJson.vue";
import BoxMapControl from "./components/BoxMapControl.vue";
import BoxMapPopup from "./components/BoxMapPopup.vue";
import BoxMapAddEvent from "./components/BoxMapAddEvent.vue";
import TrafficAddEvent from "./components/Traffic/TrafficAddEvent.vue"
import TrafficDeletEvent from "./components/Traffic/TrafficDeletEvent.vue"

import BoxMapVhangeLayer from "./components/BoxMapChangeLayer.vue";
import BoxMapTrafficFlow from "./components/BoxMapTrafficFlow.vue";
import BoxMapMeasure from "./components/BoxMapMeasure.vue";
import BoxMapHeat from "./components/BoxMapHeat.vue";
import BoxMapThreeD from "./components/BoxMapThreeD.vue";
import BoxMapLineAnimation from "./components/BoxMapLineAnimation.vue";
import RightEchart from "./components/RightEchart/RightEchart.vue";
import RightTuwCard from "./components/RightTuwCard.vue"

import BoxMapPullSearch from "./components/BoxMapPullSearch.vue"
import MapBoxTurf from "./components/MapBoxTurf.vue";
import HeaderIndex from "./Header/HeaderIndex.vue";
import { useCounterStore } from "../../stores";
import { storeToRefs } from "pinia";
const counterStore = useCounterStore();
const loading = ref(true);
let { getSeesion } = counterStore;
let bufferShowing = ref(true);
// import {getSeesion} from './hooks/getSessionHook'
import LeftOneNotice from "./LeftContainer/LeftOneNotice.vue";
import LeftTwoChart from "./LeftContainer/LeftTwoChart.vue";
// 只用来放置对象和数组，
const params = reactive({
  timer: {
    loadingTimer: null,
  },
  screen: {
    // 获取浏览器可视区域高度（包含滚动条）、
    // 获取浏览器可视区域高度（不包含工具栏高度）、
    // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的)
    screenHeight:
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight,
    screenWidth:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
  },
  height: {
    YHtitlePng: null,
    YHLeftOne: null,
  },
});

onMounted(() => {
  cancelLoading();
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenHeight, false);
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenWidth, false);
  // 鼠标移动时触发
  // window.addEventListener('mousemove',getHeight, false);

  // 自适应屏幕宽高定时器
  resizeScreen();

  // 页面刷新时获取临时会话的用户数据
  getSeesion();
});
onBeforeUnmount(() => {
  // 清除时间定时器
  clearInterval(params.timer.dateTimer);
  params.timer.dateTimer = null;
  // 清除loading定时器
  clearInterval(params.timer.loadingTimer);
  params.timer.loadingTimer = null;
  // 清除自适应屏幕宽高定时器
  clearInterval(params.timer.koiTimer);
  params.timer.koiTimer = null;
  // 移除页面大小改变时触发事件
  window.removeEventListener("resize", getScreenHeight);
  // 移除页面大小改变时触发事件
  window.removeEventListener("resize", getScreenWidth);
  clearInterval(params.timer.loadingTimer);
  params.timer.loadingTimer = null;
});
watch(
  () => [params.screen.screenWidth, params.screen.screenHeight],
  (newVal, oldVal) => {
    // 此时返回的是数组,按下标获取对应值
    // console.log(newVal[0]);
    // console.log(newVal[1]);
    if (newVal[0] <= 1200) {
      ElNotification({
        title: "浏览器高度提示",
        message: h(
          "i",
          { style: "color: teal" },
          "浏览器宽度<1200px自适应效果减弱"
        ),
        type: "warning",
        position: "bottom-right",
        duration: 2000,
      });
    }

    if (newVal[1] <= 700) {
      ElNotification({
        title: "浏览器宽度提示",
        message: h(
          "strong",
          { style: "color: teal" },
          "浏览器高度<700px自适应效果减弱"
        ),
        type: "warning",
        position: "bottom-right",
        duration: 2000,
      });
    }
    isShow.value = true;
  }
);
let isShow = ref(false);
const cancelLoading = () => {
  params.timer.loadingTimer = setTimeout(() => {
    loading.value = false;
  }, 1000);
};
let echartShow = ref(false);

// div自适应设置屏幕大小
const resizeScreen = () => {
  getScreenHeight();
  getScreenWidth();
  isShow.value = true;
  echartShow.value = true;
  echartShow.value = true;
};

//定义mapbox高度 mapHeight
const mapHeight = ref("");
const navHeight = ref("");
const navScreenWidth = ref("");
// 获取浏览器高度进行自适应
const getScreenHeight = () => {
  let screenHeight = (params.screen.screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight);
  // 四舍五入取整数
  params.height.YHtitlePng = Math.round(screenHeight * 0.07);
  params.height.YHLeftOne = Math.round(screenHeight * 0.46);
  params.height.YHLeftTwo = Math.round(screenHeight * 0.46);
  params.height.YHCenterOne = Math.round(screenHeight * 0.92);
  params.height.YHRightOne = Math.round(screenHeight * 0.3);
  params.height.YHRightTwo = Math.round(screenHeight * 0.29);
  params.height.YHRightThree = Math.round(screenHeight * 0.33);
  mapHeight.value = params.height.YHCenterOne;
  navHeight.value = params.height.YHtitlePng;
};

// 字体大小根据宽度自适应
const getScreenWidth = () => {
  const screenWidth = (params.screen.screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth);
  navScreenWidth.value = params.screen.screenWidth;
};
</script>

<style lang="scss" scoped>
.tree-button {
  position: fixed;
  top: 200px;
  right: 480px;
  z-index: 4000;
  background: #fff;
  margin-right: 5px;
  border-radius: 5px;

  i {
    color: #0f0f0f;
    padding: 6px;
  }
}

.turf {
  // position: fixed;
  // margin-top: 50px;
  // left:0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
}

//home布局容器样式
.homePageBodyBox {

  // 头部布局
  .homePageHeader {
    position: relative;
    top: 0.5vw;
    width: 100%;
    background: url("../../assets/images/title.png") no-repeat;
    background-size: 100%;
    text-align: center;
    margin: 0;
  }

  // 标题自定义修改
  .title {
    position: absolute;
    left: 46%;
    margin-top: 0.4%;
  }
}

.leftNotice {
  overflow: hidden;
  /* 隐藏超出div框的文字 */
  text-overflow: ellipsis;
}

.animate__animated {
  animation-duration: 5s;
}
</style>
