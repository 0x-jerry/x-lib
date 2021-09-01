import { debounce } from './debounce'

describe('debounce', () => {
  it('#', (done) => {
    const fn = jest.fn()
    const wrapper = debounce(fn, 200)

    wrapper()

    // leading
    expect(fn).toBeCalledTimes(1)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(1)
    }, 100)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(1)
    }, 240)

    // tailing
    setTimeout(() => {
      expect(fn).toBeCalledTimes(2)
      done()
    }, 500)
  })

  it('scope', (done) => {
    let c = ''

    const fn = jest.fn()

    class A {
      hi = 'hi'

      constructor() {
        this.test = debounce(this.test, 50)
      }

      test() {
        fn()
        c = this.hi
      }
    }

    const a = new A()
    a.test()

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1)

      expect(c).toBe('hi')
      done()
    }, 220)
  })
})
