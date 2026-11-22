import { addFind, countIn, NO_FINDS } from '@/lib/finds'

// The find counter's state: which ids were found in each group. A world counts things a visitor finds
// (a level reached, an item picked up) and shows found against the total it passes.

describe('addFind', () => {
  it('counts a new id in its group', () => {
    const finds = addFind(addFind(NO_FINDS, 'about', 'all'), 'projects', 'all')
    expect(countIn(finds, 'all', 6)).toEqual({ found: 2, total: 6 })
  })

  it('never counts a repeat twice and keeps the same state, so nothing re-renders', () => {
    const once = addFind(NO_FINDS, 'about', 'all')
    const twice = addFind(once, 'about', 'all')
    expect(twice).toBe(once)
    expect(countIn(twice, 'all', 6).found).toBe(1)
  })

  it('keeps the groups apart: the same id in two groups counts once in each', () => {
    const finds = addFind(addFind(addFind(NO_FINDS, 'a', 'bones'), 'a', 'souls'), 'b', 'bones')
    expect(countIn(finds, 'bones', 3)).toEqual({ found: 2, total: 3 })
    expect(countIn(finds, 'souls', 3)).toEqual({ found: 1, total: 3 })
  })

  it('leaves the state it was given untouched', () => {
    const before = addFind(NO_FINDS, 'about', 'all')
    addFind(before, 'projects', 'all')
    expect(countIn(before, 'all').found).toBe(1)
  })
})

describe('countIn', () => {
  it('reads an empty group as nothing found, with the total the world passes', () => {
    expect(countIn(NO_FINDS, 'all', 4)).toEqual({ found: 0, total: 4 })
    expect(countIn(NO_FINDS, 'all')).toEqual({ found: 0, total: 0 })
  })

  it('shows every find as found when the world draws the full state (reduced motion, a preview)', () => {
    const finds = addFind(NO_FINDS, 'about', 'all')
    expect(countIn(finds, 'all', 5, true)).toEqual({ found: 5, total: 5 })
  })
})
