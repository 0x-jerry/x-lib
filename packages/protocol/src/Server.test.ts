import { sleep } from '@0x-jerry/utils'
import { EventEmitter } from '@0x-jerry/events'
import { ProtocolServer } from './Server'

const clientEvt = new EventEmitter()
const serverEvt = new EventEmitter()

describe('Protocol Server', () => {
  afterAll(() => {
    clientEvt.off()
    serverEvt.off()
  })

  it('on', async () => {
    const TestType = 'test1'

    let clientReceive = null

    const server = new ProtocolServer()

    serverEvt.on(TestType, (e) => {
      server.resolve({
        ...e,
        send: (data) => {
          clientReceive = data.data
        },
      })
    })

    let receive: any = null
    server.on(TestType, (data) => {
      receive = data
      return {
        data: 'world',
      }
    })

    serverEvt.emit(TestType, { type: TestType, id: 1, data: 'hello' })
    await sleep(10)

    expect(clientReceive).toEqual({ data: 'world' })
  })

  it('ignore unknown type', async () => {
    const TestType = 'test1'

    let clientReceive = null
    const server = new ProtocolServer()

    serverEvt.on(TestType, (e) => {
      server.resolve({
        ...e,
        send: (data) => {
          clientReceive = data.data
        },
      })
    })

    let receive: any = null
    server.on(TestType, (data) => {
      receive = data
      return {
        data: 'world',
      }
    })

    serverEvt.emit(TestType, { type: 'unknown type', id: 1, data: 'hello' })
    await sleep(10)

    expect(clientReceive).toEqual(null)
    expect(receive).toEqual(null)
  })

  it('on the same type, emit a warning', async () => {
    const server = new ProtocolServer()

    const fn = jest.spyOn(global.console, 'warn')

    server.on('test', (data) => {})
    server.on('test', (data) => {})

    expect(fn).toBeCalledTimes(1)
  })

  it('response with error', async () => {
    const TestType = 'test1'

    let clientReceive = null
    const server = new ProtocolServer()

    serverEvt.on(TestType, (e) => {
      server.resolve({
        ...e,
        send: (data) => {
          clientReceive = data.data
        },
      })
    })

    let receive: any = null
    server.on(TestType, (data) => {
      receive = data
      throw new Error('unknown')
    })

    serverEvt.emit(TestType, { type: TestType, id: 1, data: 'hello' })
    await sleep(10)

    expect(clientReceive).toEqual({
      error: 'Error: unknown',
      msg: 'Unknown error',
    })
  })
})
