"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const services_1 = require("./services");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "zop-plugin" is now active!');
    let showHello = vscode.commands.registerCommand('zop-plugin.zopHello', (uri) => {
        // 参数uri为当前选中资源路径
        vscode.window.showInformationMessage(`你好呀 zop-plugin! uri::${uri}`);
    });
    new services_1.ServiceView(context);
    context.subscriptions.push(showHello);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map