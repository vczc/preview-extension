import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getExtensionFileAbsolutePath, isDev } from "./utils";
import { receiveMessageFromWebview } from "./handleMessageFromWebview";

let webviewMap: {
  [key: string]: any
} = {};

const getHtmlContent = (
  context: vscode.ExtensionContext, panel: vscode.WebviewPanel,
  router: string, htmlName: string
) => {
  // if (process.env.ZKOS_SDK_PLUGIN_ENV === 'development') {
  //   return `
  //     <html">
  //       <body style="margin:0;padding:0;min-height:100vh;background:red;">
  //       <iframe id="my-iframe" src="${router}" width="100%" style="width:100vw;border:none;height:100vh;"></iframe>
  //       </body>
  //       <script>
  //         const vscode = acquireVsCodeApi();
  //         window.addEventListener('message', event => {
  //             const message = event.data; // The JSON data our extension sent
  //             switch (message.command) {
  //                 case 'doSomething':
  //                     vscode.postMessage({
  //                         command: 'doSomething',
  //                         text: 'Hello from webview!'
  //                     });
  //                     break;
  //             }
  //         });
          
  //         const iframe = document.getElementById('my-iframe');
  //         // iframe.contentWindow.$$vscode = vscode
  //     </script>
  //     </html>
  //   `;
  // } else {

    const htmlPath = path.resolve(__dirname, `./web-build/${htmlName}`)
    let html = fs.readFileSync(htmlPath, 'utf-8');
    const webviewUri = (localFilePath: string) => {
      const resourceUri = vscode.Uri.file(localFilePath);
      return panel.webview.asWebviewUri(resourceUri);
    };
    const resourcePath = path.join(context.extensionPath, `out/web-build/${htmlName}`);
    const dirPath = path.dirname(resourcePath);

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + webviewUri(path.join(dirPath, $2)) + '"';
    });
    return html;
  }
// };

export const openWebview = (context: vscode.ExtensionContext, id: string, title: string = '网页标题', url="http://127.0.0.1:5173/build.html", htmlName: string='build.html') => {
  const _currentWebview = webviewMap[id];
  if (!_currentWebview) {
    const panel = vscode.window.createWebviewPanel(
      id, // Identifies the type of the webview. Used internally
      title, // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      } // Webview options. More on these later.
    );
    panel.webview.html = getHtmlContent(context, panel, url, htmlName);
    
    panel.onDidDispose(
      () => {
        webviewMap[id] = null;
      },
      undefined,
      context.subscriptions
    );
    receiveMessageFromWebview(panel, context)
    webviewMap[id] = panel;

  } else {
    const panel = webviewMap[id];
    panel?.reveal(vscode.ViewColumn.One);
  }
  return webviewMap
};
