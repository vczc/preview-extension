"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const services_1 = require("./services");
const servicesWebview_1 = require("./servicesWebview");
const openDialog_1 = require("./openDialog");
const registryCommanders_1 = require("./registryCommanders");
const zopCodeGenerateView_1 = require("./zopCodeGenerateView");
const zopSettingsView_1 = require("./zopSettingsView");
const initProject_1 = require("./initProject");
const index_1 = require("./utils/index");
const path = require("path");
const zopCompileDebugView_1 = require("./zopCompileDebugView");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('zop-plugin is now active!');
    (0, registryCommanders_1.default)(context);
    new services_1.ServiceView(context);
    // register openDialog command
    (0, openDialog_1.openDialog)(context);
    (0, servicesWebview_1.createWebview)(context);
    (0, zopCodeGenerateView_1.initZopCodeView)(context);
    (0, zopSettingsView_1.initZopSettingView)(context);
    (0, zopCompileDebugView_1.initCompileDebugView)(context);
    (0, initProject_1.initSetting)();
    // console.log('插件内打开的文件目录', vscode.workspace.workspaceFolders);
    // console.log('当前插件工作目录', context.extensionUri);
    console.log('process.env', process);
    console.log('配置文件settings.json是否存在', (0, index_1.isExists)(path.join(process.env.HOME, "Library", "Application Support", "Code", "User", "settings.json")));
    console.log('搞不懂', vscode.Uri.joinPath(context.extensionUri, '.env'));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    console.log('zop-plugin is deactive!');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map