"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDialog = void 0;
const vscode = require("vscode");
function openDialog(context) {
    context.subscriptions.push(vscode.commands.registerCommand('zopplugin.selectFile', () => {
        vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: '请选择文件'
        }).then(fileUri => {
            if (fileUri && fileUri[0]) {
                const filePath = fileUri[0].fsPath;
                console.log('选择的文件路径为:', filePath);
                // 在这里可以对文件路径进行处理
            }
        });
    }));
}
exports.openDialog = openDialog;
//# sourceMappingURL=openDialog.js.map