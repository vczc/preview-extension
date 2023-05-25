"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceView = void 0;
const vscode = require("vscode");
const path = require("path");
class MyTreeDataProvider {
    constructor() {
        // 定义数据源，这里只是一个示例
        this.data = [
            { id: 1, label: '服务验证', iconPath: 'images/service.svg' },
            { id: 2, label: '节点2', children: [
                    { id: 3, label: '子节点1' },
                    { id: 4, label: '子节点2' },
                ] },
            { id: 5, label: '节点3', children: [] },
        ];
    }
    // 实现 getChildren 方法，返回当前节点的子节点
    getChildren(node) {
        if (node) {
            return node.children;
        }
        else {
            return this.data;
        }
    }
    // 实现 getParent 方法，返回当前节点的父节点
    // getParent(node: MyTreeNode): MyTreeNode | undefined {
    //   // 省略实现
    // }
    // 实现 getTreeItem 方法，返回当前节点对应的 TreeItem 对象
    getTreeItem(node) {
        return {
            label: node.label,
            iconPath: node.iconPath ? path.join(__dirname, '..', 'images', 'service.svg') : '',
            command: {
                command: 'zopCheckDebugToolView.treeItemClicked',
                title: 'click',
                arguments: [node],
            },
            collapsibleState: node.children?.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        };
    }
}
class ServiceView {
    constructor(context) {
        const view = vscode.window.createTreeView('zopCheckDebugToolView', { treeDataProvider: new MyTreeDataProvider() });
        context.subscriptions.push(view);
        const treeItemClickedEvent = vscode.commands.registerCommand('zopCheckDebugToolView.treeItemClicked', (node) => {
            console.log('当前点击节点', node);
            vscode.commands.executeCommand('extension.openServiceWebview');
            vscode.window.showInformationMessage(`你点击了 ${node.label}`);
        });
        context.subscriptions.push(treeItemClickedEvent);
    }
}
exports.ServiceView = ServiceView;
//# sourceMappingURL=debuggerZop.js.map