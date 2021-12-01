import { EventEmitter } from '../EventEmitter'
import { ProtocolClient } from './Client'

const clientEvt = new EventEmitter()
const serverEvt = new EventEmitter()

describe('Protocol Client', () => {
  afterAll(() => {
    clientEvt.off()
    serverEvt.off()
  })

  it('send', async () => {
    const TestType = 'test'

    const fn = jest.fn()
    const client = new ProtocolClient()

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
      clientEvt.emit(TestType, {
        ...data,
        data: {
          data: 'world',
        },
      })
    })

    const res = await client.on(TestType, { data: 'hello' })
    expect(fn).toBeCalledTimes(1)

    expect(fn2).toBeCalledTimes(1)

    expect(res).toEqual({ data: 'world' })
  })

  it('send error', async () => {
    const TestType = 'test'

    const fn = jest.fn()
    const client = new ProtocolClient()

    client.setSender((data) => {
      expect(data.type).toBe(TestType)

      serverEvt.emit(data.type, data)
    })

    clientEvt.on(TestType, (e) => {
      fn()
      client.resolve(e)
    })

    const res = client.on(TestType, { data: 'hello' })

    expect(fn).toBeCalledTimes(1)

    expect(res).rejects.toBeInstanceOf(Error)
  })
})
