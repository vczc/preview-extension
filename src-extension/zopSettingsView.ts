import * as vscode from 'vscode';
import * as path from 'path';
import { ZopViewNode } from './zopCodeGenerateView';

export let zopSettingViewInstance: ZopSettingViewTreeDataProvider | null = null;
export class ZopSettingViewTreeDataProvider implements vscode.TreeDataProvider<ZopViewNode> {
    data: ZopViewNode[];

    constructor(private context: vscode.ExtensionContext) {
        const treeDataJson = this.context.globalState.get<string>('zopSettingDataCache');
        this.context = context;
        if (treeDataJson) {
            const _cacheData = JSON.parse(treeDataJson);
            this.data = _cacheData;
        } else {
            this.data = [
                {
                    id: `${new Date().getTime()+1}`, label: '设置', contextValue: 'Settings',
                    iconPath: {
                        light: path.join(__dirname, '..', 'images/light_setting.svg'), 
                        dark: path.join(__dirname, '..', 'images/dark_setting.svg'),
                    },
                    children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
                    command: {
                        title: '设置',
                        command: 'zopPlugin.openSetting',
                        arguments: []
                    }
                }
            ];
        }
    }


    getTreeItem(element: ZopViewNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: ZopViewNode | undefined): vscode.ProviderResult<ZopViewNode[]> {
        if (element) {
            return element.children;
        } else {
            return this.data;
        }
    }
}

export function initZopSettingView(context: vscode.ExtensionContext) {
    // get instance
    zopSettingViewInstance = new ZopSettingViewTreeDataProvider(context);

    // registry the setting tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopSetting', zopSettingViewInstance));
    
    // registry open user settings command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.openSetting', (node: ZopViewNode) => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'Zoks: Global SDK Path');
    }));
    
}
