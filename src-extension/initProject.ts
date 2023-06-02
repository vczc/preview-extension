import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BUILD_PAGE_INITDATA, SDK_PATH_NAME } from './constants/config';
import { checkShExists, warningMsg } from './utils';
import * as child_process from 'child_process'
import { saveState, getState} from './utils/common';

let context: vscode.ExtensionContext | null = null
let buildPageData: any = null;
export const initSetting = (context: vscode.ExtensionContext) => {
    context = context
    // let config: string = vscode.workspace.getConfiguration().get(SDK_PATH_NAME) || '';
    // let password= ''
    // child_process.exec(`mkdir ${config}/aabb`)
    // const child = child_process.spawn('sudo', ['-S $USER', 'bash', `${config}/a.sh`]);
    // child.stdin.write(`${password}\n`);
    // child.stdin.end();
    // child.stdout.on('data', (data) => {
    //     console.log(`脚本输出: ${data}`);
    //   });
      
    //   child.stderr.on('data', (data) => {
    //     console.error(`脚本错误: ${data}`);
    //   });
      
    //   child.on('close', (code) => {
    //     console.log(`脚本执行完成，退出码: ${code}`);
    //   });
    // const _isExists = fs.existsSync(path.join(__dirname, '../.vscode'));
    // console.log('是否存在目录',_isExists);
    // const config = vscode.workspace.getConfiguration();
    // const configPath = config.get(SDK_PATH_NAME);
    // console.log(`配置项 Zoks: ${SDK_PATH_NAME}`, configPath);
};


export const getPlatformsFromSh = async (context: vscode.ExtensionContext) => {
    buildPageData = getState(context, BUILD_PAGE_INITDATA)
    if (!context) {
        context = context
    }
    let config: string = vscode.workspace.getConfiguration().get(SDK_PATH_NAME) || '';
    if (config === "") {
        warningMsg("请先配置Global Sdk Path !");
        vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
        return false;
    } else if (!fs.existsSync(path.join(config, "sdk_build.sh"))) {
        warningMsg("sdk 路径不正确!");
        vscode.commands.executeCommand('workbench.action.openSettings', SDK_PATH_NAME);
        return false;
    } else {
        if (!buildPageData) {
            const platform = process.platform;
            let cmd: string = '';
            if (platform === "linux") {
                cmd = path.join(config, "sdk_build.sh");
            } else if (platform === "win32") {
                cmd = path.join(config, "sdk_build.bat");
            }
            cmd += " list-platform --json";
            execShellByChildProcess(cmd, platform, context);
            while (!buildPageData) {
                let fun = () => console.log("time out");
                let sleep2 = (time: number | undefined) =>
                    new Promise((resolve) => {
                    setTimeout(resolve, time);
                    });
                await sleep2(500).then(fun);
            }
            return true;
        } else {
            return true
        }
    }
}

const execShellByChildProcess = (cmd: string, platform: string, context: vscode.ExtensionContext) => {
    const replaceMap: { [key: string]: string } = {
        'Default version': 'Default_version',
        'prebuilt platform': 'prebuilt_platform',
        'runtime platform': 'runtime_platform',
    }
    if (platform === "linux") {
        child_process.exec(
            cmd,
            (_error: any, stdout: any) => {
                let str = stdout.toString();
                let newstr = str
                    .replaceAll("Default version", "Default_version")
                    .replaceAll("prebuilt platform", "prebuilt_platform")
                    .replaceAll("runtime platform", "runtime_platform");
                buildPageData = JSON.parse(newstr);
                // save cmd data to globalstate
                saveState(context, BUILD_PAGE_INITDATA, buildPageData);
            }
        );
    } else if (platform === "win32") {
        child_process.exec(
            cmd,
            (_error: any, stdout: any, _stderr: any) => {
                let str = stdout.toString();
                let newstr = str
                    .replaceAll("Default version", "Default_version")
                    .replaceAll("prebuilt platform", "prebuilt_platform")
                    .replaceAll("runtime platform", "runtime_platform");
                let i = 0;
                let len = newstr.length;
                for (; i < len; i++) {
                    if (newstr[i] === "{") {
                        break;
                    }
                }
                newstr = newstr.substr(i, len - i);
                buildPageData = JSON.parse(newstr);
                // save cmd data to globalstate
                saveState(context, BUILD_PAGE_INITDATA, buildPageData);
            }
        );
    } else if (platform === 'darwin') {
        // mac just for test
        const str = {
            "Default version": "3.0.1.2.0",
            "Detail": {
                "prebuilt": [
                    {
                        "version": "3.0.1.2.0",
                        "prebuilt platform": [
                            "orin-aarch64-linux-debug",
                            "sa8295_aarch64_qnx-debug",
                            "platform-x64-linux-debug",
                            "tcam-aarch64-linux-debug",
                            "s32g-aarch64-linux-debug"
                        ],
                        "runtime platform": "platform-x64-linux-debug"
                    }
                ]
            }
        }
        const jsonStr = JSON.stringify(str).replace(/Default version|prebuilt platform|runtime platform/g, function (match) {
            return replaceMap[match]
        })
        buildPageData = JSON.parse(jsonStr);
        // save cmd data to globalstate
        saveState(context, BUILD_PAGE_INITDATA, buildPageData);
    }
}
