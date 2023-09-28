<template>
    <div id="app-map">
        <el-form ref="form" :model="propertie" label-width="auto" label-position="left" :rules="rules" size="default">
            <el-form-item label="事件类型" prop="事件类型">
                <el-select v-model="propertie.事件类型" placeholder="请选择事故类型">
                    <el-option label="碰撞" value="碰撞" />
                    <el-option label="刮擦" value="刮擦" />
                    <el-option label="失火" value="失火" />
                    <el-option label="碾压" value="碾压" />
                    <el-option label="翻车" value="翻车" />
                    <el-option label="其他" value="其他" />
                </el-select>
            </el-form-item>
            <el-form-item label="事件等级" prop="事件等级" v-if="getSeesion().type == 'common' ? false : true">
                <el-select v-model="propertie.事件等级" placeholder="请选择事件等级">
                    <el-option label="1级" value="1" />
                    <el-option label="2级" value="2" />
                    <el-option label="3级" value="3" />
                    <el-option label="4级" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="处理状态" prop="处理状态" v-if="getSeesion().type == 'common' ? false : true">
                <el-select v-model="propertie.处理状态" placeholder="请选择处理状态">
                    <el-option label="待处理" value="2" />
                    <el-option label="正在处理" value="1" />
                    <el-option label="已处理" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="发生地点" prop="发生地点" style="width: 80%">
                <el-input v-model="propertie.发生地点" placeholder="请输入事故发生路段名" />
            </el-form-item>
            <el-form-item label="发生时间" prop="发生时间">
                <el-col :span="8">
                    <el-date-picker v-model="propertie.发生时间" type="defaultTime" format="YYYY.MM.DD HH:mm"
                        value-format="YYYY.MM.DD HH:mm" :placeholder="defaultTimes" />
                </el-col>
            </el-form-item>
            <el-form-item label="驾驶员" prop="驾驶员" style="width: 80%">
                <el-input v-model="propertie.驾驶员" placeholder="请输入事故车辆驾驶员姓名" />
            </el-form-item>
            <el-form-item label="车牌号" prop="车牌号" style="width: 80%">
                <el-input v-model="propertie.车牌号" placeholder="请输入事故车辆车牌号" />
            </el-form-item>
            <el-form-item label="联系电话" prop="联系电话" maxlength="11" style="width: 80%">
                <el-input v-model.number="propertie.联系电话" placeholder="请输入报警人联系电话" />
            </el-form-item>
            <el-form-item label-position="right" label-width="160px" style="margin-top: 2rem;">
                <el-tooltip content="提交到交管部门等待审核" placement="bottom" effect="light">
                    <el-button type="primary" @click="onSubmit">确认提交</el-button>
                </el-tooltip>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
// import mapboxgl from 'mapbox-gl';
import { ref, reactive, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';
//导入pinia状态管理
import { useCounterStore } from "../../../stores/index"
import { storeToRefs } from "pinia";
const $emit = defineEmits(['clearMarker', 'isSubmitShow'])
const removMarker = () => {
    $emit('clearMarker')
}
const mainStore = useCounterStore()
const { clientList } = storeToRefs(mainStore)
const { getSeesion } = mainStore
const name = ref('')
let submitList = ref([])
// let $marker = ref(null)
//获取用户名
onMounted(async () => {
    // $$marker = inject("$$marker")
    await clientList
    name.value = clientList.value.username
    console.log(clientList, 58582525)

    return name
})
//修改父组件中isSubmitShow 的值
const isShow = (blon) => {
    $emit('isSubmitShow', blon)
}
//设置时间选择框的默认显示时间

const times = new Date()
const defaultTimes = `${times.getFullYear()}.${times.getMonth() + 1}.${times.getDate()} ${times.getHours()}:${times.getMinutes()}`
const time = `${times.getFullYear()}${times.getMonth() + 1}${times.getDate()}${times.getHours()}${times.getMinutes()}${times.getSeconds()}`
const count = ref((Math.random() * 10000) + 100)
console.log(count, 5555555);
const propertie = ref({
    id: count,
    事件类型: "",
    事件编号: `SJ${time}`,
    发生地点: "",
    发生时间: defaultTimes,
    车牌号: "",
    驾驶员: "",
    处理状态: '2',
    事件等级: '',
    联系电话: "",
    userName: name
})

//表单校验规则
const form = ref(null)
const rules = reactive({
    事件类型: [
        {
            required: true,
            message: '请选择一个事故类型',
            trigger: 'change',
        },
    ],
    事件等级: [
        {
            required: true,
            message: '请选择一个事故类型',
            trigger: 'change',
        },
    ],
    处理状态: [
        {
            required: true,
            message: '请选择一个事故类型',
            trigger: 'change',
        },
    ],
    发生地点: [
        {
            required: true,
            message: '请输入一个事故地址',
            trigger: 'blur',
        },
    ],
    车牌号: [
        {
            min: 7,
            max: 8,
            message: '车牌号格式错误错误',
            trigger: 'blur',
        },
    ],
    驾驶员: [
        { message: '请输入驾驶员姓名', trigger: 'blur' },
        { min: 2, max: 4, message: '请输入一个2~4个字的姓名', trigger: 'blur' },
    ],
    联系电话: [
        {
            required: true,
            message: '请输入您的手机号',
            trigger: 'blur',
        },
        {
            type: 'number',
            message: '手机号格式错误',
            trigger: 'blur',
        },

    ]
})

//提交表单
function onSubmit() {
    form.value.validate((valid) => {
        if (valid) {
            // 表单校验通过，提交数据
            console.log(propertie);
            submitList.value = getFromLocalStorage("submitList")
            submitList.value.push({
                type: "Feature",
                geometry: {
                    type: "MultiPoint",
                    coordinates: [getFromLocalStorage('centerList').at(-1)]

                },
                properties: {
                    values_: propertie.value,
                    UserType: getSeesion().type == 'common' ? true : false
                },
                id: `${Math.trunc(Math.random() * 1000) + 100}`
            })
            saveToLocalStorage("submitList", submitList.value)

            //成功提交提示信息
            ElMessage({
                message: '提交成功！交管部门正在审核中...',
                type: 'success',
            })
            isShow(false)
            //清空数据
            form.value.resetFields()

            count.value = (Math.random() * 10000) + 100
            $map.triggerRepaint()
        } else {
            // 表单校验不通过，给出错误提示
            ElMessageBox.alert('请校验表单内容，修改符合填写条件后提交', '提交失败', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',

            })
        }
    });
}
//取消提交表单
function cancel() {
    isShow(false)
    //清空数据
    form.value.resetFields()
    removMarker()
}

</script>

<style  scoped>
#app-map {
    background: #fff;
    width: 450px;
    padding-top: 40px;
    padding-bottom: 20px;
    padding-left: 50px;
}
</style>