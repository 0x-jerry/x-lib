import { createConfig } from './createConfig'

interface IConf {
  test: number
  arr: { a: string }[]
}

describe('createConfig', () => {
  it('read/save', async () => {
    let savedTimes = 0

    let savedData: IConf = {
      test: 0,
      arr: [
        {
          a: '1',
        },
      ],
    }

    const save = (d: IConf) => {
      savedData = d
      savedTimes++
      return Promise.resolve()
    }

    const [conf, ensureSaved] = createConfig(() => ({ test: 0, arr: [{ a: '1' }] }), save)
    conf.test++
    conf.test++
    await ensureSaved()

    expect(savedTimes).toBe(1)
    expect(savedData.test).toBe(2)
    conf.test++
    conf.arr[0].a = '2'
    await ensureSaved()

    expect(savedTimes).toBe(2)
    expect(savedData.test).toBe(3)
    expect(savedData.arr[0]).toEqual({ a: '2' })
  })
})
