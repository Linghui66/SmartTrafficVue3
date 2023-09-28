<template>
  <div>
    <div :class="isShow ? 'show' : 'noShow'">
      <canvas id="canvas" class="canvas"></canvas>
    </div>

    <button
      class="pullSearch animate__animated animate__rotateInDownLeft"
      @click="pSearch"
    >
      <div demo-bg>
        <dv-border-box8 :dur="5">
          <div dv-bg>拉框查询</div>
        </dv-border-box8>
      </div>
    </button>

    <!-- 渲染 -->
    <el-dialog v-model="dialogTableVisible" title="拉框查询事件" align="center">
      <el-table :data="eventPoint" align="center">
        <el-table-column
          property="properties.事件类型"
          label="事件类型"
          width="200"
          align="center"
        />
        <el-table-column
          property="properties.发生地点"
          label="发生地点"
          width="200"
          align="center"
        />
        <el-table-column
          property="properties.发生时间"
          label="发生时间"
          width="200"
          align="center"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, inject, ref } from "vue";
import { getMapgisLayer } from "../hooks/getMapgisLaterByName";
import { ElMessage } from "element-plus";
let $map = null;

// 集合的事故点
let eventPoint = ref([]);

// 运用在turf 中的参考位置
let canvasCoordinate;

// canvas显示与否
let isShow = ref(false);

var isDrawing = false; // 是否正在绘制
var startX, startY; // 拉框起始坐标
var endX, endY; // 拉框结束坐标
var ctx, canvas;

let dialogTableVisible = ref(false);

// 图层数据
let eventPointOne, eventPointTwo, eventPointThree;

// 绘制矩形
function drawRect(ctx, x1, y1, x2, y2) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = "green";
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  ctx.stroke();
}

const performQuery = (startX, startY, endX, endY) => {
  eventPoint.value = [];

  let leftShang = $map.unproject([startX, startY]);
  let rightXia = $map.unproject([endX, endY]);
  let oneCoordinates = [leftShang.lng, leftShang.lat];
  let twoCoordinates = [leftShang.lng, rightXia.lat];
  let threeCoordinates = [rightXia.lng, leftShang.lat];
  let fourCoordinates = [rightXia.lng, rightXia.lat];
  canvasCoordinate = [
    oneCoordinates,
    twoCoordinates,
    threeCoordinates,
    fourCoordinates,
    oneCoordinates,
  ];
  // console.log(canvasCoordinate);

  // turf三维数组
  var polygon = turf.polygon([canvasCoordinate]);

  eventPointOne.features.forEach((item) => {
    if (turf.booleanPointInPolygon(item.geometry.coordinates, polygon)) {
      eventPoint.value.push(item);
    }
  });
  eventPointTwo.features.forEach((item) => {
    if (turf.booleanPointInPolygon(item.geometry.coordinates, polygon)) {
      eventPoint.value.push(item);
    }
  });
  eventPointThree.features.forEach((item) => {
    if (turf.booleanPointInPolygon(item.geometry.coordinates, polygon)) {
      eventPoint.value.push(item);
    }
  });

  // console.log(eventPoint.value);
};
// turf里面查询符合条件的事故点
const pSearch = () => {
  isShow.value = !isShow.value;
  if (isShow.value) {
    ElMessage.success({
      message: "请拉框查询",
      duration: 1000,
    });
  } else {
    ElMessage.warning({
      message: "关闭CANVAS",
      duration: 1000,
    });
  }

  // 监听鼠标按下事件
  canvas.addEventListener("mousedown", function (e) {
    // e.preventDefault();
    startX = e.clientX - canvas.offsetLeft - 420;
    startY = e.clientY - canvas.offsetTop - 60;
    isDrawing = true;
  });

  // 监听鼠标移动事件
  canvas.addEventListener("mousemove", function (e) {
    e.preventDefault();
    if (!isDrawing) return;
    drawRect(
      ctx,
      startX,
      startY,
      e.clientX - canvas.offsetLeft - 420,
      e.clientY - canvas.offsetTop - 60
    );
  });

  // 监听鼠标松开事件
  canvas.addEventListener("mouseup", function (e) {
    e.preventDefault();
    endX = e.clientX - canvas.offsetLeft - 420;
    endY = e.clientY - canvas.offsetTop - 60;
    isDrawing = false;

    performQuery(startX, startY, endX, endY);
    if (eventPoint.value.length === 0) {
      ElMessage.error({
        message: "查无有",
        duration: 1000,
      });
    } else {
      dialogTableVisible.value = true;
    }
  });
};

onMounted(() => {
  $map = inject("$map");
  // 创建 Canvas
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = $map.getContainer().offsetWidth;
  canvas.height = $map.getContainer().offsetHeight;

  setTimeout(() => {
    eventPointOne = getMapgisLayer($map, "eventLayer", "eventPointOne");
    eventPointTwo = getMapgisLayer($map, "eventLayer1", "eventPointTwo");
    eventPointThree = getMapgisLayer($map, "eventLayer2", "eventPointThree");
    // console.log(eventPointOne);
    // console.log(eventPointTwo);
    // console.log(eventPointThree);
  }, 10000);
});
</script>

<style lang="scss" scoped>
.noShow {
  display: none;
}
.show {
  display: block;
  z-index: 1000;
}
.pullSearch {
  position: absolute;
  top: 222px;
  right: -427px;
  background-color: rgb(0, 0, 0, 0);
  color: #00cbce;
  border: 0;
  width: 403px;
  height: 30px;
  font-size: 20px;
  outline: none;
  cursor: pointer;
  z-index: 1000;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.animate__animated {
  animation-duration: 5s;
}
</style>