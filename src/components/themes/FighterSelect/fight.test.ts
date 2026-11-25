import { beatIn, hitsUpTo, lifeOf, type Action } from './fight'

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

describe('the life bars', () => {
  // He blocks a rush that chips his bar, then lands two hits and the knockout.
  const BLOCKED: Action = { ms: 1600, beats: [{ hero: 'guard', partner: 'walk', chip: 0.3 }, { hero: 'guard', partner: 'strong', chip: 0.5 }] }
  const FINISHED: Action = { ms: 1600, beats: [{ hero: 'punch', partner: 'hurt', mark: 'hit' }, { hero: 'strong', partner: 'hurt', mark: 'hit' }, { hero: 'uppercut', partner: 'juggle', mark: 'ko' }] }
  const actions = [BLOCKED, FINISHED]

  it('counts the knockout blow as a hit', () => {
    expect(hitsUpTo(actions, { action: 1, t: 1, done: true })).toBe(3)
  })

  it('drains the rival hit by hit to nothing at the knockout, and his own bar by each blow he takes', () => {
    expect(lifeOf(actions, { action: 0, t: 0, done: false })).toEqual({ hero: 1, rival: 1 })
    expect(lifeOf(actions, { action: 0, t: 0.3, done: false })).toEqual({ hero: 0.7, rival: 1 })
    expect(lifeOf(actions, { action: 1, t: 0.3, done: false }).rival).toBeCloseTo(2 / 3)
    expect(lifeOf(actions, { action: 1, t: 1, done: true })).toEqual({ hero: 0.2, rival: 0 })
  })

  it('leaves a bar full in a round with no hits', () => {
    const still: Action = { ms: 1200, beats: [{ hero: 'stance', partner: 'stance' }] }
    expect(lifeOf([still], { action: 0, t: 1, done: true })).toEqual({ hero: 1, rival: 1 })
  })
})
