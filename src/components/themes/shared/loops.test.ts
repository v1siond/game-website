import { cycles } from './loops'

// The shorthand's length in seconds and its iteration count, read back from what a style is given.
function parts(shorthand: string): { seconds: number; count: number } {
  const words = shorthand.split(' ')
  const seconds = parseFloat(words.find((word) => /^[\d.]+s$/.test(word)) ?? '0')
  const count = Number(words[words.length - 2])
  return { seconds, count }
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
})
