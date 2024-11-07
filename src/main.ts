import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import router from "./router";
import store from "./store";
import "@/access";
import "bytemd/dist/index.css";
import "highlight.js/styles/stackoverflow-light.css";
import hljs from "highlight.js/lib/core";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import java from "highlight.js/lib/languages/java";
import Echarts from "vue-echarts";
import * as echarts from "echarts";

hljs.registerLanguage("java", java);

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(hljsVuePlugin);
app.use(store);
app.use(router);
app.component("e-charts", Echarts);
app.config.globalProperties.$echarts = echarts;
app.mount("#app");
