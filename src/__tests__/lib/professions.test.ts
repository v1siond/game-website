import {
  PROFESSION_ORDER,
  DEFAULT_PROFESSION,
  PROFESSION_LABELS,
  isProfession,
  professionFromSearch,
  stepProfession,
} from '@/lib/cv/professions'

describe('profession order and labels', () => {
  it('reads Musician, System Engineer, Martial Artist with the engineer in the centre', () => {
    expect(PROFESSION_ORDER).toEqual(['drummer', 'engineer', 'fighter'])
    expect(PROFESSION_ORDER.map((id) => PROFESSION_LABELS[id])).toEqual([
      'Musician',
      'System Engineer',
      'Martial Artist',
    ])
    expect(PROFESSION_ORDER.indexOf(DEFAULT_PROFESSION)).toBe(1)
  })
})

describe('isProfession', () => {
  it.each(['engineer', 'drummer', 'fighter'])('accepts %s', (id) => {
    expect(isProfession(id)).toBe(true)
  })

  it.each([null, undefined, '', 'musician', 'ENGINEER', 'constructor', 'toString', 3, {}])(
    'rejects %p',
    (value) => {
      expect(isProfession(value)).toBe(false)
    },
  )
})

describe('professionFromSearch', () => {
  it('reads a known profession from the query string', () => {
    expect(professionFromSearch('?profession=fighter')).toBe('fighter')
    expect(professionFromSearch('?t=neon-cyber&profession=drummer')).toBe('drummer')
  })

  it('answers none for a missing, empty or unknown value', () => {
    expect(professionFromSearch('')).toBeNull()
    expect(professionFromSearch('?profession=')).toBeNull()
    expect(professionFromSearch('?profession=gamer')).toBeNull()
  })
})

describe('stepProfession', () => {
  it('moves one slot left or right along the order', () => {
    expect(stepProfession('engineer', -1)).toBe('drummer')
    expect(stepProfession('engineer', 1)).toBe('fighter')
  })

  it('wraps at both ends', () => {
    expect(stepProfession('drummer', -1)).toBe('fighter')
    expect(stepProfession('fighter', 1)).toBe('drummer')
  })
})
