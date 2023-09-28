<template>
  <div class="resgisters">
    <!-- 动画 貌似没生效-->
    <transition-group tag="div" mode="out-in">
      <!-- 注册卡片 -->
      <div class="card" :key="cardId">
        <!-- 登录或成功或失败提示 -->
        <div class="tips">
          <p>{{ tips }}</p>
          <div v-if="success" class="drump">
            <span>{{ time }}</span
            >秒后跳转
          </div>
        </div>

        <!-- 输入用户名 -->
        <input type="text" placeholder="请输入用户名" v-model="usernames" />
        <!-- 输入密码 -->
        <input
          type="password"
          placeholder="请输入密码，请输入6~12位数字'"
          v-model="passwords"
          style="font-size: 15px"
          @change="passwordCheckIm"
        />
        <!-- 确认密码 -->
        <input
          type="password"
          placeholder="请再次输入密码"
          v-model="rePassword"
          style="font-size: 15px"
          @change="checkUserPassword"
        />
        <input
          type="text"
          placeholder="请输入手机号码11位数"
          v-model="phoneNumber"
          style="font-size: 15px"
          @change="checkUserPhone"
        />
        <!-- 用户类型 -->
        <div class="clientType">
          <el-radio-group v-model="types">
            <el-radio label="common" size="large" border class="type"
              >普通用户</el-radio
            >
          </el-radio-group>
        </div>
        <!-- 确认 -->
        <div class="check">
          <!-- 记住密码 -->
          <div class="remenber">
            <el-checkbox
              v-model="checks"
              label="记住密码"
              size="large"
              @click="remenber"
            />
            <!-- <p>记住密码</p> -->
          </div>
          <!-- 登录按钮 -->
          <button @click="goRegister">注册</button>
        </div>
        <div class="bottom">
          <button @click="backLogin">想起密码~~返回登录页</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useCounterStore } from "../../../stores/index";
import { setLocalUser, checkInput, checkPassword } from "../Hooks/useLoginHook";
import { ElMessage } from "element-plus";
const counterStore = useCounterStore();
let { tips, time, success } = storeToRefs(counterStore);
let { userRegister } = counterStore;
// console.log(counterStore,666);
let rePassword = ref("");
const cardId = ref(1);
// 用户登录输入用户名绑定的变量
let usernames = ref("");
// 用户登录输入密码绑定的变量
let passwords = ref("");
let checkPasswords = ref(true);
// 用户登录选择用户类型绑定的变量
let types = ref("common");
// 用户登录记住密码勾选框使用的标记
let remenbereds = ref(false);
let checks = ref(false);

// 电话号码
let phoneNumber = ref();
let checkPhone = ref(true);
// 获取来自父组件的add功能，用于修改resgister的值
const emit = defineEmits(["add"]);
// 回到登录页面，当resgister为false,切换回登录页面
function backLogin() {
  emit("add");
}
// 记住密码，setLocalUser来自logon文件夹的hook
function remenber() {
  setLocalUser(remenbereds, usernames, passwords, types);
}
// 校验
function checkUserPhone() {
  checkPhone.value = checkInput(phoneNumber.value);
  if (checkPhone.value === false) {
    ElMessage.error({
      message: "电话号码格式不正确，请重新输入",
      duration: 2000,
    });
  }
}
//密码输入框校验
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
//密码确认框校验
function checkUserPassword() {
  const res = checkPassword(passwords.value);
  const _res = checkPassword(rePassword.value);
  if (res && _res) {
    if (passwords.value === rePassword.value) {
      checkPasswords.value = true;
      return;
    } else {
      checkPasswords.value = false;
      ElMessage.error({
        message: "密码不一致，请重新输入",
        duration: 1000,
      });
      return;
    }
  } else if (!res) {
    // alert("密码格式不正确，请输入6~12位数字");
    ElMessage.error({
      message: "密码格式不正确，请输入6~12位数字",
      duration: 1000,
    });
    checkPasswords.value = false;
    return;
  } else if (!_res) {
    // alert("密码格式不正确，请输入6~12位数字");
    ElMessage.error({
      message: "密码格式不正确，请输入6~12位数字",
      duration: 1000,
    });
    checkPasswords.value = false;
    return;
  }
}

// 改变样式==貌似没有影响样式改变==再测试
function resetInput(e) {
  e.value = true;
}

// 注册功能
const goRegister = async () => {
  // 再次校验密码
  checkUserPassword();
  if (usernames.value === "") {
    ElMessage.error({
      message: "名字不能为空",
      duration: 1000,
    });
  } else if (checkPasswords.value && checkPhone.value) {
    const item = {
      username: usernames.value,
      password: passwords.value,
      type: types.value,
      phone: phoneNumber.value,
    };
    await userRegister(item);
    if (success.value) {
      console.log(success.value, "successADD");
      clear();
    }
  } else if (
    passwords.value !== rePassword.value &&
    checkPhone.value === false
  ) {
    ElMessage.error({
      message: "密码不一致及电话号码格式不正确，请重新输入",
      duration: 1000,
    });
  } else if (checkPhone.value === false) {
    ElMessage.error({
      message: "电话号码格式不正确，请重新输入",
      duration: 1000,
    });
  } else if (passwords.value !== rePassword.value) {
    ElMessage.error({
      message: "密码不一致，请重新输入",
      duration: 1000,
    });
  }
};
// 清除input框功能
function clear() {
  usernames.value = "";
  passwords.value = "";
  rePassword.value = "";
  // types.value = "";
  checks.value = false;
  phoneNumber.value = "";
}
</script>

<style lang="scss" scoped>
.resgisters {
  .v-enter-from,
  .v-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  .v-enter-to,
  .v-leave-from {
    opacity: 1;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 2s;
  }
  .card {
    // width: 400px;
    // height: 300px;
    border: 1px solid rgba(rgb(46, 96, 153), $alpha: 0.2);
    // box-shadow: inset 0 0 10px #c1d1f3;
    // background: rgba(#051d38, $alpha: 0.9);
    background: linear-gradient(to top, #051d38b0, #2a72c5b0);
    // border-radius: 16px;
    border-radius: 8px;
    box-shadow: rgb(69, 102, 202) 0px 0px 25px 3px inset;
    display: flex;
    flex-direction: column;
    padding: 80px 60px;
    gap: 20px;
    .tips {
      display: flex;
      flex-direction: row;
      align-items: center;
      p {
        color: #fff;
      }
      .drump {
        width: 300px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        // color: #3f8bd3;
        color: #fff;
        span {
          color: #fff;
          font-size: 30px;
          font-family: "Courier New", Courier, monospace;
          margin-right: 20px;
        }
      }
    }

    input {
      width: 360px;
      height: 50px;
      border: none;
      border-radius: 8px;
      padding-left: 20px;
      color: #535353;
      // font-size: 20px;
      background: rgba(#eee, $alpha: 0.9);
    }
    .errorSign {
      color: red;
    }
    .correctSign {
      color: rgb(72, 194, 83);
    }
    .clientType {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .el-radio-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .type {
          width: 360px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: #fff;
          &:hover {
            background: rgb(97, 144, 233);
            color: #fff;
          }
        }
      }
    }
    .check {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .remenber {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // height: 20px;
        // width: 20px;
        .el-checkbox {
          color: #fff;
        }
        p {
          color: #fff;
          margin-left: 20px;
        }
      }
      button {
        flex: 1;
        margin-left: 40px;
        width: 80px;
        padding: 10px 20px;
        align-self: center;
        border-radius: 8px;
        border: none;
        background: rgba(#eee, $alpha: 0.9);
        color: rgb(97, 144, 233);
        &:hover {
          background: rgb(97, 144, 233);
          color: #fff;
        }
      }
    }
    .bottom {
      display: flex;
      button {
        flex: 1;
        padding: 10px 20px;
        align-self: center;
        border-radius: 8px;
        border: none;
        background: rgba(#eee, $alpha: 0.9);
        color: rgb(97, 144, 233);
        &:hover {
          background: rgb(97, 144, 233);
          color: #fff;
        }
      }
    }
  }
}
</style>
