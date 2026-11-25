import { cameraAt, layerLeft, scatter, stretchesOf } from '@/lib/motion/sideScroll'

describe('stretchesOf', () => {
  it('lays each stretch of the level right after the one before, from 0', () => {
    expect(stretchesOf([300, 700, 650])).toEqual([
      { from: 0, to: 300 },
      { from: 300, to: 1000 },
      { from: 1000, to: 1650 },
    ])
  })

  it('gives no stretch for no scene', () => {
    expect(stretchesOf([])).toEqual([])
  })
})

describe('cameraAt', () => {
  const view = { start: 350, hold: 960 }

  it('starts with him where the scene starts him and ends with him at the hold', () => {
    expect(cameraAt(0, 910, view)).toBe(0)
    expect(cameraAt(1, 910, view)).toBe(300)
  })

  it('eases out of rest and into it, so it trails him in the middle', () => {
    expect(cameraAt(0.1, 600, { start: 960, hold: 960 })).toBeLessThan(60)
    expect(cameraAt(0.5, 600, { start: 960, hold: 960 })).toBeCloseTo(300)
  })

  it('reads the same frame for the same t, whichever way the scroll went', () => {
    expect(cameraAt(0.37, 700, view)).toBe(cameraAt(0.37, 700, view))
  })
})

describe('layerLeft', () => {
  it('puts the left edge of a far layer a share of the way the camera has come', () => {
    expect(layerLeft(0.25, 1000)).toBe(250)
    expect(layerLeft(1, 1400)).toBe(1400)
  })
})

describe('scatter', () => {
  it('places one shape per spacing across the range, each the same on every call', () => {
    const first = scatter(0, 1000, 200, 7)
    expect(first).toHaveLength(5)
    expect(scatter(0, 1000, 200, 7)).toEqual(first)
  })

  it('keeps a shape where it is when the range grows, so two stretches drawn side by side agree', () => {
    const near = scatter(0, 1000, 200, 3)
    const wide = scatter(-400, 1400, 200, 3)
    expect(wide.filter((shape) => shape.at >= 0 && shape.at < 1000)).toEqual(near)
  })

  it('gives every shape a share between 0 and 1 to vary its size by', () => {
    for (const shape of scatter(0, 4000, 100, 11)) {
      expect(shape.share).toBeGreaterThanOrEqual(0)
      expect(shape.share).toBeLessThan(1)
    }
  })
})
