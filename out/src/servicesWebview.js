"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebview = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const index_1 = require("./utils/index");
const WEBVIEW_ID = 'ServiceWebview';
function getWebViewContent(context, templatePath) {
    const resourcePath = (0, index_1.getExtensionFileAbsolutePath)(context, templatePath);
    const dirPath = path.dirname(resourcePath);
    console.log('地址文件夹', dirPath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    // html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    //     return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    // });
    console.log('看看张啥样----', html);
    return html;
}
function createWebview(context) {
    // 注册命令
    let disposable = vscode.commands.registerCommand('extension.openServiceWebview', () => {
        // 获取已打开的编辑器
        const editors = vscode.window.visibleTextEditors;
        // 检查是否已经打开了指定的 Webview
        const existingPanel = editors.find(editor => {
            console.log('每一项', editor.document);
            return editor.document.uri.scheme === 'webview' && editor.document.uri.path === `/${WEBVIEW_ID}`;
        });
        console.log('是否存在', existingPanel);
        if (existingPanel) {
            // 如果已经打开了 Webview，则激活对应的 tab
            vscode.window.showTextDocument(existingPanel.document);
        }
        else {
            // 如果没有打开 Webview，则创建一个新的 Webview
            const panel = vscode.window.createWebviewPanel(WEBVIEW_ID, '服务验证', vscode.ViewColumn.One, { enableScripts: true });
            const webviewUri = (localFilePath) => {
                const resourceUri = vscode.Uri.file(localFilePath);
                return panel.webview.asWebviewUri(resourceUri);
            };
            const resourcePath = (0, index_1.getExtensionFileAbsolutePath)(context, 'src/view/index.html');
            const dirPath = path.dirname(resourcePath);
            let html = fs.readFileSync(resourcePath, 'utf-8');
            html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
                return $1 + webviewUri(path.join(dirPath, $2)) + '"';
            });
            console.log('html内容', html);
            // panel.webview.asWebviewUri
            // 加载网页
            panel.webview.html = html;
            // panel.webview.html = `
            //   <html">
            //     <body style="margin:0;padding:0;min-height:100vh;background:red;">
            //     <iframe src="http://localhost:5173/" width="100%" style="width:100vw;border:none;height:100vh;"></iframe>
            //     </body>
            //   </html>
            // `;
            // panel.webview.html = `
            //   <html">
            //     <body style="margin:0;padding:0;min-height:100vh;background:red;">
            //       我去
            //     </body>
            //   </html>
            // `;
            panel.webview.onDidReceiveMessage(message => {
                if (message.command === 'showDialog') {
                    // 在控制台中打印接收到的消息
                    console.log('从webview传过来的信息', message);
                    // 调用插件方法
                    vscode.commands.executeCommand('zopplugin.selectFile');
                }
            });
        }
    });
    context.subscriptions.push(disposable);
    console.log('进入webview');
}
exports.createWebview = createWebview;
//# sourceMappingURL=servicesWebview.js.map