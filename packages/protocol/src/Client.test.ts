import { EventEmitter } from '../../src/EventEmitter'
import { ProtocolClient } from './Client'

const clientEvt = new EventEmitter()
const serverEvt = new EventEmitter()

/**
 * test typedef
 */
interface CustomProtocolEvents {
  test(opt: { data: string }): { data: string }
}

describe('Protocol Client', () => {
  afterAll(() => {
    clientEvt.off()
    serverEvt.off()
  })

  it('send', async () => {
    const TestType = 'test'

    const fn = jest.fn()
    const client = new ProtocolClient<CustomProtocolEvents>()

    client.setSender((data) => {
      expect(data.type).toBe(TestType)

      serverEvt.emit(data.type, data)
    })

    clientEvt.on(TestType, (e) => {
      fn()
      client.resolve(e)
    })

    const fn2 = jest.fn()
    serverEvt.on(TestType, (data) => {
      fn2()

      setTimeout(() => {
        clientEvt.emit(TestType, {
          ...data,
          data: {
            data: 'world',
          },
        })
      }, 100)
    })

    const res = await client.send(TestType, { data: 'hello' })
    expect(fn).toBeCalledTimes(1)

    expect(fn2).toBeCalledTimes(1)

    expect(res).toEqual({ data: 'world' })
  })

  it('send error', async () => {
    const TestType = 'test'

    const fn = jest.fn()
    const client = new ProtocolClient()

    client.setSender(() => {
      throw new Error('send Error')
    })

    clientEvt.on(TestType, (e) => {
      fn()
      client.resolve(e)
    })

    await expect(async () => {
      await client.send(TestType, { data: 'hello' })
    }).rejects.toBeInstanceOf(Error)

    expect(fn).toBeCalledTimes(0)
  })
})
