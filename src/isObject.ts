export function isObject(o: any): o is Record<string | number | symbol, any> {
  return o !== null && typeof o === 'object'
}
