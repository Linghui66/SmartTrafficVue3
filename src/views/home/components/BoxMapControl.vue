<template>
  <div>
    <div id="mouse-position">{{ mouseposition }}</div>

    <!-- 控制图层目录树显示图标 -->
    <div v-if="clientList.type !='common'"> 
      <div class="tree-button" v-if="!showbox" @click="close" v-show="!loading">
   <i class="fa-solid fa-layer-group"></i>
 </div>

    </div>
   
   
   
 <!--    <div class="tree-button" v-if="!showbox" @click="toggleBuffers" v-show="!loading" style="margin-top:40px"> -->
 <!--      <i class="fa-solid fa-building-shield"></i> -->
 <!--    </div> -->
    <!-- 图层目录树 -->
    <div class="tree" v-if="showbox">
      <span class="title">
        <!-- 父级 -->
        <input type="checkbox" class="father" v-model="allLayerVisible" @click="toggleTree" />
        <span @click="close" class="close"><i class="fa-solid fa-xmark"></i>
        </span>
      </span>
      <div class="childBox">
        <!-- 子级 -->
        <div class="child" v-for="item in layerArr" :key="item">
          <span class="child-item" @click="layerVisible">
            <input type="checkbox" class="sub" :checked="item.isVisible" @click="toggleVisible(item)" />
            <p>{{ item.name }}</p>
          </span>
        </div>
      </div>
      
    </div>
    <!-- 下载 -->
    <div id="btnSave">
    </div>
    <el-tooltip content="downloadMap" placement="bottom" effect="light">
      <button id="btn" @click="download"><i class="fa-solid fa-download"></i></button>
    </el-tooltip>
  </div>
</template>

<script setup>
import mapboxgl from "mapbox-gl";
import { onMounted, inject, ref, watch } from "vue";
//导入截图控件依赖
import html2canvas from 'html2canvas';

import { useCounterStore } from "../../../stores/index";
import { storeToRefs } from "pinia";
const props = defineProps({
  loading: Boolean
})

const mainStore = useCounterStore();
let { layerVisible, toggleAllLayer, toggleTreeLayer } = mainStore;
let { visible, layerArr, allLayerVisible,bufferArr,clientList } = storeToRefs(mainStore);
let $map = ref(null);
let showbox = ref(false);
const mouseposition = ref("");
let totalArr=[]
totalArr=[layerArr,bufferArr]
const emit=defineEmits(['toggleBuffer'])
onMounted(() => {
  $map = inject("$map");

  //全屏控件
  $map.addControl(new mapboxgl.FullscreenControl());

  //导航控件
  const nav = new mapboxgl.NavigationControl({
    //是否显示指南针按钮，默认为true
    showCompass: true,
    //是否显示缩放按钮，默认为true
    showZoom: true,
  });
  //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'top-right'
  $map.addControl(nav, "top-left");

  //属性控件
  $map.addControl(
    new mapboxgl.AttributionControl({
      //是否折叠属性信息
      compact: true,
      //自定义属性信息
      customAttribution: ["中地数码", "光谷智慧交通"],
    })
  );

  //鼠标位置
  $map.on("mousemove", function (e) {
    const { lng, lat } = e.lngLat;
    mouseposition.value = `经度:${lng.toFixed(2)},纬度:${lat.toFixed(2)} `;
  });

  //比例尺
  const scale = new mapboxgl.ScaleControl({
    unit: "metric|imperial", //默认为公里
  });
  $map.addControl(scale);
  // $map.addControl(new ExportControl());

  //图层目录树
  $map.on("style.load", () => {
    // console.log($map,666);
    // setTimeout(() => {
      // var layerTotal = $map.getStyle().layers;
      // 监听layerArr数组（来自store的图层数组） 如果layerArr的某个项的isVisible发生变化
      // 则使用 $map.setLayoutProperty控制对应图层的显示或者隐藏
      watch(
        layerArr.value,
        (newValue, oldValue) => {
          if (newValue) {
            newValue.forEach((item) => {
              if (item.isVisible) {
                $map.setLayoutProperty(`${item.id}`, "visibility", "visible");
              } else {
                $map.setLayoutProperty(`${item.id}`, "visibility", "none");
              }
            });
            // 图层目录树父级checkbox 子级每一个都选上时，父级显示true  子级有一个或多个不选，父级显示false
            toggleAllLayer();
          }
        },
        {
          deep: true,
        }
      );
    // }, 2000);
  });


});
// 关闭图层目录树弹窗
function close() {
  showbox.value = !showbox.value;
}
// 图层目录树 子目录勾选（控制所选图层显示或者隐藏）
function toggleVisible(item) {
  layerVisible(item);
  // console.log(item, "uuu");
}
// 图层目录树 总目录勾选（控制全部图层显示或者隐藏）
function toggleTree() {
  toggleTreeLayer();
}
function toggleBuffers(){
  emit("toggleBuffer")
}
// function dwonLoadMap() {
function download() {
  html2canvas(document.getElementById('btnSave')).then(function (canvas) {
    var image = document.createElement('a');
    image.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    // image.href = canvas.toDataURL("image/png");
    image.download = 'map.png';
    image.click();
  });

}


</script>

<style lang="scss" scoped>
.tree-button {
  position: absolute;
  width: 29px;
  height: 29px;
  top: 90px;
  right: 10px;
  z-index: 0;
  background: #fff;
  border-radius: 5px;
  text-align: center;

  i {
    color: #0f0f0f;
    line-height: 29px;
  }
}

.tree {
  position: fixed;
  top: 165px;
  right: 440px;
  z-index: 4000;
  width: 200px;
  height: 300px;

  background: linear-gradient(to top, #051d38b0, #2a72c5b0);
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: rgb(69, 102, 202) 0px 0px 25px 3px inset;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;

  .title {
    display: flex;
    justify-content: space-between;

    .father {
      align-items: left;
      // margin-left: -120px;
    }

    .close {
      i {
        color: #fff;
      }
    }
  }

  .childBox {
    margin-top: 10px;
    overflow: scroll;

    &::-webkit-scrollbar {
      background: linear-gradient(to top, #05101db0, #365170b0);
      width: 8px;
      border-radius: 8px;
    }

    //滚动条整体部分，可以设置宽度，颜色啥的
    // ::-webkit-scrollbar-button //滚动条两端的按钮
    // ::-webkit-scrollbar-track  //外层轨道
    // ::-webkit-scrollbar-track-piece  //内层滚动槽
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(to top, #a5abb3b0, #6b829cb0);
      height: 20px;
    }

    //滚动的滑块
    //
    &::-webkit-scrollbar-corner {
      background: none;
    }

    //边角
    //
    // ::-webkit-resizer //定义右下角拖动块的样式
    .child {
      // background: rgb(143, 156, 196);
      margin-left: 20px;
      margin-top: 20px;
      align-items: left;
      display: flex;
      flex-direction: column;

      // border: 1px solid #eee;
      // border-radius: 8px;
      .child-item {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        padding: 10px;
        background: black;

        // color:rgb(46, 62, 151) ;
        &:hover {
          background: rgb(46, 62, 151);
          color: #fff;
        }

        .sub {
          align-items: left;
          align-self: left;
          margin-right: 10px;
        }
      }
    }
  }
}

.layer {
  z-index: 2000;
}

#mouse-position {
  position: fixed;
  margin-top: 10px;
  margin-inline-start: 100px;
  color: #000;
  font-weight: 2em;
  bottom: 25px;
  background-color: hsl(0, 0%, 93%, 0.5);
  padding: 5px;
  // z-index: 100000;
}

#btn {
  position: absolute;
  right: 10px;
  top: 50px;
  width: 29px;
  height: 29px;
  background: #fff;
  border-radius: 5px;
  text-align: center;
  border: none;
  z-index: 10;
  i {
    color: #0f0f0f;
    line-height: 29px;
    font-size: 18px;
  }
}

#btnSave {
  visibility: 'hidden';
  opacity: 0;
  height: 10px;
  width: 10px;
  left: 500px;
  top: 150px;
  position: fixed;
}
</style>
