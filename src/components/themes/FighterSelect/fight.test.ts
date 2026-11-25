import { beatIn, hitsUpTo, lifeOf, runOf, scoreText, type Action } from './fight'

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

describe('one credit of the run', () => {
  it('numbers the fights in page order, calls the last one final and names the bonus and the ending', () => {
    const run = runOf(['select', 'fight', 'fight', 'fight', 'bonus', 'fight', 'fight', 'ending'])
    expect(run.map((stop) => stop.stage)).toEqual(['STAGE 1', 'STAGE 1', 'STAGE 2', 'STAGE 3', 'BONUS STAGE', 'STAGE 4', 'FINAL STAGE', 'ALL CLEAR'])
  })

  it('keeps a short path in order: the first fight, then the final one', () => {
    expect(runOf(['select', 'fight', 'fight', 'ending']).map((stop) => stop.stage)).toEqual(['STAGE 1', 'STAGE 1', 'FINAL STAGE', 'ALL CLEAR'])
  })

  it('carries the score from stage to stage: each starts where the one before ended, and the ending shows the total', () => {
    const run = runOf(['select', 'fight', 'bonus', 'fight', 'ending'])
    expect(run[0]).toMatchObject({ before: 0, award: 0 })
    run.slice(1).forEach((stop, i) => expect(stop.before).toBe(run[i].before + run[i].award))
    expect(run[2].award).toBeGreaterThan(run[1].award)
    expect(run[4].award).toBe(0)
  })

  it('writes the score the way the cabinet shows it, seven digits', () => {
    expect(scoreText(32400)).toBe('0032400')
    expect(scoreText(12345.6)).toBe('0012345')
  })
})
