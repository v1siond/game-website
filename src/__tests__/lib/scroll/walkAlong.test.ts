import { walkAlong } from '@/lib/scroll/walkAlong'

// A theatre hero walking a row of props, one per card, as the cards are read: where he is, whether he is
// walking or at a prop, and how far into his act he is, all from the cards reached.

const XS = [100, 300, 500]

describe('walkAlong', () => {
  it('waits short of the first prop until its card nears the line, then walks in', () => {
    expect(walkAlong(XS, 0, 0, 200).x).toBe(-100)
    expect(walkAlong(XS, 0.5, 0, 200).x).toBe(100)
  })

  it('stands at a prop and acts there when its card is half read', () => {
    expect(walkAlong(XS, 1.5, 0, 200)).toMatchObject({ x: 300, at: 1, moving: 0, act: 1 })
  })

  it('walks between props, mid step halfway', () => {
    const between = walkAlong(XS, 1, 0, 200)
    expect(between.x).toBe(200)
    expect(between.moving).toBeCloseTo(1)
    expect(between.act).toBeCloseTo(0)
  })

  it('only ever goes forward as more cards are read', () => {
    const xs = Array.from({ length: 61 }, (_, i) => walkAlong(XS, i / 20, -40, 200).x)
    xs.slice(1).forEach((x, i) => expect(x).toBeGreaterThanOrEqual(xs[i]))
  })

  it('stays at the last prop once every card is read', () => {
    expect(walkAlong(XS, 3, 0, 200)).toMatchObject({ x: 500, at: 2, moving: 0, act: 1 })
  })

  it('stands `offset` from each prop', () => {
    expect(walkAlong(XS, 2.5, -40, 200).x).toBe(460)
  })
})
