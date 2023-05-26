"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWebview = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
let webviewMap = {};
const getHtmlContent = (context, panel, router, htmlName) => {
    console.log('构建时候判断环境信息', process.env);
    console.log('构建时候 __dirname', __dirname);
    if (process.env.ZKOS_SDK_PLUGIN_ENV === 'development') {
        console.log('是dev');
        return `
      <html">
        <body style="margin:0;padding:0;min-height:100vh;background:red;">
        <iframe id="my-iframe" src="${router}" width="100%" style="width:100vw;border:none;height:100vh;"></iframe>
        </body>
        <script>
          const vscode = acquireVsCodeApi();
          console.log('---我进入vscode了', vscode)
          window.addEventListener('message', event => {
              const message = event.data; // The JSON data our extension sent
              console.log('我接受到一个事件,来自iframe', event)
              switch (message.command) {
                  case 'doSomething':
                      vscode.postMessage({
                          command: 'doSomething',
                          text: 'Hello from webview!'
                      });
                      break;
              }
          });
  
          const iframe = document.getElementById('my-iframe');
          iframe.contentWindow.postMessage({ command: 'doSomething' }, '*');
      </script>
      </html>
    `;
    }
    else {
        console.log('是prod');
        const htmlPath = path.resolve(__dirname, `./web-build/${htmlName}`);
        let html = fs.readFileSync(htmlPath, 'utf-8');
        const webviewUri = (localFilePath) => {
            const resourceUri = vscode.Uri.file(localFilePath);
            return panel.webview.asWebviewUri(resourceUri);
        };
        const resourcePath = path.join(context.extensionPath, `out/web-build/${htmlName}`);
        const dirPath = path.dirname(resourcePath);
        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + webviewUri(path.join(dirPath, $2)) + '"';
        });
        console.log('context.extensionPath', html);
        return html;
    }
};
const openWebview = (context, id, title = '网页标题', url = "http://127.0.0.1:5173/build.html", htmlName = 'build.html') => {
    console.log('进入openWebview');
    const _currentWebview = webviewMap[id];
    console.log('是否已经存在map', _currentWebview);
    if (!_currentWebview) {
        const panel = vscode.window.createWebviewPanel(id, // Identifies the type of the webview. Used internally
        title, // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        } // Webview options. More on these later.
        );
        panel.webview.html = getHtmlContent(context, panel, url, htmlName);
        panel.onDidDispose(() => {
            webviewMap[id] = null;
        }, undefined, context.subscriptions);
        webviewMap[id] = panel;
    }
    else {
        const panel = webviewMap[id];
        panel?.reveal(vscode.ViewColumn.One);
    }
};
exports.openWebview = openWebview;
//# sourceMappingURL=webview.js.map