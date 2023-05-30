import * as vscode from 'vscode'
import * as child_process from 'child_process'
import { checkSDKPath, errorMsg, warningMsg } from './utils'
import { SDK_PATH_NAME } from './constants/config';
import * as sudo from 'sudo-prompt'

export async function startServer() {
    try {
        if (!checkSDKPath()) {
            warningMsg("请先配置Global Sdk Path !");
            vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
            return
        }
        const _sdkPath = vscode.workspace.getConfiguration().get(SDK_PATH_NAME)
        // 拉起后端服务
        // const cpRes = child_process.execSync(`${_sdkPath}/my_start.sh`).toString()
        const cmd = `bash ${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh start ${_sdkPath}`
        const childProcess = child_process.spawn(cmd, [], { detached: true, shell: true });
        childProcess.stdout.on('data', (data) => {
            console.log(`命令输出: ${data}`);
        });
        
        childProcess.stderr.on('data', (data) => {
            console.error(`命令错误输出: ${data}`);
        });
        
        childProcess.on('error', (error) => {
            console.error(`执行命令出错: ${error}`);
        });
        
        childProcess.on('close', (code) => {
            console.log(`命令退出，退出码: ${code}`);
        });
        // child_process.execSync(`bash ${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh start ${_sdkPath}`)
        // child_process.exec(
        //     `bash ${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh start ${_sdkPath}`,
        //     (_error: any, stdout: any) => {
        //         if (_error) {
        //             console.log('错误了', _error);
        //         } else {
        //             cb && cb()
        //         }
        //         console.log('拉起服务--异步');
        //     }
        // );
        console.log('拉起服务')
    } catch (error) {
        console.log('拉起服务验证后端服务失败!')
    }
}

export async function stopServer() {
    try {
        if (!checkSDKPath()) {
            warningMsg("请先配置Global Sdk Path !");
            vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
            return
        }
        const _sdkPath = vscode.workspace.getConfiguration().get(SDK_PATH_NAME)
        // 停止后端服务
        // child_process.execSync(`${_sdkPath}/my_stop.sh`).toString()
        child_process.execSync(`${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh stop `).toString()
        console.log('停止服务')

    } catch (error) {
        console.log('停止服务验证后端服务失败!')
    }
}


