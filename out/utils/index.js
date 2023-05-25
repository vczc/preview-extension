"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMsg = exports.warningMsg = exports.infoMsg = exports.isExists = exports.getExtensionFileAbsolutePath = void 0;
const fs = require("fs");
const vscode = require("vscode");
const path = require("path");
// 获取当前插件下的绝对路径
const getExtensionFileAbsolutePath = (context, relativePath) => {
    return path.join(context.extensionPath, relativePath);
};
exports.getExtensionFileAbsolutePath = getExtensionFileAbsolutePath;
// 文件是否存在
const isExists = (path) => {
    return fs.existsSync(path);
};
exports.isExists = isExists;
// showInformationMessage
const infoMsg = (msg) => {
    vscode.window.showInformationMessage(msg);
};
exports.infoMsg = infoMsg;
// showWarningMessage
const warningMsg = (msg) => {
    vscode.window.showWarningMessage(msg);
};
exports.warningMsg = warningMsg;
// showErrorMessage
const errorMsg = (msg) => {
    vscode.window.showErrorMessage(msg);
};
exports.errorMsg = errorMsg;
//# sourceMappingURL=index.js.map