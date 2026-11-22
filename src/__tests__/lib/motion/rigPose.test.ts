import { STAND, footAt, handAt, mix, walk, type ArmPivots, type LegPivots } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose } from '@/components/themes/shared/rig'

// The pose math every jointed theatre hero shares, and its writer on a figure built the way a world draws one.

const near = (actual: readonly number[], expected: readonly number[]) =>
  expected.forEach((value, index) => expect(actual[index]).toBeCloseTo(value, 4))

describe('mix', () => {
  it('is the first pose at 0, the second at 1 and halfway between at 0.5, on every number', () => {
    const a = { ...STAND, armRight: 10, rise: -4 }
    const b = { ...STAND, armRight: 30, rise: 4 }
    expect(mix(a, b, 0)).toEqual(a)
    expect(mix(a, b, 1)).toEqual(b)
    expect(mix(a, b, 0.5)).toMatchObject({ armRight: 20, rise: 0, lean: 0 })
  })

  it('carries a world extra the rig does not name', () => {
    expect(mix({ ...STAND, blades: 0 }, { ...STAND, blades: 1 }, 0.25).blades).toBeCloseTo(0.25)
  })
})

describe('walk', () => {
  it('stands at the start of a step and lifts one knee at a time', () => {
    expect(walk(0)).toMatchObject({ kneeRight: 0, kneeLeft: 0, rise: -0 })
    expect(walk(0.5)).toMatchObject({ kneeRight: 1, kneeLeft: 0 })
    expect(walk(1.5).kneeLeft).toBeCloseTo(1)
    expect(walk(1.5).kneeRight).toBe(0)
  })

  it('swings the arm on the other side of the lifted knee', () => {
    expect(walk(0.5).armLeft).toBeGreaterThan(0)
    expect(walk(0.5).armRight).toBeCloseTo(0)
  })
})

describe('walk in profile', () => {
  const leg: LegPivots = { hip: [50, 95], knee: [50, 118], foot: [50, 142] }
  const footX = (phase: number, facing: 1 | -1, side: 'Right' | 'Left') => {
    const pose = walk(phase, facing)
    return footAt(leg, pose[`thigh${side}`], pose[`shin${side}`])[0]
  }

  it.each([1, -1] as const)('steps forward as the phase rises, facing %i: the swinging foot moves the way he faces', (facing) => {
    // the right leg swings through the first half step, the left through the second
    expect(Math.sign(footX(0.4, facing, 'Right') - footX(0.1, facing, 'Right'))).toBe(facing)
    expect(Math.sign(footX(1.4, facing, 'Left') - footX(1.1, facing, 'Left'))).toBe(facing)
  })

  it('plants the other foot, which slides back under him as he moves on', () => {
    expect(Math.sign(footX(0.4, 1, 'Left') - footX(0.1, 1, 'Left'))).toBe(-1)
  })

  it('keeps the front view stride with no facing: knees lift, no leg swings sideways', () => {
    expect(walk(0.5)).toMatchObject({ thighRight: 0, thighLeft: 0, kneeRight: 1 })
  })
})

describe('handAt', () => {
  const pivots: ArmPivots = { shoulder: [30, 50], elbow: [30, 70], hand: [30, 90] }

  it('is the drawn hand for a straight arm', () => {
    near(handAt(pivots, 0, 0), [30, 90])
  })

  it('turns the forearm about the elbow, then the whole arm about the shoulder', () => {
    near(handAt(pivots, 0, -90), [50, 70])
    near(handAt(pivots, 180, 0), [30, 10])
  })
})

describe('setRigPose', () => {
  const figure = (): Element => {
    const holder = document.createElement('div')
    holder.innerHTML = `<svg><g class="b"><g class="ar"><g class="fr"></g></g><g class="al"><g class="fl"></g></g><g class="tr"><g class="sr"></g></g><g class="tl"><g class="sl"></g></g></g></svg>`
    return holder.querySelector('svg')!
  }
  const CLASSES = { body: 'b', armRight: 'ar', foreRight: 'fr', armLeft: 'al', foreLeft: 'fl', thighRight: 'tr', shinRight: 'sr', thighLeft: 'tl', shinLeft: 'sl' }

  it('writes each group a transform of its numbers, the lifted knee foreshortening its thigh and shin', () => {
    const root = figure()
    const joints = rigJoints(root, CLASSES)
    setRigPose(joints, { ...STAND, rise: -2, lean: 4, armRight: 30, kneeLeft: 1 })
    expect((root.querySelector('.b') as SVGElement).style.transform).toBe('translateY(-2.00px) rotate(4.0deg)')
    expect((root.querySelector('.ar') as SVGElement).style.transform).toBe('rotate(30.0deg)')
    expect((root.querySelector('.tl') as SVGElement).style.transform).toBe('rotate(0.0deg) scaleY(0.820)')
    expect((root.querySelector('.sl') as SVGElement).style.transform).toBe('rotate(0.0deg) scaleY(0.920)')
  })

  it('skips a group the figure does not draw', () => {
    const holder = document.createElement('div')
    holder.innerHTML = '<svg><g class="b"></g></svg>'
    expect(() => setRigPose(rigJoints(holder.querySelector('svg')!, CLASSES), STAND)).not.toThrow()
  })
})
