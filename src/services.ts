import * as vscode from 'vscode';
import * as path from 'path';

// 定义树形菜单节点的类型
interface MyTreeNode {
    id: number;
    label: string;
    iconPath?: string; 
    children?: MyTreeNode[];
}
class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeNode> {
    // 定义数据源，这里只是一个示例
    private readonly data: MyTreeNode[] = [
      { id: 1, label: '节点1', iconPath: 'images/service.svg' },
      { id: 2, label: '节点2', children: [
        { id: 3, label: '子节点1' },
        { id: 4, label: '子节点2' },
      ] },
      { id: 5, label: '节点3', children: [] },
    ];
  
    // 实现 getChildren 方法，返回当前节点的子节点
    getChildren(node?: MyTreeNode): MyTreeNode[] {
      if (node) {
        return node.children as MyTreeNode[];
      } else {
        return this.data;
      }
    }
  
    // 实现 getParent 方法，返回当前节点的父节点
    // getParent(node: MyTreeNode): MyTreeNode | undefined {
    //   // 省略实现
    // }
  
    // 实现 getTreeItem 方法，返回当前节点对应的 TreeItem 对象
    getTreeItem(node: MyTreeNode): vscode.TreeItem {
      return {
        label: node.label,
        iconPath: node.iconPath ? path.join(__dirname, '..', 'images', 'service.svg'):'',
        command: {
            command: 'zopCheckDebugToolView.treeItemClicked',
            title: 'click',
            arguments: [node],
        },
        // collapsibleState: node.children ? vscode.TreeItemCollapsibleState.Collapsed : node.iconPath
      };
    }
  }
 
  export class ServiceView {
	constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('zopCheckDebugToolView', { treeDataProvider: new MyTreeDataProvider()});
        context.subscriptions.push(view);

        const treeItemClickedEvent = vscode.commands.registerCommand('zopCheckDebugToolView.treeItemClicked', (node: MyTreeNode) => {
            vscode.window.showInformationMessage(`你点击了 ${node.label}`);
        });
	    context.subscriptions.push(treeItemClickedEvent);
        
    }
  }