import { beatAt, beatsOf, marksUpTo, reached, type Bout } from './bout'

const CAR: Bout = {
  lead: [{ hero: 'walk' }],
  item: { hero: 'punch', mark: 'hit' },
  close: [{ hero: 'shoryuken', mark: 'wreck' }, { hero: 'win' }],
}

describe('a bout between him and his partner', () => {
  const beats = beatsOf(CAR, 2)

  it('counts the marks played so far', () => {
    expect(marksUpTo(beats, 0, 'hit')).toBe(0)
    expect(marksUpTo(beats, 1, 'hit')).toBe(1)
    expect(marksUpTo(beats, 4, 'hit')).toBe(2)
  })

  it('knows when a mark has played', () => {
    expect(reached(beats, 2, 'wreck')).toBe(false)
    expect(reached(beats, 3, 'wreck')).toBe(true)
  })

  it('follows the scroll: the lead before the first card, a beat per card, the close after the last', () => {
    expect(beatAt(CAR, 2, 0, 0.15).index).toBe(0)
    expect(beatAt(CAR, 2, 1.5, 0.5)).toEqual({ index: 2, t: 0.5 })
    expect(beatAt(CAR, 2, 2, 0.95).index).toBe(4)
  })
})
