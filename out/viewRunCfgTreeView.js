"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunCfgView = exports.RunCfgDataProvider = void 0;
const vscode = require("vscode");
const path = require("path");
class RunCfgDataProvider {
    constructor(context) {
        this.context = context;
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        RunCfgDataProvider.treeData = [
            { label: 'Build Settings', contextValue: 'Buiild_setting', iconPath: 'images/service.svg', children: [] },
            { label: 'Docker_Debugging', contextValue: 'Docker_Debugging', iconPath: 'images/service.svg', children: [] },
            { label: 'Gdb_docker_debugging', contextValue: 'Gdb_docker_debugging', iconPath: 'images/service.svg', children: [] },
        ];
        const runCfgTreeData = this.context.globalState.get('runCfgTreeData');
        console.log('获取缓存菜单', RunCfgDataProvider.treeData, runCfgTreeData);
        // 定义数据源，这里只是一个示例
        if (!!runCfgTreeData) {
            RunCfgDataProvider.treeData = runCfgTreeData;
        }
    }
    static addChild(child) {
        console.log('跟数据', RunCfgDataProvider.treeData);
        const parent = RunCfgDataProvider.treeData.find(item => item.contextValue === child.parentContextValue);
        if (parent?.children?.some((i) => i.label === child.label)) {
            vscode.window.showWarningMessage(`名称已存在!`);
            return;
        }
        else {
            parent.children.push(child);
            console.log('新增了', this);
            this._onDidChangeTreeData.fire();
        }
    }
    static data(arg0, data) {
        throw new Error('Method not implemented.');
    }
    // 实现 getChildren 方法，返回当前节点的子节点
    getChildren(node) {
        if (node) {
            return node.children;
        }
        else {
            return RunCfgDataProvider.treeData;
        }
    }
    // 实现 getTreeItem 方法，返回当前节点对应的 TreeItem 对象
    getTreeItem(node) {
        return {
            label: node.label,
            iconPath: node.iconPath ? path.join(__dirname, '..', 'images', 'service.svg') : '',
            command: {
                command: 'runCfg.treeItemClicked',
                title: 'click',
                arguments: [node],
            },
            contextValue: node.contextValue,
            // collapsibleState: node.children?.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
            collapsibleState: vscode.TreeItemCollapsibleState.None
        };
    }
}
exports.RunCfgDataProvider = RunCfgDataProvider;
class RunCfgView {
    constructor(context) {
        const view = vscode.window.createTreeView('RunCfgTreeView', { treeDataProvider: new RunCfgDataProvider(context) });
        context.subscriptions.push(view);
        const treeItemClickedEvent = vscode.commands.registerCommand('runCfg.treeItemClicked', (node) => {
            console.log('当前点击节点', node);
            // vscode.commands.executeCommand('extension.openServiceWebview');
            // vscode.window.showInformationMessage(`你点击了 ${node.label}`);
        });
        context.subscriptions.push(treeItemClickedEvent);
    }
}
exports.RunCfgView = RunCfgView;
//# sourceMappingURL=viewRunCfgTreeView.js.map