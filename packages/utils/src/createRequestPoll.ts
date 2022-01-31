import { EventEmitter } from '@0x-jerry/events'

export interface RequestPollOption {
  /**
   * @default 10
   */
  max: number
}

type RequestPollEvents = {
  next(): void
}

interface RequestPollContext {
  count: number
  event: EventEmitter<RequestPollEvents>
}

export function createRequestPoll<T extends (...arg: any[]) => Promise<any>>(
  request: T,
  opt: Partial<RequestPollOption> = {}
): T {
  const option: RequestPollOption = Object.assign({ max: 5 }, opt)

  const ctx: RequestPollContext = {
    count: 0,
    event: new EventEmitter(20),
  }

  return function (this: any, ...args: any[]) {
    return new Promise<any>((resolve, reject) => {
      const next = async () => {
        if (ctx.count >= option.max) return

        ctx.count++
        ctx.event.off('next', next)

        try {
          const res = await request.apply(this, args)
          resolve(res)
        } catch (error) {
          reject(error)
        }

        ctx.count--
        ctx.event.emit('next')
      }

      if (ctx.count < option.max) {
        next()
      } else {
        ctx.event.on('next', next)
      }
    })
  } as T
}
