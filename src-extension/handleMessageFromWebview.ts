import * as vscode from 'vscode'
import * as path from 'path'
import * as sudo from 'sudo-prompt'
import { getState, saveState } from './utils/common';
import { PAGE_DATAS_KEY, SDK_PATH_NAME } from './constants/config';
import { checkSDKPath, errorMsg, infoMsg, warningMsg } from './utils';

//处理接受数据
export function receiveMessageFromWebview(pannel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
  pannel.webview.onDidReceiveMessage(function (e) {
    const evName = e.id

    if (evName === "vscode:message save-buildConfig") {
      let pageDataMap = getState(context, PAGE_DATAS_KEY) || {}
      pageDataMap[e.pageId] = e.data
      saveState(context, PAGE_DATAS_KEY, pageDataMap)
      infoMsg("保存配置成功")
    }

    if (evName === 'vscode:sudo') {
      initEnvironment(e, pannel)
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


async function initEnvironment(event: any, pannel: vscode.WebviewPanel) {
  try {
      if (!checkSDKPath()) {
          warningMsg("请先配置Global Sdk Path !");
          vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
          return
      }
      const _sdkPath = vscode.workspace.getConfiguration().get(SDK_PATH_NAME)

      const options = {
          name: 'VSCode',
          // icns: '/Applications/Visual Studio Code.app/Contents/Resources/Code.icns', // (optional)
      };
      // const stopSh = `${_sdkPath}/my_start_env.sh disable`
      // const startSh = `${_sdkPath}/my_start_env.sh enable sdkpath ip mask`
      // const stopSh = `${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/env_init.sh disable`
      const startSh = `${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/env_init.sh  ${_sdkPath} ${event.version} ${event.ip_address} ${event.mask} ${event.platform_info} $USER`

      sudo.exec(startSh, options, (error, stdout, stderr) => {
          if (error) {
              console.log('启动初始化环境失败2', error)
              errorMsg(`启动初始化环境错误 ${error}`)
              pannel.webview.postMessage({
                id: "vscode:sudo:cb",
                data: { message: error.message, stderr, type: 'error' },
                sdkPath: _sdkPath
              });
          } else {
            pannel.webview.postMessage({
              id: "vscode:sudo:cb",
              data: {
                message: 'success', 
                type: 'success'
              },
              sdkPath: _sdkPath
            });
          }
      })

  } catch (error) {
      console.log('初始化环境出错!')
  }
}