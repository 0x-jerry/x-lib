const Once = Symbol()

interface ListenerFunction {
  (...args: any[]): any
  [Once]?: boolean
}

type Listeners<R extends Record<string, unknown>> = {
  [K in keyof R]?: Set<R[K]>
}

export class EventEmitter<Events extends Record<string, ListenerFunction>> {
  static SymbolOnce = Once

  #listeners: Listeners<Events>
  #limit: number

  constructor(limit = 20) {
    this.#limit = limit
    this.#listeners = {}
  }

  #checkLimit(size: number) {
    if (size >= this.#limit) {
      throw new Error('Listeners reached limit size: ' + this.#limit)
    }
  }

  events<K extends keyof Events>(): Listeners<Events>
  events<K extends keyof Events>(event: K): NonNullable<Listeners<Events>[K]>
  events<K extends keyof Events>(event?: K): Listeners<Events> | NonNullable<Listeners<Events>[K]> {
    if (!event) {
      return this.#listeners
    }

    if (!this.#listeners[event]) {
      this.#listeners[event] = new Set()
    }

    return this.#listeners[event]!
  }

  on<K extends keyof Events>(event: K, listener: Events[K]): () => void {
    const events = this.events(event)

    this.#checkLimit(events.size)

    events.add(listener)

    return () => {
      this.off(event, listener)
    }
  }

  once<K extends keyof Events>(event: K, listener: Events[K]) {
    const events = this.events(event)

    this.#checkLimit(events.size)

    listener[Once] = true
    events.add(listener)
  }

  off<K extends keyof Events>(event?: K, listener?: Events[K]) {
    if (!event) {
      this.#listeners = {}
      return
    }

    if (!listener) {
      delete this.#listeners[event]
      return
    }

    const events = this.events(event)
    events.delete(listener)
  }

  emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
    const events = this.events(event)
    const clears: Events[K][] = []

    events.forEach((event) => {
      event(...args)

      if (event[Once]) {
        delete event[Once]
        clears.push(event)
      }
    })

    clears.forEach((event) => {
      events.delete(event)
    })
  }
}
