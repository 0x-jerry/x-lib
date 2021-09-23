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
    const client = new ProtocolClient({
      send(data) {
        expect(data.type).toBe(TestType)

        serverEvt.emit(data.type, data)
      },
      init(receive) {
        fn()
        clientEvt.on(TestType, (e) => {
          receive(e)
        })
      },
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

    expect(fn).toBeCalledTimes(1)

    const res = await client.get(TestType, { data: 'hello' })

    expect(fn2).toBeCalledTimes(1)

    expect(res).toEqual({ data: 'world' })
  })
})
