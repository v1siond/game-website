import { legFrom, playedPast, restSpot, travelVars } from './course'

const COURSE = {
  start: { x: -20, lift: 0 },
  legs: [
    { name: 'run', to: { x: 40, lift: 0 } },
    { name: 'jump', to: { x: 50, lift: 60 } },
  ],
}

describe('a figure course', () => {
  it('starts each leg where the last one ended, the first at the start', () => {
    expect(legFrom(COURSE, 0)).toEqual({ x: -20, lift: 0 })
    expect(legFrom(COURSE, 1)).toEqual({ x: 40, lift: 0 })
  })

  it('rests where the last leg ends, or at the start with no legs', () => {
    expect(restSpot(COURSE)).toEqual({ x: 50, lift: 60 })
    expect(restSpot({ start: { x: 8, lift: 0 }, legs: [] })).toEqual({ x: 8, lift: 0 })
  })

  it('counts a leg as played once a later leg runs or the figure has arrived', () => {
    const order = ['run', 'jump']
    expect(playedPast(order, 'run', false, 'run')).toBe(false)
    expect(playedPast(order, 'jump', false, 'run')).toBe(true)
    expect(playedPast(order, 'jump', false, 'jump')).toBe(false)
    expect(playedPast(order, 'stand', true, 'jump')).toBe(true)
  })

  it('hands the travel of a leg to the rig as CSS variables', () => {
    expect(travelVars({ from: { x: 1, lift: 2 }, to: { x: 3, lift: 4 }, ms: 500 })).toEqual({
      '--from-x': 1,
      '--from-lift': 2,
      '--to-x': 3,
      '--to-lift': 4,
      '--ms': 500,
    })
  })
})
