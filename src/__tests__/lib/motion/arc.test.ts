import { drop, hop } from '@/lib/motion/arc'

describe('hop', () => {
  it('starts and lands on the ground', () => {
    expect(hop(0, 100)).toBe(0)
    expect(hop(1, 100)).toBeCloseTo(0)
  })

  it('reaches its height at the top and hangs there a moment', () => {
    expect(hop(0.5, 100)).toBeCloseTo(100)
    expect(hop(0.42, 100)).toBeGreaterThan(97)
    expect(hop(0.58, 100)).toBeGreaterThan(97)
  })

  it('stays on the ground outside its time', () => {
    expect(hop(-0.2, 100)).toBe(0)
    expect(hop(1.3, 100)).toBe(0)
  })
})

describe('drop', () => {
  it('falls from 0 to its height', () => {
    expect(drop(0, 300)).toBe(0)
    expect(drop(1, 300)).toBe(300)
  })

  it('speeds up as it falls', () => {
    expect(drop(0.5, 300)).toBeLessThan(150)
    expect(drop(0.75, 300) - drop(0.5, 300)).toBeGreaterThan(drop(0.5, 300) - drop(0.25, 300))
  })

  it('holds outside its time', () => {
    expect(drop(-1, 300)).toBe(0)
    expect(drop(2, 300)).toBe(300)
  })
})
