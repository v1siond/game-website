import { beatIn, hitsUpTo, type Action } from './fight'

// A fight action is a run of beats, each over its share of the action; the scene asks where the action is.
const COMBO: Action = {
  ms: 1800,
  beats: [
    { hero: 'punch', partner: 'hurt', mark: 'hit' },
    { hero: 'strong', partner: 'hurt', mark: 'hit' },
    { hero: 'roundhouse', partner: 'hurt', mark: 'hit', share: 2 },
  ],
}
const FINISH: Action = { ms: 1400, beats: [{ hero: 'spinKick', partner: 'hurt', mark: 'hit' }, { hero: 'stance', partner: 'down' }] }

describe('where a fight action is', () => {
  it('splits the action by each beat share', () => {
    expect(beatIn(COMBO, 0)).toEqual({ index: 0, t: 0 })
    expect(beatIn(COMBO, 0.125)).toEqual({ index: 0, t: 0.5 })
    expect(beatIn(COMBO, 0.375)).toEqual({ index: 1, t: 0.5 })
    expect(beatIn(COMBO, 0.75)).toEqual({ index: 2, t: 0.5 })
  })

  it('ends on the last beat played whole', () => {
    expect(beatIn(COMBO, 1)).toEqual({ index: 2, t: 1 })
  })

  it('counts the hits landed across the actions, a hit landing part way into its beat', () => {
    const actions = [COMBO, FINISH]
    expect(hitsUpTo(actions, { action: 0, t: 0.05, done: false })).toBe(0)
    expect(hitsUpTo(actions, { action: 0, t: 0.15, done: false })).toBe(1)
    expect(hitsUpTo(actions, { action: 0, t: 1, done: false })).toBe(3)
    expect(hitsUpTo(actions, { action: 1, t: 0.3, done: false })).toBe(4)
    expect(hitsUpTo(actions, { action: 1, t: 1, done: true })).toBe(4)
  })
})
