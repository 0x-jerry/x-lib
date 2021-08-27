/**
 * @jest-environment jsdom
 */
import { Socket } from './Socket'
import { Server } from 'mock-socket'
import { sleep } from '../sleep'
import { isObject } from '../isObject'

describe('Socket', () => {
  it('non-exists web socket server', async () => {
    const socket = new Socket('ws://127.0.0.1:7979')

    await expect(async () => {
      await socket.send('hello')
    }).rejects.toBeInstanceOf(CloseEvent)

    // Only have internal error listener.
    const ev = Object.keys(socket.events()).filter((key) => socket.events(key as any).size)

    expect(ev).toEqual(['error'])
  })

  it('serialize string', (done) => {
    const [socket] = setupSocketServer(done)

    socket.on('message', (d) => {
      expect(d).toEqual({
        from: 'wss',
        data: 'hello',
      })
    })

    socket.send('hello')
  })

  it('serialize json', (done) => {
    const [socket] = setupSocketServer(done)

    socket.on('message', (d) => {
      expect(d).toEqual({
        from: 'wss',
        data: {
          hello: 'world',
        },
      })
    })

    socket.send({
      hello: 'world',
    })
  })

  it('serialize error', (done) => {
    const [socket] = setupSocketServer(done)

    const fn = jest.fn()

    socket.on('parse-msg-error', fn)

    socket.send({
      type: 'test',
      res: 'hello',
    })

    sleep(100).then(() => {
      expect(fn).toBeCalledTimes(1)
    })
  })
})

let port = 7999
function setupSocketServer(done: () => void) {
  // mock
  const mockUrl = `ws://localhost:${port++}`
  const wss = new Server(mockUrl)

  wss.on('connection', (socket) => {
    socket.on('message', (data) => {
      const raw = JSON.parse(data as string)

      if (isObject(raw) && raw.type === 'test') {
        socket.send(raw.res)
        return
      }

      socket.send(
        JSON.stringify({
          from: 'wss',
          data: raw,
        })
      )
    })
  })

  // test

  const socket = new Socket(mockUrl)

  sleep(1000).then(done)

  return [socket, wss] as const
}
