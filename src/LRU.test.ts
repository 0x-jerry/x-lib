import { sleep } from '.'
import { LRU } from './LRU'

describe('LRU', () => {
  it('count', () => {
    const lru = new LRU({ count: 2 })

    lru.set('1', '1')
    lru.set('1', '1')
    expect(lru.cache.length).toBe(1)

    lru.set('2', '2')
    expect(lru.cache.length).toBe(2)

    lru.set('3', '3')
    expect(lru.cache.length).toBe(2)

    expect(lru.cache[0].value).toBe('3')
    expect(lru.cache[1].value).toBe('2')
  })

  it('maxAge', async () => {
    const lru = new LRU({ maxAge: 1 })
    lru.set('1', '1')
    expect(lru.get('1')).toBe('1')

    await sleep(10)
    expect(lru.get('1')).toBeUndefined()
  })
})
