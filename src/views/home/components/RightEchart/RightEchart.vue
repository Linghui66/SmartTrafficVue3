<template>
  <div>
    <div>
      <div
        class="colorGrass font-bold margin-l"
        :style="{ 'font-size': Math.round(YFOne * 1.1) + 'px' }"
      >
        实时车流量
      </div>
    </div>
    <div>
      <dv-capsule-chart
        :config="config"
        :style="{
          height: YHOne + 'px',
          width: Math.round(YWOne * 0.22) + 'px',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  inject,
  ref,
  onBeforeMount,
  onUnmounted,
  reactive,
} from "vue";

import { getMapgisLayer } from "../../hooks/getMapgisLaterByName.js";
// 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
// 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
// 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
let screenHeight = ref(
  window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
);
let screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
);
// 浏览器高度
let YHOne = ref();
// 浏览器宽度
let YWOne = ref();
// 浏览器字体大小
let YFOne = ref();
// 自适应浏览器获取宽高大小定时器
const screenTimer = ref();

let $map = null;
// 热力图名称
let chartGeoJsonData = null;
const config = reactive({
  data: [{}],
  showValue: true,
});
onBeforeMount(() => {
  YHOne.value = Math.round(screenHeight.value * 0.3);
});
onMounted(() => {
  $map = inject("$map");
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenHeight);
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenWidth);
  // 鼠标移动时触发
  //window.addEventListener('mousemove',getHeight, false);
  // 自适应浏览器获取宽高大小定时器
  resizeScreen();
  // 获取接口数据
  getData();

  getDataTimer();
});
onUnmounted(() => {
  // 清除自适应屏幕定时器
  clearInterval(screenTimer.value);
  screenTimer.value = null;
  // 页面大小改变时触发销毁
  window.removeEventListener("resize", getScreenHeight, false);
  // 页面大小改变时触发销毁
  window.removeEventListener("resize", getScreenWidth, false);
});
// 自适应浏览器获取宽高大小定时器
const resizeScreen = () => {
  screenTimer.value = setInterval(() => {
    getScreenHeight();
    getScreenWidth();
  }, 200);
};
// 获取浏览器高度进行自适应
const getScreenHeight = () => {
  screenHeight.value =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // 四舍五入取整数
  YHOne.value = Math.round(screenHeight.value * 0.3);
  //console.log("高度->"+screenHeight +"-"+ YHOne);
};

// 字体大小根据宽度自适应
const getScreenWidth = () => {
  screenWidth.value =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  // 浏览器字体计算
  YFOne.value = Math.round(screenWidth.value / 100);
  // 浏览器宽度宽度
  YWOne.value = screenWidth.value;
  //console.log("宽度->"+screenWidth);
};
const getData = () => {
  chartGeoJsonData = getMapgisLayer($map, "roadLayer", "heatMapGeoJsonData");
  // console.log(chartGeoJsonData.features, "chartGeoJsonData");
  let features = chartGeoJsonData.features;
  let roadTraffic = {};
  // 遍历原始数组
  features.forEach((feature) => {
    let { geometry, properties } = feature;
    let { type: geometryType } = geometry;
    if (geometryType === "LineString") {
      // 对于每个Feature，我们需要做的是将其属性（properties）中的"道路名称"和"车流量"提取出来，然后将它们添加到新的数组中
      let { 道路名称: roadName, 车流量: traffic } = properties;

      // 如果roadName在roadTraffic中已存在，那么将traffic加到对应的值上
      // 否则，在roadTraffic中新增一个条目，键为roadName，值为traffic
      if (roadTraffic[roadName]) {
        roadTraffic[roadName] += parseInt(traffic);
      } else {
        roadTraffic[roadName] = parseInt(traffic);
      }
    }
  });

  // 将roadTraffic对象转化为数组，并赋值给config.data
  config.data = Object.keys(roadTraffic).map((key) => ({
    name: key,
    value: roadTraffic[key],
  }));
};
const getDataTimer = () => {
  screenTimer.value = setInterval(() => {
    // 执行刷新数据的方法
    getData();
    //console.log("Hello World")
  }, 1500);
};
</script>

<style lang="scss" scoped>
.margin-l {
  margin-left: 35%;
}
</style>
