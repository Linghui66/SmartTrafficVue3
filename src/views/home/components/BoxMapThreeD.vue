<template>
  <div></div>
</template>

<script setup>
import wuhanBuildings from '../../../data/wuhan.json'
import { onMounted, inject } from "vue";
let $map = null;

onMounted(() => {
  // 注入map
  $map = inject("$map");
  // 使用自己建造的GeoJSON数据加载房屋
  $map.on("style.load",() => {
    $map.addLayer({
      id: "threeDLayer",
      source: {
        type: "geojson",
        data: wuhanBuildings,
      },
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": ["get", "Color"],
        "fill-extrusion-height": ["get", "Elevation"],
        "fill-extrusion-opacity": 0.6,
      },
    });
  })
  });
</script>

<style lang="scss" scoped>
</style>