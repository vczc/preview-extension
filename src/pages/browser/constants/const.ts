/** 自定义事件名称 */
export enum CustomEventName {
  VIEWPORT = 'extension.viewport',
  READ_TEXT = 'Clipboard.readText',
  OPEN_FILE = 'extension.openFile',
  WRITE_TEXT = 'Clipboard.writeText',
  UPDATE_TITLE = 'extension.updateTitle',
  APP_STATE_CHANGED = 'extension.appStateChanged',
  APP_CONFIGURATION = 'extension.appConfiguration',
  WINDOW_OPEN_REQUESTED = 'extension.windowOpenRequested',
  WINDOW_DIALOG_REQUESTED = 'extension.windowDialogRequested'
}

/** Cdp协议Page事件名称 */
export enum CdpPageEventName {
  /** 启用页面域通知 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-enable */
  ENABLE = 'Page.enable',
  /** 重新加载给定页面，可以选择忽略缓存 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-reload */
  RELOAD = 'Page.reload',
  /** 将当前页面导航到给定的 URL https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate */
  NAVIGATE = 'Page.navigate',
  /** 导航到页面历史的后一个页面 https://puppeteer.devjs.cn/api#pagegoforwardoptions */
  GO_FORWARD = 'Page.goForward',
  /** 导航到页面历史的前一个页面  https://puppeteer.devjs.cn/api#pagegobackoptions*/
  GO_BACKWARD = 'Page.goBackward',
  /** 当要打开新窗口时触发，通过 window.open（）、链接单击、表单提交、 等 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-windowOpen */
  WINDOW_OPEN = 'Page.windowOpen',
  /** 帧调整大小变化 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-frameResized */
  FRAME_RESIZED = 'Page.frameResized',
  /** 停止发送截屏视频帧中的每个帧 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-stopScreencast */
  STOP_SCREENCAST = 'Page.stopScreencast',
  /** 在帧导航完成后触发。帧现在与新加载程序关联 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-frameNavigated */
  FRAME_NAVIGATED = 'Page.frameNavigated',
  /** 加载事件触发 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-loadEventFired */
  LOAD_EVENT_FIRED = 'Page.loadEventFired',
  /** 开始截屏视频请求的压缩图像数据 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-screencastFrame */
  SCREENCAST_FRAME = 'Page.screencastFrame',
  /** 返回与页面布局相关的指标，例如视区边界/缩放 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-getLayoutMetrics */
  GET_LAYOUT_METRICS = 'Page.getLayoutMetrics',
  /** 确认前端已收到截屏帧 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-screencastFrameAck */
  SCREEN_CAST_FRAMEACK = 'Page.screencastFrameAck',
  /** 返回当前页面的导航历史记录 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-getNavigationHistory */
  GET_NAVIGATION_HISTORY = 'Page.getNavigationHistory',
  /** 接受或关闭 JavaScript 发起的对话框（警报、确认、提示或卸载前） https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-handleJavaScriptDialog */
  HANDLE_JAVASCRIPT_DIALOG = 'Page.handleJavaScriptDialog',
  /** 当发生相同文档导航时触发，例如由于历史记录 API 使用或锚点导航 https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-navigatedWithinDocument */
  NAVIGATED_WITHIN_DOCUMENT = 'Page.navigatedWithinDocument',
  /** 当 JavaScript 发起的对话框（警报、确认、提示或 onbeforeunload）即将触发 打开  https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-javascriptDialogOpening */
  JAVASCRIPT_DIALOG_OPENING = 'Page.javascriptDialogOpening',
  /** 覆盖设备屏幕尺寸的值（窗口.屏幕.宽度、窗口.屏幕.高度、 window.innerWidth、window.innerHeight 和 “device-width”/“device-height”相关的 CSS 媒体 查询结果） https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-setDeviceMetricsOverride */
  SET_DEVICE_METRICS_OVERRIDE = 'Page.setDeviceMetricsOverride'
}

/** Cdp协议DOM事件名称 */
export enum CdpDomEventName {
  /** 为给定页面启用 DOM 代理 https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-enable */
  ENABLE = 'DOM.enable',
  /** 解析给定 NodeId 或 BackendNodeId 的 JavaScript 节点对象 https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-resolveNode */
  RESOLVE_NODE = 'DOM.resolveNode',
  /** 返回给定节点的框 https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-getBoxModel */
  GET_BOX_MODEL = 'DOM.getBoxModel',
  /** 返回给定位置的节点 ID。根据是否启用了 DOM 域，nodeId 为 要么返回，要么不返回 https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-getNodeForLocation */
  GET_NODE_FOR_LOCATION = 'DOM.getNodeForLocation'
}

/** Cdp协议CSS事件名称 */
export enum CdpCssEventName {
  /** 为给定页面启用 CSS 代理。客户端不应假定 CSS 代理已 启用，直到收到此命令的结果 https://chromedevtools.github.io/devtools-protocol/tot/CSS/#method-enable */
  ENABLE = 'CSS.enable'
}

/** Cdp协议Overlay事件名称 */
export enum CdpOverlayEventName {
  /** 启用域通知  https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#method-enable */
  ENABLE = 'Overlay.enable',
  /** 隐藏任何突出显示 https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#method-hideHighlight */
  HIDE_HIGHLIGHT = 'Overlay.hideHighlight',
  /** 突出显示具有给定 id 或给定 JavaScript 对象包装器的 DOM 节点。节点 ID 或 必须指定对象标识 https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#method-highlightNode */
  HIGHLIGHT_NODE = 'Overlay.highlightNode',
  /** 在应检查节点时触发。这发生在调用 setInspectMode 之后或当 用户手动检查元素 https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#event-inspectNodeRequested */
  INSPECT_NODE_REQUESTED = 'Overlay.inspectNodeRequested',
  /** 在应突出显示节点时触发。这发生在调用 setInspectMode 之后 https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#event-nodeHighlightRequested */
  NODE_HIGHLIGHT_REQUESTED = 'Overlay.nodeHighlightRequested'
}

/** Cdp协议Input事件名称 */
export enum CdpInputEventName {
  /** 将鼠标事件派送到页面 https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent */
  DISPATCH_MOUSE_EVENT = 'Input.dispatchMouseEvent'
}

// 依赖注入唯一key
export const myInjectionKey = Symbol()
