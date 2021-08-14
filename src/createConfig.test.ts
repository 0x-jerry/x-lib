import { createConfig } from './createConfig'

interface IConf {
  test: number
}

describe('createConfig', () => {
  it('test', async () => {
    let savedTimes = 0

    let savedData: IConf = {
      test: 0,
    }

    const save = (d: IConf) => {
      savedData = d
      savedTimes++
      return Promise.resolve()
    }

    const [conf, ensureSaved] = await createConfig(() => ({ test: 0 }), save)
    conf.test++
    conf.test++
    await ensureSaved()

    expect(savedTimes).toBe(1)
    expect(savedData).toEqual({ test: 2 })
    conf.test++
    await ensureSaved()

    expect(savedTimes).toBe(2)
    expect(savedData).toEqual({ test: 3 })
  })
})
