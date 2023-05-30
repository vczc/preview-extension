import * as vscode from 'vscode'
import * as path from 'path'
import * as sudo from 'sudo-prompt'
import { getState, saveState } from './utils/common';
import { PAGE_DATAS_KEY } from './constants/config';
import { infoMsg } from './utils';

//处理接受数据
export function receiveMessageFromWebview(pannel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
  pannel.webview.onDidReceiveMessage(function (e) {
    const evName = e.id

    if (evName === "vscode:message save-buildConfig") {
      e.build_data = JSON.parse(e.data);
      let pageDataMap = getState(context, PAGE_DATAS_KEY) || {}
      pageDataMap[e.pageId] = e.data
      saveState(context, PAGE_DATAS_KEY, pageDataMap)
      infoMsg("保存配置成功")
    }

    if (evName === 'vscode:sudo') {
      var options = {
        name: 'VSCode',
        icns: '/Applications/Visual Studio Code.app/Contents/Resources/Code.icns', // (optional)
      };
      const _path = path.resolve(process.env.VSCODE_CWD as string, 'src-extension/a.sh')
      sudo.exec(_path, options,
        function (error, stdout, stderr) {
          if (error) {
            console.log('出错了', error)
            pannel.webview.postMessage({
              id: "vscode:sudo:cb",
              data: { message: error.message, stderr }
            });
          } else {
            pannel.webview.postMessage({
              id: "vscode:sudo:cb",
              data: { message: stdout, }
            });
          }
          console.log('stdout: ' + stdout);
        }
      );
    }

    if (evName === "vscode:dialog") {
      vscode.window.showOpenDialog({
        canSelectFiles: !!e.canSelectFiles,
        canSelectFolders: !e.canSelectFiles,
        canSelectMany: !!e.canSelectMany,
        defaultUri: vscode.Uri.file(e?.path),
        openLabel: `选择文件${!e.canSelectFiles?'夹':''}`,
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