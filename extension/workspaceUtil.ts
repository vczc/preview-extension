import * as process from 'process';
import * as path from 'path';
import * as fs from 'fs';

interface AppData {
  [key: string]: () => string;
}

export default class WorkSpaceUtil {
  // 获取工作区setting.json配置路径
  static getSettingJsonPath(): string {
    const os = process.platform;
    const NES = (str?: string) => str || '';

    const appData: AppData = {
      win32: () => path.join(path.join(NES(process.env.APPDATA), 'Code', 'User', 'settings.json')),
      linux: () => path.join(path.join(NES(process.env.HOME), '.config', 'Code', 'User', 'settings.json')),
      darwin: () => path.join(path.join(NES(process.env.HOME), 'Library', 'Application Support', 'Code', 'USer', 'settings.json')),
    };

    return appData[os] ? appData[os]() : '';
  }

  // 初始化固定DPR配置
  static initFixedDprConfig(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { parse, stringify } = require('comment-json');

    const settingPath = this.getSettingJsonPath();

    const content = fs.readFileSync(settingPath, 'utf-8');

    const data = parse(content);

    fs.writeFileSync(settingPath, stringify({ ...data, 'window.zoomLevel': 0 }, null, 2));
  }
}
