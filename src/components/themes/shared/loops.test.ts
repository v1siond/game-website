import { STORY_MS } from '@/lib/motion/stepWithin'
import { cycles, swings } from './loops'

// The shorthand's length in seconds and its iteration count, read back from what a style is given.
function parts(shorthand: string): { seconds: number; count: number } {
  const words = shorthand.split(' ')
  const seconds = parseFloat(words.find((word) => /^[\d.]+s$/.test(word)) ?? '0')
  const count = Number(words[words.length - 2])
  return { seconds, count }
}

const endS = (shorthand: string, delay: number) => {
  const { seconds, count } = parts(shorthand)
  return delay + seconds * count
}

describe('cycles', () => {
  it('plays whole cycles that end by 5 s and keep their pace', () => {
    expect(parts(cycles('flame', 1.8, 'ease-in-out'))).toEqual({ seconds: 1.8, count: 2 })
  })

  it('rests on its start frame, never playing, with less than half its cycle left', () => {
    expect(parts(cycles('sway', 7, 'ease-in-out', 4.333)).count).toBe(0)
    expect(parts(cycles('flame', 1.8, 'ease-in-out', 4.333)).count).toBe(0)
  })

  it('still fits a cycle into the time left when half of it or more is there', () => {
    expect(parts(cycles('breath', 3.6, 'ease-in-out', 2.5))).toEqual({ seconds: 2.5, count: 1 })
  })

  it('keeps today\'s pace under a negative delay and ends by 5 s', () => {
    for (const [seconds, delay] of [[10, -2], [12, -4], [14, -6], [3, -1]] as const) {
      const shorthand = cycles('spirit', seconds, 'ease-in-out', delay)
      expect(parts(shorthand).seconds).toBe(seconds)
      expect(endS(shorthand, delay)).toBeLessThanOrEqual(STORY_MS / 1000 + 1e-9)
      expect(endS(shorthand, delay)).toBeGreaterThan(0)
    }
  })
})

describe('swings', () => {
  it('plays an alternate loop in there and back pairs, so it ends on its start pose by 5 s', () => {
    const shorthand = swings('banner', 1.4, 'ease-in-out', 0.48)
    expect(shorthand).toContain('alternate')
    expect(parts(shorthand).count % 2).toBe(0)
    expect(endS(shorthand, 0.48)).toBeLessThanOrEqual(STORY_MS / 1000)
  })
})
