"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const registryCommanders_1 = require("./registryCommanders");
const zopCodeGenerateView_1 = require("./zopCodeGenerateView");
const zopSettingsView_1 = require("./zopSettingsView");
const zopServiceDebugView_1 = require("./zopServiceDebugView");
const initProject_1 = require("./initProject");
// import { isExists } from './utils/index';
const path = require("path");
const zopCompileDebugView_1 = require("./zopCompileDebugView");
const dotenv = require("dotenv");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('zop-plugin is now active!');
    // 初始化 env
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    (0, registryCommanders_1.default)(context);
    // 服务开发部署工具
    (0, zopCodeGenerateView_1.initZopCodeView)(context);
    // 编译调试工具
    (0, zopCompileDebugView_1.initCompileDebugView)(context);
    // 服务
    (0, zopServiceDebugView_1.initServiceDebugView)(context);
    // 设置
    (0, zopSettingsView_1.initZopSettingView)(context);
    // 初始化设置
    (0, initProject_1.initSetting)();
    // console.log('插件内打开的文件目录', vscode.workspace.workspaceFolders);
    // console.log('当前插件工作目录', context.extensionUri);
    // console.log('process.env', process.env);
    // console.log(
    // 	'配置文件settings.json是否存在',
    // 	isExists(path.join(process.env.HOME as string, "Library", "Application Support", "Code", "User", "settings.json"))
    // );
    // console.log('搞不懂',vscode.Uri.joinPath(context.extensionUri, '.env'))
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    console.log('zop-plugin is deactive!');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map