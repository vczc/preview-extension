// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ServiceView} from './services'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "zop-plugin" is now active!');

	let showHello = vscode.commands.registerCommand('zop-plugin.zopHello', (uri) => {
		// 参数uri为当前选中资源路径
		vscode.window.showInformationMessage(`你好呀 zop-plugin! uri::${uri}`);
	});
	new ServiceView(context);
	context.subscriptions.push(showHello);
}

// This method is called when your extension is deactivated
export function deactivate() {}
