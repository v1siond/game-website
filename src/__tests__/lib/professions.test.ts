import {
  PROFESSION_ORDER,
  DEFAULT_PROFESSION,
  isProfession,
  professionOnLoad,
  professionFromSearch,
  stepProfession,
} from '@/lib/cv/professions'
import { testCV } from '../helpers/test-utils'

describe('profession order and labels', () => {
  it('reads Musician, System Engineer, Martial Artist with the engineer in the centre', () => {
    expect(PROFESSION_ORDER).toEqual(['drummer', 'engineer', 'fighter'])
    expect(PROFESSION_ORDER.map((id) => testCV().labels.professions[id])).toEqual([
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

describe('professionOnLoad', () => {
  it('opens on the pick made earlier in this visit, so leaving for the CV and coming back keeps it', () => {
    expect(professionOnLoad('', 'drummer')).toBe('drummer')
  })

  it('lets ?profession= win over the pick made in this visit', () => {
    expect(professionOnLoad('?profession=fighter', 'drummer')).toBe('fighter')
  })

  it('has nothing to open on for a new visit, or for a stored value that is not a profession', () => {
    expect(professionOnLoad('', null)).toBeNull()
    expect(professionOnLoad('', 'wizard')).toBeNull()
    expect(professionOnLoad('?profession=wizard', '')).toBeNull()
  })
})
