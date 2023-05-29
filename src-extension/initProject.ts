import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export const initSetting = () => {
    const _isExists = fs.existsSync(path.join(__dirname, '../.vscode'));
    console.log('是否存在目录',_isExists);
    const config = vscode.workspace.getConfiguration();
    const configPath = config.get('Zoks: Global SDK Path');
    console.log('配置项 Zoks: Global SDK Path', configPath);
};

  