import { toArray } from '../toArray'

export class LinkedNode<T = unknown> {
  /**
   * if value is a LinkedNode, then return itself, else create a new LinkedNode.
   * @param value
   * @returns
   */
  static create<V>(value: V | LinkedNode<V>) {
    if (value instanceof LinkedNode) {
      return value
    }

    return new LinkedNode(value)
  }

  value: T
  next?: LinkedNode<T>

  constructor(value: T) {
    this.value = value
  }
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

  get head() {
    return this.#head
  }

  get tail() {
    return this.#tail
  }

  /**
   * insert value to the head.
   *
   * @param value
   */
  insert(value: T | LinkedNode<T>) {
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
   * append value after the node if it exist, other wise, append to the tail.
   * @param value
   * @param node
   */
  append(value: T | LinkedNode<T>, node?: LinkedNode<T>) {
    const nodeToInsert = LinkedNode.create(value)

    if (node?.next) {
      nodeToInsert.next = node.next
      node.next = nodeToInsert
      return
    }

    if (this.#tail) {
      this.#tail.next = nodeToInsert
      this.#tail = nodeToInsert
      return
    }

    this.#head = nodeToInsert
    this.#tail = nodeToInsert
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
    let head = this.head

    return {
      next: () => {
        const currentNode = head
        head = head?.next

        if (currentNode) {
          return {
            done: false,
            value: currentNode.value,
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
}
