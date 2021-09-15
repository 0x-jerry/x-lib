import { getNow } from './utils'

interface LRUOptions {
  count: number
  maxAge: number
}

interface Node<K, V> {
  key: K
  value: V
  age: number
  now: number
}

export class LRU<Key = string, Value = any> {
  /**
   * @private
   */
  cache: Node<Key, Value>[] = []

  readonly count: number
  readonly maxAge: number

  constructor(option: Partial<LRUOptions> = {}) {
    this.count = option.count ?? 500
    this.maxAge = option.maxAge ?? 24 * 60 * 60 * 1000
  }

  set(key: Key, value: Value) {
    const now = getNow()
    const list = this.cache

    const hitIdx = list.findIndex((f) => f.key === key)

    if (hitIdx >= 0) {
      const item = list[hitIdx]
      item.now = now
      item.value = value

      list.splice(hitIdx, 1)
      list.unshift(item)
    } else {
      const item = {
        key,
        value,
        age: this.maxAge,
        now: now,
      }

      this.cache.unshift(item)
    }

    if (this.cache.length >= this.count) {
      this.cache.length = this.count
    }
  }

  get(key: Key) {
    const list = this.cache
    const idx = list.findIndex((i) => i.key === key)

    if (idx < 0) {
      return
    }

    const item = list[idx]

    list.splice(idx, 1)

    const now = getNow()

    // check expire
    if (now - item.now > item.age) {
      return
    }

    item.now = now
    list.unshift(item)

    return item.value
  }

  reset() {
    this.cache = []
  }
}
