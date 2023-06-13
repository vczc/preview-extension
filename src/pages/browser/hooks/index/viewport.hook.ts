import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpOverlayEventName, CdpDomEventName, CdpPageEventName } from '../../constants/const'
import { useCdpHelperHook } from './cdp-helper.hook'

interface PropParams {
  postMessage: PostMessageType
  store: { state: State }
  strongUpdateState: (obj: any) => void
}

export function useViewportHook(props: PropParams) {
  const { postMessage, store, strongUpdateState } = props
  const { getCursorForNode, getNodeIdFromBackendId, resolveElementProperties } = useCdpHelperHook({ postMessage })
  /** 工具栏行为处理 */
  function onViewportChanged(action: string, data: any): void {
    type Actions = Record<string, any>

    const actions: Actions = {
      inspectHighlightRequested: () => handleInspectHighlightRequested(data),
      inspectElement: () => {
        handleInspectElementRequest()
        handleToggleInspect()
      },
      hoverElementChanged: () => handleElementChanged(data),
      interaction: () => postMessage.send(data.action, data.params),
      size: () => handleSizeChange(data)
    }

    actions?.[action]?.()
  }

  /** 句柄检查突出显示请求 */
  async function handleInspectHighlightRequested(data: any): Promise<void> {
    const highlightNodeInfo: any = await postMessage.send(CdpDomEventName.GET_NODE_FOR_LOCATION, {
      x: data.params.position.x,
      y: data.params.position.y
    })

    if (highlightNodeInfo) {
      let nodeId = highlightNodeInfo.nodeId

      if (!highlightNodeInfo.nodeId && highlightNodeInfo.backendNodeId) {
        nodeId = await getNodeIdFromBackendId(highlightNodeInfo.backendNodeId)
      }

      strongUpdateState({
        viewportMetadata: {
          highlightNode: {
            nodeId: nodeId,
            sourceMetadata: null
          }
        }
      })
    }
  }
  /** 处理检查元素请求 */
  async function handleInspectElementRequest(): Promise<void> {
    if (!store.state.viewportMetadata.highlightNode) {
      return
    }

    await resolveHighlightNodeSourceMetadata()

    const nodeId = store.state.viewportMetadata.highlightNode.nodeId

    // Trigger CDP request to enable DOM explorer
    // TODO: No sure store works.
    postMessage.send(CdpOverlayEventName.INSPECT_NODE_REQUESTED, {
      nodeId: nodeId
    })

    const sourceMetadata = store.state.viewportMetadata.highlightNode.sourceMetadata

    if (sourceMetadata) {
      postMessage.send(CustomEventName.OPEN_FILE, {
        fileName: sourceMetadata.fileName,
        lineNumber: sourceMetadata.lineNumber,
        columnNumber: sourceMetadata.columnNumber,
        charNumber: sourceMetadata.charNumber
      })
    }
  }

  /** 解析突出显示节点源元数据 */
  async function resolveHighlightNodeSourceMetadata(): Promise<void> {
    if (!store.state.viewportMetadata.highlightNode) {
      return
    }

    const nodeId = store.state.viewportMetadata.highlightNode.nodeId
    const nodeDetails: any = await postMessage.send(CdpDomEventName.RESOLVE_NODE, {
      nodeId: nodeId
    })

    if (nodeDetails.object) {
      const objectId = nodeDetails.object.objectId
      const nodeProperties = await resolveElementProperties(objectId, 3)

      if (nodeProperties) {
        // const sourceMetadata = getElementSourceMetadata(nodeProperties);
        const sourceMetadata: any = {}

        if (!sourceMetadata.fileName) {
          return
        }

        strongUpdateState({
          viewportMetadata: {
            highlightNode: {
              sourceMetadata: {
                fileName: sourceMetadata.fileName,
                columnNumber: sourceMetadata.columnNumber,
                lineNumber: sourceMetadata.lineNumber,
                charNumber: sourceMetadata.charNumber
              }
            }
          }
        })
      }
    }
  }

  /** 处理切换检查 */
  function handleToggleInspect(): void {
    if (store.state.isInspectEnabled) {
      // Hide browser highlight
      postMessage.send(CdpOverlayEventName.HIDE_HIGHLIGHT)

      // Hide local highlight
      strongUpdateState({
        isInspectEnabled: false,
        viewportMetadata: {
          highlightInfo: null,
          highlightNode: null
        }
      })
    } else {
      strongUpdateState({
        isInspectEnabled: true
      })
    }
  }

  // 处理元素改变
  async function handleElementChanged(data: any): Promise<void> {
    // 返回给定位置的节点id
    const nodeInfo: any = await postMessage.send(CdpDomEventName.GET_NODE_FOR_LOCATION, {
      x: data.params.position.x,
      y: data.params.position.y
    })

    const cursor = await getCursorForNode(nodeInfo)

    strongUpdateState({
      viewportMetadata: {
        cursor: cursor
      }
    })
  }

  /** 处理视口大小改变 */
  function handleSizeChange(data: any): void {
    const newViewport = {} as any
    if (data.height !== undefined && data.width !== undefined) {
      const height = Math.floor(data.height)
      const width = Math.floor(data.width)

      const devicePixelRatio = window.devicePixelRatio || 1

      postMessage.send(CdpPageEventName.SET_DEVICE_METRICS_OVERRIDE, {
        deviceScaleFactor: devicePixelRatio,
        mobile: false,
        height: height,
        width: width
      })

      newViewport.height = height as number
      newViewport.width = width as number
    }

    if (data.isResizable !== undefined) {
      newViewport.isResizable = data.isResizable
    }

    if (data.isFixedSize !== undefined) {
      newViewport.isFixedSize = data.isFixedSize
    }

    if (data.isFixedZoom !== undefined) {
      newViewport.isFixedZoom = data.isFixedZoom
    }

    if (data.emulatedDeviceId !== undefined) {
      newViewport.emulatedDeviceId = data.emulatedDeviceId
    }

    if (data.screenZoom !== undefined) {
      newViewport.screenZoom = data.screenZoom
    }

    strongUpdateState({
      viewportMetadata: {
        ...newViewport
      }
    })

    // this.viewport.calculateViewport();
    // TODO:
  }

  return {
    onViewportChanged,
    handleToggleInspect
  }
}
