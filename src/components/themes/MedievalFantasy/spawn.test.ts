import { SPAWN_AT_MS, spawnS } from './spawn'

describe('the golem spawn timeline', () => {
  it('ends by 5000 ms from the page opening, the golem fully faded in', () => {
    expect(SPAWN_AT_MS.settled).toBeLessThanOrEqual(5000)
  })

  it('keeps the drawn order of its phases', () => {
    const order = [SPAWN_AT_MS.meteor, SPAWN_AT_MS.explosion, SPAWN_AT_MS.assembling, SPAWN_AT_MS.final, SPAWN_AT_MS.hidden, SPAWN_AT_MS.settled]
    expect([...order].sort((a, b) => a - b)).toEqual(order)
  })

  it('keeps the drawn ratios: the meteor falls for the same share of the spawn it always had', () => {
    expect((SPAWN_AT_MS.explosion - SPAWN_AT_MS.meteor) / SPAWN_AT_MS.settled).toBeCloseTo(1500 / 7500, 3)
    expect(spawnS(1.5) * 1000).toBeCloseTo(SPAWN_AT_MS.explosion - SPAWN_AT_MS.meteor, 0)
  })
})
