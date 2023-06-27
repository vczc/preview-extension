import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName } from '../../constants/const'
import { onMounted, onUnmounted, computed, ref, inject, defineEmits } from 'vue'
import { debounce } from '../../utils/debounce'
import { usePageStore } from '../../services/store.service'
import { useViewportHook } from '../../hooks/index/viewport.hook'

export function useViewportPageHook() {
  const emit = defineEmits<{
    (e: 'onViewportChanged', action: string, data: any): void
  }>()

  const viewportRef: any = ref(null)
  const store = usePageStore()
  const viewportPadding = {
    top: 70,
    bottom: 30,
    left: 30,
    right: 40
  }
  const postMessage = inject(myInjectionKey) as PostMessageType
  const hookParams = {
    store,
    postMessage
  }
  const { onViewportChanged } = useViewportHook(hookParams)
  const debouncedResizeHandler = debounce(handleViewportResize, 50)

  const viewportClass = computed(() => (store.state.isDeviceEmulationEnabled ? 'viewport-resizable' : ''))

  onMounted(() => {
    debouncedResizeHandler()

    window.addEventListener('resize', debouncedResizeHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedResizeHandler)
  })

  /** 处理视口调整大小 */
  function handleViewportResize() {
    calculateViewport()
  }

  function calculateViewport() {
    calculateViewportSize()
    calculateViewportZoom()
  }

  /** 计算视口大小 */
  function calculateViewportSize() {
    if (store.state.viewportMetadata.isFixedSize) {
      return
    }

    // TODO:
    if (viewportRef.value) {
      let { width, height } = viewportRef.value?.getBoundingClientRect()
      const roundNumber = (val: number) => Math.floor(val)

      if (store.state.isDeviceEmulationEnabled) {
        const { top, bottom, left, right } = viewportPadding

        width = roundNumber(width - left - right)
        height = roundNumber(height - top - bottom)
      }

      if (width === roundNumber(store.state.viewportMetadata.width || 0) && height === roundNumber(store.state.viewportMetadata.height || 0)) {
        return
      }

      console.log('viewport~~~~~~~~~~~~~~~', viewportRef.value?.getBoundingClientRect())

      // TODO:
      // emitViewportChanges({ width, height })
    }
  }

  function calculateViewportZoom() {
    let screenZoom = 1

    if (store.state.viewportMetadata.isFixedZoom) {
      return
    }

    if (store.state.viewportMetadata.isFixedSize) {
      const screenViewportDimensions = {
        height: window.innerHeight - 38, // TODO: Remove hardcoded toolbar height
        width: window.innerWidth
      }

      if (store.state.isDeviceEmulationEnabled) {
        screenViewportDimensions.width = screenViewportDimensions.width - viewportPadding.left - viewportPadding.right
        screenViewportDimensions.height = screenViewportDimensions.height - viewportPadding.bottom - viewportPadding.top
      }

      screenZoom = Math.min(
        screenViewportDimensions.width / (store.state.viewportMetadata.width || 0),
        screenViewportDimensions.height / (store.state.viewportMetadata.height || 0)
      )
    }

    if (screenZoom === store.state.viewportMetadata.screenZoom) {
      return
    }

    emitViewportChanges({ screenZoom })
  }

  function handleResizeStop(e: any, direction: any, ref: any, delta: any) {
    emitViewportChanges({
      width: store.state.viewportMetadata.width + delta.width,
      height: store.state.viewportMetadata.height + delta.height,
      isFixedSize: true
    })
  }

  function handleInspectElement(params: object) {
    onViewportChanged('inspectElement', { params })
  }

  // 处理检查高亮请求
  function handleInspectHighlightRequested(params: object) {
    onViewportChanged('inspectHighlightRequested', {
      params: params
    })
  }

  // 处理截屏交互
  function handleScreencastInteraction(action: string, params: object) {
    onViewportChanged('interaction', { action, params })
  }

  // 处理鼠标移动
  function handleMouseMoved(params: object) {
    onViewportChanged('hoverElementChanged', { params })
  }

  function emitViewportChanges(newViewport: any) {
    onViewportChanged('size', newViewport)
  }

  return { viewportRef, viewportClass }
}
