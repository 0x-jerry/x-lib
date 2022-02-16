/**
 * Ensure `o` has a value.
 *
 * @param o
 * @returns
 */
export const notNullish = <T>(o: T | null | undefined): o is NonNullable<T> => o != null

/**
 * Assert function, like the one in node.
 *
 * @param condition
 * @param message
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message)
}
