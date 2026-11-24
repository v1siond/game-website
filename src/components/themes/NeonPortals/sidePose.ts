import { STAND as RIG_STAND, mix, walk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'

// The runner side on (side.tsx), posed for the moves that show him whole, on the shared rig (rigPose): his limbs as the rig's
// numbers, plus his own on top: the head's nod in degrees (positive looks down), the cartoon squash and stretch
// (`stretch` above 0 tall and thin, below 0 short and wide, from his soles) and what shows round him, each 0 to 1
// (the whirl of the spin, the dust of a landing). His near side is the rig's right, his far side its left; he
// faces right, so a negative turn swings a limb ahead.

/** What a pose shows round him, each a group `data-part="{name}"` faded in. */
export const PARTS = ['whirl', 'dust'] as const
export type Part = (typeof PARTS)[number]

export type SidePose = RigPose & { head: number; stretch: number } & Record<Part, number>

const STAND: SidePose = { ...RIG_STAND, head: 0, stretch: 0, whirl: 0, dust: 0 }

const pose = (partial: Partial<SidePose>): SidePose => ({ ...STAND, ...partial })

/** A bump from 0 up to 1 and back over [from, to] of t. */
export const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** At rest: the gloves loose at his sides, a little forward. */
export const REST = pose({ armRight: -14, foreRight: -24, armLeft: 10, foreLeft: -20 })

/** The cartoon ready stance: knees bent, leant in, the gloves up. */
export const READY = pose({ lean: 8, thighRight: -18, shinRight: 24, thighLeft: 14, shinLeft: 22, rise: 4, armRight: -40, foreRight: -60, armLeft: -20, foreLeft: -70 })

/** In the air: the knees tucked, both arms thrown up, stretched tall. */
export const AIR = pose({ thighRight: -60, shinRight: 70, thighLeft: -25, shinLeft: 60, armRight: -150, foreRight: -20, armLeft: -130, foreLeft: -30, stretch: 0.12 })

/** Landed: squashed wide on bent knees, the dust out either side. */
export const LANDED = pose({ thighRight: -30, shinRight: 50, thighLeft: 20, shinLeft: 50, rise: 8, armRight: -60, foreRight: -30, armLeft: 40, foreLeft: -20, stretch: -0.16, dust: 1 })

/** A landing out of the air, `t` of the way: the squash and the dust, then back to `to`. */
export function land(t: number, to: SidePose = REST): SidePose {
  if (t < 0.3) return mix(AIR, LANDED, ramp(t, 0, 0.3))
  return { ...mix(LANDED, to, ramp(t, 0.3, 1)), dust: 1 - ramp(t, 0.3, 0.8) }
}

/** The tornado spin: the arms flung out, the whirl round him, `t` of the way (the scene turns him). */
const SPUN = pose({ armRight: -95, foreRight: -5, armLeft: 95, foreLeft: 5, thighRight: -10, thighLeft: 10, stretch: 0.06 })
export const spin = (t: number, from: SidePose = READY): SidePose => ({ ...mix(from, SPUN, bell(t, 0, 1)), whirl: bell(t, 0.05, 0.95) })

/** How far round the spin has turned him at `t`, in turns (two whole turns). */
export const spinTurns = (t: number): number => 2 * t

/** The run at `phase` (one stride per unit): long strides leant hard forward, the gloves pumping. */
export function run(phase: number): SidePose {
  const stride = walk(phase, 1)
  return pose({
    ...stride,
    thighRight: 1.8 * stride.thighRight,
    thighLeft: 1.8 * stride.thighLeft,
    shinRight: 2.2 * stride.shinRight,
    shinLeft: 2.2 * stride.shinLeft,
    rise: 3 * stride.rise,
    lean: 14,
    armRight: 2.2 * stride.armRight,
    foreRight: -95,
    armLeft: 2.2 * stride.armLeft,
    foreLeft: -95,
    stretch: 0.04 * Math.abs(Math.sin(Math.PI * phase)),
  })
}

/** The body slam: laid flat out in the air, arms and legs spread, coming down on his belly. */
export const SLAM = pose({ lean: 78, armRight: -150, foreRight: -10, armLeft: -140, foreLeft: -10, thighRight: 30, shinRight: 30, thighLeft: 45, shinLeft: 30, stretch: -0.05 })

/** The bounce off a crate's top: the knees bent hard and the body squashed, then up. */
export const BOUNCE = pose({ thighRight: -40, shinRight: 70, thighLeft: -10, shinLeft: 70, rise: 14, armRight: 30, foreRight: -40, armLeft: 40, foreLeft: -40, stretch: -0.2 })

/** The kick: leant back off the planted leg, the near leg driven straight out ahead, the gloves up in guard. */
export const KICK = pose({ lean: -18, thighRight: -96, shinRight: -4, thighLeft: 10, shinLeft: 12, armRight: -40, foreRight: -90, armLeft: -30, foreLeft: -100, stretch: 0.04 })

/** The victory dance at `phase`: hips swung, the gloves waving over his head in turn, the grin up. */
export function dance(phase: number): SidePose {
  const swing = Math.sin(Math.PI * phase)
  return pose({
    lean: 8 * swing,
    armRight: -150 + 30 * swing,
    foreRight: -40 - 20 * swing,
    armLeft: -150 - 30 * swing,
    foreLeft: -40 + 20 * swing,
    thighRight: -16 * Math.max(0, swing),
    shinRight: 30 * Math.max(0, swing),
    thighLeft: 16 * Math.max(0, -swing),
    shinLeft: 30 * Math.max(0, -swing),
    head: -6,
    stretch: 0.05 * swing,
  })
}
