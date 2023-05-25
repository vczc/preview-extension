import * as vscode from "vscode";
// import * as path from "path";
// import * as fs from "fs";

let webviewMap: {
  [key: string]: any
} = {};

const getHtmlContent = (router: string) => (`
  <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
                html,
                body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100%;
                        height: 100%;
                }
                .zkos-sdk-plugin-webview {
                        width: 100%;
                        height: 100%;
                }
        </style>
        </head>

        <body>
        <iframe id="zkosSDKPluginWebview" class="zkos-sdk-plugin-webview" src="${router}" scrolling="auto"></iframe>
        <div id="app" class="zkos-sdk-plugin-webview"></div>
        </body>
    </html>
`);

export const openWebview = (context: vscode.ExtensionContext, id: string, title: string = '网页标题', ) => {
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
    panel.webview.html = getHtmlContent('http://localhost:5173');

    panel.onDidDispose(
      () => {
        console.log('did dispose了');
      },
      undefined,
      context.subscriptions
    );
    
    webviewMap[id] = panel;

  } else {
    const panel = webviewMap[id];
    panel?.reveal(vscode.ViewColumn.One);
  }
    
};