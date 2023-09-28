<template>
  <!-- 实现热力图组件 -->
  <div>
    <div demo-bg>
      <dv-border-box8 :dur="5">
        <div dv-bg class="heatmap" @click="appearHeatMap">路况热力图</div>
      </dv-border-box8>
    </div>
  </div>
</template>

<script setup>
import { BorderBox8 as DvBorderBox8 } from "@kjgl77/datav-vue3";
import { onMounted, ref, inject } from "vue";
// 引入造GeoJSON数据的方法
import { getMapgisLayer } from "../hooks/getMapgisLaterByName";
let $map = null;

// 热力图名称
let heatMapGeoJsonData = null;

// 获取$map
onMounted(() => {
  $map = inject("$map");
});
// 定义热力图的方法
const appearHeatMap = async () => {
  if (!heatMapGeoJsonData) {
    // 获取要素
    heatMapGeoJsonData = await getMapgisLayer(
      $map,
      "roadLayer",
      "heatMapGeoJsonData"
    );
    // 将车流量数据变为number类型
    heatMapGeoJsonData.features.forEach((i) => {
      i.properties["车流量"] = +i.properties["车流量"] / 2000;
    });
    // 造图层
    $map.addSource("heatMap", {
      type: "geojson",
      data: heatMapGeoJsonData,
    });
    // 热力图加载到地图上
    $map.addLayer({
      id: "heatMap",
      type: "heatmap",
      source: "heatMap",
      minzoom: 10,
      maxzoom: 15,
      paint: {
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(0, 0, 255, 0)",
          0.1,
          "purple",
          0.2,
          "blue",
          0.3,
          "green",
          0.4,
          "yellow",
          0.6,
          "red",
        ],
        "heatmap-radius": 20,
        "heatmap-opacity": 0.8,
      },
    });
  } else {
    // 先移除图层再移除源
    $map.removeLayer("heatMap");
    $map.removeSource("heatMap");
    heatMapGeoJsonData = null
  }
};
</script>

<style lang="scss" scoped>
.heatmap {
  padding: 2px;
  text-align: center;
  cursor: pointer;
}
</style>