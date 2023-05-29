import * as vscode from 'vscode';

import TargetTreeProvider from './targetTreeProvider';
import { BrowserViewWindow } from './BrowserViewWindow';
import { BrowserViewWindowManager } from './BrowserViewWindowManager';
import { Telemetry } from './telemetry';
import WorkSpaceUtil from './workspaceUtil';
import path from 'path';
import fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const telemetry = new Telemetry();

  const windowManager = new BrowserViewWindowManager();

  telemetry.sendEvent('activate');

  vscode.window.registerTreeDataProvider('targetTree', new TargetTreeProvider());

  context.subscriptions.push(
    vscode.commands.registerCommand('browser-preview.openPreview', (url?) => {
      BrowserViewWindow.getContext(context);
      createWebview(url);
    })
  );

  function createWebview(url?: any) {
    if (url != null && url instanceof vscode.Uri && url.scheme === 'file') {
      url = url.toString();
    }

    const schemeRegex = /^(https?|about|chrome|file):/;

    if (url && !url.match(schemeRegex)) {
      url = 'http://' + url;
    }

    telemetry.sendEvent('openPreview');
    windowManager.create(url);
    WorkSpaceUtil.initFixedDprConfig();
  }

  return {
    createWebview,
  };
}
