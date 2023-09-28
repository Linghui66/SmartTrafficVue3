<template>
  <div class="event-btn">
    <dv-border-box8 :dur="5">
      <div dv-bg @click="fromUp()" class="btn-up">事故上报</div>
    </dv-border-box8>
    <dv-border-box8
      :dur="5"
      v-if="getSeesion().type == 'common' ? true : false"
    >
      <div dv-bg @click="clear()" class="btn-up">撤销上报事故</div>
    </dv-border-box8>
    <div class="sbmitevent" v-show="isSubmit">
      <BoxMapSubmit
        @isSubmitShow="isSubmitShow"
        @clearMarker="clearMarker"
      ></BoxMapSubmit>
    </div>
  </div>
</template>

<script setup>
import mapboxgl from "mapbox-gl";
import { onMounted, inject, ref, reactive } from "vue";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../../utils/localStorage";
import { ElNotification, ElMessage } from "element-plus";
import BoxMapSubmit from "./BoxMapSubmit.vue";
import { useCounterStore } from "../../../stores/index";
const mainStore = useCounterStore();
const { getSeesion } = mainStore;

let $map = ref(null);
let centerLists = ref([]);
let labels = ref([]);
let isSubmit = ref(false);
onMounted(() => {
  $map = inject("$map");
  $map.on("style.load", function () {
    // 页面加载时添加标记到地图
    if (centerLists.value.length === 0) {
      centerLists.value = getFromLocalStorage("centerList");
      centerLists.value.forEach((item) => {
        marker = new mapboxgl.Marker({
          draggable: true,
          color: "#FF6601",
        }).setLngLat(item);
        labels.value.push(marker);
        marker.addTo($map);
      });
    }
    console.log(123654);
  });
});

function fromUp() {
  ElNotification({
    title: "提示",
    message: "请在地图上点击事故发生地的位置，以便交管部门审核确认。",
    duration: 4000,
  });
  //点击获取坐标
  $map.once("click", (evt) => {
    // addLabel();
    var { lng, lat } = evt.lngLat;
    var center = [lng, lat];
    centerLists.value.push(center);
    satLabels();
    addLabel(center);
    isSubmit.value = true;
  });
}

//添加标注
let marker = null;
function addLabel(center) {
  marker = new mapboxgl.Marker({
    draggable: true,
    color: "#FF6601",
  }).setLngLat(center);
  labels.value.push(marker);
  marker.addTo($map);
}
//保存到本地
function satLabels() {
  saveToLocalStorage("centerList", centerLists.value);
}

//清除所有标注
function clear() {
  if (getFromLocalStorage("submitList").length === 0) {
    ElMessage({
      message: "暂无待审核事故",
      type: "warning",
    });
  } else {
    labels.value.forEach((item) => {
      item.remove();
    });
    saveToLocalStorage("centerList", []);
    saveToLocalStorage("submitList", []);
    centerLists.value = [];
    //成功提交提示信息
    ElMessage({
      message: "已撤销未审核和事故报警",
      type: "success",
    });
  }
}
//设置报警表单的显隐

function isSubmitShow(blon) {
  isSubmit.value = blon;
  console.log(isSubmit);
}
//清除添加的marker
function clearMarker() {
  marker.remove();
  centerLists.value.pop();
  saveToLocalStorage("centerList", centerLists.value);
}
</script>

<style lang="scss" scoped>
.event-btn {
  text-align: center;
}

// .frombox {
//     background: #fff;
//     z-index: 1000;

//     button {
//         position: absolute;
//         right: 20px;
//         top: 90px;
//     }

.btn-up:hover {
  cursor: pointer;
}

.sbmitevent {
  position: absolute;
  top: 150px;
  left: -660px;
  z-index: 1000;
}
</style>
