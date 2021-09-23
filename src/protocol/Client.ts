import { EventEmitter } from '../EventEmitter'
import { ProtocolOptions, ProtocolData } from './shared'

export class ProtocolClient {
  #event = new EventEmitter()

  #uid = 1

  #proxyClient: ProtocolOptions

  constructor(opt: ProtocolOptions) {
    this.#proxyClient = opt

    this.#proxyClient.init(this.#resolveMsg)
  }

  #resolveMsg = (rawData: ProtocolData) => {
    const { id, data } = rawData
    this.#event.emit(id, data)
  }

  #createProtocol(type: string, data: any): ProtocolData {
    return {
      id: (this.#uid++).toString(),
      type,
      data,
    }
  }

  /**
   * @example
   * ```ts
   * const client = new ProtocolClient({...})
   *
   * const res = await client.get('echo', { data: 'hello' })
   * console.log(res)
   * ```
   * @param type
   * @param data
   * @returns
   */
  async get(type: string, data: any) {
    const sendData = this.#createProtocol(type, data)

    return new Promise<any>(async (resolve, reject) => {
      const success = (data: any) => resolve(data)

      this.#event.once(sendData.id, success)

      try {
        await this.#proxyClient.send(sendData)
      } catch (error) {
        this.#event.off(sendData.id, success)
        reject(error)
      }
    })
  }
}
