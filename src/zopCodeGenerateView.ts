import * as vscode from 'vscode';
import * as path from 'path';
// const {nanoid} = require('nanoid');
import {nanoid} from 'nanoid';
import { infoMsg, warningMsg } from './utils';
// Activating extension 'wuazhu.wuazhu-vscode-plugin-demo' failed: require() of ES Module
export interface ZopViewNode extends vscode.TreeItem {
    label: string;
    contextValue: string;
    parentId?: string;
    children?: ZopViewNode[];
}

export let zopCodeProviderInstance: ZopCodeGenerateTreeDataProvider | null = null;

export class ZopCodeGenerateTreeDataProvider implements vscode.TreeDataProvider<ZopViewNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ZopViewNode | undefined | null | void> = new vscode.EventEmitter<ZopViewNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ZopViewNode | undefined | null  | void> = this._onDidChangeTreeData.event;
    
    data: ZopViewNode[];

    constructor(private context: vscode.ExtensionContext) {
        this.context = context;
        this.data = [
            {
                id: `${new Date().getTime()+1}`, label: '工具链', contextValue: 'Tool_Chain',
                iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'), 
                    dark: path.join(__dirname, '..', 'images/service.svg'),
                },
                children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    title: '工具链',
                    command: `toolChain.click`
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

export function initZopCodeView(context: vscode.ExtensionContext) {
    // get instance
    zopCodeProviderInstance = new ZopCodeGenerateTreeDataProvider(context);

    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCodeGenerate', zopCodeProviderInstance));
    
    // 点击工具链
    context.subscriptions.push(vscode.commands.registerCommand("toolChain.click", () => {
        console.log('点击工具链');
        const mathExt: any = vscode.extensions.getExtension("toolchain.Tortie-preview");
        const importedApi = mathExt.exports;
        // const url = "http://127.0.0.1:15000/service_demo/#/service/service_design";
        const url = "https://www.baidu.com";
        importedApi.createWebview(url);
    }));
    
}
