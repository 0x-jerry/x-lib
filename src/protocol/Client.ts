import { EventEmitter } from '../EventEmitter'
import { ProtocolData } from './shared'

type ProtocolSendFn = (data: ProtocolData) => Promise<any> | any

let uid = 0

export class ProtocolClient {
  #event = new EventEmitter()

  #send?: ProtocolSendFn

  #createProtocol(type: string, data: any): ProtocolData {
    return {
      id: (uid++).toString(),
      type,
      data,
    }
  }

  setSender(send: ProtocolSendFn) {
    this.#send = send
  }

  resolve = (rawData: ProtocolData) => {
    const { id, data } = rawData
    this.#event.emit(id, data)
  }

  /**
   * @example
   * ```ts
   * const client = new ProtocolClient({...})
   *
   * const res = await client.send('echo', { data: 'hello' })
   * console.log(res)
   * ```
   * @param type
   * @param params
   * @returns
   */
  send = async (type: string, params?: any) => {
    const sendData = this.#createProtocol(type, params)

    return new Promise<any>(async (resolve, reject) => {
      const success = (data: any) => resolve(data)

      this.#event.once(sendData.id, success)

      try {
        await this.#send?.(sendData)
      } catch (error) {
        this.#event.off(sendData.id, success)
        reject(error)
      }
    })
  }
}
