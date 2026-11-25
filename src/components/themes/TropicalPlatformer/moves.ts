import { hop } from '@/lib/motion/arc'
import { handAt, mix, walk } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { lerp } from '../shared/stageNodes'
import { FIGURE_STAND, type FigurePose } from './character'

// His moves in the places of the run (places/): the poses of the jungle hero on the shared rig, side on and
// facing right (the near side is the rig's right, a negative turn swings a limb forward), and the small
// helpers every place builds its frames from. A frame is a function of the move's t alone, so it plays the
// same backward.

/** His frame in a move: his pose, how far ahead of his spot and how high above the ground his soles are,
 *  a tumble (`spin`, degrees round the middle of his tucked body) and how much of him shows. */
export interface Frame {
  pose: FigurePose
  ahead: number
  lift?: number
  spin?: number
  opacity?: number
}

/** His size on the stage: place units per unit of his drawing (about 190 tall). */
export const K = 1.5

export const ease = (t: number): number => t * t * (3 - 2 * t)

/** His pose over a stretch of the move: from `a` to `b` while t runs from..to. */
export const blend = (a: FigurePose, b: FigurePose, t: number, from: number, to: number): FigurePose => mix(a, b, ease(ramp(t, from, to)))

export const still = (pose: FigurePose, ahead = 0, lift = 0): Frame => ({ pose, ahead, lift })

const posed = (turns: Partial<FigurePose>): FigurePose => ({ ...FIGURE_STAND, ...turns })

/** His stance: low, the knees bent, the head forward, the long arms hanging a little ahead, ready. */
export const STAND = posed({ rise: 4, lean: 4, thighRight: -14, shinRight: 18, thighLeft: 10, shinLeft: 12, armRight: -10, foreRight: -12, armLeft: 6, foreLeft: -10 })
export const CROUCH = posed({ rise: 8, thighRight: -50, shinRight: 70, thighLeft: -30, shinLeft: 60, armRight: -30, foreRight: -40, armLeft: -10, foreLeft: -40 })
/** Tucked into a ball for the roll and the blast: knees to the chest, arms round them. */
export const TUCK = posed({ rise: 28, thighRight: -120, shinRight: 140, thighLeft: -110, shinLeft: 140, armRight: -70, foreRight: -100, armLeft: -60, foreLeft: -100 })
/** In the air reaching up: both arms high, the legs drawn up under him. */
export const REACH = posed({ armRight: -168, foreRight: -6, armLeft: -150, foreLeft: -10, thighRight: -40, shinRight: 60, thighLeft: -10, shinLeft: 40 })
/** Riding: seated with the knees forward, the hands on the rim or the boar's neck. */
export const RIDE = posed({ rise: 12, thighRight: -80, shinRight: 75, thighLeft: -70, shinLeft: 75, armRight: -60, foreRight: -30, armLeft: -50, foreLeft: -30 })
/** Lifting something over his head in both hands. */
export const LIFT = posed({ armRight: -175, foreRight: -30, armLeft: -165, foreLeft: -30, thighRight: -10, thighLeft: 12 })
/** Throwing: leant in, the near arm flung forward and down. */
export const THROW = posed({ lean: 16, armRight: -70, foreRight: -10, armLeft: -50, foreLeft: -10, thighRight: -30, shinRight: 30, thighLeft: 20, shinLeft: 10 })
/** Angry: the heavy fists down at his sides, leant forward over the empty cave. */
export const FISTS = posed({ rise: 6, lean: 10, armRight: 14, foreRight: -30, armLeft: 18, foreLeft: -30, thighRight: -18, shinRight: 22, thighLeft: 12, shinLeft: 14 })
export const GUARD = posed({ armRight: -40, foreRight: -110, armLeft: -50, foreLeft: -105, thighRight: -12, thighLeft: 14 })
/** The teep: the near foot driven straight out from the hip, leant back, the guard up. */
export const TEEP = posed({ lean: -16, rise: 2, thighRight: -92, shinRight: -2, thighLeft: 8, shinLeft: 12, armRight: -40, foreRight: -110, armLeft: -50, foreLeft: -105 })
/** The flying knee: the near knee driven up and forward, the far leg trailing, both hands down on the clinch. */
export const KNEE = posed({ lean: 6, thighRight: -110, shinRight: 120, thighLeft: 30, shinLeft: 40, armRight: -70, foreRight: -60, armLeft: -60, foreLeft: -70 })
/** The slam: down on his bent knees, both heavy fists driven into the ground before him. */
export const SLAM = posed({ rise: 22, lean: 26, thighRight: -70, shinRight: 90, thighLeft: -50, shinLeft: 80, armRight: -20, foreRight: -4, armLeft: -14, foreLeft: -4 })
/** The key turned in a lock: the near arm held out level, the far one ready at his side. */
export const KEY = posed({ armRight: -84, foreRight: -16, armLeft: 10, foreLeft: -30, thighRight: -10, thighLeft: 10 })

/** A walk step at `phase`, facing right. */
export const stride = (phase: number): FigurePose => ({ ...FIGURE_STAND, ...walk(phase, 1) })

/** The drum roll at `phase`: the sticks over the drum head, near and far coming down in turn. */
export const roll = (phase: number): FigurePose => {
  const near = Math.max(0, Math.sin(Math.PI * phase))
  const far = Math.max(0, -Math.sin(Math.PI * phase))
  return posed({ armRight: -45 + 25 * near, foreRight: -70 + 30 * near, armLeft: -40 + 25 * far, foreLeft: -70 + 30 * far, thighRight: -6, thighLeft: 8 })
}

/** The middle of his tucked body in his drawing, from his soles: what a tumble turns him round. */
export const BALL = { x: 8, y: -50 }
/** The middle of his tucked body above the ground, in place units. */
export const TUCK_MIDDLE = 75

// His near arm's joints in his drawing (character.tsx): the shoulder, the elbow, the middle of the hand.
const ARM = { shoulder: [52, 66], elbow: [52, 90], hand: [53, 114] } as const

/** Where his near hand is in a pose, from his soles, in place units (y up negative). */
const handOf = (pose: FigurePose): [number, number] => {
  const [x, y] = handAt({ shoulder: [...ARM.shoulder], elbow: [...ARM.elbow], hand: [...ARM.hand] }, pose.armRight, pose.foreRight)
  return [(x - 50) * K, (y - 146 + pose.rise) * K]
}

/** Where a thing he holds sits in a frame: at his near hand. */
export const heldIn = (frame: Frame): [number, number] => {
  const [x, y] = handOf(frame.pose)
  return [frame.ahead + x, -(frame.lift ?? 0) + y]
}

/** A flight from `from` to `to` (each [ahead, lift]) over an arc `height` above the straight line between them. */
export const flight = (u: number, from: readonly [number, number], to: readonly [number, number], height: number): [number, number] => [
  lerp(from[0], to[0], u),
  lerp(from[1], to[1], u) + hop(u, height),
]
