import { footAt, stepsFor, sweepOf, turnFor, type Leg } from './gait'

// A leg hanging from a hip at (20, 50): thigh 20 and shin 30, so the foot of a straight leg is on y 100.
const LEG: Leg = { hip: [20, 50], thigh: 20, shin: 30 }

const near = (actual: readonly number[], expected: readonly number[]) =>
  expected.forEach((value, index) => expect(actual[index]).toBeCloseTo(value, 4))

describe('footAt', () => {
  it('hangs a straight leg straight down', () => {
    near(footAt(LEG, [0, 0]), [20, 100])
  })

  it('swings the foot forward (to the right) on a negative hip turn', () => {
    near(footAt(LEG, [-90, 0]), [70, 50])
  })

  it('folds the shin back under a positive knee turn', () => {
    near(footAt(LEG, [0, 90]), [-10, 70])
  })
})

describe('turnFor', () => {
  it.each([
    [[30, 92]],
    [[6, 96]],
    [[22, 80]],
    [[40, 70]],
  ] as const)('puts the foot on %j with the knee bent forward', (foot) => {
    const turn = turnFor(LEG, foot)
    near(footAt(LEG, turn), foot)
    expect(turn[1]).toBeGreaterThanOrEqual(0)
  })

  it('straightens the leg towards a point out of reach', () => {
    const turn = turnFor(LEG, [60, 100])
    near(turn, [(Math.atan2(-40, 50) * 180) / Math.PI, 0])
  })
})

describe('sweepOf', () => {
  it('measures how far a planted sole moves under the figure from one contact to the next', () => {
    const ahead = turnFor(LEG, [38, 96])
    const behind = turnFor(LEG, [2, 96])
    expect(sweepOf(LEG, ahead, behind)).toBeCloseTo(36, 4)
    expect(sweepOf(LEG, behind, ahead)).toBeCloseTo(36, 4)
  })
})

describe('stepsFor', () => {
  it('takes as many whole steps as the distance holds strides, at least one', () => {
    expect(stepsFor(200, 40)).toBe(5)
    expect(stepsFor(-200, 40)).toBe(5)
    expect(stepsFor(210, 40)).toBe(5)
    expect(stepsFor(10, 40)).toBe(1)
  })
})
