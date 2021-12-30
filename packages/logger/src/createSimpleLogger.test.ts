import { createSimpleLogger } from './createSimpleLogger'

describe('createSimpleLogger', () => {
  it('output', () => {
    let ns, other

    const clear = () => {
      ns = undefined
      other = undefined
    }

    console.warn =
      console.error =
      console.log =
        ($ns, ...$other) => {
          ns = $ns
          other = $other
        }

    const logger = createSimpleLogger('tt')

    logger.log('hello')
    expect(ns).toBe('[tt]')
    expect(other).toEqual(['hello'])
    clear()

    logger.warn('hello')
    expect(ns).toBe('[tt]')
    expect(other).toEqual(['hello'])
    clear()

    logger.error('hello')
    expect(ns).toBe('[tt]')
    expect(other).toEqual(['hello'])
    clear()
  })
})
