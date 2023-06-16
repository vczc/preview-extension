/** 防抖 */
export function debounce(fn: Function, delay: number) {
  let timer: any = null

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(args)
    }, delay)
  }
}

/** 节流 */
export function throttle(fn: Function, interval: number) {
  let lastTime = 0

  return () => {
    const nowTime = Date.now()
    const timeDiff = nowTime - lastTime

    if (interval <= timeDiff) {
      fn()
      lastTime = nowTime
    }
  }
}
