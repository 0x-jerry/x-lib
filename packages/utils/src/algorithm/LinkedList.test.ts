import { LinkedList, LinkedNode } from './LinkedList'

describe('LinkedNode', () => {
  it('create LinkedNode', () => {
    const node = new LinkedNode(1)

    expect(LinkedNode.create(1)).not.toBe(node)
    expect(LinkedNode.create(node)).toBe(node)
  })
})

describe('LinkedList', () => {
  it('head', () => {
    const linkedList = new LinkedList<number>()
    expect(linkedList.head).toBeUndefined()

    linkedList.insert(1)
    expect(linkedList.head?.value).toBe(1)

    linkedList.insert(2)
    expect(linkedList.head?.value).toBe(2)
  })

  it('tail', () => {
    const linkedList = new LinkedList<number>()
    expect(linkedList.tail).toBeUndefined()

    linkedList.insert(1)
    expect(linkedList.tail?.value).toBe(1)

    linkedList.insert(2)
    expect(linkedList.tail?.value).toBe(1)
  })

  it('insert', () => {
    const linkedList = new LinkedList<number>()

    linkedList.insert(1)
    linkedList.insert(2)
    linkedList.insert(3)

    expect(linkedList.toArray()).toEqual([3, 2, 1])
  })

  it('append', () => {
    const linkedList = new LinkedList<number>()

    linkedList.append(1)
    linkedList.append(2)
    linkedList.append(3)

    expect(linkedList.toArray()).toEqual([1, 2, 3])
  })

  it('append to node', () => {
    const linkedList = new LinkedList<number>()

    const node = LinkedNode.create(2)

    linkedList.append(1)
    linkedList.append(node)
    linkedList.append(3)
    linkedList.append(4, node)

    expect(linkedList.toArray()).toEqual([1, 2, 4, 3])
  })
})
