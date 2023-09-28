<template>
  <div>
    <el-dialog v-model="props.amendSelf" @click="toggleClose">
      <el-form-item label="请输入修改信息">
        {{ userTips }}
      </el-form-item>
      <el-form status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户名称">
          <el-input v-model="username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="password"
            type="password"
            autocomplete="off"
            placeholder="请输入6~12位数字"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.number="phone" placeholder="请输入11位手机号码" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input v-model="clientList.type" disabled="true" />
        </el-form-item>
        <el-form-item label="在线状态">
          <el-input v-model="isOnline" disabled="true" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useCounterStore } from "../../../../../stores";
import {
  getLocalUser,
  setLocalUser,
  checkName,
  checkInput,
  checkPassword,
} from "../../../../logon/Hooks/useLoginHook";
import { ElMessage } from "element-plus";
const props = defineProps({
  amendSelf: Boolean,
});
const emit = defineEmits(["reAmend"]);
const counterStore = useCounterStore();
let { clientList, userList, userRemenber } = storeToRefs(counterStore);
let { amendUserData, closeSearch } = counterStore;
let username = ref("");
let password = ref("");
let phone = ref("");
let type = ref(clientList.value.type);
let isOnline = true;
username.value = clientList.value.username;
phone.value = clientList.value.phone;
// 用户管理模块提示语
let userTips = ref("");
let check = ref(false);
// 修改用户信息--提交按钮
const submitForm = () => {
  if (username.value === "") {
    ElMessage.error({
      message: "名字不能为空",
      duration: 2000,
    });
    return;
  }
  if (password === "") {
    ElMessage.error({
      message: "密码不能为空",
      duration: 2000,
    });
    return;
  }
  console.log(userList.value, 98888);
  if (userList.value) {
    const resName = checkName(username.value, userList, clientList);
    console.log(resName, 67676);
    const resPassword = checkPassword(password.value);
    // console.log(resPassword,"resp");
    const res = checkInput(phone.value);
    // console.log(res,"phone");
    if (resName) {
      ElMessage.error({
        message: "名字重复",
        duration: 2000,
      });
      return
    } else {
      if (res && resPassword) {
        console.log("rrrrr");
        const item = {
          username: username.value,
          password: password.value,
          type: type.value,
          phone: phone.value,
          isOnline: true,
        };
        amendUserData(clientList, item);
        console.log(userRemenber.value, 886866666);
        if (userRemenber.value) {
          userRemenber.value = !userRemenber.value;
          setLocalUser(userRemenber, username, password, type);
        }
        userTips.value = "修改成功";
      } else if (res === false) {
        ElMessage.error({
          message: "电话号码格式不正确",
          duration: 2000,
        });
        userTips.value = "电话号码格式不正确";
        return
      } else if (resPassword === false) {
        ElMessage.error({
          message: "密码格式不正确，请输入6~12位数字",
          duration: 2000,
        });
        userTips.value = "密码格式不正确，请输入6~12位数字";
        return
      }
    }
  }
};
const toggleClose = () => {
  closeSearch();
};
</script>

<style lang="scss" scoped></style>
