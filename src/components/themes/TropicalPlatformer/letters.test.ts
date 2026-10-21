import { letterCards, nameLetters } from './letters'

describe('nameLetters', () => {
  it('takes the first four letters of the first word, upper case', () => {
    expect(nameLetters('Alexander Pulido')).toEqual(['A', 'L', 'E', 'X'])
  })

  it('keeps a short first word whole', () => {
    expect(nameLetters('  Al Pulido')).toEqual(['A', 'L'])
  })

  it('gives no letters for an empty name', () => {
    expect(nameLetters('')).toEqual([])
  })
})

describe('letterCards', () => {
  it('puts the first letter on the first card, the last on the last and the rest evenly between', () => {
    expect(letterCards(4, 10)).toEqual([0, 3, 6, 9])
  })

  it('gives one letter per card when the counts match', () => {
    expect(letterCards(4, 4)).toEqual([0, 1, 2, 3])
  })

  it('goes round the cards when there are fewer cards than letters', () => {
    expect(letterCards(4, 3)).toEqual([0, 1, 2, 0])
  })

  it('places nothing without cards', () => {
    expect(letterCards(4, 0)).toEqual([])
  })
})
