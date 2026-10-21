import { nameWords } from '@/components/cv/nameWords'

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
