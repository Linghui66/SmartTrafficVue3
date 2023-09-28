import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import App from "./App.vue";
import router from "./router";

// Element组件
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 导入mapbox样式
import "mapbox-gl/dist/mapbox-gl.css";

// 导入data-vue3
import DataVVue3 from "@kjgl77/datav-vue3";

// 导出app
export const app = createApp(App);
// 设置 axios 的基础 URL
axios.defaults.baseURL = "http://localhost:3000";
axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 将 axios 实例添加到 Vue 3 实例的全局属性中
app.config.globalProperties.axios = axios;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.use(DataVVue3);

app.mount("#app");
