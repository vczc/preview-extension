import * as vscode from 'vscode';
import { zopCodeProviderInstance } from './zopCodeGenerateView';
import { infoMsg } from './utils/index';

export default function(context: vscode.ExtensionContext) {
    
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
        infoMsg(`刷新按钮点击!`);
    }));

    // 服务校验点击
    // context.subscriptions.push(vscode.commands.registerCommand("serviceVerify.click", () => {
    //     console.log("serviceVerify.click!");
    // }));

  
}