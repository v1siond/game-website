import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './sprite.module.css'

// The survivor posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus his own kit on top, each 0 to 1: the bolt out of the plasmid hand, the wrench's arc, the
// audio diary by his face, the sparks over the fingers, the spark off the snare, the revival chamber's light
// and how far he is knit back together in it. His front side (the plasmid arm, the near leg) is the rig's
// right, his back side its left; he faces right, so he walks with the rig's profile stride facing 1.

export type DecoPose = RigPose & { head: number; bolt: number; arc: number; recorder: number; sparks: number; hit: number; chamber: number; knit: number }

const STAND: DecoPose = { ...RIG_STAND, head: 0, bolt: 0, arc: 0, recorder: 0, sparks: 0, hit: 0, chamber: 0, knit: 1 }

const pose = (partial: Partial<DecoPose>): DecoPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the wrench hanging, both sticks raised over the snare, the Muay Thai guard. */
const KIT: Record<Profession, DecoPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -20, foreRight: -70, armLeft: -25, foreLeft: -75 }),
  fighter: pose({ armRight: -35, foreRight: -135, armLeft: -25, foreLeft: -145, thighRight: -6 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): DecoPose => KIT[profession]

/** His stride at `phase` (rising as he goes on), the legs on the rig's profile walk; the engineer swings his
 *  arms with it, the sticks and the guard stay up. */
export function walk(profession: Profession, phase: number): DecoPose {
  const stride = rigWalk(phase, 1)
  const kit = KIT[profession]
  const swing = profession === 'engineer' ? 1 : 0
  return {
    ...kit,
    rise: stride.rise,
    thighRight: kit.thighRight + stride.thighRight,
    thighLeft: stride.thighLeft,
    shinRight: stride.shinRight,
    shinLeft: stride.shinLeft,
    armRight: kit.armRight + swing * stride.armRight,
    armLeft: kit.armLeft + swing * stride.armLeft,
  }
}

/** The plasmid thrown forward and the bolt forked out of it, `t` of the way. */
const ZAP = pose({ armRight: -75, foreRight: -12, lean: -3 })
export const zap = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], ZAP, t), bolt: ramp(t, 0.7, 1), sparks: t })

/** The plasmid hand raised over his head, lifting with the mind, `t` of the way. */
const LIFT = pose({ armRight: -150, foreRight: -15, lean: -4 })
export const lift = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], LIFT, t), sparks: t })

/** The audio diary held up by his face, his head leaning into its speaker, `t` of the way. */
const LISTEN = pose({ armRight: -45, foreRight: -140, head: 6 })
export const listen = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], LISTEN, t), recorder: ramp(t, 0.5, 0.8) })

/** The wrench wound up behind his head (`t` to 0.5), then brought down hard in front, the arc at the hit. */
const WOUND = pose({ armLeft: 160, foreLeft: 30, lean: -6 })
const STRUCK = pose({ armLeft: -80, foreLeft: -10, lean: 7 })
export function swing(profession: Profession, t: number): DecoPose {
  if (t < 0.5) return mix(KIT[profession], WOUND, t / 0.5)
  return { ...mix(WOUND, STRUCK, ramp(t, 0.5, 0.75)), arc: 1 - Math.abs(t - 0.75) / 0.25 }
}

/** Both hands on a valve wheel, turning it a quarter round with `turn`, `t` of the way in. */
const GRIP = pose({ armRight: -70, foreRight: -35, armLeft: -55, foreLeft: -40, lean: 4 })
export const grip = (profession: Profession, t: number, turn: number): DecoPose => {
  const held = mix(KIT[profession], GRIP, t)
  return { ...held, armRight: held.armRight + 20 * turn * t, armLeft: held.armLeft - 15 * turn * t, sparks: 0.35 * t }
}

/** The free hand up for a banner cord (`t` to 0.5), then the cord yanked down. */
const REACH = pose({ armRight: -165, foreRight: -12, lean: -4 })
const YANK = pose({ armRight: -40, foreRight: -105, lean: 5, rise: 3 })
export function pull(profession: Profession, t: number): DecoPose {
  if (t < 0.5) return mix(KIT[profession], REACH, t / 0.5)
  return mix(REACH, YANK, (t - 0.5) / 0.5)
}

/** The sticks on the snare: each forearm strikes on its half of `phase`, `t` of the way into the roll. */
export function drum(t: number, phase: number): DecoPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 35 * right * t, foreLeft: kit.foreLeft + 35 * left * t, hit: t * beat, sparks: t, head: 3 * beat * t }
}

/** The knee (`t` to 0.5), then the round kick out of it, the guard held. */
const KNEE = pose({ thighRight: -85, shinRight: 95, lean: -6 })
const KICK = pose({ thighRight: -80, shinRight: 0, lean: -6 })
export function strike(profession: Profession, t: number): DecoPose {
  const kit = KIT[profession]
  const legs = t < 0.5 ? mix(kit, KNEE, t / 0.5) : mix(KNEE, KICK, (t - 0.5) / 0.5)
  return { ...kit, thighRight: legs.thighRight, shinRight: legs.shinRight, lean: legs.lean, sparks: 0.5 * t }
}

/** The revival chamber: its light stands, he is knit back together inside it from the feet up, it fades. */
export const revive = (profession: Profession, t: number): DecoPose => ({
  ...KIT[profession],
  chamber: Math.min(ramp(t, 0, 0.25), 1 - ramp(t, 0.75, 1)),
  knit: ramp(t, 0.2, 0.65),
})

// ---- the writer ----

const LIMB_CLASSES = {
  body: s.body,
  armRight: s.armFront,
  foreRight: s.foreFront,
  armLeft: s.armBack,
  foreLeft: s.foreBack,
  thighRight: s.thighFront,
  shinRight: s.shinFront,
  thighLeft: s.thighBack,
  shinLeft: s.shinBack,
}

const KIT_CLASSES = { head: s.head, bolt: s.bolt, arc: s.arc, recorder: s.recorder, sparks: s.sparks, hit: s.hitSpark, chamber: s.chamber, veins: s.veins }

export type DecoJoints = RigJoints & Record<keyof typeof KIT_CLASSES, SVGElement | null>

/** His groups inside `root`, the group that holds one SurvivorSprite. */
export const decoJoints = (root: Element): DecoJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  ...(Object.fromEntries(Object.entries(KIT_CLASSES).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as Record<keyof typeof KIT_CLASSES, SVGElement | null>),
})

const opacity = (el: SVGElement | null, value: number): void => {
  if (el) el.style.opacity = value.toFixed(3)
}

/** Writes `p` on his groups: the rig's limbs, then his kit. Transforms and opacity only. */
export function setDecoPose(j: DecoJoints, p: DecoPose): void {
  setRigPose(j, p)
  if (j.head) j.head.style.transform = `rotate(${p.head.toFixed(1)}deg)`
  if (j.body) j.body.style.opacity = p.knit.toFixed(3)
  opacity(j.bolt, p.bolt)
  opacity(j.arc, p.arc)
  opacity(j.recorder, p.recorder)
  opacity(j.sparks, p.sparks)
  opacity(j.hit, p.hit)
  opacity(j.chamber, p.chamber)
  opacity(j.veins, 0.35 + 0.65 * p.sparks)
}
