import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName } from '../../constants/const'
interface PropParams {
  postMessage: PostMessageType
  store: { state: State }
  strongUpdateState: (obj: any) => void
  onViewportChanged: (action: string, data: any) => void
  handleToggleInspect: () => void
}

export function useToolbarHook(props: PropParams) {
  const { postMessage, store, strongUpdateState, onViewportChanged, handleToggleInspect } = props

  /** 工具栏行为处理 */
  function onToolbarActionInvoked(action: string, data: any): Promise<any> {
    const actions: Record<string, any> = {
      forward: () => postMessage.send(CdpPageEventName.GO_FORWARD),
      backward: () => postMessage.send(CdpPageEventName.GO_BACKWARD),
      refresh: () => postMessage.send(CdpPageEventName.RELOAD),
      inspect: () => handleToggleInspect(),
      emulateDevice: () => handleToggleDeviceEmulation(),
      urlChange: () => handleUrlChange(data),
      readClipboard: () => postMessage.send(CustomEventName.READ_TEXT),
      writeClipboard: () => handleClipboardWrite(data),
      viewportSizeChange: () => handleViewportSizeChange(data),
      viewportDeviceChange: () => handleViewportDeviceChange(data)
    }

    actions?.[action]?.()

    return Promise.resolve()
  }

  /** 切换设备仿真 */
  function handleToggleDeviceEmulation(): void {
    if (store.state.isDeviceEmulationEnabled) {
      disableViewportDeviceEmulation()
    } else {
      enableViewportDeviceEmulation()
    }
  }

  /** 禁用视口设备仿真 */
  function disableViewportDeviceEmulation(): void {
    handleViewportDeviceChange({
      device: {
        name: 'Responsive',
        viewport: {
          width: store.state.viewportMetadata.width,
          height: store.state.viewportMetadata.height
        }
      }
    })

    strongUpdateState({
      isDeviceEmulationEnabled: false
    })
  }

  /** 禁用视口设备仿真 */
  function enableViewportDeviceEmulation(deviceName = 'Responsive'): void {
    handleViewportDeviceChange({
      device: {
        name: deviceName,
        viewport: {
          width: store.state.viewportMetadata.width,
          height: store.state.viewportMetadata.height
        }
      }
    })

    strongUpdateState({
      isDeviceEmulationEnabled: true
    })
  }

  /** 启用设备视口改变 */
  function handleViewportDeviceChange(data: any): void {
    const isResizable = data.device.name === 'Responsive'
    const isFixedSize = data.device.name !== 'Responsive'
    const isFixedZoom = data.device.name === 'Responsive'
    const width = data.device.viewport ? data.device.viewport.width : undefined
    const height = data.device.viewport ? data.device.viewport.height : undefined
    const screenZoom = 1

    onViewportChanged('size', {
      width,
      height,
      screenZoom,
      isResizable,
      isFixedSize,
      isFixedZoom,
      emulatedDeviceId: data.device.name
    })
  }

  function handleViewportSizeChange(data: any): void {
    const { width, height } = data
    onViewportChanged('size', { width, height })
  }

  /** 处理url变化 */
  function handleUrlChange(data: any) {
    const url = data.url

    postMessage.send(CdpPageEventName.NAVIGATE, { url })

    strongUpdateState({ url })
  }

  // 处理剪切版写入
  function handleClipboardWrite(data: any): Promise<any> | void {
    // overwrite the clipboard only if there is a valid value
    if (data && (data as any).value) {
      return postMessage.send('Clipboard.writeText', data)
    }
  }

  return {
    onToolbarActionInvoked,
    handleViewportSizeChange
  }
}
