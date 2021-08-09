// @ts-nocheck
export function isObject(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === 'object';
}