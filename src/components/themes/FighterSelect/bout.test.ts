import { beatAt, marksUpTo, planOf, type Bout } from './bout'

// Block then punish per card, a different link per card in turn, and a two beat close.
const ROUND: Bout = {
  lead: [{ hero: 'stance' }],
  cards: [[{ hero: 'guard', partner: 'punch' }, { hero: 'strong', partner: 'hurt', mark: 'hit' }], [{ hero: 'roundhouse', partner: 'hurt', mark: 'hit' }]],
  close: [{ hero: 'uppercut', partner: 'down' }, { hero: 'win', partner: 'down' }],
}

describe('a bout between him and his partner', () => {
  const plan = planOf(ROUND, 3)

  it('lays out the lead, each card in turn of the cycle, then the close', () => {
    expect(plan.beats.map((beat) => beat.hero)).toEqual(['stance', 'guard', 'strong', 'roundhouse', 'guard', 'strong', 'uppercut', 'win'])
    expect(plan.starts).toEqual([1, 3, 4, 6])
  })

  it('counts the marks played so far', () => {
    expect(marksUpTo(plan.beats, 1, 'hit')).toBe(0)
    expect(marksUpTo(plan.beats, 5, 'hit')).toBe(3)
  })

  it('plays the lead while the scene rises, before the first card', () => {
    expect(beatAt(ROUND, plan, 0, 0.15)).toMatchObject({ index: 0, card: -1 })
  })

  it('splits a card of two beats over its own scroll', () => {
    expect(beatAt(ROUND, plan, 0.25, 0.4)).toEqual({ index: 1, t: 0.5, card: 0 })
    expect(beatAt(ROUND, plan, 0.75, 0.4)).toEqual({ index: 2, t: 0.5, card: 0 })
    expect(beatAt(ROUND, plan, 1.5, 0.4)).toEqual({ index: 3, t: 0.5, card: 1 })
  })

  it('plays the close once the last card is past', () => {
    expect(beatAt(ROUND, plan, 3, 0.95)).toMatchObject({ index: 7, card: 3 })
  })

  it('plays a scene with no cards from its lead alone', () => {
    const still: Bout = { lead: [{ hero: 'win', partner: 'down' }], cards: [], close: [] }
    expect(beatAt(still, planOf(still, 0), 0, 0.9)).toMatchObject({ index: 0, card: -1 })
  })
})
