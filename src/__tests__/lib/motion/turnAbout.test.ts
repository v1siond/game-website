import { turnAbout } from '@/lib/motion/turnAbout'

const near = (actual: readonly number[], expected: readonly number[]) =>
  expected.forEach((value, index) => expect(actual[index]).toBeCloseTo(value, 4))

describe('turnAbout', () => {
  it('leaves a point where it is for no turn', () => {
    near(turnAbout([12, -4], 0, [3, 7]), [12, -4])
  })

  it('turns clockwise on screen (y down) for a positive turn', () => {
    near(turnAbout([10, 0], 90, [0, 0]), [0, 10])
    near(turnAbout([0, 10], 90, [0, 0]), [-10, 0])
  })

  it('turns about the pivot, not the origin', () => {
    near(turnAbout([10, 5], 180, [5, 5]), [0, 5])
    near(turnAbout([5, 9], -90, [5, 5]), [9, 5])
  })

  it('adds turns that follow each other and keeps the distance to the pivot', () => {
    const pivot = [25, 55] as const
    const once = turnAbout([30, 44], 70, pivot)
    near(once, [37.04672, 55.93624])
    near(turnAbout(turnAbout([30, 44], 30, pivot), 40, pivot), once)
    expect(Math.hypot(once[0] - pivot[0], once[1] - pivot[1])).toBeCloseTo(Math.hypot(5, -11), 6)
  })
})
