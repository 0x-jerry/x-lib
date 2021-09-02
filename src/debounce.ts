import { Fn } from './typing'

export function debounce<T extends Fn>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let trailingHandle: any
  let lastCalledTime = 0

  return function (this: T, ...params) {
    const now = new Date().getTime()
    clearTimeout(trailingHandle)

    const callFn = () => {
      lastCalledTime = new Date().getTime()
      fn.apply(this, params)
    }

    // check exact time interval
    if (now - lastCalledTime >= wait) {
      callFn()
      return
    }

    lastCalledTime = now

    trailingHandle = setTimeout(() => callFn(), wait)
  }
}
