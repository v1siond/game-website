import { headingTo, pinFor } from './route'

describe('the flight between his jobs', () => {
  it('pins a town by the place name every locale writes the same', () => {
    expect(pinFor('Falcón, Venezuela')).toEqual([104, 98])
    expect(pinFor('Miami-Fort Lauderdale')).toEqual([104, 66])
    expect(pinFor('Florida')).toEqual([99, 62])
  })

  it('lands a line naming no known town in the States, in any language', () => {
    expect(pinFor('United States, remote')).toEqual([80, 48])
    expect(pinFor('Stati Uniti, da remoto')).toEqual([80, 48])
    expect(pinFor('')).toEqual([80, 48])
  })

  it('turns the plane toward the next pin, clockwise from east', () => {
    expect(headingTo([0, 0], [10, 0])).toBe(0)
    expect(headingTo([0, 0], [0, 10])).toBe(90)
    expect(headingTo([10, 10], [10, 0])).toBe(-90)
    expect(headingTo([5, 5], [5, 5])).toBe(0)
  })
})
