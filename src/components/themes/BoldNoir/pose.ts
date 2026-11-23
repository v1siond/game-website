import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './detective.module.css'

// The detective posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus how far his hat is tipped, 0 to 1. He faces the viewer, so his front side (the viewer's right,
// the badge hand) is the rig's right, his back side its left, and he dashes with the rig's front stride.

export type NoirPose = RigPose & { hat: number }

const STAND: NoirPose = { ...RIG_STAND, hat: 0 }

const pose = (partial: Partial<NoirPose>): NoirPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the suit's arms down, the sticks over the snare, the Muay Thai guard. */
const KIT: Record<Profession, NoirPose> = {
  engineer: STAND,
  drummer: pose({ foreRight: 20, foreLeft: -20 }),
  fighter: pose({ armRight: 15, foreRight: 150, armLeft: -15, foreLeft: -150 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): NoirPose => KIT[profession]

/** The hat tipped to the street, `t` of the way and back. */
export const tip = (profession: Profession, t: number): NoirPose => ({ ...KIT[profession], hat: Math.sin(Math.PI * t) })

// Squatting `deg` at the hips: each thigh turns out at the hip and its shin folds back twice as far, so the
// foot comes back under him, and the body drops by what the bent legs lose in height (thigh and shin,
// 30.6 units long). A positive turn is clockwise on screen, which swings the viewer's right leg in.
const LEG = 30.6
const squat = (deg: number): Partial<NoirPose> => ({
  thighRight: -deg,
  shinRight: 2 * deg,
  thighLeft: deg,
  shinLeft: -2 * deg,
  rise: LEG * (1 - Math.cos((deg * Math.PI) / 180)),
})

/** The dash from cover to cover at `phase` (rising as he goes on): low on bent knees, leaning into it, the
 *  arms bent and pumping with the front stride. */
export function dash(phase: number): NoirPose {
  const stride = rigWalk(phase, 0)
  const low = squat(28)
  return pose({
    ...low,
    rise: (low.rise ?? 0) + stride.rise,
    kneeRight: stride.kneeRight,
    kneeLeft: stride.kneeLeft,
    lean: 6,
    armRight: -24 + 2 * stride.armRight,
    foreRight: -70,
    armLeft: 24 + 2 * stride.armLeft,
    foreLeft: 70,
  })
}

/** Back flat to the doorway, palms on the frame either side, the hat brim down over his eyes. */
const HUG = pose({ ...squat(14), armRight: -24, foreRight: -8, armLeft: 24, foreLeft: 8, hat: 0.4 })
export const hug = (t: number): NoirPose => mix(STAND, HUG, ramp(t, 0, 0.35))

/** Down on his knees at a lock: the back hand on his knee, the front hand at the keyhole on his right. */
const KNEEL = pose({ ...squat(52), kneeRight: 0.6, kneeLeft: 0.6, lean: 4, armRight: -62, foreRight: -42, armLeft: 28, foreLeft: -40 })

/** He kneels at the lock and works it, the front hand turning `turns` times, then still as it gives. */
const work = (t: number, turns: number, swing: number): NoirPose => {
  const held = mix(STAND, KNEEL, ramp(t, 0, 0.3))
  return { ...held, foreRight: held.foreRight + swing * Math.sin(ramp(t, 0.3, 0.85) * Math.PI * 2 * turns) }
}

/** The lock picked: the pick worked in quick small turns. */
export const pick = (t: number): NoirPose => work(t, 4, 8)

/** The safe cracked: the dial turned back and forth in wide slow turns. */
export const crack = (t: number): NoirPose => work(t, 2, 16)

/** Low behind cover, a hand on it, the brim down, until the searchlight has passed. */
const COVER = pose({ ...squat(58), kneeRight: 0.5, kneeLeft: 0.5, lean: 5, armRight: -55, foreRight: -60, armLeft: 22, foreLeft: 40, hat: 0.4 })
export const cover = (t: number): NoirPose => mix(STAND, COVER, ramp(t, 0, 0.3))

/** The ambush out of cover: crouched to spring, tucked in the air with both arms thrown up, and landed low
 *  on the guard's back with the torn mask flung high in the front hand. */
const SPRING = pose({ ...squat(50), lean: 8, armRight: 30, foreRight: 20, armLeft: -30, foreLeft: -20 })
const TUCK = pose({ ...squat(64), rise: 0, armRight: -150, foreRight: 20, armLeft: 150, foreLeft: -20 })
const POUNCE = pose({ ...squat(46), lean: -4, armRight: -160, foreRight: -10, armLeft: 40, foreLeft: -50 })
export function ambush(t: number): NoirPose {
  if (t < 0.2) return mix(STAND, SPRING, t / 0.2)
  if (t < 0.55) return mix(SPRING, TUCK, ramp(t, 0.2, 0.35))
  return mix(TUCK, POUNCE, ramp(t, 0.55, 0.8))
}

// ---- the battle ----

/** His battle stance in every kit: the guard up and the feet set apart. */
const READY = pose({ armRight: 15, foreRight: 150, armLeft: -15, foreLeft: -150, thighRight: -8, thighLeft: 8, rise: 0.4 })
export const ready = (t: number): NoirPose => mix(STAND, READY, t)

/** Each kit's blow at the weak point: the suit's straight right, the sticks brought down from overhead, the
 *  Muay Thai knee driven up with the jab. */
const BLOW: Record<Profession, NoirPose> = {
  engineer: pose({ armRight: -90, foreRight: 0, armLeft: -15, foreLeft: -150, thighRight: -14, thighLeft: 12, lean: 8 }),
  drummer: pose({ armRight: -120, foreRight: -40, armLeft: -15, foreLeft: -150, thighRight: -14, thighLeft: 12, lean: 8 }),
  fighter: pose({ armRight: -85, foreRight: 0, armLeft: -15, foreLeft: -150, thighRight: -30, shinRight: 50, kneeRight: 1, lean: 6 }),
}

/** The strike over `t`: a wind back, the blow at its peak by 0.35, held while the foe goes down, then back
 *  into the stance for the extra turn. */
export function strike(profession: Profession, t: number): NoirPose {
  const wind = mix(READY, pose({ ...READY, lean: -4, armRight: 30 }), ramp(t, 0, 0.15))
  if (t < 0.15) return wind
  if (t < 0.6) return mix(wind, BLOW[profession], ramp(t, 0.15, 0.3))
  return mix(BLOW[profession], READY, ramp(t, 0.6, 0.85))
}

/** The victory: his back to the fallen, the suit's hand straightening the tie and the other on the hip, the
 *  brim pulled down; the drummer the same, the sticks in hand; the Muay Thai glove raised high. */
const VICTORY: Record<Profession, NoirPose> = {
  engineer: pose({ armRight: 30, foreRight: 120, armLeft: 22, foreLeft: -70, lean: -3, hat: 0.5 }),
  drummer: pose({ armRight: 30, foreRight: 120, armLeft: 22, foreLeft: -70, lean: -3, hat: 0.5 }),
  fighter: pose({ armRight: -165, foreRight: 0, armLeft: -15, foreLeft: -150, lean: -3 }),
}
export const victory = (profession: Profession, t: number): NoirPose => mix(READY, VICTORY[profession], t)

// ---- the club and the office ----

/** On the drummer's stool behind the kit: knees up toward the viewer, the sticks on the snare, each forearm
 *  striking on its half of `phase`, `t` of the way into the roll. */
const SEAT = pose({ ...squat(40), kneeRight: 1, kneeLeft: 1, foreRight: 20, foreLeft: -20 })
export function drum(t: number, phase: number): NoirPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  return { ...SEAT, foreRight: SEAT.foreRight + 16 * right * t, foreLeft: SEAT.foreLeft - 16 * left * t, hat: 0.2 * beat * t }
}

/** The calling card laid on the desk at his right, the front hand down flat on it. */
const LAY = pose({ armRight: -40, foreRight: -20, lean: 7 })
export const lay = (t: number): NoirPose => mix(STAND, LAY, Math.sin(Math.PI * Math.min(1, t)))

/** The leap at the glass: tucked, the front arm over his face. */
export const LEAP = pose({ ...squat(60), rise: 0, armRight: 40, foreRight: 140, armLeft: 150, foreLeft: -20, lean: 10 })

// ---- the writer ----

const LIMB_CLASSES = {
  body: s.body,
  armRight: s.frontUpper,
  foreRight: s.frontFore,
  armLeft: s.backUpper,
  foreLeft: s.backFore,
  thighRight: s.frontThigh,
  shinRight: s.frontShin,
  thighLeft: s.backThigh,
  shinLeft: s.backShin,
}

export interface NoirJoints extends RigJoints {
  hat: SVGElement | null
}

/** His groups inside `root`, the group that holds one Detective. */
export const noirJoints = (root: Element): NoirJoints => ({ ...rigJoints(root, LIMB_CLASSES), hat: root.querySelector<SVGElement>(`.${s.hat}`) })

/** Writes `p` on his groups: the rig's limbs, then his hat. Transforms only. */
export function setNoirPose(j: NoirJoints, p: NoirPose): void {
  setRigPose(j, p)
  if (j.hat) j.hat.style.transform = `translateY(${(-1.5 * p.hat).toFixed(2)}px) rotate(${(-12 * p.hat).toFixed(1)}deg)`
}
