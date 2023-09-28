import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getClientHttp } from "../request/index";
import axios from "axios";
import router from "../router";
import { ElMessage } from "element-plus";
export const useCounterStore = defineStore("main", () => {
  let count = ref(1);
  // 各组件共享的用户名字、类型、token
  let clientList = ref("");
  // 登录失败提示语
  let tips = ref("");
  let success = ref(false);
  let time = ref(3);
  let userList = ref([]);
  let allLayerVisible = ref(true);
  let userRemenber = ref(false);
  let layerArr = ref([]);
  let bufferArr = ref([]);
  let jsonForEveryone = ref([]);
  // 测试获取数据库的用户数据==成功
  const getClient = async () => {
    const res = await getClientHttp();
    console.log(res);
    clientList.value = res;
  };
  // 公用baseURL，不能删
  axios.defaults.baseURL = "http://localhost:3000";

  // 登录功能
  // 用户名、密码、type 与JSON数据的一致则返回code:200
  const checkUser = async (item) => {
    console.log("login");
    // 登录查询
    const res = await axios.post("/api/login", {
      username: item.username,
      password: item.password,
      type: item.type,
    });
    // console.log("uuuu");
    // console.log(res);
    // 如果res.code=200说明请求成功
    if (res.code === 200) {
      // 把用户名字、类型、token记录下来，作为公共数据分发给各组件使用
      clientList.value = {
        username: item.username,
        type: item.type,
        token: res.token,
        phone: res.phone,
        id: res.id,
        // password:window.btoa(item.password)
      };
      // console.log(clientList.value,8899);
      // 把token保存到本地存储
      localStorage.setItem("token", JSON.stringify(res.token));
      // 把clientList保存到临时会话存储，用于home页面刷新时重新获取用户的登录信息，重新渲染在home页面
      sessionStorage.setItem("blotter", JSON.stringify(clientList.value));
      ElMessage.success({
        message: "登录成功",
        duration: 1000,
      });

      // 跳转页面到主页
      router.push(`/home?id=${clientList.value.id}`);
      // 如果res.code==400说明请求失败
    } else if (res.code === 400) {
      // 把登录失败提示赋值给tips,登录卡片显示登录失败提示
      (tips.value = "用户名或密码或用户类型错误☹，请重新输入"),
        ElMessage.error({
          message: "登录失败，请再次尝试",
          duration: 2000,
        });
      // 为保证路由一致停留在登录页，可以使用router.back()强制停留，
      // 后面测试如果登录失败不发生任何调整页面的情况，可以将此行去掉
      router.back();
      // router.push("/")
    }
  };
  // 注册功能
  const userRegister = async (item) => {
    console.log("register");

    // 注册（普通用户使用）
    const res = await axios.post("/api/register", {
      username: item.username,
      password: item.password,
      type: item.type,
      phone: item.phone,
    });
    console.log(res);
    // 如果注册成功，显示注册成功
    if (res.code === 200) {
      (tips.value = "注册成功"), (success.value = true);
      ElMessage.success({
        message: "注册成功",
        duration: 1000,
      });
      // 3秒后自动跳转到home页面
      const drump = () => {
        time.value--;
        if (time.value <= 0) {
          clearInterval(timer);
          checkUser(item);
        }
      };
      var timer = setInterval(drump, 1000);
    } else {
      // (tips.value = "注册失败"),
       (success.value = false);
      ElMessage.error({
        message: "注册失败，已有相同账号名称",
        duration: 2000,
      });
    }
  };
  // 新增账号功能（管理员使用）
  const addUserFor = async (item) => {
    console.log("add");
    const res = await axios.post("/api/register", {
      username: item.username,
      password: item.password,
      type: item.type,
      phone: item.phone,
    });
    console.log(res);
    // 如果新增成功，显示添加成功
    if (res.code === 200) {
      success.value=true
      console.log(success,"jjjjj");
      searchUser(item.type);
      ElMessage.success({
        message: "新增成功",
        duration: 1000,
      });
      return 
    } else {
      success.value=false
      ElMessage.error({
        message: "添加失败，已有相同账号名称",
        duration: 2000,
      });
      return
    }
   
  };
  // 退出账号功能
  const userLogOut = async () => {
    console.log(clientList.value.type, clientList.value.username, 99);
    const res = await axios.post("/api/logout", {
      type: clientList.value.type,
      username: clientList.value.username,
    });
    console.log(res);
    localStorage.removeItem("token");
    clientList.value = "";
    // router.push("/");
    router.back();
    tips.value = "请登录";
    success.value = false;
    time.value = 3;
  };
  // 查询用户功能
  const searchUser = async (item) => {
    let url = `/api/user?type=${item}`;
    const res = await axios.get(
      url,
      // 必须要添加头部信息
      {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")),
        },
      }
    );
    console.log(res);
    if (res.code === 200) {
      //渲染列表
      userList.value = res.result;
      // ElMessage.success({
      // message: "查询成功",
      // duration: 1000,
      // });
    } else if (res.code === 400) {
      ElMessage.error({
        message: "查询类型有误，应为common|traffic|admin其中一种",
        duration: 2000,
      });
      // alert("查询类型有误，应为common|traffic|admin其中一种");
    }
  };
  // 删除用户功能
  const delUer = async (index, row) => {
    // 询问是否删除，question为真则删除
    let question = window.confirm(`确定删除${row.username}吗`);
    if (question) {
      const res = await axios.post("/api/delete", {
        type: row.type,
        username: row.username,
      });
      console.log("删除", res);
      // 如果后台删除成功，渲染列表删除该项，刷新列表
      if (res.code === 200) {
        userList.value.splice(index, 1);
        ElMessage.success({
          message: "删除成功",
          duration: 1000,
        });
      } else {
        ElMessage.error({
          message: "删除失败",
          duration: 2000,
        });
      }
    }
  };
  // 修改用户数据功能（管理员专用）
  const amendUserData = async (userRow, item) => {
    // if(userIndex){
    console.log(userRow, item, 57575757);
    const res = await axios.patch("/api/amend", {
      id: userRow.value.id,
      username: item.username,
      password: item.password,
      type: item.type,
      phone: item.phone,
      isOnline: item.isOnline,
    });
    console.log("修改", res);
    if (res.code === 200) {
      searchUser(userRow.value.type);
      // alert("修改成功")
      ElMessage.success({
        message: "修改成功",
        duration: 1000,
      });
    } else {
      ElMessage.error({
        message: "修改失败",
        duration: 2000,
      });
    }
    // }
  };
  // 清除用户查询到的列表
  const closeSearch = () => {
    userList.value = [];
  };

  // 页面刷新时获取临时会话的用户数据
  const getSeesion=()=>{
  const res=JSON.parse(sessionStorage.getItem('blotter'))
  // 赋值给clientList,页面右上角能重新显示用户名称，能执行退出操作
  clientList.value=res
  return res
  }
  // 收集图层功能
  const layerCollect = (layer) => {
    const czName = ref("");
    if (layer.id.slice(0, 8) === "rounding") {
      czName.value = layer.id;
      bufferArr.value.push({
        id: layer.id,
        isVisible: true,
        name: czName.value,
      });
      // console.log(bufferArr.value,"bufferArr.value");
    } else {
      if (layer.id === "houseLayer") {
        czName.value = "居民区";
      } else if (layer.id === "roadLayer") {
        czName.value = "道路";
      } else if (layer.id.slice(0, 10) === "eventLayer") {
        czName.value = "事件" + layer.id.slice(10, 11);
      } else if (layer.id === "cameraLayer") {
        czName.value = "监控";
      } else if (layer.id === "policeOfficeLayer") {
        czName.value = "警局";
      } else {
        czName.value = layer.id;
      }
      layerArr.value.push({
        id: layer.id,
        isVisible: true,
        name: czName.value,
      });
    }
  };
  // 图层显示功能
  const layerVisible = (item) => {
    layerArr.value.map((_item) => {
      if (_item.id === item.id) {
        _item.isVisible = !_item.isVisible;
      }
    });
  };
  // 全部图层显示功能
  const toggleAllLayer = () => {
    const res = layerArr.value.every((item) => item.isVisible);
    // console.log(res,777);
    allLayerVisible.value = res;
  };
  const toggleTreeLayer = () => {
    allLayerVisible.value = !allLayerVisible.value;
    layerArr.value.map((item) => {
      item.isVisible = allLayerVisible.value;
    });
  };

  //echart数据
  let echartData = ref([]);
  function changeEchart(data) {
    echartData.value = data.features;
    // console.log(data,'0909')
    // console.log(echartData,55555);
  }

  // 使用方法把echartdata传递出去
  function returnEchartDate() {
    let data = null;
    if (echartData !== null) {
      data = echartData;
    }
    return data;
  }

  function newechartData(data) {
    echartData.value.push(data);
    console.log(echartData, 369);
  }
  //
  let popId = ref(null);
  function popUPId(num) {
      popId.value = num;
  }

  const getGeoJSON = async (jsonData) => {
    // console.log(jsonData.data,44544);
    jsonForEveryone.value = await jsonData.features;
    // console.log(jsonForEveryone.value, "store");
  };

  return {
    count,
    checkUser,
    clientList,
    tips,
    success,
    time,
    userList,
    userRegister,
    userLogOut,
    searchUser,
    delUer,
    changeEchart,
    closeSearch,
    echartData,
    getSeesion,
    popUPId,
    popId,
    newechartData,
    layerVisible,
    layerArr,
    allLayerVisible,
    toggleAllLayer,
    toggleTreeLayer,
    amendUserData,
    returnEchartDate,
    addUserFor,
    userRemenber,
    layerCollect,
    getGeoJSON,
    jsonForEveryone,
    bufferArr,
  };
});
