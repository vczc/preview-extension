import vscode, { Disposable, WebviewPanel, Uri, Webview, ViewColumn, ExtensionContext, commands } from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

export class ZopWebviewPanel {
  // 当前面板状态
  public static currentPanel: ZopWebviewPanel | undefined

  // webview 面板
  private readonly _panel: WebviewPanel

  private _disposables: Disposable[] = []

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel

    // 销毁webview视图触发清理资源
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // 设置webview html内容
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, context.extensionPath)

    this._setWebviewMessageListener(this._panel.webview)
  }

  /** webview panel 渲染 */
  public static render(context: ExtensionContext): void {
    if (ZopWebviewPanel.currentPanel) {
      ZopWebviewPanel.currentPanel._panel.reveal(ViewColumn.One)
    } else {
      const panel = vscode.window.createWebviewPanel('toolchain.tortie-preview', 'Tortie Preview', ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'out', 'web-build', 'assets')]
      })

      ZopWebviewPanel.currentPanel = new ZopWebviewPanel(panel, context)
    }
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

    console.log('🚀 ~ file: zop-webview-panel.ts:42 ~ ZopWebviewPanel ~ html=html.replace ~ html:', html)

    return html
  }

  /** 资源循环清理 */
  public dispose(): void {
    ZopWebviewPanel.currentPanel = undefined

    this._panel.dispose()

    while (this._disposables.length) {
      const disposeable = this._disposables.pop()
      disposeable && disposeable.dispose()
    }
  }

  /** 设置webview消息接收器 */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      message => {
        const command = message.command
        const text = message.text

        if (command === 'test') {
          vscode.window.showInformationMessage(text)
          return
        }
      },
      undefined,
      this._disposables
    )
  }
}

/** 初始化 zop webview panel */
export function initZopWebviewPanel(context: ExtensionContext): void {
  ZopWebviewPanel.render(context)
}
