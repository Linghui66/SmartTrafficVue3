<template>
  <div></div>
</template>

<script setup>
import { inject, onMounted, watch, ref } from "vue";
import { Query } from "../../../utils/query"
import red from "/src/assets/images/red.png"
import look from "../../../assets/images/look.png"
import policeman from "../../../assets/images/Policeman.png"
import green from "../../../assets/images/green.png"
import blue from "../../../assets/images/blue.png"
//导入pinia状态管理
import { useCounterStore } from "../../../stores/index";
import { storeToRefs } from "pinia";

const mainStore = useCounterStore();
const { changeEchart, layerCollect, getGeoJSON } = mainStore;

// import { success } from "./Hooks/loadGisSuccsee";
let $map = null;

// 加载mapGIS数据
const MapGISLayer = new Zondy.Map.Doc("", "guanggu", {
  // crossOrigin: "Anonymous"
});

// function success(data) {
//   console.log(data);
//   var format = new Zondy.Format.PolygonJSON();
//   //将MapGIS要素JSON反序列化为ol.Feature类型数组
//   var features = format.read(data);

//   //第一步：将数组转化为GeoJSON格式
//   const geoJsonFormat = new ol.format.GeoJSON();
//   const geoJsonString = geoJsonFormat.writeFeatures(features);

//   //第二部：geoJsonString 转换为json对象格式
//   const geojsonFeatures = JSON.parse(geoJsonString);

//   $map.addLayer({
//     id: "road-layer",
//     source: {
//       type: "geojson",
//       data: geojsonFeatures,
//     },
//     type: "fill",
//     paint: {
//       "fill-color": "#ff2d51",
//     },
//   });
// }


onMounted(async () => {
    $map = inject("$map");

    // 将mapGISLayer准备加入
    await $map.on("style.load", () => {

        // 添加第一个图层
        Query.queryByLayer({
            service: {
                name: "guanggu",
                layerId: "0",
            },
            success(data) {
                var format = new Zondy.Format.PolygonJSON();
                //将MapGIS要素JSON反序列化为ol.Feature类型数组
                var features = format.read(data);

        //第一步：将数组转化为GeoJSON格式
        const geoJsonFormat = new ol.format.GeoJSON();
        const geoJsonString = geoJsonFormat.writeFeatures(features);

        //第二部：geoJsonString 转换为json对象格式
        const geojsonFeatures = JSON.parse(geoJsonString);
        const layer = {
          id: "houseLayer",
          source: {
            type: "geojson",
            data: geojsonFeatures,
          },
          type: "fill",
          paint: {
            "fill-color": "pink",
            "fill-opacity": 0.2,
          },
          "z-index": 10,
        };
        $map.addLayer(layer);
        const datas = geojsonFeatures.features[0].geometry;
        // console.log(datas,"uy");
        layerCollect(layer);
      },
    });
    // 添加第二个图层
    Query.queryByLayer({
      service: {
        name: "guanggu",
        layerId: "1",
      },
      success(data) {
        // console.log(data, "fgfgygj");
        var format = new Zondy.Format.PolygonJSON();
        //将MapGIS要素JSON反序列化为ol.Feature类型数组
        var features = format.read(data);

        //第一步：将数组转化为GeoJSON格式
        const geoJsonFormat = new ol.format.GeoJSON();
        const geoJsonString = geoJsonFormat.writeFeatures(features);
        // console.log(geoJsonString,"wwwww");
        //第二部：geoJsonString 转换为json对象格式
        const geojsonFeatures = JSON.parse(geoJsonString);
        // console.log(geojsonFeatures, 9999777);
        const layer = {
          id: "roadLayer",
          source: {
            type: "geojson",
            data: geojsonFeatures,
          },
          type: "line",
          paint: {
            // "line-color": "rgba(124, 231, 253,0.5)",
            "line-color": "rgba(255, 255, 255,0.8)",
            "line-width": 8,
          },
          "z-index": 5,
        };
        $map.addLayer(layer);
        layerCollect(layer);
      },
    });
    // 添加第三个图层
    Query.queryByLayer({
      service: {
        name: "guanggu",
        layerId: "2",
      },
      success(data) {
        var format = new Zondy.Format.PolygonJSON();
        //将MapGIS要素JSON反序列化为ol.Feature类型数组
        var features = format.read(data);

        //第一步：将数组转化为GeoJSON格式
        const geoJsonFormat = new ol.format.GeoJSON();
        const geoJsonString = geoJsonFormat.writeFeatures(features);
        // console.log(geoJsonString,"rrrttt");
        //第二部：geoJsonString 转换为json对象格式
        const geojsonFeatures = JSON.parse(geoJsonString);
        //echarts数据
        changeEchart(geojsonFeatures);

        //第三部获取事件处理状态
        // 处理状态 0
        // console.log(geojsonFeatures.features.filter((item) => { return item.properties.values_.处理状态 === "0" }), 22222);
        const stateZoreList = {
          type: "FeatureCollection",
          features: geojsonFeatures.features.filter((item) => {
            return item.properties.values_.处理状态 === "0";
          }),
        };
        $map.loadImage(blue, (error, image) => {
          if (error) throw error;
          $map.addImage("blue", image);
          const layer = {
            id: "eventLayer",
            source: {
              type: "geojson",
              data: stateZoreList,
            },
            type: "symbol",
            layout: {
              "icon-image": "blue",
              "icon-size": 0.6,
            },
          };
          $map.addLayer(layer);
          layerCollect(layer);
        });

        //处理状态 1
        const stateOneList = {
          type: "FeatureCollection",
          features: geojsonFeatures.features.filter((item) => {
            return item.properties.values_.处理状态 === "1";
          }),
        };
        $map.loadImage(green, (error, image) => {
          if (error) throw error;
          $map.addImage("green", image);
          const layer = {
            id: "eventLayer1",
            source: {
              type: "geojson",
              data: stateOneList,
            },
            type: "symbol",
            layout: {
              "icon-image": "green",
              "icon-size": 0.6,
            },
            "z-index": 1000,
          };
          $map.addLayer(layer);
          layerCollect(layer);
        });

                //处理状态 2
                const stateTowList = { type: "FeatureCollection", features: geojsonFeatures.features.filter((item) => { return item.properties.values_.处理状态 === "2" }) }
                $map.loadImage(red, (error, image) => {
                    if (error) throw error;
                    $map.addImage('red', image);
                    const layer={
                      id: "eventLayer2",
                       source: {
                           type: "geojson",
                           data: stateTowList,
                       },
                       type: "symbol",
                       layout: {
                           "icon-image": "red",
                           "icon-size": 0.6,
                       }
                    }
                    $map.addLayer(layer);
                    layerCollect(layer)
                });

            }

        })
      
    
    
    // 添加第四个图层
    Query.queryByLayer({
      service: {
        name: "guanggu",
        layerId: "3",
      },
      success(data) {
        var format = new Zondy.Format.PolygonJSON();
        //将MapGIS要素JSON反序列化为ol.Feature类型数组
        var features = format.read(data);

                //第一步：将数组转化为GeoJSON格式
                const geoJsonFormat = new ol.format.GeoJSON();
                const geoJsonString = geoJsonFormat.writeFeatures(features);
                // console.log(geoJsonString,"mmmmm");
                //第二部：geoJsonString 转换为json对象格式
                const geojsonFeatures = JSON.parse(geoJsonString);
                $map.loadImage(look, (error, image) => {
                    if (error) throw error;
                    $map.addImage("look", image);
                    const layer={
                      id: "cameraLayer",
                      source: {
                          type: "geojson",
                          data: geojsonFeatures,
                      },
                      type: "symbol",
                      layout: {
                          "icon-image": "look",
                          "icon-size": 0.3,
                      }
                    }
                    $map.addLayer(layer);
                    layerCollect(layer);

                })
    
            },
    });
    // 添加第五个图层
    Query.queryByLayer({
      service: {
        name: "guanggu",
        layerId: "4",
      },
      success(data) {
        var format = new Zondy.Format.PolygonJSON();
        //将MapGIS要素JSON反序列化为ol.Feature类型数组
        var features = format.read(data);

        //第一步：将数组转化为GeoJSON格式
        const geoJsonFormat = new ol.format.GeoJSON();
        const geoJsonString = geoJsonFormat.writeFeatures(features);

        //第二部：geoJsonString 转换为json对象格式
        const geojsonFeatures = JSON.parse(geoJsonString);
        // console.log(geojsonFeatures, 4444444444);
        getGeoJSON(geojsonFeatures)
        $map.loadImage(policeman, (error, image) => {
          if (error) throw error;
          $map.addImage("policeman", image);
          const layer = {
            id: "policeOfficeLayer",
            source: {
              type: "geojson",
              data: geojsonFeatures,
            },
            type: "symbol",
            layout: {
              "icon-image": "policeman",
              "icon-size": 0.4,
            },
          };
          $map.addLayer(layer);
          layerCollect(layer);
        });
      },
    });
  });
});
</script>

<style lang="scss" scoped></style>
