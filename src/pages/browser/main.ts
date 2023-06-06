import { createApp } from "vue";
import "../../assets/style.css";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";

let redirectData: any = {};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $vscode: any;
  }
}

// 两种模式
// dev模式
// build模式

async function main() {
  try {
    const appElementInstance = createApp(App);
    appElementInstance.use(router);
    appElementInstance.use(ElementPlus);
    appElementInstance.mount("#app");
    appElementInstance.config.globalProperties.$vscode =
      window?.acquireVsCodeApi?.();
  } catch (error: any) {
    console.log(error);
  }
}

main();
