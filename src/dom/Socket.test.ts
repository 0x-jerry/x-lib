/**
 * @jest-environment jsdom
 */
import { Socket } from './Socket'

describe('Socket', () => {
  it('non-exists web socket server', async () => {
    await expect(async () => {
      const socket = new Socket('ws://127.0.0.1:7979')
      await socket.send('hello')
    }).rejects.toBeInstanceOf(CloseEvent)
  })
})
