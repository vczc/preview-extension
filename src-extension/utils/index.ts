import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';


// 获取当前插件下的绝对路径
export const getExtensionFileAbsolutePath = (context: vscode.ExtensionContext, relativePath: string) => {
    return path.join(context.extensionPath, relativePath);
};

// 文件是否存在
export const isExists = (path: string) => {
    return fs.existsSync(path);
};

// showInformationMessage
export const infoMsg = (msg: string) => {
    vscode.window.showInformationMessage(msg);
};

// showWarningMessage
export const warningMsg = (msg: string) => {
    vscode.window.showWarningMessage(msg);
};

// showErrorMessage
export const errorMsg = (msg: string) => {
    vscode.window.showErrorMessage(msg);
};


export const isDev = () => {
    return process.env.ZKOS_SDK_PLUGIN_ENV === 'development';
};

export const isProd = () => {
    return process.env.ZKOS_SDK_PLUGIN_ENV === 'production';
};