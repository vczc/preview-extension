import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { SDK_PATH_NAME } from '../constants/config';


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

// check the skd path has its value
export const checkSDKPath = () => {
    let config = vscode.workspace.getConfiguration().get(SDK_PATH_NAME);
    return !!config
}

// check the skd path has sdk_buil.sh file 
export const checkShExists = () => {
    let config: string = vscode.workspace.getConfiguration().get(SDK_PATH_NAME) || '';
    return fs.existsSync(path.join(config, "sdk_build.sh"))
}