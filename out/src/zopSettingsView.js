"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initZopSettingView = exports.ZopSettingViewTreeDataProvider = exports.zopSettingViewInstance = void 0;
const vscode = require("vscode");
const path = require("path");
exports.zopSettingViewInstance = null;
class ZopSettingViewTreeDataProvider {
    constructor(context) {
        this.context = context;
        const treeDataJson = this.context.globalState.get('zopSettingDataCache');
        this.context = context;
        if (treeDataJson) {
            const _cacheData = JSON.parse(treeDataJson);
            this.data = _cacheData;
        }
        else {
            this.data = [
                {
                    id: `${new Date().getTime() + 1}`, label: '设置', contextValue: 'Settings',
                    iconPath: {
                        light: path.join(__dirname, '..', 'images/service.svg'),
                        dark: path.join(__dirname, '..', 'images/service.svg'),
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
        console.log(this.data);
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
exports.ZopSettingViewTreeDataProvider = ZopSettingViewTreeDataProvider;
function initZopSettingView(context) {
    // get instance
    exports.zopSettingViewInstance = new ZopSettingViewTreeDataProvider(context);
    // registry the setting tree view
    context.subscriptions.push(vscode.window.registerTreeDataProvider('zopSetting', exports.zopSettingViewInstance));
    // registry open user settings command
    context.subscriptions.push(vscode.commands.registerCommand('zopPlugin.openSetting', (node) => {
        console.log('打开设置');
        vscode.commands.executeCommand('workbench.action.openSettings', 'Zoks: Global SDK Path');
    }));
}
exports.initZopSettingView = initZopSettingView;
//# sourceMappingURL=zopSettingsView.js.map