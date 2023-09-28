<template>
    <div v-if="getSeesion().type == 'common' ? false : true">
        <h2 style="margin-bottom:10px;">事故审核</h2>
        <div v-for="item in list" :key="item.id" @click="showItem(item.id)" class="btn-up">

            <dv-border-box8 :dur="5" :reverse="true">
                <div dv-bg>{{ `${item.properties.values_.事件类型} ${item.properties.values_.发生时间} ` }}</div>
            </dv-border-box8>
        </div>

        <h3 v-if="list.length == 0" style="margin-top: 40px; font-weight: 1em;">暂无事故待审核</h3>
    </div>
    <el-dialog v-model="isShow" title="事故上传" width="30%" :before-close="handleClose" append-to-body="true">
        <div class="massage">
            <p>事件类型{{ selectedItem.properties.values_.事件类型 }}</p>
            <p>发生地点：{{ selectedItem.properties.values_.发生地点 }}</p>
            <p>发生时间：{{ selectedItem.properties.values_.发生时间 }}</p>
            <p>报警人姓名：{{ selectedItem.properties.values_.userName }}

                <span style="margin-left: 20px;">联系电话：{{ selectedItem.properties.values_.联系电话 }}</span>
            </p>


            <el-form ref="forms" :model="form" style="margin-top: 10px;" v-if="selectedItem.properties.UserType">
                <el-form-item label="事件等级" prop="事件等级">
                    <el-select v-model="form.事件等级" placeholder="请选择事件等级">
                        <el-option label="1级" value="1" />
                        <el-option label="2级" value="2" />
                        <el-option label="3级" value="3" />
                        <el-option label="4级" value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理状态" prop="处理状态">
                    <el-select v-model="form.处理状态" placeholder="请选择处理状态">
                        <el-option label="待处理" value="2" selected />
                        <el-option label="正在处理" value="1" />
                        <el-option label="已处理" value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div v-else>
                <p>事件等级：{{ selectedItem.properties.values_.事件等级 }}</p>
                <p>处理状态：{{ states(selectedItem.properties.values_.处理状态) }}</p>
            </div>
        </div>
        <span>确认上传这条事故信息吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="delEvent(selectedItem.id)">取消上传并删除</el-button>
                <el-button type="primary" @click="addEvent(selectedItem.id)">
                    确认上传事故
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';
import { ElMessageBox } from 'element-plus'
import { saveToLocalStorage, getFromLocalStorage } from '../../../../utils/localStorage';
import { useCounterStore } from "../../../../stores/index"
import green from "../../../../assets/images/green.png"
import blue from "../../../../assets/images/blue.png"
import red from "../../../../assets/images/red.png"
const mainStore = useCounterStore()
const { newechartData, getSeesion } = mainStore
const selectedItem = ref(null)
let list = ref([])
list.value = getFromLocalStorage("submitList")

let center = ref([])
center.value = getFromLocalStorage("centerList")
const isShow = ref(false)

let featuresList = []
featuresList = getFromLocalStorage("featuresList")

let $map = null
let greenSource = null
let blueSource = null
let redSource = ref(null)
onMounted(() => {
    $map = inject('$map')
    // $map.addImage("red")
    setTimeout(() => {
        redSource = $map.getSource("eventLayer2");
        console.log(redSource);
        greenSource = $map.getSource("eventLayer1")
        blueSource = $map.getSource("eventLayer")
        if (getFromLocalStorage("featuresList").length !== 0) {
            featuresList = getFromLocalStorage("featuresList")
            //传入pinia
            newechartData(featuresList)
            //push到data
            featuresList.forEach((item) => {
                if (item.properties.values_.处理状态 === "0") {
                    if (blueSource) {
                        let currentDataBlue = blueSource._data;
                        if (currentDataBlue && currentDataBlue.type === 'FeatureCollection') {
                            let features = currentDataBlue.features;
                            features.push(item)
                            $map.getSource("eventLayer").setData({
                                type: 'FeatureCollection',
                                features: features
                            });
                        }
                    }
                }
                if (item.properties.values_.处理状态 === "1") {
                    if (greenSource) {
                        let currentDataGreen = greenSource._data;
                        if (currentDataGreen && currentDataGreen.type === 'FeatureCollection') {
                            let features1 = currentDataGreen.features;
                            features1.push(item)
                            $map.getSource("eventLayer1").setData({
                                type: 'FeatureCollection',
                                features: features1
                            });
                        }
                    }
                }
                if (item.properties.values_.处理状态 === "2") {
                    if (redSource) {
                        let currentDataRed = redSource._data;
                        if (currentDataRed && currentDataRed.type === 'FeatureCollection') {
                            let features2 = currentDataRed.features;
                            features2.push(item)
                            $map.getSource("eventLayer2").setData({
                                type: 'FeatureCollection',
                                features: features2
                            });
                        }
                    }
                }


            })
        }
    }, 2300)
})

//表单
const forms = ref(null)
const form = ref({
    事件等级: '',
    处理状态: ''

})

//控制确认框显隐
function showItem(data) {
    selectedItem.value = list.value.find(item => {
        return item.id === data
    })
    isShow.value = true
}

// 判断事件处理状态值 页面渲染
function states(str) {
    if (str === "0") {
        return "已处理"
    } else if (str === "1") {
        return "正在处理"
    } else {
        return "待处理"
    }
}
//上报事件
function addEvent(data) {
    isShow.value = false

    //删除marker坐标
    let coordintate = list.value.find((item) => {
        return item.id === data
    }).geometry.coordinates

    center.value = center.value.filter((item) => {
        return item[0] !== coordintate[0][0]
    })

    saveToLocalStorage("centerList", center.value)

    //保存到本地
    featuresList.push(list.value.find((item) => {
        return item.id === data
    }))
    //修改事件状态
    if (featuresList.at(-1).properties.UserType) {
        featuresList.at(-1).properties.values_.事件等级 = form.value.事件等级
        featuresList.at(-1).properties.values_.处理状态 = form.value.处理状态
    }

    //传入pinia
    newechartData(featuresList.at[-1])
    console.log(featuresList)
    //保存到本地
    saveToLocalStorage("featuresList", featuresList)

    //添加图片标注
    if (featuresList.at(-1).properties.values_.处理状态 == '0') {
        if (blueSource) {
            let currentDataBlue = blueSource._data;
            if (currentDataBlue && currentDataBlue.type === 'FeatureCollection') {
                let features0 = currentDataBlue.features;
                features0.push(featuresList.at(-1))
                $map.getSource("eventLayer").setData({
                    type: 'FeatureCollection',
                    features: features0
                });
                $map.loadImage(blue, (error, image) => {
                    if (error) throw error;
                    $map.addImage("blue", image);
                    $map.setLayoutProperty("eventLayer", "icon-image", "blue")
                })
                $map.setStyle("eventLayer")
            }
        }
    }
    if (featuresList.at(-1).properties.values_.处理状态 == '1') {
        if (greenSource) {
            let currentDataGreen = greenSource._data;
            if (currentDataGreen && currentDataGreen.type === 'FeatureCollection') {
                let features1 = currentDataGreen.features;
                features1.push(featuresList.at(-1))
                $map.getSource("eventLayer1").setData({
                    type: 'FeatureCollection',
                    features: features1
                });
                $map.loadImage(green, (error, image) => {
                    if (error) throw error;
                    $map.addImage("green", image);
                    $map.setLayoutProperty("eventLayer1", "icon-image", "green")
                })
                $map.setStyle("eventLayer1")
            }
        }
    }
    if (featuresList.at(-1).properties.values_.处理状态 == '2') {
        if (redSource) {
            let currentDataRed = redSource._data;
            if (currentDataRed && currentDataRed.type === 'FeatureCollection') {
                let features2 = currentDataRed.features;
                features2.push(featuresList.at(-1))
                $map.getSource("eventLayer2").setData({
                    type: 'FeatureCollection',
                    features: features2
                });
                $map.loadImage(red, (error, image) => {
                    if (error) throw error;
                    $map.addImage("red", image);
                    $map.setLayoutProperty("eventLayer2", "icon-image", "red")
                })
                $map.setStyle("eventLayer2")
            }
        }
    }

    //删除已上传事件的事件审核渲染
    list.value = list.value.filter((item) => {
        return item.id !== data
    })
    saveToLocalStorage("submitList", list.value)
    //页面刷新
    location.reload()
}

//删除待审核

function delEvent(data) {
    isShow.value = false
    //删除marker坐标
    let lnglat = list.value.find((item) => {
        return item.id === data
    }).geometry.coordinates
    console.log(lnglat[0][0]);
    center.value = center.value.filter((item) => {
        console.log(item[0]);
        return item[0] !== lnglat[0][0]
    })
    saveToLocalStorage("centerList", center.value)
    //删除渲染列表
    list.value = list.value.filter((item) => {
        return item.id !== data
    })
    saveToLocalStorage("submitList", list.value)
    $map.setStyle("mapbox://styles/mapbox/dark-v11")
}
//再次确认
const handleClose = (done) => {
    ElMessageBox.confirm('确定不审核这条事故报告吗？确认关闭后这条事故依然会显示在事故审核栏中。')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}

.massage {
    line-height: 20px;
    text-align: left;
    margin-bottom: 20px;
}

.btn-up:hover {
    cursor: pointer;
}
</style>