import * as vscode from "vscode";
// import * as path from "path";
// import * as fs from "fs";

let webviewMap: {
  [key: string]: any
} = {};

const getHtmlContent = (router: string) => (`
  <html">
    <body style="margin:0;padding:0;min-height:100vh;background:red;">
    <iframe src="http://localhost:5173/" width="100%" style="width:100vw;border:none;height:100vh;"></iframe>
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