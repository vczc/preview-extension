type Fn = (data: any) => void

/** 事件处理中心 */
export class EventCenter {
  // 缓存事件名称和对应的处理函数
  public _events: Record<string, any> = new Object()
  // 缓存数据（用于先发布，后订阅的情况）
  public _cache: Record<string, any> = new Object()

  /** 发布 */
  public publish(name: string, data: any): void {
    if (name) {
      this._cache[name] = this._cache?.[name] || []
      this._cache[name].push(data)
    }

    this._events[name] && this._events[name].forEach((cb: Fn) => cb(data))
  }

  /** 订阅 */
  public subscribe(name: string, fn: Fn): void {
    if (!this._events[name]) {
      this._events[name] = []
    }

    // 如果事件在订阅前发布，则直接回调返回数据
    if (this._cache[name]) {
      this._cache[name].forEach((data: any) => fn(data))
    }

    this._events[name].push(fn)
  }

  /** 取消订阅  */
  public unsubscribe(name: string, fn: Fn): void {
    if (!this._events[name]) {
      return
    }

    // 将某个事件名称里相同的函数全部过滤掉
    this._events[name] = this._events[name].filter((cb: Fn) => cb !== fn)
  }
}
