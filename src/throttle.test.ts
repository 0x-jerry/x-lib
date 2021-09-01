import { throttle } from './throttle'

describe('throttle', () => {
  it('#', (done) => {
    const fn = jest.fn()
    const wrapper = throttle(fn, 200)

    wrapper()
    wrapper()
    wrapper()

    // leading
    expect(fn).toBeCalledTimes(1)

    setTimeout(() => {
      wrapper()
    }, 100)

    setTimeout(() => {
      wrapper()
    }, 150)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(2)
    }, 210)

    setTimeout(() => {
      wrapper()
      wrapper()
    }, 220)

    // tailing
    setTimeout(() => {
      expect(fn).toBeCalledTimes(3)
      done()
    }, 500)
  })

  it('scope', (done) => {
    let c = ''
    class A {
      hi = 'hi'

      constructor() {
        this.test = throttle(this.test, 200)
      }

      test() {
        c = this.hi
      }
    }

    const a = new A()
    a.test()

    setTimeout(() => {
      expect(c).toBe('hi')
      done()
    }, 220)
  })
})
