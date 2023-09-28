<template>
<!-- 实现普通用户可以做的查询功能 -->
  <div>
    <!-- 查询的事件类型input框 -->
    <el-input
      v-model.lazy="input"
      class="w-50 m-2"
      placeholder="请搜索要查询的交通事件"
      @change="searchEvent(input)"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>

    <!-- 弹窗显示事件 -->
    <el-dialog v-model="dialogTableVisible" title="Wuhan Event Show">
      <el-table
        :data="showEvent"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        align="center"
      >
        <el-table-column
          prop="type"
          label="事件类型"
          width="150"
          align="center"
        />
        <el-table-column
          prop="where"
          label="发生地点"
          width="150"
          align="center"
        />
        <el-table-column
          prop="time"
          label="发生时间"
          width="150"
          align="center"
        />
        <el-table-column
          prop="status"
          label="处理状态"
          width="150"
          align="center"
        />
      </el-table>
      <!-- 分页 -->
      <div class="example-pagination-block">
        <div class="example-demonstration"></div>
        <el-pagination
          layout="prev, pager, next"
          :total="totalPage"
          @current-change="currentPage"
        />
      </div>
    </el-dialog>

    <!-- 弹窗显示事件 -->
    <el-dialog v-model="dialogTableVisible" title="Wuhan Event Show">
      <el-table
        :data="showEvent"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        align="center"
      >
        <el-table-column
          prop="type"
          label="事件类型"
          width="150"
          align="center"
        />
        <el-table-column
          prop="where"
          label="发生地点"
          width="150"
          align="center"
        />
        <el-table-column
          prop="time"
          label="发生时间"
          width="150"
          align="center"
        />
        <el-table-column
          prop="status"
          label="处理状态"
          width="150"
          align="center"
        />
      </el-table>
      <!-- 分页 -->
      <div class="example-pagination-block">
        <div class="example-demonstration"></div>
        <el-pagination
          layout="prev, pager, next"
          :total="totalPage"
          @current-change="currentPage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { onBeforeUpdate, ref } from "vue";
// pinia引入
import { useCounterStore } from "../../../../stores/index";
import { storeToRefs } from "pinia";
const counterStore = useCounterStore();

// 弹窗的显示控制
const dialogTableVisible = ref(false);

// pinia里面的事故数据
let echartData = ref([]);
// 输入框变量
let input = ref("");
// 弹窗的显示渲染数据
let showEvent = ref([]);
// 二维数组  分页渲染
let pageArr = ref([]);
// 动态翻页的条目
let totalPage = ref(10)


// 根据处理情况渲染颜色
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.status === "1") {
    return "one-row";
  } else if (row.status === "2") {
    return "two-row";
  } else {
    return "three-row";
  }
};

// page页数控制渲染数据
const currentPage = (page) => {
  showEvent.value = pageArr.value[page - 1];
};

// 实现input框的值改变传递信息
const searchEvent = (input) => {
  dialogTableVisible.value = true;
  searchContent(input);
};

// 实现过滤显示 搜索的内容
const searchContent = (inputType) => {
  // 清空展示的数据和分页数据
  showEvent.value = [];
  pageArr.value = [];
  // 过滤事件
  let eventType = echartData.value.filter((item) => {
    return inputType === item.properties.values_["事件类型"];
  });
  // 需要渲染的事件
  eventType.forEach((item) => {
    showEvent.value.push({
      id: item.properties.values_["事件编号"],
      type: item.properties.values_["事件类型"],
      where: item.properties.values_["发生地点"],
      time: item.properties.values_["发生时间"],
      carId: item.properties.values_["车牌号"],
      driver: item.properties.values_["驾驶员"],
      status: item.properties.values_["处理状态"],
    });
  });
  // 判断 大于10条信息分为2维数组 分割
  if (showEvent.value.length > 10) {
    // 实现分割
    for (let i = 0; i < showEvent.value.length; i += 10) {
      let item = showEvent.value.slice(i, i + 10);
      pageArr.value.push(item);
    }
    showEvent.value = pageArr.value[0];
  }
  // 实现动态的页数
  totalPage.value = pageArr.value.length * 10
  // 判断是否具有该事件存在
  if (showEvent.value.length === 0) {
    ElMessage.warning({
      message: "暂无该系列事件",
      duration: 1000,
    });
  } else {
    ElMessage.success({
      message: "查询成功",
      duration: 1000,
    });
  }
  // 清空input内容
  input.value = "";
};

// 获取pinia里面的数据 只读取一次
let count = 0;
onBeforeUpdate(async () => {
  // 异步方法实现获得echartData数据
  count++;
  if (count === 1) {
    let variable = await counterStore.returnEchartDate();
    // 遍历出来 事故数据出来
    console.log(variable.value,'hyh');
    variable.value.forEach((item) => {
      echartData.value.push(item);
    });
    console.log(echartData.value,'hyh');
  }
});
</script>

<style lang="scss" scoped>
// 分页组件
.example-pagination-block {
  float: right;
}
::v-deep .el-pagination {
  height: 28px;
}
// 查询事件表格的设置颜色
::v-deep .el-table .three-row {
  --el-table-tr-bg-color: lightblue;
  color: black;
  opacity: 0.8;
}
::v-deep .el-table .two-row {
  --el-table-tr-bg-color: red;
  color: black;
  opacity: 0.8;
}
::v-deep .el-table .one-row {
  --el-table-tr-bg-color: orange;
  color: black;
  opacity: 0.8;
}
</style>
