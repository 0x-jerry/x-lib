// @ts-nocheck
import { Fn } from "./typing.ts";
export function debounce<T extends Fn>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let trailingHandle: any;
  let leadingCalled = false;
  let lastCalledTime = -1;
  return function (this: T, ...params) {
    const now = new Date().getTime();
    clearTimeout(trailingHandle);

    const callFn = () => {
      lastCalledTime = new Date().getTime();
      fn.apply(this, params);
    }; // leading


    if (!leadingCalled) {
      leadingCalled = true;
      callFn();
      return;
    } // check exact time interval


    if (now - lastCalledTime >= wait) {
      callFn();
      return;
    }

    lastCalledTime = now;
    trailingHandle = setTimeout(() => callFn(), wait);
  };
}