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
export function activate(context: vscode.ExtensionContext) {
	console.log('zop-plugin is now active!');
	// merge .env file's env variables
    dotenv.config({ path:  path.resolve(__dirname, '../.env')});
	// registry all common commanders
	registryCommanders(context);

	// initial code generator tools panel treeviews
	initZopCodeView(context);
	// initial compile and debug panel treeviews
	initCompileDebugView(context);
	// initial services tool panel treeviews
	initServiceDebugView(context);
	// initial settings panel treeviews
	initZopSettingView(context);
	
	// initial somethings~
	initSetting(context);
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
