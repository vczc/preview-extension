import * as vscode from 'vscode';
import * as path from 'path';
import { infoMsg, warningMsg } from './utils/index';
import { openWebview } from './webview';
import { ZopViewNode } from './zopCodeGenerateView';
import { getPlatformsFromSh } from './initProject';
import { getState } from './utils/common';
import { BUILD_PAGE_INITDATA, PAGE_DATAS_KEY } from './constants/config';

export let zopCompileDebugProviderInstance: ZopCompileDebugTreeDataProvider | null = null;

export class ZopCompileDebugTreeDataProvider implements vscode.TreeDataProvider<ZopViewNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ZopViewNode | undefined | null | void> = new vscode.EventEmitter<ZopViewNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ZopViewNode | undefined | null  | void> = this._onDidChangeTreeData.event;
    
    data: ZopViewNode[];
    initialData: ZopViewNode[];
    contextValue: string;

    constructor(private context: vscode.ExtensionContext) {
        const treeDataJson = this.context.globalState.get<string>('zopCompileDebugDataCache');
        this.context = context;
        this.contextValue = 'zopCompileDebug';
        this.initialData = [
            {
                id: `${new Date().getTime()+11}`, label: 'Build Settings', contextValue: 'Build_setting',
                iconPath: {
                    light: path.join(__dirname, '..', 'images/light/light_build.svg'), 
                    dark: path.join(__dirname, '..', 'images/dark/dark_build.svg'),
                },
                children: [],
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed 
            },
            {
                id: `${new Date().getTime()+22}`, label: 'Docker_Debugging', contextValue: 'Docker_Debuggingsss',
                iconPath: {
                    light: path.join(__dirname, '..', 'images/light/light_docker.svg'), 
                    dark: path.join(__dirname, '..', 'images/dark/dark_docker.svg'),
                },
                children: [],
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed 
            },
            {
                id: `${new Date().getTime()+33}`, label: 'Gdb_docker_debugging', contextValue: 'Gdb_docker_debugging',
                iconPath: {
                    light: path.join(__dirname, '..', 'images/light/light_gdb.svg'), 
                    dark: path.join(__dirname, '..', 'images/dark/dark_gdb.svg'),
                },
                children: [],
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
            },
            // {
            //     id: `${new Date().getTime()+44}`, label: 'test-清除缓存', contextValue: 'clearCacheTreeData', iconPath: {
            //         light: path.join(__dirname, '..', 'images/service.svg'), 
            //         dark: path.join(__dirname, '..', 'images/service.svg'),
            //     },
            //     children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
            //     command: {
            //         title: '测试',
            //         command: 'zopPlugin.delCache',
            //         arguments: []
            //     }
            //  },
        ];
        if (treeDataJson) {
            const _cacheData = JSON.parse(treeDataJson);
            this.data = _cacheData;
        } else {
            this.data = this.initialData;
        }
    }

    cacheTreeData() {
        this.context.globalState.update('zopCompileDebugDataCache', JSON.stringify(this.data));
    }
    
    clearCacheTreeData() {
        this.data = this.initialData;
        this.cacheTreeData();
        this.refresh();
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
    removeSubNode(node: ZopViewNode) {
        const _parentNode = this.data.find(item => item.id === node.parentId);
        const _rmIndex = _parentNode?.children?.findIndex(i => i.id === node.id) as number;
        _parentNode?.children?.splice(_rmIndex, 1);
        this.cacheTreeData();
        this.refresh();
        vscode.window.showInformationMessage(`删除成功!`);
    }
    renameSubNode(node: ZopViewNode, value: string) {
        const _parentNode = this.data.find(item => item.id === node.parentId);
        if (_parentNode?.children?.some(i => i.label === value)) {
            warningMsg(`修改成功!`);
            return;
        } else {
            node.label = value;
            this.cacheTreeData();
            this.refresh();
            infoMsg(`修改成功!`);
        }
    }
    addSubNode(node: ZopViewNode, value: string) {
        const _hasSameNode = node.children?.some(i => i.label === value);
        if (_hasSameNode) {
            warningMsg(`存在同名节点!`);
            return;
        }
        const _contextValue = `${node.contextValue}_child`;
        const _id = `${new Date().getTime()}`;
        
        const newNode: ZopViewNode = {
            label: value,
            parentId: node.id,
            id: _id,
            contextValue: _contextValue,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            tooltip: value,
            command: {
                title: value,
                command: `${node.contextValue}_click`,
                arguments: [{parentId: node.id, id: _id, contextValue: _contextValue, label: value}]
            }
        };
        node.children?.push(newNode);
        this.cacheTreeData();
        this.refresh();
        infoMsg(`新增节点: ${value} 成功!`);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

export function initCompileDebugView(context: vscode.ExtensionContext) {
    // get instance
    zopCompileDebugProviderInstance = new ZopCompileDebugTreeDataProvider(context);

    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCompileDebugView', zopCompileDebugProviderInstance));
    
    // registry addNewNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.addNewNode', (node: ZopViewNode) => {
        vscode.window.showInputBox({ prompt: '请输入名称' }).then(value => {
            if (value) {
                zopCompileDebugProviderInstance!.addSubNode(node, value);
            }
        });
    }));

    // registry renameNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.renameNode', (node: ZopViewNode) => {
        vscode.window.showInputBox({ prompt: '请输入新名称' }).then(value => {
            if (value) {
                zopCompileDebugProviderInstance!.renameSubNode(node, value);
            }
        });
    }));
    
    // registry removeNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.removeNode', (node: ZopViewNode) => {
        zopCompileDebugProviderInstance!.removeSubNode(node);
    }));
    
    // registry removeNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.delCache', () => {
        zopCompileDebugProviderInstance!.clearCacheTreeData();
        vscode.window.showInformationMessage(`清理成功!`);
        context.globalState.update(BUILD_PAGE_INITDATA, '')
        context.globalState.update(PAGE_DATAS_KEY, '')
    }));

    context.subscriptions.push(vscode.commands.registerCommand('Build_setting_click', async (node) => {
        if(await getPlatformsFromSh(context)) {
            const _buildPageInitData = getState(context, BUILD_PAGE_INITDATA)
            const _pageData = getState(context, PAGE_DATAS_KEY)
            const webviewPanel: any = openWebview(
                context,
                node.id,
                `${node.label}的配置`,
                'http://localhost:5173/build.html/#/build-config',
                'build.html'
            );
            webviewPanel[node.id].webview.postMessage({
                id: 'initdata',
                data: _buildPageInitData,
                pageId: node.id
            })
            const nodePageData = _pageData[node.id]
            if (nodePageData) {
                webviewPanel[node.id].webview.postMessage({
                    id: 'pageData',
                    data: nodePageData,
                    pageId: node.id
                })  
            }
        }
        
    }));
    
}
