<template>
  <!-- 登录页卡片 -->
  <div class="card">
    <!-- 登录失败提示 -->
    <div
      w20rem
      h18rem
      p3
      lex="~ "
      justify-center
      items-center
      bg-dark
      style="width: 30rem"
    >
      <dv-border-box10  class="bg-dark">
        <div dv-bg>
          <div class="mid">
            <p>{{ tips }}</p>
            <!-- 输入用户名 -->
            <input type="text" placeholder="请输入用户名" v-model="username" />
            <!-- 输入密码 -->
            <input
              type="password"
              placeholder="请输入密码6~12位数字"
              v-model="password"
              style="font-size: 15px"
            />
            <!-- <select v-model="type"> -->
              <!-- <option value="common">普通用户</option> -->
              <!-- <option value="traffic">交管用户</option> -->
              <!-- <option value="admin">管理员</option> -->
            <!-- </select> -->
            <!-- 用户类型 -->
            <div class="clientType">
              <el-radio-group v-model="type">
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
            <!-- 确认 -->
            <!-- <input type="checkbox" name="记住密码" id="" v-model="check"  @click="remenber"> -->
            <div class="check">
              <div class="remenber">
                <el-checkbox
                  v-model="check"
                  label="记住密码"
                  size="large"
                  @click="remenber"
                />
              </div>
              <!-- 登录按钮 -->
              <button @click="checkout">登录</button>
            </div>
            <div class="find">
              <!-- 找回密码 -->
              <a href="" @click="find">找回密码</a>
              <!-- 新用户注册 -->
              <p @click="addUser">新用户注册</p>
            </div>
          </div>
        </div>
      </dv-border-box10>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useCounterStore } from "../../../stores/index";
import { getLocalUser, setLocalUser } from "../Hooks/useLoginHook";
import { BorderBox10 as DvBorderBox10 } from "@kjgl77/datav-vue3";
import { ElMessage } from "element-plus";
const counterStore = useCounterStore();
// console.log(counterStore, 888888);
let { count } = storeToRefs(counterStore);
// console.log(count.value, 99999);
const emit = defineEmits(["add"]);
let { checkUser } = counterStore;
// console.log(checkUser,777777);
// 解构store的共享数据
let { tips,userRemenber } = storeToRefs(counterStore);
// 解构store的共享方法
// let {checkUser}=counterStore
// 用户登录输入用户名绑定的变量
let username = ref("");
// 用户登录输入密码绑定的变量
let password = ref("");
// 用户登录选择用户类型绑定的变量
let type = ref("");
let phone=ref("")
// 用户登录记住密码勾选框使用的标记
let check = ref(false);
const cardId = ref(1);

onMounted(() => {
  // 检查本地存储是否有用户保存的记住账号和密码，getLocalUser放置在logon文件夹的H
  getLocalUser(username, password, type, check, userRemenber);
});
// 切换到注册卡片
function addUser() {
  emit("add");
}
// 登录按钮的功能
const checkout=async()=> {
  // console.log(type.value);
  // 把用户的名字、密码、用户类型放到item,传递给store使用
  const item = {
    username: username.value,
    password: password.value,
    type: type.value,
  };
  // 使用来自store的登录功能，需要传入用户的名字、密码、用户类型，item包含了这些
  // console.log(checkUser, 888);
  await checkUser(item);
  if (!check.value) {
    let i = ref(3);
    const reset = () => {
      i.value--;
      if (i.value <= 0) {
        clearInterval(timer);
        username.value = "";
        password.value = "";
        type.value = "";
        userRemenber.value = false;
        check.value = false;
      }
    };
    var timer = setInterval(reset, 1000);
  }
}
// 记住密码功能
function remenber() {
  // setLocalUser放置在logon文件夹的Hooks
  setLocalUser(userRemenber, username, password, type);
}
// 找回密码功能
function find() {
  ElMessage.success({
   message: "请联系管理员，QQ666666，电话15915888888",
   duration: 3000,
 });
 return
}
</script>

<style lang="scss" scoped>
.card {
  // width: 400px;
  // height: 300px;
  // border: 1px solid rgba(rgb(46, 96, 153), $alpha: 0.2);
  // box-shadow: inset 0 0 10px #c1d1f3;
  // background: rgba(#eee, $alpha: 0.2);
  // border-radius: 8px;
  // box-shadow: rgb(29, 72, 196) 0px 0px 25px 3px inset;
  display: flex;
  flex-direction: column;
  padding: 80px 60px;
  gap: 20px;
  .bg-dark{
    // background: rgba(#051d38, $alpha: 0.9);
    background:linear-gradient(to top , #051d38b0, #2a72c5b0);
  }
  .mid {
    margin: 40px;
    // width: 10px;
    // height: 500px;
    display: flex;
    flex-direction: column;
    padding: 60px 10px;
    // background: rgba(#eee, $alpha: 0.8);
    p {
      color: #fff;
      margin-bottom: 20px;
    }
    input {
      height: 50px;
      border: none;
      border-radius: 8px;
      padding-left: 20px;
      color: #535353;
      margin-bottom: 20px;
      // font-size: 20px;
      background: rgba(#eee, $alpha: 0.9);
    }
    .clientType {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      .el-radio-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .type {
          width: 100px;
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
      margin-bottom: 20px;
      .remenber {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // height: 20px;
        // width: 20px;
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
        color:  rgb(97, 144, 233);
        &:hover {
          background: rgb(97, 144, 233);
          color: #fff;
        }
      }
    }
    .find {
      display: flex;
      width: 100%;
      justify-content: center;
      a {
        color: rgb(242, 242, 250);
        &:hover {
          color: rgb(159, 18, 194);
        }
      }
      p {
        margin-left: 40px;
        color:  rgb(242, 242, 250);
        &:hover {
          color: rgb(159, 18, 194);
        }
      }
    }
  }
}
</style>
