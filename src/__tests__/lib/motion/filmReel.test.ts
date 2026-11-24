import { REEL_HOLE_PX, reelAt } from '@/lib/motion/filmReel'

describe('reelAt', () => {
  it('rests at the page top: holes in place, grain still, no flicker, the notes at their start', () => {
    expect(reelAt(0, 800)).toEqual({ reel: 0, grainX: 0, grainY: 0, flicker: 0, notes: 0 })
  })

  it('runs the sprocket holes by the scroll, wrapping on one hole so the strip ends where it began', () => {
    const one = reelAt(40, 800).reel
    expect(one).toBeGreaterThan(0)
    expect(one).toBeLessThan(REEL_HOLE_PX)
    expect(reelAt(40 + (REEL_HOLE_PX * 4) / 0.25, 800).reel).toBeCloseTo(one)
  })

  it('is a function of the scroll alone, so scrolling back up draws the same frame', () => {
    expect(reelAt(1234, 800)).toEqual(reelAt(1234, 800))
  })

  it('lifts the notes over the first screen and holds them there past it', () => {
    expect(reelAt(400, 800).notes).toBeCloseTo(0.5)
    expect(reelAt(800, 800).notes).toBe(1)
    expect(reelAt(5000, 800).notes).toBe(1)
  })

  it('jumps the grain between its frames as the page moves', () => {
    const frames = new Set([0, 60, 120, 180, 240].map((y) => `${reelAt(y, 800).grainX},${reelAt(y, 800).grainY}`))
    expect(frames.size).toBeGreaterThan(2)
  })

  it('keeps the flicker faint, never over the projector flash', () => {
    for (let y = 0; y < 4000; y += 37) expect(reelAt(y, 800).flicker).toBeLessThanOrEqual(0.08)
  })
})
