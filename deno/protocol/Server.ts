// @ts-nocheck
import { ProtocolData } from "./shared.ts";
type ProtocolResponseFn = (params: any) => Promise<any> | any;
interface ProtocolServerContext extends ProtocolData {
  send(data: ProtocolData): any;
}
/**
 * @example
 *
 * ```ts
 * const server = new ProtocolServer()
 *
 * server.on('test', () => {
 *  return 'boom!'
 * })
 *
 * window.onmessage = (data) => {
 *  server.resolve({
 *    ...data,
 *    send(data) {
 *      window.top.postMessage(data)
 *    }
 *  })
 * }
 *
 * ```
 */

export class ProtocolServer {
  #events = new Map<string, ProtocolResponseFn>();

  #createProtocol(id: string, type: string, data: any): ProtocolData {
    return {
      id,
      type,
      data
    };
  }

  async #getResolvedData(fn: ProtocolResponseFn, params: any) {
    try {
      const data = await fn(params);
      return data;
    } catch (error) {
      return {
        msg: 'Unknown error',
        error: String(error)
      };
    }
  }

  resolve = async (ctx: ProtocolServerContext) => {
    const {
      type,
      id,
      data,
      send
    } = ctx;
    const fn = this.#events.get(type);

    if (!fn) {
      // ignore
      return;
    }

    const responseData = await this.#getResolvedData(fn, data);
    const sendData = this.#createProtocol(id, type, responseData);
    send(sendData);
  };
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
      console.warn('Type [', type, '] has defined! And it will be override.');
    }

    this.#events.set(type, fn);
  }

}