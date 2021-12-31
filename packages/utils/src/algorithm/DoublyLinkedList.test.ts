import { DoublyLinkedList, DoublyLinkedNode } from './DoublyLinkedList'

describe('DoublyLinkedNode', () => {
  it('create', () => {
    const node = new DoublyLinkedNode(1)

    expect(DoublyLinkedNode.create(1)).not.toBe(node)
    expect(DoublyLinkedNode.create(node)).toBe(node)
  })
})

describe('DoublyLinkedList', () => {
  it('create', () => {
    const list = DoublyLinkedList.create([1, 2, 3])

    expect(list.toArray()).toEqual([1, 2, 3])
  })

  it('head', () => {
    const list = DoublyLinkedList.create([1, 2, 3])

    expect(list.head?.value).toBe(1)

    list.remove(1)
    expect(list.head?.value).toBe(2)
  })

  it('tail', () => {
    const list = DoublyLinkedList.create([1, 2, 3])

    expect(list.tail?.value).toBe(3)

    list.remove(3)
    expect(list.tail?.value).toBe(2)
  })

  it('size', () => {
    const list = DoublyLinkedList.create([1, 2, 3])
    expect(list.size).toBe(3)

    list.remove(3)
    expect(list.size).toBe(2)
  })

  it('toArray', () => {
    const list = DoublyLinkedList.create([1, 2, 3])
    expect(list.toArray()).toEqual([1, 2, 3])

    expect(list.toArray(true)).toEqual([3, 2, 1])
  })

  it('insert', () => {
    const list = DoublyLinkedList.create([1, 2, 3])

    const node2 = list.findNode((i) => i.value === 2)

    list.insert(0)
    expect(list.toArray()).toEqual([0, 1, 2, 3])

    list.insert(5, node2)
    expect(list.toArray()).toEqual([0, 1, 5, 2, 3])
  })

  it('append', () => {
    const list = DoublyLinkedList.create([1, 2, 3])

    const node2 = list.findNode((i) => i.value === 2)

    list.append(0)
    expect(list.toArray()).toEqual([1, 2, 3, 0])

    list.append(5, node2)
    expect(list.toArray()).toEqual([1, 2, 5, 3, 0])
  })

  it('remove', () => {
    const list = DoublyLinkedList.create([1, 2, 3, 4])

    expect(list.toArray()).toEqual([1, 2, 3, 4])

    list.remove(1)
    expect(list.toArray()).toEqual([2, 3, 4])

    list.remove(3)
    expect(list.toArray()).toEqual([2, 4])

    list.remove(4)
    expect(list.toArray()).toEqual([2])

    list.remove(2)
    expect(list.toArray()).toEqual([])
  })
})
