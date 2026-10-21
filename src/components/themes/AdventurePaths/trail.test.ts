import { buildTrail, dotsAlong, pointAt, shareOf, stopShares } from './trail'
import { walkPosition } from './walk'

describe('expedition trail geometry', () => {
  const straight = buildTrail([
    [0, 0],
    [100, 0],
    [200, 0],
  ])

  it('runs through every stop, the stops at their distances along it', () => {
    expect(straight.length).toBeCloseTo(200, 5)
    expect(straight.stops.map((stop) => Math.round(stop))).toEqual([0, 100, 200])
    expect(stopShares(straight).map((share) => Math.round(share * 100))).toEqual([0, 50, 100])
    expect(straight.d.startsWith('M0 0 C')).toBe(true)
  })

  it('finds the point at a distance and clamps to the ends', () => {
    expect(pointAt(straight, 50)[0]).toBeCloseTo(50, 0)
    expect(pointAt(straight, -10)).toEqual([0, 0])
    expect(pointAt(straight, 900)).toEqual([200, 0])
  })

  it('sets dots at even steps between the ends, never on them', () => {
    const dots = dotsAlong(straight, 20)
    expect(dots).toHaveLength(9)
    expect(dots[0].x).toBeCloseTo(20, 0)
    expect(dots[dots.length - 1].at).toBeCloseTo(0.9, 2)
  })

  it('refuses a trail of one stop', () => {
    expect(() => buildTrail([[0, 0]])).toThrow('two or more stops')
  })

  it('gives a point as a share of the map box', () => {
    expect(shareOf([50, 25], 200, 100)).toEqual([25, 25])
  })
})

describe('the walk along a trail', () => {
  const trail = buildTrail([
    [0, 0],
    [100, 0],
  ])

  it('walks back along one leg and out along the next, facing the way he goes', () => {
    const legs = [
      { trail, from: 100, to: 0 },
      { trail, from: 0, to: 60 },
    ]
    const back = walkPosition(legs, 30)
    expect(back.point[0]).toBeCloseTo(70, 0)
    expect(back.left).toBe(true)

    const out = walkPosition(legs, 130)
    expect(out.point[0]).toBeCloseTo(30, 0)
    expect(out.left).toBe(false)
  })

  it('stands on the last stop past the end and keeps his facing there', () => {
    const end = walkPosition([{ trail, from: 0, to: 100 }], 500)
    expect(end.point[0]).toBeCloseTo(100, 0)
    expect(end.left).toBeUndefined()
  })
})
