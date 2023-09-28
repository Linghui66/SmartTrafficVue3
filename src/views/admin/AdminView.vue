<template>
  <div class="admin-item">
    <div class="toggle">
      <el-button type="primary" plain @click="search">查询用户</el-button>
      <el-button type="primary" plain @click="del">删除用户</el-button>
    </div>
    <div v-show="isShow" class="search">
      <el-form class="demo-form-inline">
        <!-- <el-form-item label="用户名"> -->
        <!-- <el-input v-model="username" placeholder="用户名" clearable /> -->
        <!-- </el-form-item> -->
        <el-form-item label="用户类型">
          <el-select v-model="type" placeholder="用户类型" clearable>
            <el-option label="common" value="common" />
            <el-option label="traffic" value="traffic" />
            <el-option label="admin" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="filterTableData" style="width: 100%">
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Name" prop="name" />
        <el-table-column align="right">
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="Type to search"
            />
          </template>
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { reactive } from "vue";
import { computed } from "vue";
import { useCounterStore } from "../../stores";
const counterStore = useCounterStore();
let { searchClient } = counterStore;
const filterTableData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "John",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Morgan",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Jessy",
    address: "No. 189, Grove St, Los Angeles",
  },
]);
const type = ref("");
let isShow = ref(false);
function search() {
  isShow.value = !isShow.value;
  // searchClient();
}
function searchUser() {
  searchClient(type.value);
}
function handleEdit($index, row) {
  console.log(111);
}
function handleDelete($index, row) {
  console.log(222);
}
function del() {
  console.log(333);
}
</script>

<style lang="scss" scoped>
.admin-item {
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .toggle {
    margin-top: 100px;
  }
  .search {
    margin-top: 100px;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .demo-form-inline{
      display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: row;
    }
    .demo-form-inline .el-input {
      --el-input-width: 220px;
    }
  }
}
</style>
