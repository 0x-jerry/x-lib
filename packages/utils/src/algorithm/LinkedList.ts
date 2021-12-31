import { toArray } from '../toArray'

export class LinkedNode<T = unknown> {
  /**
   * If value is a LinkedNode, then return itself, else create a new LinkedNode.
   * @param value
   * @returns
   */
  static create<V>(value: V | LinkedNode<V>): LinkedNode<V> {
    if (value instanceof LinkedNode) {
      return value
    }

    return new LinkedNode(value)
  }

  next?: LinkedNode<T>

  constructor(public value: T) {}
}

export class LinkedList<T = unknown> {
  static create<T>(value: T | T[]): LinkedList<T> {
    const values = toArray(value)
    const linkedList = new LinkedList<T>()

    for (const value of values) {
      linkedList.append(value)
    }

    return linkedList
  }

  #head?: LinkedNode<T>
  #tail?: LinkedNode<T>
  #size = 0

  get head() {
    return this.#head
  }

  get tail() {
    return this.#tail
  }

  get size() {
    return this.#size
  }

  /**
   * Insert value into the head.
   *
   * @param value
   */
  insert(value: T | LinkedNode<T>) {
    this.#size++

    const nodeToInsert = LinkedNode.create(value)

    if (!this.head) {
      this.#head = nodeToInsert
      this.#tail = nodeToInsert
      return
    }

    nodeToInsert.next = this.head

    this.#head = nodeToInsert
  }

  /**
   * Append value after the node if it exist, other wise, append to the tail.
   * @param value
   * @param node
   */
  append(value: T | LinkedNode<T>, node?: LinkedNode<T>) {
    this.#size++
    const nodeToAppend = LinkedNode.create(value)

    if (node?.next) {
      nodeToAppend.next = node.next
      node.next = nodeToAppend
      return
    }

    if (this.#tail) {
      this.#tail.next = nodeToAppend
      this.#tail = nodeToAppend
      return
    }

    this.#head = nodeToAppend
    this.#tail = nodeToAppend
  }

  /**
   * Remove node of value if exist, and return it.
   * @param value
   */
  remove(value: T): LinkedNode<T> | undefined {
    // const previousNode = this.findNode((o) => o.next?.value === value)
    let previousNode: LinkedNode<T> | undefined
    let removedNode: LinkedNode<T> | undefined

    for (const item of this.entities()) {
      if (item.value === value) {
        removedNode = item
        break
      }

      if (item.next?.value === value) {
        previousNode = item
        removedNode = item.next
        break
      }
    }

    if (!removedNode) {
      return
    }

    if (previousNode && removedNode.next) {
      previousNode.next = removedNode.next
      // removedNode.next = undefined
    } else if (previousNode) {
      previousNode.next = undefined
      this.#tail = previousNode
    } else if (removedNode.next) {
      this.#head = removedNode.next
    } else {
      this.#tail = undefined
      this.#head = undefined
    }

    this.#size--

    return removedNode
  }

  find(predict: (o: T) => any): T | undefined {
    return this.findNode((node) => predict(node.value))?.value
  }

  findNode(predict: (o: LinkedNode<T>) => any): LinkedNode<T> | undefined {
    let head = this.head

    while (head) {
      if (predict(head)) {
        return head
      }

      head = head.next
    }
  }

  toArray(): T[] {
    if (!this.head) {
      return []
    }

    const values: T[] = []

    for (const value of this) {
      values.push(value)
    }

    return values
  }

  [Symbol.iterator](): Iterator<T> {
    let iterator = this.entities()

    return {
      next: () => {
        const value = iterator.next().value

        if (value) {
          return {
            done: false,
            value: value.value,
          }
        } else {
          return {
            done: true,
            value: undefined,
          }
        }
      },
    }
  }

  entities(): IterableIterator<LinkedNode<T>> {
    let head = this.head

    const iterator: IterableIterator<LinkedNode<T>> = {
      [Symbol.iterator]() {
        return this
      },
      next: () => {
        const currentNode = head
        head = head?.next

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
