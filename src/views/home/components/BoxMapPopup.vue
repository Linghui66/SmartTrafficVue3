<template>
    <div>
        <div id="popup">
            <button id="close">x</button>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl';
import { onMounted, inject, ref } from "vue"
import MP4 from "../../../assets/images/车流.mp4"
import { useCounterStore } from "../../../stores/index"
const mainStore = useCounterStore()
const { getSeesion,popUPId } = mainStore
let $map = null
onMounted(() => {
    $map = inject('$map')
    $map.doubleClickZoom.disable()
    $map.getCanvas().style.cursor = "Default";
    // console.log($map.getSource('eventLayer')._data,33333);

    if (getSeesion().type !== "common") {
        //警务处图层
        $map.on("click", "policeOfficeLayer", evt => {
            console.log($map.getSource('eventLayer'), 33333);
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                console.log(feature, 6565);
                let content = `<div style="color:black; width:140px;" >名称：${feature.名称}<br>
                               位置：${feature.位置}<br>
                               空闲警员数：${feature.空闲警员数}</div>`;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })

        //监控图层
        $map.on("click", "cameraLayer", evt => {
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                console.log(feature, 6565);
                let content = `<div style="color:black;">编号：${feature.编号}<br>
                            位置：${feature.位置}<br>
                            监控画面：<br/>
                            <video autoplay style="height:100px">
                            <source src="${MP4}" type="video/mp4">
                            </video></div>`;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })



        //事件处理状态 0 图层
        $map.on("click", "eventLayer", evt => {
            if (evt) {
                console.log(evt.features, 456789);
                let feature = JSON.parse(evt.features[0].properties.values_)
                popUPId(evt.features[0].id)
                let content = `<div style="color:black;">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br>
                            事件编号：${feature.事件编号}<br/>
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            车牌号：${feature.车牌号}<br/>
                            驾驶员：${feature.驾驶员}<br/>
                            处理状态：${states(feature.处理状态)} <br/>
                            </div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
        //事件处理状态 1 图层
        $map.on("click", "eventLayer1", evt => {
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                popUPId(evt.features[0].id)
                console.log(evt, 6565);
                let content = `<div style="color:black;">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br>
                            事件编号：${feature.事件编号}<br/>
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            车牌号：${feature.车牌号}<br/>
                            驾驶员：${feature.驾驶员}<br/>
                            处理状态：${states(feature.处理状态)} <br/>
                            </div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
        //事件处理状态 2 图层
        $map.on("click", "eventLayer2", evt => {
            console.log($map.getLayoutProperty("eventLayer2", "icon-image"), 77777);
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                //pinia ID
                popUPId(evt.features[0].id)
                console.log(feature, 6565);
                let content = `<div style="color:black; ">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br>
                            事件编号：${feature.事件编号}<br/>
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            车牌号：${feature.车牌号}<br/>
                            驾驶员：${feature.驾驶员}<br/>
                            处理状态：${states(feature.处理状态)} <br/>
                            </div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                }).setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
    }
    else {
        //事件处理状态 0 图层
        $map.on("click", "eventLayer", evt => {
            if (evt) {
                console.log(evt, 456789);
                let feature = JSON.parse(evt.features[0].properties.values_)

                let content = `<div style="color:black;">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br>
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            处理状态：${states(feature.处理状态)}<br/></div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
        //事件处理状态 1 图层
        $map.on("click", "eventLayer1", evt => {
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                console.log(feature, 6565);
                let content = `<div style="color:black;">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br>
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            处理状态：${states(feature.处理状态)}<br/></div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                })
                    .setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
        //事件处理状态 2 图层
        $map.on("click", "eventLayer2", evt => {
            console.log($map.getLayoutProperty("eventLayer2", "icon-image"), 77777);
            if (evt) {
                let feature = JSON.parse(evt.features[0].properties.values_)
                console.log(feature, 6565);
                let content = `<div style="color:black; ">事件等级：${feature.事件等级}<br>
                            事件类型：${feature.事件类型}<br> 
                            发生地点：${feature.发生地点}<br/>
                            发生时间：${feature.发生时间}<br/>
                            处理状态：${states(feature.处理状态)}<br/>
                            </div>
                            `;
                let center = evt.features[0].geometry.coordinates;
                let popup = new mapboxgl.Popup({
                    closeButton: false, // 是否显示关闭按钮
                }).setHTML(content)
                    .setLngLat(center)
                    .addTo($map);
            }

        })
    }
});

// 判断事件处理状态值
function states(str) {
    if (str === "0") {
        return `<span style="color:blue;">已处理</span>`
    } else if (str === "1") {
        return `<span style="color:green;">正在处理</span>`
    } else {
        return `<span style="color:red;">待处理</span>`
    }
}
</script>

<style lang="scss" scoped>
#popup {
    width: 200px;
    height: 50px;
    border: 1px solid #666;
    border-radius: 30px;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 200;
    background-color: #fff;
    display: none;
}
</style>