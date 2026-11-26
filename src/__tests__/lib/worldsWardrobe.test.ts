import { outfitPlace } from '@/lib/worlds/wardrobe'
import { TOUR_ORDER } from '@/lib/worlds/nudge'

describe('outfitPlace', () => {
  it('counts the first world of the tour as outfit 1', () => {
    expect(outfitPlace(TOUR_ORDER[0])).toBe(1)
  })

  it('counts the last world of the tour as outfit 17, the size of the tour', () => {
    expect(outfitPlace(TOUR_ORDER[TOUR_ORDER.length - 1])).toBe(TOUR_ORDER.length)
    expect(TOUR_ORDER.length).toBe(17)
  })

  it('gives every world of the tour its own place, in tour order', () => {
    expect(TOUR_ORDER.map(outfitPlace)).toEqual(TOUR_ORDER.map((_, index) => index + 1))
  })

  it('gives an id outside the tour no place', () => {
    expect(outfitPlace('not-a-world')).toBeNull()
  })
})
