<template>
  <div>
    <!-- 用户下拉功能菜单 -->
    <el-dropdown
      class="userAbility"
      :hide-on-click="false"
      @command="handleCommand"
    >
      <span class="dropDown"><el-icon class="el-icon--left"><UserFilled />
        </el-icon>{{ clientList.username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <div v-if="clientList.type === 'admin'">
            <el-dropdown-item command="search">用户管理</el-dropdown-item>
            <el-dropdown-item command="noticeManage">公告管理</el-dropdown-item>
            <el-dropdown-item command="noticeRelease"
              >公告发布</el-dropdown-item
            >
            <!-- <el-dropdown-item command="eventUpdates"
              >交通事件更新</el-dropdown-item
            > -->
          </div>
          <el-dropdown-item command="amend">修改个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 用户管理弹窗（管理员专用） -->
    <el-dialog
      v-model="userTableVisible"
      title="用户列表管理页面"
      style="height: 700px; overflow-y: auto"
      @close="toggleClose"
    >
      <el-table :data="userList">
        <el-table-column property="username" label="用户名称" width="150" />
        <el-table-column property="type" label="用户类型" width="150" />
        <el-table-column property="isOnline" label="是否在线" width="100" />
        <el-table-column align="right">
          <template #header>
            <div style="display: flex;">
              <el-input
                v-model="userTableSearch"
                size="small"
                placeholder="用户查询"
                width="150"
                @keyup.enter="getUser"
              />
              <el-button type="primary" @click="getUser" style="margin-left:20px">查询</el-button>
              <el-button type="success" style="margin-left:20px" @click="addNewUser">新增用户</el-button>
            </div>
          </template>

          <template #default="scope">
            <el-button
              class="amend"
              size="small"
              type="danger"
              @click="amendUser(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="userDelete(scope.$index, scope.row)"
              >删除用户</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 公告管理弹窗 -->
    <el-dialog
      v-model="noticeManageDialogVisible"
      title="公告管理页面"
      style="width: 1000px; height: 750px"
    >
      <el-table
        :data="noticeData"
        style="width: 100%; height: 650px; overflow-y: auto"
      >
        <el-table-column fixed prop="noticeTime" label="发布时间" width="150" />
        <el-table-column prop="noticeName" label="公告名称" width="120" />
        <el-table-column
          prop="noticeSurvivalDay"
          label="公告持续天数"
          width="120"
        />
        <el-table-column prop="noticeInfo" label="公告内容" width="600" />
        <el-table-column prop="noticeType" label="严重等级" width="120" />
        <el-table-column fixed="right" label="操作" width="120">
          <el-table-column prop="isOnline" label="是否显示" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isOnline"
                class="ml-2"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                @change="noticeSwitchChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="删除" width="120">
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                @click="noticeDelete(scope.$index, scope.row.id)"
                >删除公告</el-button
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 修改用户信息弹窗（管理员专用 可以修改所有用户的信息） -->
    <el-dialog v-model="tryAmend">
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
          <el-input v-model="userTableSearch" :disabled="true"/>
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
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增用户（管理员专用） -->
     <AddUser :addNewUserByAdmin="addNewUserByAdmin"></AddUser>
     <!--修改个人信息弹窗(每个用户均可使用 只能修改自己的信息) -->
     <AmendSelfInfo :amendSelf="amendSelf" @reAmend="reAmend"></AmendSelfInfo>
    <!-- 公告发布弹窗 -->
    <el-dialog
      v-model="noticeReleaseVisible"
      title="请输入您所需发布的公告内容"
      style="height: 700px; overflow-y: auto"
    >
      <el-form
        :inline="true"
        :model="noticeForm"
        label-width="400px"
        label-position="top"
      >
        <el-form-item label="公告名称">
          <el-input v-model="noticeForm.noticeName" style="width: 800px" />
        </el-form-item>
        <el-form-item label="公告严重等级">
          <el-select
            v-model="noticeForm.noticeType"
            placeholder="选择公告严重等级"
          >
            <el-option label="无影响" value="unimportant" />
            <el-option label="预警" value="warning" />
            <el-option label="危害" value="dangerous" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告发布显示时间">
          <div class="block">
            <el-date-picker
              v-model="noticeForm.noticeTime"
              type="datetime"
              placeholder="选择公告发布显示时间"
              :default-time="defaultTime"
            />
          </div>
        </el-form-item>
        <el-form-item label="公告存续时间">
          <el-input
            v-model="noticeForm.noticeSurvivalDay"
            placeholder="请输入公告存续时间"
            clearable
          />
        </el-form-item>
        <el-form-item label="公告详细内容">
          <el-input
            v-model="noticeForm.noticeInfo"
            type="textarea"
            style="width: 800px; height: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            @click="noticeReleaseVisible = false"
            style="margin-left: 550px"
            >取消发布</el-button
          >
          <el-button type="primary" @click="onSubmit">公告提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 事件更新弹窗 -->
    <el-dialog
      v-model="eventTableVisible"
      title="交通事件更新管理页面"
      style="height: 700px; width: 1000px; overflow-y: auto"
    >
      <el-table :data="gridData">
        <el-table-column
          property="userEventName"
          label="提交用户"
          width="200"
        />
        <el-table-column property="eventType" label="事件类型" width="250" />
        <el-table-column
          property="eventInfo"
          label="事件详细内容"
          width="350"
        />
        <el-table-column align="right">
          <template #header>
            <el-input
              v-model="eventSearch"
              size="small"
              placeholder="事件查询"
            />
          </template>
          <template #default="scope">
            <el-button
              type="success"
              size="small"
              @click="updateSubmit(scope.$index, scope.row)"
              >提交更新</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="eventDelete(scope.$index, scope.row)"
              >删除该事件</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ref, reactive, onMounted } from "vue";
import { useCounterStore } from "../../../../stores/index";
import AddUser from './UserManegement/AddUser.vue'
import AmendSelfInfo from './UserManegement/AmendSelfInfo.vue'
import {
  postMockHttp,
  deleteMockHttp,
  patchMockHttp,
  getMockHttp,
} from "../../../../request/MockNoticeRequest/index";
import {
  checkInput,
  checkName,
  checkPassword,
} from "../../../logon/Hooks/useLoginHook";
const counterStore = useCounterStore();
let { clientList, userList } = storeToRefs(counterStore);
let { userLogOut, searchUser, delUer, closeSearch, amendUserData } =counterStore;
let username = ref("");
let password = ref("");
let type = ref("");
let phone = ref("");
let isOnline = ref(false);
let options = [
  { label: "在线", value: true },
  { label: "下线", value: false },
];
let valueChange = ref("");
let userIndex = ref("");
let userRow = ref("");
let addNewUserByAdmin=ref(false)
let amendSelf=ref(false)
const handleCommand = (command) => {
  switch (command) {
    case "search":
      userTableVisible.value = true;
      break;
    case "noticeManage":
      noticeManageDialogVisible.value = true;
      break;
    case "noticeRelease":
      noticeReleaseVisible.value = true;
      break;
    // case "eventUpdates":
    //   eventTableVisible.value = true;
    //   break;
    case "logout":
      logout();
      break;
    case "amend":
      amend()
  }
};
/* 用户管理菜单块 */
const userTableVisible = ref(false);
const userTableSearch = ref("");
const tryAmend = ref(false);

/* const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
const handleEdit = (index, row) => {
  console.log(index, row)
}
*/
/* 公告管理模块 */
const noticeManageDialogVisible = ref(false);
// 公告数据获得
const noticeData = ref([]);
const getNoticeInfo = () => {
  setInterval(async () => {
    const res = await getMockHttp();
    for (let i = 0; i < res.length; i++) {
      let exists = noticeData.value.some((obj) => obj.id === res[i].id);
      if (!exists) {
        noticeData.value.push(res[i]);
      }
    }
  }, 2000);
};

// 公告状态更改及删除
const noticeSwitchChange = (row) => {
  const patchData = {
    isOnline: row.isOnline,
  };
  patchMockHttp([row.id, patchData]);
};
const noticeDelete = (index, id) => {
  noticeData.value.splice(index, 1);
  deleteMockHttp(id);
};
/* 用户公告发布块 */
const noticeReleaseVisible = ref(false);

const noticeForm = reactive({
  noticeName: "",
  noticeTime: "",
  noticeLevel: "",
  noticeInfo: "",
  noticeSurvivalDay: "",
  noticeType: "",
  isOnline: false,
});
const onSubmit = () => {
  ElMessage({
    showClose: true,
    message: "公告提交成功",
    type: "success",
  });
  postMockHttp(noticeForm);
  noticeReleaseVisible.value = false;
  noticeForm.value = {
    noticeName: "",
    noticeTime: "",
    noticeLevel: "",
    noticeInfo: "",
    noticeSurvivalDay: "",
    noticeType: "",
    isOnline: false,
  };
};

// 关闭查询弹窗
const toggleClose = () => {
  closeSearch();
  userTableSearch.value = "";
};

// 查询用户信息
const getUser = () => {
  // console.log(11);
  searchUser(userTableSearch.value);
};

// 退出
const logout = () => {
  userLogOut();
};

// 删除用户
const userDelete = (index, row) => {
  delUer(index, row);
};
// 新增用户(管理员专用)
const addNewUser=()=>{
  addNewUserByAdmin.value=!addNewUserByAdmin.value
}

// 修改用户信息(管理员专用)
const amendUser = (index, row) => {
  let question = window.confirm(`确定修改${row.username}吗`);
  if (question) {
    tryAmend.value = !tryAmend.value;
    userIndex.value = index;
    userRow.value = row;
    username.value = row.username;
    password.value = row.password;
    type.value = row.type;
    phone.value = row.phone;
    valueChange.value = row.isOnline;
    // console.log(userIndex.value,userRow.value,"yuyu");
  }
};

// 修改用户信息--提交按钮(管理员专用)
const submitForm = () => {
  // console.log(userIndex.value, 45454);
  if (username.value === "") {
    return alert("名字不能为空");
  }
  const resName = checkName(username.value, userList, userRow);
  // console.log(resName,67676);
  const resPassword = checkPassword(password.value);
  // console.log(resPassword,"resp");
  const res = checkInput(phone.value);
  // console.log(res,"phone");
  if (resName) {
    alert("名字重复");
  } else {
    if (res && resPassword) {
      if (valueChange.value === true || valueChange.value === false) {
        const item = {
          username: username.value,
          password: password.value,
          type: type.value,
          phone: phone.value,
          isOnline: valueChange.value,
        };
        amendUserData(userRow, item);
        // summit.value = false;
        username.value = "";
        password.value = "";
        type.value = "";
        phone.value = "";
        isOnline.value = false;
        // }
        tryAmend.value = !tryAmend.value;
      } else {
        alert("请选择在线状态");
      }
    } else if (res === false) {
      alert("电话号码格式不正确");
    } else if (resPassword === false) {
      alert("密码格式不正确，请输入6~12位数字");
    }
  }
};

// 修改个人信息（所有用户使用）
const amend=()=>{
  searchUser(clientList.value.type);
  amendSelf.value=!amendSelf.value
}
const reAmend=()=>{
  amendSelf.value=!amendSelf.value
}
/* 事件更新管理模块 */
const eventTableVisible = ref(false);
const eventSearch = ref("");
onMounted(() => {
  getNoticeInfo();
});
</script>

<style lang="scss" scoped>
.dropDown {
  color: whitesmoke;
  cursor: pointer;
}
.amend {
  background: rgb(221, 157, 18);
  border: rgb(221, 157, 18);
  &:hover {
    background: rgb(235, 205, 151);
  }
}
.userType {
  margin-left: -20px;
  margin-bottom: 20px;
}
.select {
  // margin-left: 40px;
  height: 40px;
}
</style>
