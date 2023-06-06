import * as os from 'os'
import { CHROME_ARGS } from './const'

type ChromiumPath = string | undefined
class HeadlessBrowser {
  /** 启动无头浏览器 */
  private launchHeadlessBrowser() {
    const arg = [...CHROME_ARGS]
    const isLinux = os.platform() === 'linux'

    isLinux && arg.pop()
  }

  /** 获取chromium路径 */
  private _getChromiumPath(): ChromiumPath {
    const chromiunPath: ChromiumPath = undefined
    return chromiunPath
  }
}
