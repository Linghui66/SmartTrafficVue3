<template>
  <!-- 实现测量工具 -->
  <div demo-bg>
    <dv-border-box8 :dur="5">
      <div dv-bg @click="clearDraw" class="delDraw">清除Draw</div>
    </dv-border-box8>
  </div>

  <!-- 自定义弹窗 -->
  <div demo-bg>
    <dv-border-box8>
      <div dv-bg id="popup">111</div>
    </dv-border-box8>
  </div>
</template>

<script setup>
// 需要引入mapboxGl
import { BorderBox7 as DvBorderBox7 } from "@kjgl77/datav-vue3";
import mapboxGl from "mapbox-gl";
import { inject, onMounted, ref } from "vue";
let $map = null;
var draw = null;

// 清除画笔
function clearDraw() {
  if (draw) {
    draw.deleteAll();
    $("#popup").hide();
  }
}

onMounted(() => {
  $map = inject("$map");
  draw = new MapboxDraw({
    //不允许使用键盘交互绘制
    keybindings: false,
    //设置为ture，可按住shift+拉框来拾取图形
    boxSelect: true,
    //点击要素时的响应半径（像素单位）
    clickBuffer: 5,
    //默认控件显示方式。如果设置为true，则会添加所有的绘图控件
    displayControlsDefault: false,
    //添加指定的绘制控件
    controls: {
      //绘制线控件
      line_string: true,
      //绘制多边形控件
      polygon: true,
    },
  });

  //将绘制控件添加到左上角
  $map.addControl(draw, "top-left");
  $map.on("draw.create", handleDraw);
  function handleDraw(e) {
    let drawType = e.features[0].geometry.type; // 判断是什么工具画的
    if (drawType === "LineString") {
      // 测量长度
      let data = e.features[0].geometry.coordinates;
      /* turf测算长度  -km */
      let line = turf.lineString(data);
      var length = turf.length(line, { units: "miles" });
      // 转化为千米
      const lengthInKm ="长度：" +
        turf.convertLength(length, "miles", "kilometers").toFixed(2) + "千米";
      /* 将面积使用popup显示到中心点 */
      let p = $map.project(data[0]);
      // 经纬度转化屏幕
      $("#popup").show().text(lengthInKm);
    } else {
      // 测量面积
      let data = e.features[0];
      /* turf测算面积  -平方米 */
      let area = "面积：" + (turf.area(data) / 1000).toFixed(2) + "平方米";
      /* 将面积使用popup显示到中心点 */
      let center = turf.center(data).geometry.coordinates;
      // 经纬度转化屏幕
      let p = $map.project(center);
      $("#popup").show().text(area);
    }
  }
});
</script>

<style lang="scss" scoped>
// .delDraw {
//   text-align: center;
//   font-size: 13px;
//   padding: 2px;
//   cursor: pointer;
// }
#popup {
  position: fixed;
  top: 25px;
  left: -790px;
  background-color: white;
  color: black;
  padding: 3px;
  border-radius: 3px;
  text-align: center;
  z-index: 1000;
  display: none;
}
</style>