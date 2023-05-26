"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSetting = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const initSetting = () => {
    const _isExists = fs.existsSync(path.join(__dirname, '../.vscode'));
    console.log('是否存在目录', _isExists);
    const config = vscode.workspace.getConfiguration();
    const configPath = config.get('Zoks: Global SDK Path');
    console.log('配置项 Zoks: Global SDK Path', configPath);
};
exports.initSetting = initSetting;
//# sourceMappingURL=initProject.js.map