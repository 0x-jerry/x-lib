import { sleep } from '../sleep'
import { EventEmitter } from '../EventEmitter'
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

    const server = new ProtocolServer({
      send(data) {
        clientReceive = data.data
      },
      init(receive) {
        serverEvt.on(TestType, (e) => {
          receive(e)
        })
      },
    })

    let receive: any = null
    server.on(TestType, (data) => {
      receive = data
      return {
        data: 'world',
      }
    })
    server.start()

    serverEvt.emit(TestType, { type: TestType, id: 1, data: 'hello' })
    await sleep(10)

    expect(clientReceive).toEqual({ data: 'world' })
  })
})
