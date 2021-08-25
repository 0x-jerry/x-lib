import { isObject } from './isObject'

export interface Protocol<D = any, T = string> {
  __protocol_symbol__: true
  id: string | number
  type: T
  data: D
}

export function isProtocol<D, T>(o: any): o is Protocol<D, T> {
  return isObject(o) && o.__protocol_symbol__
}

let id = 0

export function createProtocolMessage<D = any, T = string>(type: T, data: D): Protocol<D, T> {
  return {
    __protocol_symbol__: true,
    id: (id++).toString(),
    type,
    data,
  }
}
