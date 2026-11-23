import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './detective.module.css'

// The detective posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus his own kit on top, each 0 to 1: the hat tipped, the notebook up, the red clue mark over
// it, the badge held up and its paper flash. He faces the viewer, so his front side (the viewer's right,
// the badge hand) is the rig's right, his back side its left, and he walks with the rig's front stride.

export type NoirPose = RigPose & { hat: number; notebook: number; clue: number; badge: number; flash: number }

const STAND: NoirPose = { ...RIG_STAND, hat: 0, notebook: 0, clue: 0, badge: 0, flash: 0 }

const pose = (partial: Partial<NoirPose>): NoirPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the suit's arms down, the sticks over the snare, the Muay Thai guard. */
const KIT: Record<Profession, NoirPose> = {
  engineer: STAND,
  drummer: pose({ foreRight: 20, foreLeft: -20 }),
  fighter: pose({ armRight: 15, foreRight: 150, armLeft: -15, foreLeft: -150 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): NoirPose => KIT[profession]

/** His two step at `phase` (rising as he goes on), on the rig's front stride; the suit swings its arms with
 *  it, the sticks and the guard stay up. */
export function walk(profession: Profession, phase: number): NoirPose {
  const stride = rigWalk(phase, 0)
  const kit = KIT[profession]
  const swing = profession === 'engineer' ? 1 : 0
  return {
    ...kit,
    rise: stride.rise,
    kneeRight: stride.kneeRight,
    kneeLeft: stride.kneeLeft,
    shinRight: stride.shinRight,
    shinLeft: stride.shinLeft,
    armRight: kit.armRight + swing * stride.armRight,
    armLeft: kit.armLeft + swing * stride.armLeft,
  }
}

/** The hat tipped to the street, `t` of the way and back. */
export const tip = (profession: Profession, t: number): NoirPose => ({ ...KIT[profession], hat: Math.sin(Math.PI * t) })

/** The front arm out flat at the prop on his right, `t` of the way. */
const POINT = pose({ armRight: -85, foreRight: -5, lean: -2 })
export const point = (profession: Profession, t: number): NoirPose => mix(KIT[profession], POINT, t)

/** The notebook up in the back hand and the pencil working, the red clue mark popping at the end. */
const NOTE = pose({ foreLeft: -100, foreRight: 110 })
export function note(profession: Profession, t: number): NoirPose {
  if (profession !== 'engineer') return point(profession, t)
  const scribble = 6 * Math.sin(t * Math.PI * 8)
  const held = mix(KIT.engineer, NOTE, ramp(t, 0, 0.3))
  return { ...held, foreRight: held.foreRight + scribble * ramp(t, 0.3, 0.4), notebook: ramp(t, 0, 0.2), clue: ramp(t, 0.7, 0.85) }
}

/** The badge held up high at the prop, its paper flash at the top of the lift. */
const SHOW = pose({ armRight: -140, foreRight: 60 })
export const badge = (profession: Profession, t: number): NoirPose => ({ ...mix(KIT[profession], SHOW, t), badge: ramp(t, 0.4, 0.7), flash: Math.max(0, 1 - Math.abs(t - 0.8) / 0.2) })

/** A drawer handle taken (`t` to 0.5), then the drawer pulled toward him. */
const TAKE = pose({ armRight: -75, foreRight: -10, lean: -3 })
const DRAW = pose({ armRight: -45, foreRight: -55, lean: 4 })
export function pull(profession: Profession, t: number): NoirPose {
  if (t < 0.5) return mix(KIT[profession], TAKE, t / 0.5)
  return mix(TAKE, DRAW, (t - 0.5) / 0.5)
}

/** The front hand on a safe's dial, working it back and forth with the turn. */
const DIAL = pose({ armRight: -70, foreRight: -30, lean: -2 })
export const crack = (profession: Profession, t: number): NoirPose => {
  const held = mix(KIT[profession], DIAL, ramp(t, 0, 0.4))
  return { ...held, foreRight: held.foreRight + 14 * Math.sin(t * Math.PI * 4) * ramp(t, 0.3, 0.4) }
}

/** The stamp raised high (`t` to 0.5), then brought down hard on the folder. */
const RAISE = pose({ armRight: -155, foreRight: -10, lean: -3 })
const DOWN = pose({ armRight: -60, foreRight: 30, lean: 5, rise: 1.5 })
export function stamp(profession: Profession, t: number): NoirPose {
  if (t < 0.5) return mix(KIT[profession], RAISE, t / 0.5)
  return mix(RAISE, DOWN, ramp(t, 0.5, 0.7))
}

/** The sticks on the snare: each forearm strikes on its half of `phase`, `t` of the way into the roll. */
export function drum(t: number, phase: number): NoirPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 16 * right * t, foreLeft: kit.foreLeft - 16 * left * t, hat: 0.2 * beat * t }
}

/** The guard held, the front glove jabbed out at the bag at the middle of `t` and back. */
const JAB = pose({ armRight: -80, foreRight: 0, lean: -4 })
export function jab(profession: Profession, t: number): NoirPose {
  const out = Math.max(0, 1 - Math.abs(t - 0.6) / 0.25)
  return mix(KIT[profession], JAB, out)
}

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
  notebook: SVGElement[]
  clue: SVGElement | null
  badge: SVGElement | null
  flash: SVGElement | null
}

const one = (root: Element, className: string): SVGElement | null => root.querySelector<SVGElement>(`.${className}`)

/** His groups inside `root`, the group that holds one Detective. */
export const noirJoints = (root: Element): NoirJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  hat: one(root, s.hat),
  notebook: Array.from(root.querySelectorAll<SVGElement>(`.${s.notebook}`)),
  clue: one(root, s.clue),
  badge: one(root, s.badge),
  flash: one(root, s.flash),
})

const opacity = (el: SVGElement | null, value: number): void => {
  if (el) el.style.opacity = value.toFixed(3)
}

/** Writes `p` on his groups: the rig's limbs, then his kit. Transforms and opacity only. */
export function setNoirPose(j: NoirJoints, p: NoirPose): void {
  setRigPose(j, p)
  if (j.hat) j.hat.style.transform = `translateY(${(-1.5 * p.hat).toFixed(2)}px) rotate(${(-12 * p.hat).toFixed(1)}deg)`
  j.notebook.forEach((el) => opacity(el, p.notebook))
  opacity(j.clue, p.clue)
  opacity(j.badge, p.badge)
  opacity(j.flash, p.flash)
}
