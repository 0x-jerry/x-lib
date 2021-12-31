import { toArray } from '../toArray'

export class DoublyLinkedNode<T = unknown> {
  /**
   * If value is a DoublyLinkedNode, then return itself, else create a new DoublyLinkedNode.
   * @param value
   * @returns
   */
  static create<V>(value: V | DoublyLinkedNode<V>): DoublyLinkedNode<V> {
    if (value instanceof DoublyLinkedNode) {
      return value
    }

    return new DoublyLinkedNode(value)
  }

  constructor(public value: T) {}

  next?: DoublyLinkedNode<T>
  previous?: DoublyLinkedNode<T>
}

export class DoublyLinkedList<T = unknown> {
  static create<T>(value: T | T[]): DoublyLinkedList<T> {
    const values = toArray(value)
    const linkedList = new DoublyLinkedList<T>()

    for (const value of values) {
      linkedList.append(value)
    }

    return linkedList
  }

  #head?: DoublyLinkedNode<T>
  #tail?: DoublyLinkedNode<T>

  #size = 0

  get size() {
    return this.#size
  }

  get head() {
    return this.#head
  }

  get tail() {
    return this.#tail
  }

  /**
   * insert value before node if it exists, other wise, insert into the head.
   *
   * @param value
   */
  insert(value: T | DoublyLinkedNode<T>, node?: DoublyLinkedNode<T>) {
    this.#size++
    const nodeToInsert = DoublyLinkedNode.create(value)

    // Insert into the head
    if (!node || node === this.head) {
      if (this.head) {
        this.head.previous = nodeToInsert
        nodeToInsert.next = this.head
        this.#head = nodeToInsert
        return
      }

      this.#head = nodeToInsert
      this.#tail = nodeToInsert

      return
    }

    // Insert before node
    // previousNode -> nodeToInsert -> node

    const previousNode = node.previous!

    previousNode.next = nodeToInsert
    nodeToInsert.previous = previousNode

    nodeToInsert.next = node
    node.previous = nodeToInsert
  }

  /**
   * Append value after the node if it exists, other wise, append to the tail.
   * @param value
   * @param node
   */
  append(value: T | DoublyLinkedNode<T>, node?: DoublyLinkedNode<T>) {
    this.#size++

    const nodeToAppend = DoublyLinkedNode.create(value)

    // Append to the tail
    if (!node || node == this.tail) {
      if (this.tail) {
        this.tail.next = nodeToAppend
        nodeToAppend.previous = this.tail
        this.#tail = nodeToAppend
        return
      }

      this.#head = nodeToAppend
      this.#tail = nodeToAppend
      return
    }

    // Append to the node

    // node -> nodeToAppend -> nextNode
    const nextNode = node.next!
    nextNode.previous = nodeToAppend
    nodeToAppend.next = nextNode

    node.next = nodeToAppend
    nodeToAppend.previous = node
  }

  /**
   * Remove the node and return it if it exists
   * @param value
   */
  remove(value: T): DoublyLinkedNode<T> | undefined {
    return
  }

  find(predict: (o: T) => any): T | undefined {
    return this.findNode((node) => predict(node.value))?.value
  }

  findNode(predict: (o: DoublyLinkedNode<T>) => any): DoublyLinkedNode<T> | undefined {
    let head = this.head

    while (head) {
      if (predict(head)) {
        return head
      }

      head = head.next
    }
  }

  toArray(reverse = false): T[] {
    const values: T[] = []

    for (const item of this.entities(reverse)) {
      values.push(item.value)
    }

    return values
  }

  [Symbol.iterator](): Iterator<T> {
    const iterator = this.entities()

    return {
      next: () => {
        const value = iterator.next().value

        return {
          done: !value,
          value: value?.value,
        }
      },
    }
  }

  entities(reverse = false): IterableIterator<DoublyLinkedNode<T>> {
    const nextKey = reverse ? 'previous' : 'next'
    let beginNode = reverse ? this.tail : this.head

    const iterator: IterableIterator<DoublyLinkedNode<T>> = {
      [Symbol.iterator]() {
        return this
      },
      next: () => {
        const currentNode = beginNode
        beginNode = beginNode?.[nextKey]

        if (currentNode) {
          return {
            done: false,
            value: currentNode,
          }
        } else {
          return {
            done: true,
            value: undefined,
          }
        }
      },
    }

    return iterator
  }
}
