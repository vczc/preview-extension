"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initZopCodeView = exports.ZopCodeGenerateTreeDataProvider = exports.zopCodeProviderInstance = void 0;
const vscode = require("vscode");
const path = require("path");
exports.zopCodeProviderInstance = null;
class ZopCodeGenerateTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.context = context;
        this.data = [
            {
                id: `${new Date().getTime() + 1}`, label: '工具链', contextValue: 'Tool_Chain',
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
}
exports.ZopCodeGenerateTreeDataProvider = ZopCodeGenerateTreeDataProvider;
function initZopCodeView(context) {
    // get instance
    exports.zopCodeProviderInstance = new ZopCodeGenerateTreeDataProvider(context);
    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCodeGenerate', exports.zopCodeProviderInstance));
    // 点击工具链
    context.subscriptions.push(vscode.commands.registerCommand("toolChain.click", () => {
        console.log('点击工具链');
        const mathExt = vscode.extensions.getExtension("toolchain.Tortie-preview");
        const importedApi = mathExt.exports;
        // const url = "http://127.0.0.1:15000/service_demo/#/service/service_design";
        const url = "https://www.baidu.com";
        importedApi.createWebview(url);
    }));
}
exports.initZopCodeView = initZopCodeView;
//# sourceMappingURL=zopCodeGenerateView.js.map