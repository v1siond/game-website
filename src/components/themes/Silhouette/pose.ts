import type { Profession } from '@/lib/cv/professions'
import { STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, type RigJoints } from '../shared/rig'
import s from './figure.module.css'

// His figure posed by the scroll, on the shared rig (rigPose, ../shared/rig). He is seen from the side,
// facing right, so a limb swung ahead of him turns negative (counterclockwise on screen), a shin folding
// back turns positive, and a positive lean tips him forward. He walks with the rig's profile stride.

const pose = (partial: Partial<RigPose>): RigPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the coat's arms down, the sticks held ready, the Muay Thai guard. */
const KIT: Record<Profession, RigPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -40, foreRight: -50, armLeft: -30, foreLeft: -50 }),
  fighter: pose({ armRight: -35, foreRight: -115, armLeft: -20, foreLeft: -120 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): RigPose => KIT[profession]

/** His stride at `phase` (rising as he goes on), in profile; only the coat swings its arms, the sticks
 *  and the guard stay up. */
export function walk(profession: Profession, phase: number): RigPose {
  const stride = rigWalk(phase, 1)
  const kit = KIT[profession]
  const swing = profession === 'engineer' ? 1 : 0.2
  return { ...stride, armRight: kit.armRight + swing * stride.armRight, foreRight: kit.foreRight, armLeft: kit.armLeft + swing * stride.armLeft, foreLeft: kit.foreLeft }
}

/** The front hand up at what hangs over him, `t` of the way. */
const REACH = pose({ armRight: -150, foreRight: -10, rise: -2, lean: -3 })
export const reach = (profession: Profession, t: number): RigPose => mix(KIT[profession], REACH, t)

/** Both hands up on a rope, hanging his weight off it, the feet off the ground at the end. */
const HANG = pose({ armRight: -170, foreRight: -5, armLeft: -165, foreLeft: -5, thighRight: -10, shinRight: 20, thighLeft: 8, shinLeft: 25 })
export function hang(profession: Profession, t: number): RigPose {
  const held = mix(KIT[profession], HANG, ramp(t, 0, 0.6))
  return { ...held, rise: -8 * ramp(t, 0.5, 1) }
}

/** Leaning into what stands ahead of him, both hands flat on it. */
const PUSH = pose({ armRight: -80, foreRight: -10, armLeft: -70, foreLeft: -15, lean: 12, thighRight: -20, shinRight: 10, thighLeft: 20, shinLeft: 5 })
export const push = (profession: Profession, t: number): RigPose => mix(KIT[profession], PUSH, t)

/** A hop over what lies at his feet: knees tucked at the top, landed at the end. */
const TUCK = pose({ thighRight: -55, shinRight: 75, thighLeft: -35, shinLeft: 80, armRight: -60, armLeft: -40, lean: 6 })
export function jump(profession: Profession, t: number): RigPose {
  const arc = Math.sin(Math.PI * t)
  return { ...mix(KIT[profession], TUCK, arc), rise: -16 * arc }
}

/** A lever thrown: the hand up on its handle, then hauled down and back with his weight on it. */
const GRIP = pose({ armRight: -125, foreRight: -15, lean: 2 })
const HAUL = pose({ armRight: -35, foreRight: -40, armLeft: 10, lean: -8, thighRight: -15, thighLeft: 12 })
export function pull(profession: Profession, t: number): RigPose {
  if (t < 0.4) return mix(KIT[profession], GRIP, t / 0.4)
  return mix(GRIP, HAUL, ramp(t, 0.4, 0.8))
}

/** The sticks on the drum: each forearm strikes on its half of `phase`, `t` of the way into the roll. */
export function drum(t: number, phase: number): RigPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 35 * right * t, foreLeft: kit.foreLeft + 35 * left * t }
}

/** The front leg chambered (`t` to 0.45), then the kick driven out level, the guard held, his weight back. */
const CHAMBER = pose({ thighRight: -70, shinRight: 95, lean: -6 })
const KICK = pose({ thighRight: -95, shinRight: -5, lean: -14 })
export function kick(profession: Profession, t: number): RigPose {
  const kit = KIT[profession]
  const leg = t < 0.45 ? mix(kit, CHAMBER, t / 0.45) : mix(CHAMBER, KICK, ramp(t, 0.45, 0.65))
  return { ...kit, thighRight: leg.thighRight, shinRight: leg.shinRight, lean: leg.lean }
}

/** Lying in the grass (`t` 0), up on his hands, then standing in his kit (`t` 1). */
const LIE = pose({ lean: 82, rise: 0, armRight: -90, armLeft: -80, thighRight: -10, thighLeft: -5 })
const HANDS = pose({ lean: 40, armRight: -45, foreRight: 0, armLeft: -40, thighRight: -60, shinRight: 90, thighLeft: -50, shinLeft: 95 })
export function wake(profession: Profession, t: number): RigPose {
  if (t < 0.5) return mix(LIE, HANDS, ramp(t, 0, 0.5))
  return mix(HANDS, KIT[profession], ramp(t, 0.5, 1))
}

// ---- his joints: the shared rig's writer (setRigPose) poses them ----

const LIMB_CLASSES = {
  body: s.root,
  armRight: s.armF,
  foreRight: s.foreF,
  armLeft: s.armB,
  foreLeft: s.foreB,
  thighRight: s.legF,
  shinRight: s.shinF,
  thighLeft: s.legB,
  shinLeft: s.shinB,
}

/** His groups inside `root`, the group that holds one ShadeFigure. */
export const shadeJoints = (root: Element): RigJoints => rigJoints(root, LIMB_CLASSES)
