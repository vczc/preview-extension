import * as path from 'path';
import * as vscode from 'vscode';
import * as EventEmitter from 'eventemitter2';

import Browser from './browser';
import BrowserPage from './browserPage';
import { ExtensionConfiguration } from './extensionConfiguration';
import { uuid } from './uuid';

export const PANEL_TITLE = 'Tortie Preview';

export class BrowserViewWindow extends EventEmitter.EventEmitter2 {
  private static readonly viewType = 'browser-preview';
  private _panel: vscode.WebviewPanel | null;
  private _disposables: vscode.Disposable[] = [];
  private state = {};
  public browserPage: BrowserPage | null;
  private browser: Browser;
  public id: string;
  public config: ExtensionConfiguration;
  static extensionContext: vscode.ExtensionContext;

  constructor(config: ExtensionConfiguration, browser: Browser, id?: string) {
    super();
    this.config = config;
    this._panel = null;
    this.browserPage = null;
    this.browser = browser;
    this.id = id || uuid();
  }

  public async launch(startUrl?: string) {
    try {
      this.browserPage = await this.browser.newPage();
      if (this.browserPage) {
        this.browserPage.else((data: any) => {
          if (this._panel) {
            this._panel.webview.postMessage(data);
          }
        });
      }
    } catch (err) {
      // @ts-ignore
      vscode.window.showErrorMessage(err.message);
    }
    let showOptions = {
      viewColumn: vscode.ViewColumn.Beside,
    };
    this._panel = vscode.window.createWebviewPanel(BrowserViewWindow.viewType, 'Tortie Preview', showOptions, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(BrowserViewWindow.extensionContext.extensionUri, 'build', 'dist', 'assets')],
    });
    this._panel.webview.html = this.getContent(this._panel);
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.onDidReceiveMessage(
      msg => {
        if (msg.type === 'extension.updateTitle') {
          if (this._panel) {
            this._panel.title = msg.params.title;
            return;
          }
        }
        if (msg.type === 'extension.windowOpenRequested') {
          this.emit('windowOpenRequested', {
            url: msg.params.url,
          });
        }
        if (msg.type === 'extension.openFile') {
          this.handleOpenFileRequest(msg.params);
        }
        if (msg.type === 'extension.windowDialogRequested') {
          const { message, type } = msg.params;
          if (type == 'alert') {
            vscode.window.showInformationMessage(message);
            if (this.browserPage) {
              this.browserPage.send('Page.handleJavaScriptDialog', {
                accept: true,
              });
            }
          } else if (type === 'prompt') {
            vscode.window.showInputBox({ placeHolder: message }).then(result => {
              if (this.browserPage) {
                this.browserPage.send('Page.handleJavaScriptDialog', {
                  accept: true,
                  promptText: result,
                });
              }
            });
          } else if (type === 'confirm') {
            vscode.window.showQuickPick(['Ok', 'Cancel']).then(result => {
              if (this.browserPage) {
                this.browserPage.send('Page.handleJavaScriptDialog', {
                  accept: result === 'Ok',
                });
              }
            });
          }
        }
        if (msg.type === 'extension.appStateChanged') {
          this.state = msg.params.state;
          this.emit('stateChanged');
        }
        if (this.browserPage) {
          try {
            // not sure about this one but this throws later with unhandled
            // 'extension.appStateChanged' message
            if (msg.type !== 'extension.appStateChanged') {
              this.browserPage.send(msg.type, msg.params, msg.callbackId);
            }
            this.emit(msg.type, msg.params);
          } catch (err) {
            // @ts-ignore
            vscode.window.showErrorMessage(err);
          }
        }
      },
      null,
      this._disposables
    );
    // Update starturl if requested to launch specifi page.
    if (startUrl) {
      this.config.startUrl = startUrl;
    }
    this._panel.webview.postMessage({
      method: 'extension.appConfiguration',
      result: this.config,
    });
  }

  public getContent(panel: vscode.WebviewPanel): string {
    const webview = panel.webview;
    const scriptPathOnDisk = vscode.Uri.joinPath(BrowserViewWindow.extensionContext.extensionUri, 'build', 'dist', 'assets', 'index.js');
    const stylePathOnDisk = vscode.Uri.joinPath(BrowserViewWindow.extensionContext.extensionUri, 'build', 'dist', 'assets', 'index.css');
    const scriptResetUri = webview.asWebviewUri(scriptPathOnDisk);
    const styleResetUri = webview.asWebviewUri(stylePathOnDisk);

    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Vite + React + TS</title>
          <script type="module" src="${scriptResetUri}"></script>
          <link rel="stylesheet" href="${styleResetUri}">
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
      `;
  }

  public static getContext(context: vscode.ExtensionContext) {
    BrowserViewWindow.extensionContext = context;
    console.log('🚀 ~ file: BrowserViewWindow.ts:141 ~ BrowserViewWindow ~ getContext ~ this.extensionContext:', BrowserViewWindow.extensionContext);
  }

  public getState() {
    return this.state;
  }

  public setViewport(viewport: any) {
    this._panel!.webview.postMessage({
      method: 'extension.viewport',
      result: viewport,
    });
  }

  public show() {
    if (this._panel) {
      this._panel.reveal();
    }
  }

  public dispose() {
    if (this._panel) {
      this._panel.dispose();
    }
    if (this.browserPage) {
      this.browserPage.dispose();
      this.browserPage = null;
    }
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
    this.emit('disposed');
    this.removeAllListeners();
  }

  private handleOpenFileRequest(params: any) {
    let lineNumber = params.lineNumber;
    let columnNumber = params.columnNumber | params.charNumber | 0;

    let workspacePath = (vscode.workspace.rootPath || '') + '/';
    let relativePath = params.fileName.replace(workspacePath, '');

    vscode.workspace.findFiles(relativePath, '', 1).then(file => {
      if (!file || !file.length) {
        return;
      }

      var firstFile = file[0];

      // Open document
      vscode.workspace.openTextDocument(firstFile).then(
        (document: vscode.TextDocument) => {
          // Show the document
          vscode.window.showTextDocument(document, vscode.ViewColumn.One).then(
            document => {
              if (lineNumber) {
                // Adjust line position from 1 to zero-based.
                let pos = new vscode.Position(-1 + lineNumber, columnNumber);
                document.selection = new vscode.Selection(pos, pos);
              }
            },
            reason => {
              vscode.window.showErrorMessage(`Failed to show file. ${reason}`);
            }
          );
        },
        err => {
          vscode.window.showErrorMessage(`Failed to open file. ${err}`);
        }
      );
    });
  }
}
