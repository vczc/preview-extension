import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { State } from '../types/interface'

export const usePageStore = defineStore('page', () => {
  const state: State = reactive({
    url: 'about:blank',
    count: 0,
    frame: null,
    format: 'png',
    scrollWidth: 0,
    scrollHeight: 0,
    isInspectEnabled: false,
    isDeviceEmulationEnabled: false,
    history: {
      canGoBack: false,
      canGoForward: false
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
      scrollOffsetY: 0
    }
  })
  function increment() {
    state.url = 'baidu.com'
  }

  return { state, increment }
})
