import * as process from 'process'
import * as path from 'path'
import * as fs from 'fs'
import { env } from 'vscode'

/** 剪贴板提供对系统剪贴板写的访问 */
export const writeText = (value: string): Thenable<void> => {
  return env.clipboard.writeText(value)
}

/** 剪贴板提供对系统剪贴板读的访问 */
export const readText = (): Thenable<string> => {
  return env.clipboard.readText()
}

/** 初始化Dpr配置 */
export const initFixedDprConfig = (): void => {
  const { parse, stringify } = require('comment-json')

  const settingPath = getSettingJsonPath()

  const content = fs.readFileSync(settingPath, 'utf-8')

  const data = parse(content)

  fs.writeFileSync(settingPath, stringify({ ...data, 'window.zoomLevel': 0 }, null, 2))
}

/** 获取vscode setting.json路径 */
function getSettingJsonPath(): string {
  const os = process.platform
  const NES = (str?: string) => str || ''

  const appData: Record<string, () => string> = {
    win32: () => path.join(path.join(NES(process.env.APPDATA), 'Code', 'User', 'settings.json')),
    linux: () => path.join(path.join(NES(process.env.HOME), '.config', 'Code', 'User', 'settings.json')),
    darwin: () => path.join(path.join(NES(process.env.HOME), 'Library', 'Application Support', 'Code', 'USer', 'settings.json'))
  }

  return appData?.[os]?.()
}
