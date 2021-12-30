import { EventEmitter } from '../EventEmitter'

type WebSocketEvents = {
  error(e: any): void
  connected(): void
  closed(ev: CloseEvent): void
  message<T>(data: T): void
  'parse-msg-error'(e: any): void
}

interface SocketFormatter {
  beforeReceive(data: string): any
  beforeSend(data: any): string
}

const defaultFormatter: SocketFormatter = {
  beforeReceive: (data) => JSON.parse(data),
  beforeSend: (data) => JSON.stringify(data),
}

export class Socket extends EventEmitter<WebSocketEvents> {
  #s?: WebSocket

  get socket() {
    return this.#s
  }

  get #isConnecting() {
    return this.#s?.readyState === WebSocket.CONNECTING
  }

  get connected() {
    return this.#s?.readyState === WebSocket.OPEN
  }

  formatter = defaultFormatter

  constructor(public url: string) {
    super()

    // avoid uncaught exception
    this.on('error', console.error)
  }

  async #connect() {
    if (this.#isConnecting) {
      return new Promise<void>((resolve, reject) => {
        const result = (err?: any) => {
          this.off('connected', result)
          this.off('closed', result)

          if (err) reject(err)
          else resolve()
        }

        this.once('connected', () => result())
        this.once('closed', (err) => result(err))
      })
    }

    return new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(this.url)
      this.#s = socket

      socket.onclose = (ev) => {
        this.emit('closed', ev)

        reject(ev)
      }

      socket.onerror = (ev) => {
        this.emit('error', ev)
      }

      socket.onopen = () => {
        this.emit('connected')
        resolve()
      }

      socket.onmessage = (ev) => {
        try {
          const data = this.formatter.beforeReceive(ev.data)
          this.emit('message', data)
        } catch (error) {
          this.emit('parse-msg-error', error)
          this.emit('message', ev.data)
        }
      }
    })
  }

  send = async (data: any) => {
    if (!this.connected) {
      await this.#connect()
    }

    this.#s!.send(this.formatter.beforeSend(data))
  }
}
