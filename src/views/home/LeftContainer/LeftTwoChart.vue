<template>
  <div ref="refChart" :style="{ height: charHeight + 'px' }"></div>
</template>

<script setup>
import * as echarts from "echarts";
import skin from "../../../assets/theme/skin";
import { ref, onBeforeMount, onUnmounted, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCounterStore } from "../../../stores/index";
const counterStore = useCounterStore();
let { echartData } = storeToRefs(counterStore);

let allData = ref(null);
let refChart = ref();
// 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
// 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
// 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
const charHeight = ref();
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
const getScreenHeight = () => {
  screenHeight.value =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // 四舍五入取整数
  charHeight.value = Math.round(screenHeight.value * 0.43);
};

// 字体大小根据宽度自适应
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
// tootip定时器ID-用于清除定时器
const tootipTimer = ref();

// 初始化图表对象
let chartInstance = ref();
const chartEventData = ref();

onBeforeMount(() => {
  charHeight.value = Math.round(screenHeight.value * 0.43);
});
const screenAdapter = () => {
  let titleFontSize = (refChart.value.offsetWidth / 100) * 2;
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: Math.round(titleFontSize * 2),
      },
    },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: Math.round(titleFontSize * 1.2),
      },
    },
  };
  // 图标自适应变化配置
  chartInstance.value.setOption(adapterOption);
  chartInstance.value.resize();
};
onMounted(() => {
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenHeight, false);
  // 页面大小改变时触发
  window.addEventListener("resize", getScreenWidth, false);
  // 鼠标移动时触发
  //window.addEventListener('mousemove',getHeight, false);
  resizeScreen();
  // 初始化统计报表对象
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  // 图表初始化
  initChart();
  // 获取接口数据
  getData();
  // 开启图表自适应
  window.addEventListener("resize", screenAdapter);
  screenAdapter();
  // Tootip刷新定时器
  getTootipTimer();
});

const getData = () => {
  setTimeout(() => {
    let eventCounts = {};
    for (let feature of echartData.value) {
      let eventType = feature.properties.values_["事件类型"];
      if (!eventCounts[eventType]) {
        eventCounts[eventType] = 0;
      }
      eventCounts[eventType]++;
    }
    allData.value = Object.keys(eventCounts)
      .map((key) => ({
        value: eventCounts[key],
        name: key,
      }))
      .sort((a, b) => b.value - a.value);
  }, 800);
  setTimeout(() => {
    updateChart();
  }, 850);
};

const updateChart = () => {
  // 处理图表需要的数据
  const dataOption = {
    series: [
      {
        data: allData.value,
      },
    ],
  };
  // 图表数据变化配置
  chartInstance.value.setOption(dataOption);
};
const initChart = () => {
  // 覆盖默认主题
  echarts.registerTheme("myTheme", skin);
  // 定义实例
  chartInstance.value = echarts.init(refChart.value, "myTheme");
  const initOption = {
    title: {
      text: "交通事故统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "交通事故",
        type: "pie",
        // 环形图大小
        radius: ["45%", "70%"],
        // 环形图位置
        center: ["56%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
          formatter: "{d}%", // 当前百分比
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };
  // 图表初始化配置
  chartInstance.value.setOption(initOption);

  // 鼠标移入停止定时器
  chartInstance.value.on("mouseover", () => {
    clearInterval(tootipTimer.value);
  });

  // 鼠标移入启动定时器
  chartInstance.value.on("mouseout", () => {
    getTootipTimer();
  });
};

onUnmounted(() => {
  // 页面大小改变时触发
  window.removeEventListener("resize", getScreenHeight);
  // 页面大小改变时触发
  window.removeEventListener("resize", getScreenWidth);
  window.removeEventListener("resize", screenAdapter);
  // 销毁Echarts图表
  chartInstance.value.dispose();
  chartInstance.value = null;

  // 清除tootip刷新定时器
  clearInterval(tootipTimer.value);
  tootipTimer.value = null;
});
// 定时器
const getTootipTimer = () => {
  let index = 0; // 播放所在下标
  tootipTimer.value = setInterval(() => {
    // echarts实现定时播放tooltip
    chartInstance.value.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: index,
    });
    index++;
    if (index > allData.value.length) {
      index = 0;
    }
  }, 2000);
};
</script>

<style lang="scss" scoped></style>
