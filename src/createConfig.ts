import { reactive, effect, UnwrapNestedRefs } from '@vue/reactivity'
import { isObject } from './isObject'

type SaveFn<T> = (data: T) => void
type ReadFn<T> = () => T

/**
 * @example
 *
 * ```ts
 * const [data, saving] = createConf({ a: 1, b: 1 }, { path: './config.json' })
 *
 * data.a++
 * data.b++
 *
 * await saving() // Ensure all changes saved, will only save once.
 *
 * ```
 *
 * @param defaultValue
 * @param option
 * @returns
 */
export function createConfig<T extends Record<string, any>>(
  read: ReadFn<T>,
  save: SaveFn<T>
): [UnwrapNestedRefs<T>, () => Promise<void>] {
  const defaultConf = read()

  const data = reactive(defaultConf)

  let saving = Promise.resolve()

  let handler: any | undefined

  const saveData = () => {
    return new Promise<void>((resolve) => {
      clearTimeout(handler)

      handler = setTimeout(() => {
        save(data)

        resolve()
      })
    })
  }

  effect(() => {
    traverse(data)
    saving = saveData()
  })

  return [data, () => saving]
}

/**
 * Touch every property recursively
 * @param o object
 */
function traverse(o: unknown) {
  if (Array.isArray(o)) {
    for (const item of o) {
      traverse(item)
    }
  } else if (isObject(o)) {
    for (const key in o) {
      if (Object.prototype.hasOwnProperty.call(o, key)) {
        const value = (o as any)[key]
        traverse(value)
      }
    }
  }
}
