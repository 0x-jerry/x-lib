import { createKeyboardHandler } from './createKeyboardHandler'

export class KeyboardNavigator {
  #handleKeydown

  #cancelHandler: (() => void)[] = []

  #isEnable = false

  #activeElement: HTMLElement | null = null

  get #elements() {
    return this.rootEl.querySelectorAll(`[tabindex='-1']`) as NodeListOf<HTMLElement>
  }

  get activeElement() {
    return this.#activeElement
  }

  get isEnable() {
    return this.#isEnable
  }

  constructor(public readonly rootEl: Element) {
    this.#handleKeydown = createKeyboardHandler((listener) => {
      // Compatible with deno.
      globalThis.window.addEventListener('keydown', listener)
    })

    this.enable()
  }

  #setActive(el: HTMLElement | null) {
    if (!el) return

    this.#activeElement?.blur()
    this.#activeElement = el
    this.#activeElement?.focus()
  }

  enable() {
    this.#isEnable = true

    this.#cancelHandler = [
      this.#handleKeydown('up', () => this.up()),
      this.#handleKeydown('down', () => this.down()),
      this.#handleKeydown('left', () => this.left()),
      this.#handleKeydown('right', () => this.right()),
    ]
  }

  disable() {
    this.#isEnable = false

    this.#cancelHandler.forEach((cancel) => cancel())
  }

  focus() {
    if (this.#activeElement) return

    this.#setActive(this.#elements[0])
  }

  blur() {
    this.#activeElement?.blur()
  }

  up() {
    if (!this.#activeElement) return

    const nextElements = getNestElements(this.#activeElement, this.#elements)

    this.#setActive(nextElements.up)
  }

  down() {
    if (!this.#activeElement) return

    const nextElements = getNestElements(this.#activeElement, this.#elements)

    this.#setActive(nextElements.down)
  }

  left() {
    if (!this.#activeElement) return

    const nextElements = getNestElements(this.#activeElement, this.#elements)

    this.#setActive(nextElements.left)
  }

  right() {
    if (!this.#activeElement) return

    const nextElements = getNestElements(this.#activeElement, this.#elements)

    this.#setActive(nextElements.right)
  }
}

function getNestElements(
  activeElement: HTMLElement,
  elements: HTMLElement[] | NodeListOf<HTMLElement>
) {
  type Dir = 'left' | 'right' | 'up' | 'down'

  const nextEl: Record<Dir, HTMLElement | null> = {
    up: null,
    down: null,
    left: null,
    right: null,
  }

  const [activeTop, activeLeft] = utils.getGlobalOffset(activeElement)

  for (const item of elements) {
    if (item === activeElement) continue

    const [currentTop, currentLeft] = utils.getGlobalOffset(item)

    const offsetY = activeTop - currentTop
    const offsetX = activeLeft - currentLeft

    const isVertical = Math.abs(offsetY) > Math.abs(offsetX)

    const dir: Dir = isVertical ? (offsetY > 0 ? 'up' : 'down') : offsetX > 0 ? 'left' : 'right'

    if (!nextEl[dir]) {
      nextEl[dir] = item
    } else {
      const [nTop, nLeft] = utils.getGlobalOffset(nextEl[dir]!)

      const dItem = distance(activeTop, activeLeft, currentTop, currentLeft)
      const dNext = distance(activeTop, activeLeft, nTop, nLeft)

      if (dItem < dNext) {
        nextEl[dir] = item
      }
    }
  }

  return nextEl
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2
}

export const utils = {
  /**
   *
   * @param el
   * @returns [top, left]
   */
  getGlobalOffset(el: HTMLElement) {
    let top = 0
    let left = 0

    let current: HTMLElement | null = el

    while (current) {
      top += current.offsetTop
      left += current.offsetLeft

      current = el.offsetParent as HTMLElement | null
    }

    return [top, left] as const
  },
}

export function createNavigator(rootEl: HTMLElement) {
  return new KeyboardNavigator(rootEl)
}
