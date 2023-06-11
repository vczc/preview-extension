import { onMounted, inject, onUnmounted } from 'vue'
import { PostMessageType, Subscribe } from '../types/interface'
import { CustomEventName, myInjectionKey } from '../constants/const'
import { CdpPageEventName } from '../constants/const'
import { CdpOverlayEventName } from '../constants/const'

export function useIndexHook() {
  const pm = inject(myInjectionKey) as PostMessageType

  // 自定义事件订阅
  const customSubscribe: Subscribe[] = [
    {
      name: CustomEventName.APP_CONFIGURATION,
      callback: data => {
        console.log('web页面规格数据~~~~~', data)
      }
    }
  ]

  // cdp Page事件订阅
  const cdpPageSubscribe: Subscribe[] = [
    {
      name: CdpPageEventName.SCREENCAST_FRAME,
      callback: data => {
        console.log('web开始截屏视频请求的压缩图像数据~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.NAVIGATED_WITHIN_DOCUMENT,
      callback: data => {
        console.log('当发生相同文档导航时触发，例如由于历史记录 API 使用或锚点导航~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.FRAME_NAVIGATED,
      callback: data => {
        console.log('在帧导航完成后触发。帧现在与新加载程序关联~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.LOAD_EVENT_FIRED,
      callback: data => {
        console.log('加载事件触发~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.SCREENCAST_FRAME,
      callback: data => {
        console.log('开始截屏视频请求的压缩图像数据~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.WINDOW_OPEN,
      callback: data => {
        console.log('当要打开新窗口时触发，通过 window.open（）、链接单击、表单提交、 等~~~~~~~~', data)
      }
    },
    {
      name: CdpPageEventName.JAVASCRIPT_DIALOG_OPENING,
      callback: data => {
        console.log('当 JavaScript 发起的对话框（警报、确认、提示或 onbeforeunload）即将触发 打开~~~~~~~~', data)
      }
    }
  ]

  // cdp Overlay事件订阅
  const cdpOverlaySubscribe: Subscribe[] = [
    {
      name: CdpOverlayEventName.NODE_HIGHLIGHT_REQUESTED,
      callback: data => {
        console.log('在应突出显示节点时触发。这发生在调用 setInspectMode 之后~~~~~~~~', data)
      }
    },

    {
      name: CdpOverlayEventName.INSPECT_NODE_REQUESTED,
      callback: data => {
        console.log('帧调整大小变化~~~~~~~~', data)
      }
    }
  ]

  // 订阅集合
  const subscribe: Subscribe[] = [...customSubscribe, ...cdpPageSubscribe, ...cdpOverlaySubscribe]

  const params = {
    quality: 100,
    format: 'png',
    maxWidth: 2000,
    maxHeight: 2000
  }

  pm.send('Page.startScreencast', params)

  onMounted(() => {
    subscribe.forEach(i => pm.subscribe(i.name, i.callback))
  })

  onUnmounted(() => {
    subscribe.forEach(i => pm.unsubscribe(i.name, i.callback))
  })
}
