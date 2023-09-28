<template>
  <div>
    <el-dialog v-model="props.addNewUserByAdmin">
      <el-form-item>
        <p style="margin-left: 60px; color: red">{{ tipWord }}</p>
      </el-form-item>
      <el-form status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户名称">
          <el-input
            v-model="usernames"
            type="text"
            autocomplete="off"
            @click="clearTips"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="passwords"
            type="password"
            autocomplete="off"
            placeholder="请输入6~12位数字"
            @change="passwordCheckIm"
            @click="clearTips"
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="rePassword"
            type="password"
            autocomplete="off"
            placeholder="请输入一样的密码"
            @change="passwordCheckIm"
            @click="clearTips"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model.number="phoneNumber"
            placeholder="请输入11位手机号码"
            @change="checkUserPhone"
            @click="clearTips"
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <!-- 用户类型 -->
          <div class="clientType">
            <el-radio-group v-model="types">
              <el-radio label="common" size="large" border class="type"
                >普通用户</el-radio
              >
              <el-radio label="traffic" size="large" border class="type"
                >交管用户</el-radio
              >
              <el-radio label="admin" size="large" border class="type"
                >管理员</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="valueChange"
            clearable
            placeholder="在线状态"
            class="select"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goRegister">确定</el-button>
          <!-- <el-button type="primary" @click="againRegister">继续注册</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCounterStore } from "../../../../../stores/index";
import {
  setLocalUser,
  checkInput,
  checkPassword,
} from "../../../../logon/Hooks/useLoginHook";
import { ElMessage } from "element-plus";
const counterStore = useCounterStore();
const props = defineProps({
  addNewUserByAdmin: Boolean,
});

let { addUserFor } = counterStore;
let { success } = storeToRefs(counterStore);
let valueChange = ref(false);
let options = [
  { label: "在线", value: true },
  { label: "下线", value: false },
];
// console.log(counterStore,666);
let rePassword = ref("");
// 用户登录输入用户名绑定的变量
let usernames = ref("");
// 用户登录输入密码绑定的变量
let passwords = ref("");
let checkPasswords = ref(true);
// 用户登录选择用户类型绑定的变量
let types = ref("common");
let tipWord = ref("");
// 电话号码
let phoneNumber = ref();
let checkPhone = ref(true);
// 校验电话号码
function checkUserPhone() {
  checkPhone.value = checkInput(phoneNumber.value);
  if (checkPhone.value === false) {
    ElMessage.error({
      message: "电话号码格式不正确，请重新输入",
      duration: 1000,
    });
  }
}
function passwordCheckIm() {
  const res = checkPassword(passwords.value);
  if (!res) {
    ElMessage.error({
      message: "密码格式不正确，请输入6~12位数字",
      duration: 1000,
    });
  }
  // tipWord.value = "密码格式不正确，请输入6~12位数字";
}
function checkUserPassword() {
  const res = checkPassword(passwords.value);
  const _res = checkPassword(rePassword.value);
// console.log(res,"res",_res,"_res");
  if (res && _res) {
    if (passwords.value === rePassword.value) {
      checkPasswords.value = true;
      return true
    } else {
      checkPasswords.value = false;
      ElMessage.error({
        message: "密码不一致，请重新输入",
        duration: 1000,
      });
    }
  } else if (!res) {
    // alert("密码格式不正确，请输入6~12位数字");
    ElMessage.error({
      message: "密码格式不正确，请输入6~12位数字",
      duration: 1000,
    });
    checkPasswords.value=false
    return false
  } else if (!_res) {
    // alert("密码格式不正确，请输入6~12位数字");
    ElMessage.error({
      message: "密码格式不正确，请输入6~12位数字",
      duration: 1000,
    });
    checkPasswords.value=false
    return false
  }
}

// 添加功能
const goRegister=async()=> {
  checkUserPassword()
  if (usernames.value === "") {
    ElMessage.error({
      message: "名字不能为空",
      duration: 1000,
    });
  }
  else if (valueChange.value === "") {
    ElMessage.error({
      message: "请选择在线状态",
      duration: 1000,
    });
  }
  else if (checkPasswords.value && checkPhone.value) {
    const item = {
      username: usernames.value,
      password: passwords.value,
      type: types.value,
      phone: phoneNumber.value,
    };
    await addUserFor(item);
    // console.log(success.value,"gffgdgf");
    if (success.value) {
      console.log(success.value,"successADD");
      clearTips()
      clear();
    }
  } else if (
    passwords.value !== rePassword.value &&
    checkPhone.value === false
  ) {
    tipWord.value = "密码不一致及电话号码格式不正确，请重新输入";
  } else if (checkPhone.value === false) {
    tipWord.value = "电话号码格式不正确，请重新输入";
  } else if (passwords.value !== rePassword.value) {
    tipWord.value = "密码不一致，请重新输入";
  }
}
// 清除提示信息
function clearTips() {
  tipWord.value = "";
}
// 清除input框功能
function clear() {
  usernames.value = "";
  passwords.value = "";
  rePassword.value = "";
  types.value = "";
  phoneNumber.value = "";
}
</script>

<style lang="scss" scoped></style>
