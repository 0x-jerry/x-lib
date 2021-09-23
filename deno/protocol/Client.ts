// @ts-nocheck
import { EventEmitter } from "../EventEmitter.ts";
import { ProtocolData } from "./shared.ts";
export interface ProtocolClientOptions {
  send(data: ProtocolData): Promise<any> | any;
  init(receiveMsg: (data: ProtocolData) => void): Promise<any> | any;
}
export class ProtocolClient {
  #event = new EventEmitter();
  #uid = 1;
  #proxyClient: ProtocolClientOptions;

  constructor(opt: ProtocolClientOptions) {
    this.#proxyClient = opt;
    this.#proxyClient.init(this.#resolveMsg);
  }

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
    const sendData = this.#createProtocol(type, data);
    return new Promise<any>(async (resolve, reject) => {
      const success = (data: any) => resolve(data);

      this.#event.once(sendData.id, success);

      try {
        await this.#proxyClient.send(sendData);
      } catch (error) {
        this.#event.off(sendData.id, success);
        reject(error);
      }
    });
  }

}