import { trackAt } from '@/lib/scroll/track'

describe('trackAt', () => {
  it('waits before the first card with the first obstacle one spacing ahead', () => {
    expect(trackAt(0, 4, 400)).toEqual({ offset: 0, at: 0, run: 0, act: 0 })
  })

  it('runs the floor one spacing in the first share of a card, then plays the move', () => {
    const connector = trackAt(1.15, 4, 400)
    expect(connector.at).toBe(1)
    expect(connector.run).toBeCloseTo(0.5)
    expect(connector.act).toBe(0)
    expect(connector.offset).toBeGreaterThan(400)
    expect(connector.offset).toBeLessThan(800)

    const move = trackAt(1.65, 4, 400)
    expect(move.run).toBe(1)
    expect(move.offset).toBe(800)
    expect(move.act).toBeCloseTo(0.5)
  })

  it('holds the last move done at and past the last card: the settled frame', () => {
    expect(trackAt(4, 4, 400)).toEqual({ offset: 1600, at: 3, run: 1, act: 1 })
    expect(trackAt(9, 4, 400)).toEqual({ offset: 1600, at: 3, run: 1, act: 1 })
  })

  it('plays back the same frames on the way up', () => {
    expect(trackAt(2.4, 4, 400)).toEqual(trackAt(2.4, 4, 400))
    expect(trackAt(2.2, 4, 400).offset).toBeLessThan(trackAt(2.3, 4, 400).offset)
  })

  it('takes the connector share it is given', () => {
    expect(trackAt(0.5, 2, 100, 0.5)).toMatchObject({ run: 1, act: 0, offset: 100 })
  })
})
