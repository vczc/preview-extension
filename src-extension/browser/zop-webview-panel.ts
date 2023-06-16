import * as fs from 'fs'
import * as path from 'path'
import vscode, { Disposable, WebviewPanel, Webview, ViewColumn, ExtensionContext } from 'vscode'
import { HeadlessBrowser } from './headless-browser'
import { ExtensionConfiguration } from './interface'
import { CustomEventName, CdpPageEventName } from './const'
import { readText, writeText, initFixedDprConfig } from './utils'
import { promises } from 'dns'

export class ZopWebviewPanel extends HeadlessBrowser {
  // webview 面板
  private _panel: WebviewPanel | any

  private _disposables: Disposable[] = []

  static context: ExtensionContext

  // web页面配置
  private _webConfig: ExtensionConfiguration = {
    format: 'png',
    startUrl: 'https://news.baidu.com/',
    columnNumber: 2
  }

  constructor(url?: string) {
    super()
    this.loadWebview()
  }

  /** webview panel 渲染 */
  public async loadWebview(url?: string): Promise<void> {
    await this.createBrowserPage()

    const name = 'Tortie Preview'
    const viewType = 'toolchain.tortie-preview'

    this._panel = vscode.window.createWebviewPanel(viewType, name, ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(ZopWebviewPanel.context.extensionUri, 'out', 'web-build', 'assets')]
    })

    // 销毁webview视图触发清理资源
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // 设置webview html内容
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, ZopWebviewPanel.context.extensionPath)

    // 接收web信息
    this._receiveWebviewMessage(this._panel.webview)

    // 如果传入url，则更新web加载页面url（一般用于当前webview开启新webview时）
    url && (this._webConfig.startUrl = url)

    // 通知web页面渲染规格
    this._sendWebviewPostMessage({ type: CustomEventName.APP_CONFIGURATION, result: this._webConfig })

    initFixedDprConfig()
  }

  /** 获取webview html内容 */
  private _getWebviewContent(webview: Webview, extensionPath: string, htmlName = 'browser.html'): string {
    const htmlPath = path.resolve(__dirname, `./web-build/${htmlName}`)

    let html = fs.readFileSync(htmlPath, 'utf-8')

    const resourcePath = path.join(extensionPath, `out/web-build/${htmlName}`)
    const dirPath = path.dirname(resourcePath)

    const webviewUri = (localFilePath: string) => {
      const resourceUri = vscode.Uri.file(localFilePath)
      return webview.asWebviewUri(resourceUri)
    }

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + webviewUri(path.join(dirPath, $2)) + '"'
    })

    return html
  }

  /** 创建无头浏览器页面并连接cdp通信 */
  private async createBrowserPage(): Promise<void> {
    try {
      await this.launchPage()

      this.cdp.else((type: any, data: any) => {
        console.log('🚀 panel cdp消息转发', { type, data })
        this._sendWebviewPostMessage({ type, data })
      })
    } catch (e) {
      console.log('puppeteer newPage failed', e)
    }
  }

  /** 资源循环清理 */
  public dispose(): void {
    this._panel?.dispose()

    this.browserDispose()

    while (this._disposables.length) {
      const disposeable = this._disposables.pop()
      disposeable && disposeable.dispose()
    }
  }

  /** 插件发送webview消息 */
  private _sendWebviewPostMessage(data: any) {
    this._panel && this._panel.webview.postMessage(data)
  }

  /** 插件接收webview消息 */
  private _receiveWebviewMessage(webview: Webview) {
    webview.onDidReceiveMessage(
      msg => {
        const { type, params, callbackId } = msg

        this._handleReceiveMessage(type, params, callbackId)

        this.cdp.send(type, params)
      },
      undefined,
      this._disposables
    )
  }

  /** 处理接收webview信息 */
  private _handleReceiveMessage(action: string, data: object, callbackId?: number): void {
    const { resolve, reject } = {
      resolve: (result: any) => this.emit({ callbackId, result }),
      reject: (err: any) => this.emit({ callbackId, error: err.message })
    }

    const actions: Record<string, any> = {
      [CdpPageEventName.GO_FORWARD]: async () => await this.page.goForward(),
      [CdpPageEventName.GO_BACKWARD]: async () => await this.page.goBack(),
      [CustomEventName.READ_TEXT]: () => readText().then(resolve, reject),
      [CustomEventName.WRITE_TEXT]: () => writeText((data as any).value).then(resolve, reject),
      // 向cdp协议发送消息，获得结果再发回给webview
      default: () => this.cdp.send(action, data).then(resolve, reject)
    }

    actions[action] ? actions[action]() : actions['default']()
  }
}

/** 初始化 zop webview panel */
export function initZopWebviewPanel(context: ExtensionContext): void {
  // 初始化实例前，先设置插件上下文（函数使用时无需传参）
  ZopWebviewPanel.context = context
  new ZopWebviewPanel()
}
