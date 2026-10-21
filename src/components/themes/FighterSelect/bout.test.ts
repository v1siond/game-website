import { lastBeat, marksUpTo, nextBeat, reached, type Beat } from './bout'

const CAR: Beat[] = [
  { hero: 'walk', ms: 600 },
  { hero: 'punch', ms: 420, mark: 'hit' },
  { hero: 'tatsumaki', ms: 1080, mark: 'hit' },
  { hero: 'shoryuken', ms: 760, mark: 'wreck' },
  { hero: 'win', ms: 0 },
]

describe('a bout between him and his partner', () => {
  it('counts the marks played so far', () => {
    expect(marksUpTo(CAR, 0, 'hit')).toBe(0)
    expect(marksUpTo(CAR, 1, 'hit')).toBe(1)
    expect(marksUpTo(CAR, 4, 'hit')).toBe(2)
  })

  it('knows when a mark has played', () => {
    expect(reached(CAR, 2, 'wreck')).toBe(false)
    expect(reached(CAR, 3, 'wreck')).toBe(true)
  })

  it('steps beat by beat and holds the last', () => {
    expect(nextBeat(CAR, 0)).toBe(1)
    expect(nextBeat(CAR, 4)).toBe(4)
    expect(lastBeat(CAR)).toBe(4)
    expect(lastBeat([])).toBe(0)
  })
})
