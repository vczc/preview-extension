import { createApp } from 'vue';
import '../../assets/style.css';
import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';

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
		appElementInstance.use(router);
		appElementInstance.use(ElementPlus);
    appElementInstance.mount('#app');
		appElementInstance.config.globalProperties.$vscode = window?.acquireVsCodeApi?.();
		// router.push({
		// 	...redirectData.replace,
		// 	state: {
		// 		params: redirectData?.params
		// 	},
		// 	replace: true
		// }); // 业务页面切换
  } catch (error: any) {
    console.log(error);
  }
}
main();

// window.onload = function () {
// 	if (import.meta.env.DEV) {
// 		redirectData = {
// 			replace: '/build-config'
// 		}
	
// 		main()
// 	} else {
// 		window.addEventListener('message', async (event) => { // 前端页面接收主进程发来的消息
// 			if (event.data.id === 'redirect') { // id是唯一通信标识符
// 				redirectData = {
// 					id: event.data?.id,
// 					replace: event.data?.replace,
// 					params: event.data?.build_data
// 				}
// 				// event.data.acquireVsCodeApi
// 				// const vscode = window?.acquireVsCodeApi?.(); // 前端页面向vscode插件主进程发送消息,唯一途径，单向
// 				// parent.acquireVsCodeApi
// 				// Use the vscode API object to send a message to the extension's backend
// 				// setTimeout(() => {// id必须是vscode:前缀
// 				// 	(vscode?.postMessage || window.parent.postMessage)?.({ id: 'vscode:message', command: 'hello', data: 'world' }, '*');
// 				// 	//debugger
// 				// })
	
// 				main()
// 			}
// 		})
// 	}
// }
