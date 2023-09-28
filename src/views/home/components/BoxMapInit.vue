<template>
  <!-- 设置map的高度 -->
  <div id="map" :style="{ height: height }"></div>
</template>

<script setup>
import mapboxGl from "mapbox-gl";
import { onMounted, ref, watch } from "vue";
import { app } from "../../../main";

mapboxGl.accessToken = import.meta.env.VITE_TOKEN;
const props = defineProps({
  mapHeight: Number,
  count: Number,
});
/* map 高度变量 */
const height = ref("");
height.value = `${props.mapHeight - 22}px`;

onMounted(() => {
  const map = new mapboxGl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/dark-v11", // style URL
    projection: "globe",
    preserveDrawingBuffer:true
    // wrapX: false,
    // crossOrigin: "Anonymous"//设置数据源跨域
  });
  map.flyTo({
    center: [114.38, 30.49],
    zoom: 13,
    pitch: 40,
    bearing: -40,
    speed: 1,
  });

  //获取mapbox

  map.on("style.load", () => {
    map.setFog({});
  });
  app.provide("$map", map);

});
// watch(props.mapHeight, (newvalue) => {
//     console.log(newvalue);
//     height.value = `${newvalue - 20}px`
//     console.log(height);
// }, { deep: true })
</script>

<style scoped>
#map {
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  /* height: 95vh; */
}
</style>
