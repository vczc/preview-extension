// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import registryCommanders from './registryCommanders';
import { initZopCodeView } from './zopCodeGenerateView';
import { initZopSettingView } from './zopSettingsView';
import { initServiceDebugView } from './zopServiceDebugView';
import { initCompileDebugView } from './zopCompileDebugView';
import { initSetting } from './initProject';
// import { isExists } from './utils/index';
import * as path from 'path';
import * as dotenv from 'dotenv';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('zop-plugin is now active!');
	// 初始化 env
    dotenv.config({ path:  path.resolve(__dirname, '../.env')});
	// console.log('融合env')
	console.log('12测试是否成功1')
	registryCommanders(context);

	// 服务开发部署工具
	initZopCodeView(context);
	// 编译调试工具
	initCompileDebugView(context);
	// 服务
	initServiceDebugView(context);
	// 设置
	initZopSettingView(context);
	
	// 初始化设置
	initSetting();
	// console.log('插件内打开的文件目录', vscode.workspace.workspaceFolders);
	// console.log('当前插件工作目录', context.extensionUri);
	// console.log('process.env', process.env);
	// console.log(
	// 	'配置文件settings.json是否存在',
	// 	isExists(path.join(process.env.HOME as string, "Library", "Application Support", "Code", "User", "settings.json"))
	// );
	// console.log('搞不懂',vscode.Uri.joinPath(context.extensionUri, '.env'))
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('zop-plugin is deactive!');

}
