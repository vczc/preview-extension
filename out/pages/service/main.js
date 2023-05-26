"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
require("../../assets/style.css");
const App_vue_1 = require("./App.vue");
const router_1 = require("./router");
const pinia_1 = require("pinia");
const element_plus_1 = require("element-plus");
require("./assets/main.css");
let redirectData = {};
// 两种模式
// dev模式
// build模式
async function main() {
    try {
        const appElementInstance = (0, vue_1.createApp)(App_vue_1.default);
        appElementInstance
            .use(router_1.default)
            .use((0, pinia_1.createPinia)())
            .use(element_plus_1.default)
            .mount('#service');
        appElementInstance.config.globalProperties.$vscode = window?.acquireVsCodeApi?.();
    }
    catch (error) {
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
//# sourceMappingURL=main.js.map