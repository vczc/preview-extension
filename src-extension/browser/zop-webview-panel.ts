import vscode, { Disposable, WebviewPanel, Uri, Webview, ViewColumn, ExtensionContext, commands } from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { HeadlessBrowser } from './headless-browser'
import { CustomEventName, CdpPageEventName } from './const'
import { ExtensionConfiguration } from './interface'

export class ZopWebviewPanel extends HeadlessBrowser {
  // 当前面板状态
  // public static currentPanel: ZopWebviewPanel | undefined

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
    // if (ZopWebviewPanel.currentPanel) {
    //   ZopWebviewPanel.currentPanel._panel.reveal(ViewColumn.One)
    // } else {
    // const name = 'Tortie Preview'
    // const viewType = 'toolchain.tortie-preview'
    // const panel = vscode.window.createWebviewPanel(viewType, name, ViewColumn.One, {
    //   enableScripts: true,
    //   retainContextWhenHidden: true,
    //   localResourceRoots: [vscode.Uri.joinPath(ZopWebviewPanel._context.extensionUri, 'out', 'web-build', 'assets')]
    // })
    // ZopWebviewPanel.currentPanel = new ZopWebviewPanel(panel)
    // }
    try {
      await this.launchPage()

      // TODO:
      this.cdp.on('test', () => {})

      this.cdp.else((type: any, data: any) => {
        console.log('🚀 panel cdp消息转发', { type, data })
        this._sendWebviewPostMessage({ type, data })
      })
    } catch (e) {
      console.log('puppeteer newPage failed', e)
    }

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

  /** 资源循环清理 */
  public dispose(): void {
    // ZopWebviewPanel.currentPanel = undefined

    this._panel.dispose()

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
        const { type, params } = msg
        console.log('插件接收消息~~~~~~~~', { type, params })

        if (type === CustomEventName.UPDATE_TITLE) {
          this._panel.title = params.title
          return
        }

        if (type === CustomEventName.WINDOW_OPEN_REQUESTED) {
          const url = params.url
          new ZopWebviewPanel(url)
        }

        if (type === CustomEventName.OPEN_FILE) {
        }

        if (type === CustomEventName.WINDOW_DIALOG_REQUESTED) {
          const actions: Record<string, () => void> = {
            alert: () => {},
            prompt: () => {},
            confirm: () => {}
          }

          actions[type]?.()
        }

        if (type === CustomEventName.APP_STATE_CHANGED) {
        }

        this.cdp.send(type, params)
      },
      undefined,
      this._disposables
    )
  }

  /** cdp协议发送消息 */
  private async _cdpSendMessage(type: string, params: any): Promise<void> {
    try {
      await this.cdp.send(type, params)
    } catch (e) {
      console.error('CDP failed to send message', e)
    }
  }

  /** cdp协议接收消息 */
  private _cdpReviceMessage() {
    this.cdp.on('Animation.animationCreated', () => console.log('Animation created!'))
  }
}

/** 初始化 zop webview panel */
export function initZopWebviewPanel(context: ExtensionContext): void {
  // 初始化实例前，先设置插件上下文（函数使用时无需传参）
  ZopWebviewPanel.context = context
  new ZopWebviewPanel()
}
