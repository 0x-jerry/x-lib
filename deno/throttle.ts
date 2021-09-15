// @ts-nocheck
import { Fn } from "./typing.ts";
export function throttle<T extends Fn>(fn: T, timeFrame: number): (...args: Parameters<T>) => void {
  let lastCalledTime = 0;
  let trailingHandle: any;
  return function (this: T, ...params) {
    const now = new Date().getTime();
    clearTimeout(trailingHandle);

    const callFn = () => {
      lastCalledTime = new Date().getTime();
      fn.apply(this, params);
    }; // exact time interval


    if (now - lastCalledTime >= timeFrame) {
      callFn();
      return;
    }

    trailingHandle = setTimeout(() => callFn(), timeFrame);
  };
}