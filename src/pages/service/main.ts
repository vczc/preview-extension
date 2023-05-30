import { createApp } from 'vue';
import '../../assets/style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import './assets/main.css';

let redirectData: any = {};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vscode: any
}
}
// 两种模式

// dev模式
// build模式

async function main () {
  try {
    const appElementInstance = createApp(App);
		appElementInstance
			.use(router)
			.use(createPinia())
			.use(ElementPlus)
    		.mount('#service');
		appElementInstance.config.globalProperties.$vscode = window?.acquireVsCodeApi?.();
		
  } catch (error: any) {
    console.log(error);
  }
}
main();
