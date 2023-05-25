"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const index_1 = require("./utils/index");
function default_1(context) {
    // 刷新 公用方法
    context.subscriptions.push(vscode.commands.registerCommand('view.refresh', (node) => {
        console.log(node);
        switch (node.contextValue) {
            case 'Build_setting':
                // zopCodeProviderInstance?.refresh();
                break;
            default:
                // zopCodeProviderInstance?.refresh();
                break;
        }
        (0, index_1.infoMsg)(`刷新按钮点击!`);
    }));
    // 服务校验点击
    // context.subscriptions.push(vscode.commands.registerCommand("serviceVerify.click", () => {
    //     console.log("serviceVerify.click!");
    // }));
}
exports.default = default_1;
//# sourceMappingURL=registryCommanders.js.map