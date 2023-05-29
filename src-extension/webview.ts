import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getExtensionFileAbsolutePath, isDev } from "./utils";
import * as sudo from 'sudo-prompt'

let webviewMap: {
  [key: string]: any
} = {};

const getHtmlContent = (
  context: vscode.ExtensionContext, panel: vscode.WebviewPanel,
  router: string, htmlName: string
) => {
  console.log('构建时候判断环境信息1', process.env.ZKOS_SDK_PLUGIN_ENV);
  
  // if (process.env.ZKOS_SDK_PLUGIN_ENV === 'development') {
  //   return `
  //     <html">
  //       <body style="margin:0;padding:0;min-height:100vh;background:red;">
  //       <iframe id="my-iframe" src="${router}" width="100%" style="width:100vw;border:none;height:100vh;"></iframe>
  //       </body>
  //       <script>
  //         const vscode = acquireVsCodeApi();
  //         console.log('---我进入vscode了', vscode)
  //         window.addEventListener('message', event => {
  //             const message = event.data; // The JSON data our extension sent
  //             console.log('我接受到一个事件,来自iframe', event)
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
    receiveMessageFromWebview(panel)
    webviewMap[id] = panel;

  } else {
    const panel = webviewMap[id];
    panel?.reveal(vscode.ViewColumn.One);
  }
};

//处理接受数据
function receiveMessageFromWebview(pannel: vscode.WebviewPanel) {
  pannel.webview.onDidReceiveMessage(function (e) {
    // if (e.id === "vscode:message save-buildConfig") {
    //   e.build_data = JSON.parse(e.build_data);
    //   console.log("label is" + e.build_data.label);
    //   if (SettingsManager.settingMap_build.has(e.build_data.label)) {
    //     let item = new buildConfigItem(
    //       e.build_data.label,
    //       e.build_data.outputPath,
    //       e.build_data.sdkPlatForm,
    //       e.build_data.sdkVersion,
    //       e.build_data.cmakeArgs
    //     );
    //     SettingsManager.settingMap_build.set(item.label, item);
    //     SettingsManager.updateFromMap();
    //     vscode.window.showInformationMessage("保存配置成功");
    //   } else {
    //     vscode.window.showInformationMessage(
    //       "保存配置失败，reason: 没有名称为" + e.build_data.label + "的页面"
    //     );
    //   }
    // }
    if (e.id === 'vscode:sudo') {
      console.log(e)
      console.log(process.env)
      var options = {
        name: 'VSCode',
        icns: '/Applications/Visual Studio Code.app/Contents/Resources/Code.icns', // (optional)
      };
      const _path = path.resolve(process.env.VSCODE_CWD as string, 'src-extension/a.sh')
      sudo.exec(_path, options,
        function(error, stdout, stderr) {
          if (error) {
            console.log('出错了', error)
            pannel.webview.postMessage({
              id: "vscode:sudo:cb",
              data: {message: error.message, stderr}
            });
          } else {
            pannel.webview.postMessage({
              id: "vscode:sudo:cb",
              data: {message: stdout, }
            });
          }
          console.log('stdout: ' + stdout);
        }
      );
    }
    if (e.id === "vscode:dialog") {
      vscode.window
        .showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          defaultUri: vscode.Uri.file(e?.path),
          openLabel: "选择文件夹",
        })
        .then((res) => {
          if (res) {
            let path = res[0].path.toString();
            pannel.webview.postMessage({
              id: "changePath",
              path: process.platform === 'win32' ? path.slice(1, path.length) : path
            });
          }
        });
    }
  });
}
