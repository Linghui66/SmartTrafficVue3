<template>
<!-- 实现实时交通 -->
  <div demo-bg>
    <dv-border-box8 :dur="5">
      <div dv-bg class="getroad" @click="getRoad">实时路况</div>
    </dv-border-box8>
  </div>
</template>

<script setup>
import { BorderBox8 as DvBorderBox8 } from "@kjgl77/datav-vue3";
import { inject, onMounted } from "vue";
// 引入实时交通的方法
import { getRealTimeTraffic } from "../hooks/boxMapTrafficFlow";

let $map = null;
// 是否显示
let show = false;
onMounted(() => {
  $map = inject("$map");
});
// 实现实时路况的改变
const getRoad = () => {
  show = !show;
  getRealTimeTraffic($map, show);
};
</script>

<style lang="scss" scoped>
// .getroad {
//   font-size: 13px;
//   padding: 2px;
//   text-align: center;
//   cursor: pointer;
// }
</style>