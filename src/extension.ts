// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ServiceView} from './services';
import {createWebview} from './servicesWebview';
import {openDialog} from './openDialog';
import registryCommanders from './registryCommanders';
import { initZopCodeView } from './zopCodeGenerateView';
import { initZopSettingView } from './zopSettingsView';
import { initSetting } from './initProject';
import { isExists } from './utils/index';
import * as path from 'path';
import { initCompileDebugView } from './zopCompileDebugView';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('zop-plugin is now active!');
	registryCommanders(context);

	new ServiceView(context);
	
	// register openDialog command
	openDialog(context);
	createWebview(context);
	initZopCodeView(context);
	initZopSettingView(context);
	initCompileDebugView(context);
	initSetting();
	// console.log('插件内打开的文件目录', vscode.workspace.workspaceFolders);
	// console.log('当前插件工作目录', context.extensionUri);
	console.log('process.env', process);
	console.log(
		'配置文件settings.json是否存在',
		isExists(path.join(process.env.HOME as string, "Library", "Application Support", "Code", "User", "settings.json"))
	);
	console.log('搞不懂',vscode.Uri.joinPath(context.extensionUri, '.env'))
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('zop-plugin is deactive!');

}
