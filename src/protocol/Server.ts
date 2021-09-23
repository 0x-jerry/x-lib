import { ProtocolResponseFn, ProtocolOptions, ProtocolData } from './shared'

export class ProtocolServer {
  #events = new Map<string, ProtocolResponseFn>()

  #proxyServer: ProtocolOptions

  constructor(opt: ProtocolOptions) {
    this.#proxyServer = opt
  }

  #createProtocol(id: string, type: string, data: any): ProtocolData {
    return {
      id,
      type,
      data,
    }
  }

  async #getResolvedData(fn: ProtocolResponseFn, params: any) {
    try {
      const data = await fn(params)
      return data
    } catch (error) {
      return {
        msg: 'Unknown error',
        error: String(error),
      }
    }
  }

  #resolveMsg = async (rawData: ProtocolData) => {
    const { type, id, data } = rawData
    const fn = this.#events.get(type)
    if (!fn) {
      // ignore
      return
    }

    const responseData = await this.#getResolvedData(fn, data)

    const sendData = this.#createProtocol(id, type, responseData)

    this.#proxyServer.send(sendData)
  }

  start() {
    this.#proxyServer.init(this.#resolveMsg)
  }

  /**
   * @example
   * ```ts
   * const server = new ProtocolServer({...})
   *
   * server.on('echo', (data) => data)
   *
   * server.on('other', (data) => {
   *  const res = doSomethingWith(data)
   *
   *  return res
   * })
   * ```
   * @param type
   * @param fn
   */
  on(type: string, fn: ProtocolResponseFn) {
    if (this.#events.has(type)) {
      console.warn('Type [', type, '] has defined! And it will be override.')
    }

    this.#events.set(type, fn)
  }
}
