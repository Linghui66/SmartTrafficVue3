<template>
  <div>
    <dv-border-box8
      :dur="5"
      v-if="getSeesion().type == 'common' ? false : true"
    >
      <div dv-bg @click="editEvent()" class="btn-up">事故更新</div>
    </dv-border-box8>
    <div class="selet" v-if="isShow">
      <h3>修改处理状态</h3>
      <span class="span">请在地图中点击你想修改的事件</span>
      <el-select
        v-model="state"
        style="margin-top: 15px"
        placeholder="请选择修改事件的处理状态"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="btn">
        <button class="btn1" @click="close()">取消修改</button
        ><button @click="yes()" class="btn2">确定修改</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, onMounted, inject, watch } from "vue";
import { useCounterStore } from "../../../../stores/index";
import { storeToRefs } from "pinia";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../../../utils/localStorage";
const mainStore = useCounterStore();
const { getSeesion, popUPId } = mainStore;
const { popId } = storeToRefs(mainStore);
let isShow = ref(false);

let featuresList = [];
featuresList = getFromLocalStorage("featuresList");
let $map = null;
let docLayer = null;
// let position = null
let id = ref(null);

onMounted(() => {
  $map = inject("$map");
  docLayer = new Zondy.Map.Doc("", "guanggu", {});
  console.log(docLayer, 123);
});
//点击打开窗口
function editEvent() {
  isShow.value = true;
}

function satesEdit(values, id) {
  // let gpoint = new Zondy.Object.GPoint(coordintate[0], coordintate[1]) // 修改位置
  // /* 设置当前点要素的几何信息 */
  // let fGeom = new Zondy.Object.FeatureGeometry({
  //     PntGeom: [gpoint]
  // })
  /* 设置添加点要素的属性信息 */
  let attValue = [values];
  /* 2.4  构建要素对象 */
  let feature = new Zondy.Object.Feature({
    // fGeom: fGeom, //坐标--几何信息
    AttValue: attValue, //属性
  });
  feature.setFType(1);
  feature.setFID(id); //++
  //创建一个要素数据集
  let featureSet = new Zondy.Object.FeatureSet();
  /* 设置属性结构 */
  let cAttStruct = new Zondy.Object.CAttStruct({
    FldName: ["处理状态"], //属性的字段名
    FldNumber: 1, //属性的个数
    FldType: ["string"], //属性的类型
  });
  featureSet.AttStruct = cAttStruct;
  /* 添加要素到要素数据集 */
  featureSet.addFeature(feature);
  /* 
   创建一个编辑服务类 
   第一个参数：服务的名称 第二参数：图层的名称
   */
  var editService = new Zondy.Service.EditDocFeature("guanggu", 2, {
    ip: "localhost",
    port: "6163", //访问IGServer的端口号, .net为6163,Java为8089
  });
  console.log(featureSet);
  //执行添加点要素功能
  editService.update(featureSet, onSuccess);
}
function onSuccess(data) {
  if (data.succeed) {
    //成功提交提示信息
    ElMessage({
      message: "修改成功！",
      type: "success",
    });
    docLayer.refresh(); //重新加载地图文档
    //重新加载地图文档
    //页面刷新
    location.reload();
  } else {
    //成功提交提示信息
    ElMessage({
      message: "修改失败，稍后再试！",
      type: "error",
    });
  }
}
const state = ref("");

const options = [
  {
    value: "2",
    label: "待处理",
  },
  {
    value: "1",
    label: "正在处理",
  },
  {
    value: "0",
    label: "已处理",
  },
];
//监听selet框处理状态值
watch(popId, () => [console.log(popId.value, 852)]);
//点击确定
function yes() {
  let count = featuresList.find((item) => {
    return item.id == popId.value;
  });
  console.log(count, "blue");
  //如果是新添加的featuresList中的数据就修改本地数据
  if (count) {
    let index = featuresList.indexOf(
      featuresList.find((item) => {
        return item.id == popId.value;
      })
    );
    featuresList[index].properties.values_.处理状态 = state.value;
    saveToLocalStorage("featuresList", featuresList);
    //成功提交提示信息
    ElMessage({
      message: "修改成功，请刷新页面查看！",
      type: "success",
    });
    state.value = "";
  }
  //else就修改IgServer
  else {
    //可能存在跨域问题
    satesEdit(state.value, popId.value);
  }
  isShow.value = false;
}
//取消更新
function close() {
  isShow.value = false;
  popUPId(null);
  state.value = "";
}
</script>

<style lang="scss" scoped>
.btn-up:hover {
  cursor: pointer;
}

.selet {
  position: fixed;
  top: 100px;
  right: 520px;
  z-index: 5000;
  width: 200px;
  height: 230px;

  background: linear-gradient(to top, #051d38b0, #2a72c5);
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: rgb(69, 102, 202) 0px 0px 25px 3px inset;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;

  .span {
    margin-top: 10px;
    font-size: 14px;
    color: #eee;
  }

  button {
    width: 65px;
    height: 25px;
    display: inline;
    margin-top: 30px;
    border: 1px solid #fff;
  }
  .btn {
    display: flex;
    width: 100%;
    justify-content: space-between;
    // gap:16px;
    .btn1 {
      // margin-left: 15px;
      // margin-right: 10px;
      padding-inline: 4px;
      border-radius: 4px;
      &:hover {
        background-color: rgb(34, 165, 217);
        color: #fff;
      }
    }

    .btn2 {
      background-color: skyblue;
      padding-inline: 4px;
      border-radius: 4px;
      &:hover {
        background-color: rgb(34, 165, 217);
        color: #fff;
      }
    }
  }
}
</style>
