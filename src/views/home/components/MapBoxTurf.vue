<template>
  <div
    class="tree-button"
    @click="toggleBuffer"
    v-show="!loading"
    style="margin-top: 40px"
    v-if="clientList.type != 'common'"
  >
    <i class="fa-solid fa-building-shield"></i>
  </div>
  <div></div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { inject, onMounted, ref, watch } from "vue";
import { useCounterStore } from "../../../stores/index";
const counterStore = useCounterStore();
let { layerCollect, getSeesion } = counterStore;
let { clientList } = storeToRefs(counterStore);
const props = defineProps({
  bufferShowing: Boolean,
  loading: Boolean,
});
let $map = null;
let bufferShowing = ref(false);
// console.log(turf.buffer, "kkk");

// buffer数据集合
let pointly = {
  type: "FeatureCollection",
  features: [],
};

onMounted(() => {
  getSeesion();
  $map = inject("$map");
  $map.on("load", () => {
  // console.log(clientList.value.type, 9999);
  if (clientList.value.type === "common") {
    $map.setLayoutProperty("bufferMap", "visibility", "none");
  }else{


  setTimeout(() => {
    const { jsonForEveryone } = storeToRefs(counterStore);
    jsonForEveryone.value.forEach((item) => {
      let point = turf.point([
        item.geometry.coordinates[0]["0"],
        item.geometry.coordinates[0]["1"],
      ]);
      // console.log(point, "he");
      let buffered = turf.buffer(point, 0.3, { units: "miles" });

      pointly.features.push(buffered);
    });
    // console.log(pointly, "hyh");
    $map.addLayer({
      id: "bufferMap",
      type: "fill",
      source: {
        type: "geojson",
        data: pointly,
      },
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.7,
      },
    });
  }, 4000);
  // $map.on("load", () => {
    watch(bufferShowing, (newValue, oldValue) => {
      if (newValue) {
        // console.log(newValue, 454545);
        $map.setLayoutProperty("bufferMap", "visibility", "visible");
      } else {
        $map.setLayoutProperty("bufferMap", "visibility", "none");
      }
    });
  // });
  
}
})
});
function toggleBuffer() {
  bufferShowing.value = !bufferShowing.value;
  // console.log(bufferShowing.value, 88885555);
}
</script>

<style lang="scss" scoped>
.tree-button {
  position: absolute;
  top: 90px;
  right: 10px;
  background: #fff;
  border-radius: 5px;
  i {
    color: #0f0f0f;
    padding: 5.5px;
  }
}
.turf {
  // position: fixed;
  // margin-top: 50px;
  // left:0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
}
</style>
