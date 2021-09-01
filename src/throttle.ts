import { Fn } from './typing'

export function throttle<T extends Fn>(fn: T, timeFrame: number): (...args: Parameters<T>) => void {
  let leadingCalled = false
  let lastCalledTime = -1

  let trailingHandle: any

  return function (this: T, ...params) {
    const now = new Date().getTime()
    clearTimeout(trailingHandle)

    const callFn = () => {
      lastCalledTime = new Date().getTime()
      fn.apply(this, params)
    }

    // leading
    if (!leadingCalled) {
      leadingCalled = true
      callFn()
      return
    }

    // exact time interval
    if (now - lastCalledTime >= timeFrame) {
      callFn()
      return
    }

    trailingHandle = setTimeout(() => callFn(), timeFrame)
  }
}
