import { EventCenter } from './event-center.service'

export class postMessage extends EventCenter {
  private vid: number
  private vscode: any
  private callbacks: Map<number, object>

  constructor() {
    super()
    this.vid = 0
    this.callbacks = new Map()
    this.vscode = window?.acquireVsCodeApi?.()

    window.addEventListener('message', event => this.recived(event))
  }

  // 向插件发送消息
  send<T>(type: string, params = {}): Promise<T> {
    const id = ++this.vid

    const webviewParams = {
      type,
      params,
      callbackId: id
    }
    console.log('web发出消息 ', webviewParams)

    this.vscode?.postMessage?.(webviewParams)

    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject, error: new Error(), type })
    })
  }

  // 接收插件消息
  recived(message: any): void {
    const object: any = message.data
    console.log('web接收消息~~~~~~~~~~~~~', message)

    if (object) {
      const { type, data, callbackId } = object
      // 发送给插件层的某个请求返回消息时
      if (callbackId) {
        const callback: any = this.callbacks.get(callbackId)

        if (callback) {
          // 接受处理后删除当前id，做到请求响应1对1
          this.callbacks.delete(callbackId)

          const { resolve, reject } = callback

          !object.error ? resolve(data) : reject(object.error, callback.type, object)
        }
      } else {
        // 第一次发送
        this.publish(type, data)
      }
    }
  }
}
