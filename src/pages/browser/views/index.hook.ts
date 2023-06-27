import { onMounted, inject, onUnmounted } from 'vue'
import { PostMessageType, Subscribe } from '../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName, CdpCssEventName } from '../constants/const'
import { NavigationHistoryResponse, ExtensionConfiguration, IViewport } from '../types/interface'
import { usePageStore } from '../services/store.service'
import { useViewportHook } from '../hooks/index/viewport.hook'
import { useToolbarHook } from '../hooks/index/toolbar.hook'

export function useIndexHook() {
  const postMessage = inject(myInjectionKey) as PostMessageType
  const store = usePageStore()
  const { updateState } = store
  const hookParams = {
    postMessage,
    store
  }
  const { onViewportChanged, handleToggleInspect } = useViewportHook(hookParams)
  const { handleViewportSizeChange } = useToolbarHook({ ...hookParams, strongUpdateState, onViewportChanged, handleToggleInspect })

  // 自定义事件订阅
  const customSubscribe: Subscribe[] = [
    {
      name: CustomEventName.VIEWPORT,
      callback: (data: IViewport) => {
        console.log('🏡🏡插件视口变化', data)
        handleViewportSizeChange(data)
      }
    },
    {
      name: CustomEventName.APP_CONFIGURATION,
      callback: (data: ExtensionConfiguration) => {
        console.log('🏡🏡web页面规格数据', data)
        if (!data) {
          return
        }

        const { format = 'png', startUrl: url = 'about:blank', isVerboseMode = false } = data

        strongUpdateState({ url, format, isVerboseMode })

        url && postMessage.send(CdpPageEventName.NAVIGATE, { url })
      }
    }
  ]

  // cdp Page事件订阅
  const cdpPageSubscribe: Subscribe[] = [
    {
      name: CdpPageEventName.FRAME_RESIZED,
      callback: data => {
        console.log('🏡🏡帧大小变化时', data)
        stopCasting()
        startCasting()
      }
    },
    {
      name: CdpPageEventName.NAVIGATED_WITHIN_DOCUMENT,
      callback: data => {
        console.log('🏡🏡当发生相同文档导航时触发，例如由于历史记录 API 使用或锚点导航', data)
        requestNavigationHistory()
      }
    },
    {
      name: CdpPageEventName.FRAME_NAVIGATED,
      callback: data => {
        console.log('🏡🏡在帧导航完成后触发。帧现在与新加载程序关联', data)
        const isMainFrame = !data.frame?.parentId

        if (isMainFrame) {
          requestNavigationHistory()
          strongUpdateState({
            viewportMetadata: {
              isLoading: true,
              loadingPercent: 0.1
            }
          })
        }
      }
    },
    {
      name: CdpPageEventName.LOAD_EVENT_FIRED,
      callback: data => {
        console.log('🏡🏡加载事件触发', data)
        strongUpdateState({ viewportMetadata: { loadingPercent: 1.0 } })

        setTimeout(() => {
          strongUpdateState({ viewportMetadata: { loadingPercent: 1.0, isLoading: false } })
        }, 500)
      }
    },
    {
      name: CdpPageEventName.SCREENCAST_FRAME,
      callback: data => {
        console.log('🏡🏡开始截屏视频请求的压缩图像数据', data)
        handleScreencastFrame(data)
      }
    },
    {
      name: CdpPageEventName.WINDOW_OPEN,
      callback: data => {
        console.log('🏡🏡当要打开新窗口时触发，通过 window.open（）、链接单击、表单提交、 等', data)
        postMessage.send(CustomEventName.WINDOW_OPEN_REQUESTED, { url: data.url })
      }
    },
    {
      name: CdpPageEventName.JAVASCRIPT_DIALOG_OPENING,
      callback: data => {
        console.log('🏡🏡当 JavaScript 发起的对话框（警报、确认、提示或 onbeforeunload）即将触发 打开', data)
        const { url, message, type } = data

        postMessage.send(CustomEventName.WINDOW_DIALOG_REQUESTED, { url, message, type })
      }
    }
  ]

  // cdp Overlay事件订阅
  const cdpOverlaySubscribe: Subscribe[] = [
    // {
    //   name: CdpOverlayEventName.NODE_HIGHLIGHT_REQUESTED,
    //   callback: data => {
    //     console.log('在应突出显示节点时触发。这发生在调用 setInspectMode 之后~~~~~~~~', data)
    //   }
    // },
    // {
    //   name: CdpOverlayEventName.INSPECT_NODE_REQUESTED,
    //   callback: data => {
    //     console.log('inspectNodeRequested~~~~~~~~', data)
    //   }
    // }
  ]

  // 订阅集合
  const subscribe: Subscribe[] = [...customSubscribe, ...cdpPageSubscribe, ...cdpOverlaySubscribe]

  onMounted(() => {
    subscribe.forEach(i => postMessage.subscribe(i.name, i.callback))

    cdpInit()
    requestNavigationHistory()
    startCasting()
  })

  onUnmounted(() => {
    subscribe.forEach(i => postMessage.unsubscribe(i.name, i.callback))
  })

  /** cdp初始化 */
  function cdpInit() {
    postMessage.send(CdpPageEventName.ENABLE)
    postMessage.send(CdpDomEventName.ENABLE)
    postMessage.send(CdpCssEventName.ENABLE)
    postMessage.send(CdpOverlayEventName.ENABLE)
  }

  /** 具有副作用的状态更新 */
  function strongUpdateState(obj: any): void {
    /** 更新完共享状态，通知插件web页面状态，用于留存 */
    updateState(obj)
    // , state => postMessage.send(CustomEventName.APP_STATE_CHANGED, { ...JSON.parse(JSON.stringify(state)) })
  }

  /** 开始适用截屏视频帧事件发送每个帧 */
  function startCasting(): void {
    const params = {
      quality: 100,
      format: store.state.format,
      maxWidth: 2000,
      maxHeight: 2000
    }

    if (store.state.viewportMetadata.width) {
      params.maxWidth = Math.floor(store.state.viewportMetadata.width * window.devicePixelRatio)
    }

    if (store.state.viewportMetadata.height) {
      params.maxHeight = Math.floor(store.state.viewportMetadata.height * window.devicePixelRatio)
    }

    postMessage.send(CdpPageEventName.START_SCREEN_CAST, params)
  }

  /** 停止发送截屏视屏帧的每个帧 */
  function stopCasting() {
    postMessage.send(CdpPageEventName.STOP_SCREENCAST)
  }

  /** 请求导航历史记录 */
  async function requestNavigationHistory(): Promise<void> {
    const history: NavigationHistoryResponse = await postMessage.send(CdpPageEventName.GET_NAVIGATION_HISTORY)

    if (!history) {
      return
    }

    console.log('🏡🏡请求导航历史记录', history)
    const historyIndex = history.currentIndex
    const historyEntries = history.entries
    const currentEntry = historyEntries[historyIndex]

    let url = currentEntry.url

    const pattern = /^http:\/\/(.+)/
    const match = url.match(pattern)
    if (match) {
      url = match[1]
    }

    strongUpdateState({
      url,
      history: {
        canGoBack: historyIndex === 0,
        canGoForward: historyIndex === historyEntries.length - 1
      }
    })

    const panelTitle = currentEntry.title || currentEntry.url

    postMessage.send(CustomEventName.UPDATE_TITLE, {
      title: `Tortie Preview (${panelTitle})`
    })
  }

  /** 处理截屏视频的压缩图像相关数据 */
  function handleScreencastFrame(result: any): void {
    const { sessionId, data, metadata } = result

    postMessage.send(CdpPageEventName.SCREEN_CAST_FRAMEACK, { sessionId })
    postMessage.send(CdpPageEventName.GET_LAYOUT_METRICS).then((res: any) => {
      const { width, height } = res.cssContentSize
      strongUpdateState({ scrollHeight: height, scrollWidth: width })
    })

    requestNodeHighlighting()

    strongUpdateState({
      frame: {
        base64Data: data,
        metadata
      },
      viewportMetadata: {
        scrollOffsetX: metadata.scrollOffsetX,
        scrollOffsetY: metadata.scrollOffsetY
      }
    })
  }

  /** 请求节点突出显示 */
  async function requestNodeHighlighting(): Promise<void> {
    if (store.state.viewportMetadata.highlightNode) {
      const nodeId = store.state.viewportMetadata.highlightNode.nodeId
      const highlightBoxModel: any = await postMessage.send(CdpDomEventName.GET_BOX_MODEL, { nodeId })

      await postMessage.send(CdpOverlayEventName.HIGHLIGHT_NODE, {
        nodeId,
        highlightConfig: {
          showInfo: true,
          showStyles: true,
          showRulers: true,
          showExtensionLines: true
        }
      })

      if (highlightBoxModel && highlightBoxModel.model) {
        strongUpdateState({
          viewportMetadata: {
            highlightInfo: highlightBoxModel.model
          }
        })
      }
    }
  }
}
