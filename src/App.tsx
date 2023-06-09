import * as React from 'react';
import './App.css';

import Viewport from './components/viewport/viewport';
import Connection from './connection';
import { ExtensionConfiguration } from '../extension/extensionConfiguration';
import { resolve as getElementSourceMetadata } from 'element-to-source';
import { CDPHelper } from './utils/cdpHelper';
import Toolbar from './components/toolbar/toolbar';

interface ElementSource {
  charNumber: number;
  columnNumber: number;
  fileName: string;
  lineNumber: string;
}

interface IState {
  format: 'jpeg' | 'png';
  frame: object | null;
  url: string;
  isVerboseMode: boolean;
  isInspectEnabled: boolean;
  isDeviceEmulationEnabled: boolean;
  viewportMetadata: IViewport;
  history: {
    canGoBack: boolean;
    canGoForward: boolean;
  };
  scrollHeight: number;
  scrollWidth: number;
}

interface IViewport {
  height: number | null;
  width: number | null;
  cursor: string | null;
  emulatedDeviceId: string | null;
  isLoading: boolean;
  isFixedSize: boolean;
  isFixedZoom: boolean;
  isResizable: boolean;
  loadingPercent: number;
  highlightNode: {
    nodeId: string;
    sourceMetadata: ElementSource | null;
  } | null;
  highlightInfo: object | null;
  deviceSizeRatio: number;
  screenZoom: number;
  scrollOffsetX: number;
  scrollOffsetY: number;
}

class App extends React.Component<any, IState> {
  private connection: Connection;
  private viewport: any;
  private cdpHelper: CDPHelper;

  constructor(props: any) {
    super(props);
    this.state = {
      frame: null,
      format: 'png',
      url: 'about:blank',
      isVerboseMode: false,
      isInspectEnabled: false,
      isDeviceEmulationEnabled: false,
      history: {
        canGoBack: false,
        canGoForward: false,
      },
      viewportMetadata: {
        cursor: null,
        deviceSizeRatio: 1,
        height: null,
        width: null,
        highlightNode: null,
        highlightInfo: null,
        emulatedDeviceId: 'Responsive',
        isLoading: false,
        isFixedSize: false,
        isFixedZoom: false,
        isResizable: true,
        loadingPercent: 0.0,
        screenZoom: 1,
        scrollOffsetX: 0,
        scrollOffsetY: 0,
      },
      scrollHeight: 0,
      scrollWidth: 0,
    };

    this.connection = new Connection();
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onToolbarActionInvoked = this.onToolbarActionInvoked.bind(this);
    this.connection.enableVerboseLogging(this.state.isVerboseMode);

    // 当发生相同文档导航时触发，例如由于历史记录 API 使用或锚点导航
    this.connection.on('Page.navigatedWithinDocument', () => {
      this.requestNavigationHistory();
    });

    // 在帧导航完成后触发。帧现在与新加载程序关联
    this.connection.on('Page.frameNavigated', (result: any) => {
      const { frame } = result;
      const isMainFrame = !frame.parentId;

      if (isMainFrame) {
        this.requestNavigationHistory();
        this.updateState({
          ...this.state,
          viewportMetadata: {
            ...this.state.viewportMetadata,
            isLoading: true,
            loadingPercent: 0.1,
          },
        });
      }
    });

    // 加载事件触发
    this.connection.on('Page.loadEventFired', () => {
      this.updateState({
        ...this.state,
        viewportMetadata: {
          ...this.state.viewportMetadata,
          loadingPercent: 1.0,
        },
      });

      setTimeout(() => {
        this.updateState({
          ...this.state,
          viewportMetadata: {
            ...this.state.viewportMetadata,
            isLoading: false,
            loadingPercent: 0,
          },
        });
      }, 500);
    });

    // 开始截屏视频请求的压缩图像数据
    this.connection.on('Page.screencastFrame', (result: any) => {
      this.handleScreencastFrame(result);
    });

    // 当要打开新窗口时触发，通过 window.open（）、链接单击、表单提交等
    this.connection.on('Page.windowOpen', (result: any) => {
      this.connection.send('extension.windowOpenRequested', {
        url: result.url,
      });
    });

    // 当 JavaScript 发起的对话框（警报、确认、提示或 onbeforeunload）即将打开时触发
    this.connection.on('Page.javascriptDialogOpening', (result: any) => {
      const { url, message, type } = result;

      this.connection.send('extension.windowDialogRequested', {
        url: url,
        message: message,
        type: type,
      });
    });

    // 帧大小变化时
    this.connection.on('Page.frameResized', () => {
      this.stopCasting();
      this.startCasting();
    });

    this.connection.on('Overlay.nodeHighlightRequested', (result: any) => {
      console.log('nodeHighlightRequested', result);

      // this.handleInspectHighlightRequested();
    });

    this.connection.on('Overlay.inspectNodeRequested', (result: any) => {
      console.log('inspectNodeRequested', result);

      // this.handleInspectHighlightRequested();
    });

    this.connection.on('extension.appConfiguration', (payload: ExtensionConfiguration) => {
      if (!payload) {
        return;
      }

      this.updateState({
        isVerboseMode: payload.isVerboseMode ? payload.isVerboseMode : false,
        // url: payload.startUrl ? payload.startUrl : 'about:blank',
        url: payload.startUrl ? payload.startUrl : 'https://news.baidu.com/',
        format: payload.format ? payload.format : 'jpeg',
      });

      if (payload.startUrl) {
        this.connection.send('Page.navigate', {
          url: payload.startUrl,
        });
      }
    });

    this.connection.on('extension.viewport', (viewport: IViewport) => {
      this.handleViewportSizeChange(viewport);
      this.enableViewportDeviceEmulation('Live Share');

      // TODO: Scroll the page
    });

    // Initialize
    this.connection.send('Page.enable');
    this.connection.send('DOM.enable');
    this.connection.send('CSS.enable');
    this.connection.send('Overlay.enable');

    this.requestNavigationHistory();
    this.startCasting();

    this.cdpHelper = new CDPHelper(this.connection);
  }

  // 处理截屏视频的压缩图像相关数据
  private handleScreencastFrame(result: any) {
    const { sessionId, data, metadata } = result;
    this.connection.send('Page.screencastFrameAck', { sessionId });

    this.connection.send('Page.getLayoutMetrics').then((result: any) => {
      const { width, height } = result.cssContentSize;

      this.setState({ scrollHeight: height, scrollWidth: width });
    });

    this.requestNodeHighlighting();

    this.updateState({
      ...this.state,
      frame: {
        base64Data: data,
        metadata: metadata,
      },
      viewportMetadata: {
        ...this.state.viewportMetadata,
        scrollOffsetX: metadata.scrollOffsetX,
        scrollOffsetY: metadata.scrollOffsetY,
      },
    });
  }

  public componentDidUpdate() {
    const { isVerboseMode } = this.state;

    this.connection.enableVerboseLogging(isVerboseMode);
  }

  // 发送状态机
  private sendStatetoHost() {
    this.connection.send('extension.appStateChanged', {
      state: this.state,
    });
  }

  public render() {
    return (
      <div className="App">
        <Toolbar
          url={this.state.url}
          viewport={this.state.viewportMetadata}
          onActionInvoked={this.onToolbarActionInvoked}
          canGoBack={this.state.history.canGoBack}
          canGoForward={this.state.history.canGoForward}
          isInspectEnabled={this.state.isInspectEnabled}
          isDeviceEmulationEnabled={this.state.isDeviceEmulationEnabled}
        />
        <Viewport
          viewport={this.state.viewportMetadata}
          scrollHeight={this.state.scrollHeight}
          scrollWidth={this.state.scrollWidth}
          isInspectEnabled={this.state.isInspectEnabled}
          isDeviceEmulationEnabled={this.state.isDeviceEmulationEnabled}
          frame={this.state.frame}
          format={this.state.format}
          url={this.state.url}
          onViewportChanged={this.onViewportChanged}
          ref={c => {
            this.viewport = c;
          }}
        />
      </div>
    );
  }

  // 停止发送截屏视屏帧的每个帧
  public stopCasting() {
    this.connection.send('Page.stopScreencast');
  }

  // 开始适用截屏视频帧事件发送每个帧
  public startCasting() {
    const params = {
      quality: 100,
      format: this.state.format,
      maxWidth: 2000,
      maxHeight: 2000,
    };

    if (this.state.viewportMetadata.width) {
      params.maxWidth = Math.floor(this.state.viewportMetadata.width * window.devicePixelRatio);
    }

    if (this.state.viewportMetadata.height) {
      params.maxHeight = Math.floor(this.state.viewportMetadata.height * window.devicePixelRatio);
    }

    this.connection.send('Page.startScreencast', params);
  }

  // 请求导航历史记录
  private async requestNavigationHistory() {
    const history: any = await this.connection.send('Page.getNavigationHistory');

    if (!history) {
      return;
    }

    const historyIndex = history.currentIndex;
    const historyEntries = history.entries;
    const currentEntry = historyEntries[historyIndex];
    let url = currentEntry.url;

    const pattern = /^http:\/\/(.+)/;
    const match = url.match(pattern);
    if (match) {
      url = match[1];
    }

    this.updateState({
      ...this.state,
      url: url,
      history: {
        canGoBack: historyIndex === 0,
        canGoForward: historyIndex === historyEntries.length - 1,
      },
    });

    const panelTitle = currentEntry.title || currentEntry.url;

    this.connection.send('extension.updateTitle', {
      title: `Tortie Preview (${panelTitle})`,
    });
  }

  private onToolbarActionInvoked(action: string, data: any): Promise<any> {
    switch (action) {
      case 'forward':
        this.connection.send('Page.goForward');
        break;
      case 'backward':
        this.connection.send('Page.goBackward');
        break;
      case 'refresh':
        this.connection.send('Page.reload');
        break;
      case 'inspect':
        this.handleToggleInspect();
        break;
      case 'emulateDevice':
        this.handleToggleDeviceEmulation();
        break;
      case 'urlChange':
        this.handleUrlChange(data);
        break;
      case 'readClipboard':
        return this.connection.send('Clipboard.readText');
      case 'writeClipboard':
        this.handleClipboardWrite(data);
        break;
      case 'viewportSizeChange':
        this.handleViewportSizeChange(data);
        break;
      case 'viewportDeviceChange':
        this.handleViewportDeviceChange(data);
        break;
    }
    // return an empty promise
    return Promise.resolve();
  }

  // 视口发生变化时执行对应副作用
  private async onViewportChanged(action: string, data: any) {
    switch (action) {
      case 'inspectHighlightRequested':
        this.handleInspectHighlightRequested(data);
        break;
      case 'inspectElement':
        await this.handleInspectElementRequest();
        this.handleToggleInspect();
        break;
      case 'hoverElementChanged':
        await this.handleElementChanged(data);
        break;
      case 'interaction':
        this.connection.send(data.action, data.params);
        break;

      case 'size':
        console.log('app.onViewportChanged.size', data);
        // eslint-disable-next-line no-case-declarations
        const newViewport = {} as any;
        if (data.height !== undefined && data.width !== undefined) {
          const height = Math.floor(data.height);
          const width = Math.floor(data.width);

          const devicePixelRatio = window.devicePixelRatio || 1;

          this.connection.send('Page.setDeviceMetricsOverride', {
            deviceScaleFactor: devicePixelRatio,
            mobile: false,
            height: height,
            width: width,
          });

          newViewport.height = height as number;
          newViewport.width = width as number;
        }

        if (data.isResizable !== undefined) {
          newViewport.isResizable = data.isResizable;
        }

        if (data.isFixedSize !== undefined) {
          newViewport.isFixedSize = data.isFixedSize;
        }

        if (data.isFixedZoom !== undefined) {
          newViewport.isFixedZoom = data.isFixedZoom;
        }

        if (data.emulatedDeviceId !== undefined) {
          newViewport.emulatedDeviceId = data.emulatedDeviceId;
        }

        if (data.screenZoom !== undefined) {
          newViewport.screenZoom = data.screenZoom;
        }

        await this.updateState({
          ...this.state,
          viewportMetadata: {
            ...this.state.viewportMetadata,
            ...newViewport,
          },
        });
        this.viewport.calculateViewport();

        break;
    }
  }

  // 异步更新数据并执行副作用
  private async updateState(newState: any): Promise<void> {
    return new Promise(resolve => {
      this.setState(newState, () => {
        this.sendStatetoHost();
        resolve();
      });
    });
  }

  // 句柄检查突出显示请求
  private async handleInspectHighlightRequested(data: any) {
    const highlightNodeInfo: any = await this.connection.send('DOM.getNodeForLocation', {
      x: data.params.position.x,
      y: data.params.position.y,
    });

    if (highlightNodeInfo) {
      let nodeId = highlightNodeInfo.nodeId;

      if (!highlightNodeInfo.nodeId && highlightNodeInfo.backendNodeId) {
        nodeId = await this.cdpHelper.getNodeIdFromBackendId(highlightNodeInfo.backendNodeId);
      }

      this.setState({
        ...this.state,
        viewportMetadata: {
          ...this.state.viewportMetadata,
          highlightNode: {
            nodeId: nodeId,
            sourceMetadata: null,
          },
        },
      });

      // await this.handleHighlightNodeClickType();

      this.requestNodeHighlighting();
    }
  }

  // private async handleHighlightNodeClickType() {
  //   if (!this.state.viewportMetadata.highlightNode) {
  //     return;
  //   }

  //   let cursor = 'not-allowed';
  //   let sourceMetadata = this.state.viewportMetadata.highlightNode.sourceMetadata;

  //   if(sourceMetadata && sourceMetadata.fileName) {
  //     cursor = 'pointer';
  //   }

  //   this.setState({
  //     ...this.state,
  //     viewportMetadata: {
  //       ...this.state.viewportMetadata,
  //       cursor: cursor
  //     }
  //   });
  // }

  // 解析突出显示节点源元数据
  private async resolveHighlightNodeSourceMetadata() {
    if (!this.state.viewportMetadata.highlightNode) {
      return;
    }

    const nodeId = this.state.viewportMetadata.highlightNode.nodeId;
    const nodeDetails: any = await this.connection.send('DOM.resolveNode', {
      nodeId: nodeId,
    });

    if (nodeDetails.object) {
      const objectId = nodeDetails.object.objectId;
      const nodeProperties = await this.cdpHelper.resolveElementProperties(objectId, 3);

      if (nodeProperties) {
        const sourceMetadata = getElementSourceMetadata(nodeProperties);

        if (!sourceMetadata.fileName) {
          return;
        }

        this.setState({
          ...this.state,
          viewportMetadata: {
            ...this.state.viewportMetadata,
            highlightNode: {
              ...this.state.viewportMetadata.highlightNode,
              sourceMetadata: {
                fileName: sourceMetadata.fileName,
                columnNumber: sourceMetadata.columnNumber,
                lineNumber: sourceMetadata.lineNumber,
                charNumber: sourceMetadata.charNumber,
              },
            },
          },
        });
      }
    }
  }

  // 处理检查元素请求
  private async handleInspectElementRequest() {
    if (!this.state.viewportMetadata.highlightNode) {
      return;
    }

    await this.resolveHighlightNodeSourceMetadata();

    const nodeId = this.state.viewportMetadata.highlightNode.nodeId;

    // Trigger CDP request to enable DOM explorer
    // TODO: No sure this works.
    this.connection.send('Overlay.inspectNodeRequested', {
      nodeId: nodeId,
    });

    const sourceMetadata = this.state.viewportMetadata.highlightNode.sourceMetadata;

    if (sourceMetadata) {
      this.connection.send('extension.openFile', {
        fileName: sourceMetadata.fileName,
        lineNumber: sourceMetadata.lineNumber,
        columnNumber: sourceMetadata.columnNumber,
        charNumber: sourceMetadata.charNumber,
      });
    }
  }

  // 处理切换检查
  private handleToggleInspect() {
    if (this.state.isInspectEnabled) {
      // Hide browser highlight
      this.connection.send('Overlay.hideHighlight');

      // Hide local highlight
      this.updateState({
        isInspectEnabled: false,
        viewportMetadata: {
          ...this.state.viewportMetadata,
          highlightInfo: null,
          highlightNode: null,
        },
      });
    } else {
      this.updateState({
        isInspectEnabled: true,
      });
    }
  }

  // 处理url变化
  private handleUrlChange(data: any) {
    this.connection.send('Page.navigate', {
      url: data.url,
    });
    this.updateState({
      ...this.state,
      url: data.url,
    });
  }

  // 处理设备视口大小改变
  private handleViewportSizeChange(data: any) {
    this.onViewportChanged('size', {
      width: data.width,
      height: data.height,
    });
  }

  // 处理设备视口改变
  private handleViewportDeviceChange(data: any) {
    const isResizable = data.device.name === 'Responsive';
    const isFixedSize = data.device.name !== 'Responsive';
    const isFixedZoom = data.device.name === 'Responsive';
    const width = data.device.viewport ? data.device.viewport.width : undefined;
    const height = data.device.viewport ? data.device.viewport.height : undefined;
    const screenZoom = 1;

    this.onViewportChanged('size', {
      emulatedDeviceId: data.device.name,
      height: height,
      isResizable: isResizable,
      isFixedSize: isFixedSize,
      isFixedZoom: isFixedZoom,
      screenZoom: screenZoom,
      width: width,
    });
  }

  // 切换设备仿真
  private handleToggleDeviceEmulation() {
    if (this.state.isDeviceEmulationEnabled) {
      this.disableViewportDeviceEmulation();
    } else {
      this.enableViewportDeviceEmulation();
    }
  }

  // 禁用视口设备仿真
  private disableViewportDeviceEmulation() {
    console.log('app.disableViewportDeviceEmulation');
    this.handleViewportDeviceChange({
      device: {
        name: 'Responsive',
        viewport: {
          width: this.state.viewportMetadata.width,
          height: this.state.viewportMetadata.height,
        },
      },
    });
    this.updateState({
      isDeviceEmulationEnabled: false,
    });
  }

  private enableViewportDeviceEmulation(deviceName = 'Responsive') {
    console.log('app.enableViewportDeviceEmulation');
    this.handleViewportDeviceChange({
      device: {
        name: deviceName,
        viewport: {
          width: this.state.viewportMetadata.width,
          height: this.state.viewportMetadata.height,
        },
      },
    });
    this.updateState({
      isDeviceEmulationEnabled: true,
    });
  }

  // 处理剪切版写入
  private handleClipboardWrite(data: any) {
    // overwrite the clipboard only if there is a valid value
    if (data && (data as any).value) {
      return this.connection.send('Clipboard.writeText', data);
    }
  }

  // 处理元素改变
  private async handleElementChanged(data: any) {
    // 返回给定位置的节点id
    const nodeInfo: any = await this.connection.send('DOM.getNodeForLocation', {
      x: data.params.position.x,
      y: data.params.position.y,
    });

    const cursor = await this.cdpHelper.getCursorForNode(nodeInfo);

    this.setState({
      ...this.state,
      viewportMetadata: {
        ...this.state.viewportMetadata,
        cursor: cursor,
      },
    });
  }

  // 请求节点突出显示
  private async requestNodeHighlighting() {
    if (this.state.viewportMetadata.highlightNode) {
      const nodeId = this.state.viewportMetadata.highlightNode.nodeId;
      const highlightBoxModel: any = await this.connection.send('DOM.getBoxModel', {
        nodeId: nodeId,
      });

      // Trigger hightlight in regular browser.
      await this.connection.send('Overlay.highlightNode', {
        nodeId: nodeId,
        highlightConfig: {
          showInfo: true,
          showStyles: true,
          showRulers: true,
          showExtensionLines: true,
        },
      });

      if (highlightBoxModel && highlightBoxModel.model) {
        this.setState({
          ...this.state,
          viewportMetadata: {
            ...this.state.viewportMetadata,
            highlightInfo: highlightBoxModel.model,
          },
        });
      }
    }
  }
}

export default App;
