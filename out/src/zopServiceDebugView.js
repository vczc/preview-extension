"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServiceDebugView = exports.ZopServiceDebugTreeDataProvider = exports.zopServiceDebugInstance = void 0;
const vscode = require("vscode");
const path = require("path");
const webview_1 = require("./webview");
exports.zopServiceDebugInstance = null;
class ZopServiceDebugTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.context = context;
        const _serviceCheckId = `${new Date().getTime() + 31}`;
        const _serviceContextValue = `${new Date().getTime() + 31}`;
        const _serviceLabel = '服务验证';
        this.data = [
            {
                id: _serviceCheckId,
                label: _serviceLabel,
                contextValue: _serviceContextValue,
                iconPath: {
                    light: path.join(__dirname, '..', 'images/service.svg'),
                    dark: path.join(__dirname, '..', 'images/service.svg'),
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
exports.ZopServiceDebugTreeDataProvider = ZopServiceDebugTreeDataProvider;
function initServiceDebugView(context) {
    // get instance
    exports.zopServiceDebugInstance = new ZopServiceDebugTreeDataProvider(context);
    // registry the tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCheckDebugToolView', exports.zopServiceDebugInstance));
    // 点击服务验证
    context.subscriptions.push(vscode.commands.registerCommand("serviceCheck.click", (node) => {
        (0, webview_1.openWebview)(context, node.id, `服务验证`, process.env.SERVICE_WEBVIEW, 'service.html');
    }));
}
exports.initServiceDebugView = initServiceDebugView;
//# sourceMappingURL=zopServiceDebugView.js.map