import { litOf, propSize } from '@/lib/scroll/propRow'

// A row of props on a theatre floor, one per card: how big they are drawn, and how lit each one is as the
// cards are read.

describe('propSize', () => {
  it('draws a lone prop whole', () => {
    expect(propSize([])).toBe(1)
    expect(propSize([500])).toBe(1)
  })

  it('draws props whole while they have room, and smaller in a closer row', () => {
    expect(propSize([0, 200, 400])).toBe(1)
    expect(propSize([0, 70, 140])).toBe(0.5)
  })

  it('never shrinks them below 0.4', () => {
    expect(propSize([0, 10, 20])).toBe(0.4)
  })
})

describe('litOf', () => {
  it('keeps a prop dark until its card is a third read', () => {
    expect(litOf(0, 0)).toBe(0)
    expect(litOf(1.3, 1)).toBe(0)
  })

  it('lights it as the act on it lands, and keeps it lit', () => {
    expect(litOf(1.5, 1)).toBe(1)
    expect(litOf(4, 1)).toBe(1)
    expect(litOf(1.425, 1)).toBeCloseTo(0.5)
  })
})
