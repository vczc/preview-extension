"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCompileDebugView = exports.ZopCompileDebugTreeDataProvider = exports.zopCompileDebugProviderInstance = void 0;
const vscode = require("vscode");
const path = require("path");
const index_1 = require("./utils/index");
const webview_1 = require("./webview");
exports.zopCompileDebugProviderInstance = null;
class ZopCompileDebugTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        const treeDataJson = this.context.globalState.get('zopCompileDebugDataCache');
        this.context = context;
        this.contextValue = 'zopCompileDebug';
        this.initialData = [
            { id: `${new Date().getTime() + 11}`, label: 'Build Settings', contextValue: 'Build_setting', iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'),
                    dark: path.join(__dirname, '..', 'images/service.svg'),
                }, children: [], collapsibleState: vscode.TreeItemCollapsibleState.Collapsed },
            { id: `${new Date().getTime() + 22}`, label: 'Docker_Debugging', contextValue: 'Docker_Debuggingsss', iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'),
                    dark: path.join(__dirname, '..', 'images/service.svg'),
                }, children: [], collapsibleState: vscode.TreeItemCollapsibleState.Collapsed },
            { id: `${new Date().getTime() + 33}`, label: 'Gdb_docker_debugging', contextValue: 'Gdb_docker_debugging', iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'),
                    dark: path.join(__dirname, '..', 'images/service.svg'),
                }, children: [], collapsibleState: vscode.TreeItemCollapsibleState.Collapsed },
            {
                id: `${new Date().getTime() + 44}`, label: 'test-清除缓存', contextValue: 'clearCacheTreeData', iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'),
                    dark: path.join(__dirname, '..', 'images/service.svg'),
                },
                children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    title: '测试',
                    command: 'zopPlugin.delCache',
                    arguments: []
                }
            },
        ];
        if (treeDataJson) {
            const _cacheData = JSON.parse(treeDataJson);
            this.data = _cacheData;
        }
        else {
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
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return element.children;
        }
        else {
            return this.data;
        }
    }
    removeSubNode(node) {
        const _parentNode = this.data.find(item => item.id === node.parentId);
        const _rmIndex = _parentNode?.children?.findIndex(i => i.id === node.id);
        _parentNode?.children?.splice(_rmIndex, 1);
        this.cacheTreeData();
        this.refresh();
        vscode.window.showInformationMessage(`删除成功!`);
    }
    renameSubNode(node, value) {
        const _parentNode = this.data.find(item => item.id === node.parentId);
        if (_parentNode?.children?.some(i => i.label === value)) {
            (0, index_1.warningMsg)(`修改成功!`);
            return;
        }
        else {
            node.label = value;
            this.cacheTreeData();
            this.refresh();
            (0, index_1.infoMsg)(`修改成功!`);
        }
    }
    addSubNode(node, value) {
        const _hasSameNode = node.children?.some(i => i.label === value);
        if (_hasSameNode) {
            (0, index_1.warningMsg)(`存在同名节点!`);
            return;
        }
        const _contextValue = `${node.contextValue}_child`;
        const _id = `${new Date().getTime()}`;
        const newNode = {
            label: value,
            parentId: node.id,
            id: _id,
            contextValue: _contextValue,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            tooltip: value,
            command: {
                title: value,
                command: `${node.contextValue}_click`,
                arguments: [{ parentId: node.id, id: _id, contextValue: _contextValue, label: value }]
            }
        };
        node.children?.push(newNode);
        this.cacheTreeData();
        this.refresh();
        (0, index_1.infoMsg)(`新增节点: ${value} 成功!`);
        console.log(node);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.ZopCompileDebugTreeDataProvider = ZopCompileDebugTreeDataProvider;
function initCompileDebugView(context) {
    // get instance
    exports.zopCompileDebugProviderInstance = new ZopCompileDebugTreeDataProvider(context);
    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCompileDebugView', exports.zopCompileDebugProviderInstance));
    // registry addNewNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.addNewNode', (node) => {
        vscode.window.showInputBox({ prompt: '请输入名称' }).then(value => {
            if (value) {
                exports.zopCompileDebugProviderInstance.addSubNode(node, value);
            }
        });
    }));
    // registry renameNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.renameNode', (node) => {
        vscode.window.showInputBox({ prompt: '请输入新名称' }).then(value => {
            console.log(node, value);
            if (value) {
                exports.zopCompileDebugProviderInstance.renameSubNode(node, value);
            }
        });
    }));
    // registry removeNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.removeNode', (node) => {
        exports.zopCompileDebugProviderInstance.removeSubNode(node);
    }));
    // registry removeNode command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.delCache', () => {
        exports.zopCompileDebugProviderInstance.clearCacheTreeData();
        vscode.window.showInformationMessage(`清理成功!`);
        console.log('掉到了');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('Build_setting_click', (node) => {
        console.log('点击了Build_setting_click', node);
        (0, webview_1.openWebview)(context, node.id, `${node.label}的配置`);
    }));
}
exports.initCompileDebugView = initCompileDebugView;
//# sourceMappingURL=zopCompileDebugView.js.map