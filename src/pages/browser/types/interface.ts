import exp from 'constants'

export interface PostMessageType {
  vid: number
  vscode: any
  callbacks: Map<number, object>
  send: <T>(type: string, params?: any) => Promise<T>
  publish: (name: string, data: any) => void
  subscribe: (name: string, fn: any) => void
  unsubscribe: (name: string, fn: any) => void
}

export interface Subscribe {
  name: string
  callback: (data: any) => void
}

export interface State {
  format: 'jpeg' | 'png'
  frame: any | null
  url: string
  isVerboseMode?: boolean
  isInspectEnabled: boolean
  isDeviceEmulationEnabled: boolean
  viewportMetadata: IViewport
  history: {
    canGoBack: boolean
    canGoForward: boolean
  }
  scrollHeight: number
  scrollWidth: number
}

export interface IViewport {
  height: number | null
  width: number | null
  cursor: string | null
  emulatedDeviceId: string | null
  isLoading: boolean
  isFixedSize: boolean
  isFixedZoom: boolean
  isResizable: boolean
  loadingPercent: number
  highlightNode: {
    nodeId: string
    sourceMetadata: ElementSource | null
  } | null
  highlightInfo: object | null
  deviceSizeRatio: number
  screenZoom: number
  scrollOffsetX: number
  scrollOffsetY: number
}

export interface ElementSource {
  charNumber: number
  columnNumber: number
  fileName: string
  lineNumber: string
}

export interface NavigationHistoryResponse {
  currentIndex: number
  entries: NavigationEntry[]
}

export interface NavigationEntry {
  id: number
  url: string
  userTypedURL: string
  title: string
  transitionType: any
}

export interface ExtensionConfiguration {
  chromeExecutable?: string
  format?: 'jpeg' | 'png'
  isVerboseMode?: boolean
  startUrl?: string
  columnNumber: number
}
