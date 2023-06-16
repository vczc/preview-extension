import * as os from 'os'
import { EventEmitter } from 'events'
import puppeteer from 'puppeteer-core'
import * as chrome from 'karma-chrome-launcher'
import { CHROME_ARGS } from './const'
import { ChromiumPath, HeadlessBrowserParams } from './interface'
const EventEmitterEnhancer = require('event-emitter-enhancer')
const EnhancedEventEmitter = EventEmitterEnhancer.extend(EventEmitter)

export class HeadlessBrowser extends EnhancedEventEmitter {
  // 当前浏览器
  private browser: any

  // 当前页面
  public page: any

  // 用于和chrome Devtools Protocol原生通信
  public cdp: any

  // 当前系统名称
  private platform: string = os.platform()

  constructor() {
    super()
  }

  /** 启动无头浏览器 */
  private async _launchHeadlessBrowser(): Promise<void> {
    const arg: string[] = [...CHROME_ARGS]
    const isLinux: boolean = this.platform === 'linux'
    const executablePath: ChromiumPath = this._getChromiumPath()

    // 为linux时剔除最后一个参数
    isLinux && arg.pop()

    const params: HeadlessBrowserParams = {
      arg,
      headless: true,
      executablePath,
      defaultViewport: null
    }

    try {
      this.browser = await puppeteer.launch(params)
    } catch (e) {
      console.error('headless browser initialization faild', e)
    }
  }

  public async launchPage(): Promise<void> {
    // 浏览器未启动时
    if (!this.browser) {
      await this._launchHeadlessBrowser()
    }

    this.page = await this.browser.newPage()
    this.cdp = await this.page.target().createCDPSession()

    EventEmitterEnhancer.modifyInstance(this.cdp)

    // this.cdp.else((action: string, data: object) => {
    //   console.log('cdp发出消息', { action, data })
    //   this.emit({
    //     method: action,
    //     result: data
    //   })
    // })
  }

  /** 浏览器资源清理 */
  public browserDispose(): void {
    this.cdp.dispose()
    this.page.close()

    if (this.browser) {
      this.browser.close()
      this.browser = null
    }
  }

  /** 获取chromium路径 */
  private _getChromiumPath(): ChromiumPath {
    const chromiums = Object.keys(chrome)
    let chromiunPath: ChromiumPath = undefined

    chromiums.forEach(key => {
      // 找不到名称含有launcher的启动器
      if (!key.startsWith('launcher')) {
        return
      }

      // @ts-ignore
      const info: typeof import('karma-chrome-launcher').example = chrome[key]
      const _prototype = info[1].prototype
      const _default_cmd = _prototype.DEFAULT_CMD

      // 找不到默认可执行文件
      if (!_prototype || !_default_cmd) {
        return
      }

      // 载入对应平台的可执行文件路径
      const maybeThisPath = _default_cmd[this.platform]

      if (maybeThisPath && typeof maybeThisPath === 'string') {
        chromiunPath = maybeThisPath
      }
    })

    return chromiunPath
  }
}
