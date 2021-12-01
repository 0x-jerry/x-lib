// @ts-nocheck
import { EventEmitter } from "../EventEmitter.ts";
import { ProtocolData } from "./shared.ts";
type ProtocolSendFn = (data: ProtocolData) => Promise<any> | any;
export class ProtocolClient {
  #event = new EventEmitter();
  #uid = 1;
  #send: ProtocolSendFn;
  #resolveMsg = (rawData: ProtocolData) => {
    const {
      id,
      data
    } = rawData;
    this.#event.emit(id, data);
  };

  #createProtocol(type: string, data: any): ProtocolData {
    return {
      id: (this.#uid++).toString(),
      type,
      data
    };
  }

  setSender(send: ProtocolSendFn) {
    this.#send = send;
  }

  resolve(data: any) {
    this.#resolveMsg(data);
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


  async send(type: string, params?: any) {
    const sendData = this.#createProtocol(type, params);
    return new Promise<any>(async (resolve, reject) => {
      const success = (data: any) => resolve(data);

      this.#event.once(sendData.id, success);

      try {
        await this.#send?.(sendData);
      } catch (error) {
        this.#event.off(sendData.id, success);
        reject(error);
      }
    });
  }

}