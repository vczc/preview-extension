/**
 * 传给puppeteer的内置指令参数
 * --disable-gpu 禁用GPU硬件加速
 * --disable-dev-shm-usage  /dev/shm分区在某些虚拟机环境中太小，导致Chrome出现故障或崩溃（请参阅http://crbug.com/715363). 使用此标志可以解决此问题（将始终使用临时目录来创建匿名共享内存文件）
 * --start-maximized    最大限度地启动浏览器，而不考虑以前的任何设置
 * --no-sandbox linux特有参数
 */
export const CHROME_ARGS = ['--disable-gpu', '--disable-dev-shm-usage', '--start-maximized', '--no-sandbox']

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
  /** 开始使用截屏视频帧事件发送每个帧 https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-startScreencast */
  START_SCREEN_CAST = 'Page.startScreencast',
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
