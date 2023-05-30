import * as vscode from 'vscode';
import { zopCompileDebugProviderInstance } from './zopCompileDebugView';
import { infoMsg } from './utils/index';

export default function(context: vscode.ExtensionContext) {
    // 刷新 公用方法
    context.subscriptions.push(vscode.commands.registerCommand('view.refresh', (node) => {
        switch (node.contextValue) {
            case 'Build_setting':
                zopCompileDebugProviderInstance?.refresh();
                break;
            default:
                zopCompileDebugProviderInstance?.refresh();
                break;
        }
        infoMsg(`刷新成功!`);
    }));
}