import * as vscode from 'vscode'
import * as path from 'path'
// const {nanoid} = require('nanoid');
import { nanoid } from 'nanoid'
import { infoMsg, warningMsg } from './utils'
import { initZopWebviewPanel } from './browser'
// Activating extension 'wuazhu.wuazhu-vscode-plugin-demo' failed: require() of ES Module
export interface ZopViewNode extends vscode.TreeItem {
  label: string
  contextValue: string
  parentId?: string
  children?: ZopViewNode[]
}

export let zopCodeProviderInstance: ZopCodeGenerateTreeDataProvider | null = null

export class ZopCodeGenerateTreeDataProvider implements vscode.TreeDataProvider<ZopViewNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<ZopViewNode | undefined | null | void> = new vscode.EventEmitter<
    ZopViewNode | undefined | null | void
  >()
  readonly onDidChangeTreeData: vscode.Event<ZopViewNode | undefined | null | void> = this._onDidChangeTreeData.event

  data: ZopViewNode[]

  constructor(private context: vscode.ExtensionContext) {
    this.context = context
    this.data = [
      {
        id: `${new Date().getTime() + 1}`,
        label: '工具链',
        contextValue: 'Tool_Chain',
        iconPath: {
          light: path.join(__dirname, '..', 'images/light/light_toolchain.svg'),
          dark: path.join(__dirname, '..', 'images/dark/dark_toolchain.svg')
        },
        children: [],
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: {
          title: '工具链',
          command: `toolChain.click`
        }
      }
    ]
  }

  getTreeItem(element: ZopViewNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(element?: ZopViewNode | undefined): vscode.ProviderResult<ZopViewNode[]> {
    if (element) {
      return element.children
    } else {
      return this.data
    }
  }
}

export function initZopCodeView(context: vscode.ExtensionContext) {
  // get instance
  zopCodeProviderInstance = new ZopCodeGenerateTreeDataProvider(context)

  // registry the tree view
  context.subscriptions.push(vscode.window.registerTreeDataProvider('zopCodeGenerate', zopCodeProviderInstance))

  // 点击工具链
  context.subscriptions.push(
    vscode.commands.registerCommand('toolChain.click', () => {
      initZopWebviewPanel(context)
    })
  )
}
