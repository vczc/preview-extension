import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { State } from '../types/interface'
import { recursiveUpdate } from '../utils/object'
import { log } from '../utils/log'

export const usePageStore = defineStore('page', () => {
  const state: State = reactive({
    url: 'about:blank',
    format: 'png',
    scrollWidth: 0,
    scrollHeight: 0,
    isInspectEnabled: false,
    isDeviceEmulationEnabled: false,
    frame: {
      base64Data: '',
      metadata: {
        deviceHeight: 0,
        deviceWidth: 0,
        offsetTop: 0,
        pageScaleFactor: 0,
        scrollOffsetX: 0,
        scrollOffsetY: 0,
        timestamp: 0
      }
    },
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
    log('state update', state)
  }

  /** 批量递归更新共享状态 */
  function updateState(obj: any, callback?: (state: State) => void) {
    recursiveUpdate(state, obj)

    log('state update', JSON.parse(JSON.stringify(state)))

    if (callback && typeof callback === 'function') {
      callback(state)
    }
  }

  return { state, increment, updateState }
})
