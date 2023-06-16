import { PostMessageType, State } from '../../types/interface'
import { CustomEventName, CdpPageEventName, CdpOverlayEventName, myInjectionKey, CdpDomEventName } from '../../constants/const'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { debounce } from '../../utils/debounce'
import { usePageStore } from '../../services/store.service'

export function useViewportHook() {
  const emit = defineEmits<{
    (e: 'onViewportChanged', action: string, data: any): void
  }>()

  const viewportRef: any = ref(null)
  const store = usePageStore()
  const { updateState } = store
  const viewportPadding = {
    top: 70,
    bottom: 30,
    left: 30,
    right: 40
  }

  const state = reactive({})
  const debouncedResizeHandler = debounce(handleViewportResize, 50)

  onMounted(() => {
    debouncedResizeHandler()

    window.addEventListener('resize', debouncedResizeHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedResizeHandler)
  })

  /** 处理视口调整大小 */
  function handleViewportResize() {}

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

      emitViewportChanges({ width, height })
    }
  }
  function calculateViewportZoom() {}

  function emitViewportChanges(newViewport: any) {
    emit('onViewportChanged', 'size', newViewport)
  }
}
