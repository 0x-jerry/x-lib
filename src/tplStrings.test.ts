import { tplStrings } from './tplStrings'

describe('tplStrings', () => {
  it('#', () => {
    expect(tplStrings`hello${1}`).toBe(`hello${1}`)

    expect(tplStrings`hello${1} 12`).toBe(`hello${1} 12`)

    expect(tplStrings`1 ${2} 3 ${4}`).toBe(`1 ${2} 3 ${4}`)
  })
})
