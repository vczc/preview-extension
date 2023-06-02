import * as vscode from 'vscode';
import * as path from 'path';
import { ZopViewNode } from './zopCodeGenerateView';
import { openWebview } from './webview';
export let zopServiceDebugInstance: ZopServiceDebugTreeDataProvider | null = null;
import { startServer, stopServer } from './serviceBackendServer';
import { checkSDKPath, warningMsg } from './utils';
import { SDK_PATH_NAME } from './constants/config';
export class ZopServiceDebugTreeDataProvider implements vscode.TreeDataProvider<ZopViewNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ZopViewNode | undefined | null | void> = new vscode.EventEmitter<ZopViewNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ZopViewNode | undefined | null  | void> = this._onDidChangeTreeData.event;
    
    data: ZopViewNode[];

    constructor(private context: vscode.ExtensionContext) {
        this.context = context;
        const _serviceCheckId= `${new Date().getTime()+31}`
        const _serviceContextValue= `${new Date().getTime()+31}`
        const _serviceLabel = '服务验证'
        this.data = [
            {
                id: _serviceCheckId,
                label: _serviceLabel,
                contextValue: _serviceContextValue,
                iconPath: {
                    light: path.join(__dirname, '..', 'images/light/light_service.svg'), 
                    dark: path.join(__dirname, '..', 'images/dark/dark_service.svg'),
                },
                children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    title: '服务验证',
                    command: `serviceCheck.click`,
                    arguments: [{
                        id: _serviceCheckId,
                        contextValue: _serviceContextValue,
                        label: _serviceLabel
                    }]
                }
            }
        ];
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

export function initServiceDebugView(context: vscode.ExtensionContext) {
    // get instance
    zopServiceDebugInstance = new ZopServiceDebugTreeDataProvider(context);

    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCheckDebugToolView', zopServiceDebugInstance));
    
    // 点击服务验证
    context.subscriptions.push(vscode.commands.registerCommand("serviceCheck.click", async (node) => {
        await startServer()
        if (!checkSDKPath()) {
            warningMsg("请先配置Global Sdk Path !");
            vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
            return
        }
        setTimeout(() => {
            console.log('1s打开webview回调');
            openWebview(context, node.id, `服务验证`, process.env.SERVICE_WEBVIEW, 'service.html', stopServer);
        }, 1000);
            
    }));
    
}
