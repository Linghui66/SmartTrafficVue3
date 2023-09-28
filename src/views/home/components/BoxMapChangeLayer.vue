<template>
  <!-- 实现切换图层 -->
  <div demo-bg>
    <h2 class="tools">Tools</h2>
    <dv-border-box8 :dur="5">
      <div dv-bg class="changelayer" @click="changeLayer">切换地图</div>
    </dv-border-box8>
  </div>
</template>

<script setup>
import { BorderBox8 as DvBorderBox8 } from "@kjgl77/datav-vue3";
import { inject, onMounted } from "vue";
let $map = null;
// 两种地图样式
const light = "mapbox://styles/mapbox/dark-v11";
const night = "mapbox://styles/mapbox/satellite-v9";
let change = true;
onMounted(() => {
  $map = inject("$map");
});
// 切换图层的方法
const changeLayer = () => {
  change = !change;
  if (!change) {
    $map.setStyle(night);
  } else {
    $map.setStyle(light);
  }
};
</script>

<style lang="scss" scoped>
.tools{
  text-align: center;
  margin-bottom:10px;
}
// .changelayer {
//   text-align: center;
//   cursor: pointer;
//   font-size: 13px;
//   padding: 2px;
// }
</style>