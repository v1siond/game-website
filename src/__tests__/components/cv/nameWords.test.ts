import { initialsOf, nameWords } from '@/lib/cv/nameWords'

describe('nameWords', () => {
  it('splits the name into its words, each with where it starts in the name', () => {
    expect(nameWords('Alexander Pulido')).toEqual([
      { word: 'Alexander', start: 0 },
      { word: 'Pulido', start: 10 },
    ])
  })

  it('skips runs of spaces and keeps the starts of the name as written', () => {
    expect(nameWords('  Alexander   Pulido ')).toEqual([
      { word: 'Alexander', start: 2 },
      { word: 'Pulido', start: 14 },
    ])
  })

  it('gives no words for an empty name', () => {
    expect(nameWords('')).toEqual([])
  })
})

describe('initialsOf', () => {
  it('takes the first letter of each word of the name', () => {
    expect(initialsOf('Alexander Pulido')).toBe('AP')
  })

  it('skips runs of spaces', () => {
    expect(initialsOf('  Alexander   Pulido ')).toBe('AP')
  })

  it('gives nothing for an empty name', () => {
    expect(initialsOf('')).toBe('')
  })
})
