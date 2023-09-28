<template>
  <div></div>
</template>

<script setup>
import { onMounted, inject } from "vue";
// 去拿道路图层
import { getMapgisLayer } from "../hooks/getMapgisLaterByName";
let $map = null;
// 定义道路变量
let lineAnimationGeoJson = null;
onMounted(() => {
  $map = inject("$map");

  // 定时器开关 获取GeoJSON数据
  setTimeout(async () => {
    lineAnimationGeoJson = await getMapgisLayer(
      $map,
      "roadLayer",
      "lineAnimation"
    );

    // 造汽车
    let carPoint = {
      type: "FeatureCollection",
      features: [],
    };
    lineAnimationGeoJson.features.forEach((item) => {
      carPoint.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: item.geometry.coordinates[0],
        },
      });
    });

    let lineDistance = [];
    for (let i = 0; i < carPoint.features.length; i++) {
      lineDistance.push(turf.length(lineAnimationGeoJson.features[i]));
    }

    let arc = [];
    const steps = 500;

    // 画段落
    var arcCenterParams = [];
    for (let i = 0; i <= lineDistance.length; i++) {
      for (let j = 0; j <= lineDistance[i]; j += lineDistance[i] / steps) {
        let segment = turf.along(lineAnimationGeoJson.features[i], j);
        arcCenterParams.push(segment.geometry.coordinates);
      }
      arc.push(arcCenterParams);
      arcCenterParams = [];
    }

    // 赋值 每一段怎么走
    for (let i = 0; i < lineAnimationGeoJson.features.length; i++) {
      lineAnimationGeoJson.features[i].geometry.coordinates = arc[i];
    }

    let counter = 0;

    // 这里不需要上style.on
    // $map.addSource("route", {
    //   type: "geojson",
    //   data: lineAnimationGeoJson,
    // });
    $map.addSource("carPoint", {
      type: "geojson",
      data: carPoint,
    });
    // $map.addLayer({
    //   id: "route",
    //   source: "route",
    //   type: "line",
    //   paint: {
    //     "line-width": 2,
    //     "line-color": "red",
    //   },
    // });
    $map.addLayer({
      id: "point",
      source: "carPoint",
      type: "symbol",
      layout: {
        "icon-image": "car",
        "icon-size": 2,
        "icon-rotation-alignment": "map", //不是$map
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });

    // 动漫
    function animate() {
      lineAnimationGeoJson.features[0].geometry.coordinates[
        counter >= steps ? counter - 1 : counter
      ];

      lineAnimationGeoJson.features[0].geometry.coordinates[
        counter >= steps ? counter : counter + 1
      ];

      // 各个
      carPoint.features[0].geometry.coordinates =
        lineAnimationGeoJson.features[0].geometry.coordinates[counter];
      carPoint.features[1].geometry.coordinates =
        lineAnimationGeoJson.features[1].geometry.coordinates[counter];
      carPoint.features[2].geometry.coordinates =
        lineAnimationGeoJson.features[2].geometry.coordinates[counter];
      carPoint.features[3].geometry.coordinates =
        lineAnimationGeoJson.features[3].geometry.coordinates[counter];
      carPoint.features[4].geometry.coordinates =
        lineAnimationGeoJson.features[4].geometry.coordinates[counter];
      carPoint.features[5].geometry.coordinates =
        lineAnimationGeoJson.features[5].geometry.coordinates[counter];
      carPoint.features[6].geometry.coordinates =
        lineAnimationGeoJson.features[6].geometry.coordinates[counter];
      carPoint.features[7].geometry.coordinates =
        lineAnimationGeoJson.features[7].geometry.coordinates[counter];
      carPoint.features[8].geometry.coordinates =
        lineAnimationGeoJson.features[8].geometry.coordinates[counter];
      carPoint.features[9].geometry.coordinates =
        lineAnimationGeoJson.features[9].geometry.coordinates[counter];
      carPoint.features[10].geometry.coordinates =
        lineAnimationGeoJson.features[10].geometry.coordinates[counter];
      carPoint.features[11].geometry.coordinates =
        lineAnimationGeoJson.features[11].geometry.coordinates[counter];
      carPoint.features[12].geometry.coordinates =
        lineAnimationGeoJson.features[12].geometry.coordinates[counter];
      carPoint.features[13].geometry.coordinates =
        lineAnimationGeoJson.features[13].geometry.coordinates[counter];
      carPoint.features[14].geometry.coordinates =
        lineAnimationGeoJson.features[14].geometry.coordinates[counter];
      carPoint.features[15].geometry.coordinates =
        lineAnimationGeoJson.features[15].geometry.coordinates[counter];
      carPoint.features[16].geometry.coordinates =
        lineAnimationGeoJson.features[16].geometry.coordinates[counter];
      carPoint.features[17].geometry.coordinates =
        lineAnimationGeoJson.features[17].geometry.coordinates[counter];
      carPoint.features[18].geometry.coordinates =
        lineAnimationGeoJson.features[18].geometry.coordinates[counter];
      carPoint.features[19].geometry.coordinates =
        lineAnimationGeoJson.features[19].geometry.coordinates[counter];
      carPoint.features[20].geometry.coordinates =
        lineAnimationGeoJson.features[20].geometry.coordinates[counter];
      carPoint.features[21].geometry.coordinates =
        lineAnimationGeoJson.features[21].geometry.coordinates[counter];
      carPoint.features[22].geometry.coordinates =
        lineAnimationGeoJson.features[22].geometry.coordinates[counter];
      carPoint.features[23].geometry.coordinates =
        lineAnimationGeoJson.features[23].geometry.coordinates[counter];
      carPoint.features[24].geometry.coordinates =
        lineAnimationGeoJson.features[24].geometry.coordinates[counter];
      carPoint.features[25].geometry.coordinates =
        lineAnimationGeoJson.features[25].geometry.coordinates[counter];
      carPoint.features[26].geometry.coordinates =
        lineAnimationGeoJson.features[26].geometry.coordinates[counter];
      carPoint.features[27].geometry.coordinates =
        lineAnimationGeoJson.features[27].geometry.coordinates[counter];
      $map.getSource("carPoint").setData(carPoint);

      if (counter < steps) {
        requestAnimationFrame(animate);
      }

      counter = counter + 1;

      // 汽车一值跑起来的处理
      if (counter >= steps) {
        counter = 0;
      }
    }

    animate(counter);
  }, 8000);
});
</script>

<style lang="scss" scoped>
</style>