import type { Profession } from '@/lib/cv/professions'
import { STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, type RigJoints } from '../shared/rig'
import s from './figure.module.css'

// His figure posed by the scroll through the genre's few verbs (run, jump, climb, swing, push, pull, duck,
// fall), on the shared rig (rigPose, ../shared/rig). He is seen from the side, facing right, so a limb
// swung ahead of him turns negative (counterclockwise on screen), a shin folding back turns positive, and a
// positive lean tips him forward. He runs with the rig's profile stride.

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

/** His run between beats: the profile stride with his weight forward, the coat's arms pumping. */
export function run(profession: Profession, phase: number): RigPose {
  const stride = walk(profession, phase)
  return { ...stride, lean: 6, thighRight: stride.thighRight * 1.3, thighLeft: stride.thighLeft * 1.3 }
}

/** Dropped flat under what sweeps over him: knees folded, his weight forward, his arms over his head. */
export const DUCK = pose({ thighRight: -80, shinRight: 115, thighLeft: -65, shinLeft: 120, lean: 28, rise: 8, armRight: -150, foreRight: -70, armLeft: -140, foreLeft: -70 })

/** Knees tucked in the air over a gap or a trap, his arms reaching ahead. */
export const TUCK = pose({ thighRight: -60, shinRight: 80, thighLeft: -40, shinLeft: 85, armRight: -70, armLeft: -50, lean: 8 })

/** Hauling himself over a ledge: his hands pressing down on its edge, the front knee up onto it. */
export const CLIMB = pose({ armRight: -30, foreRight: -70, armLeft: -25, foreLeft: -70, thighRight: -95, shinRight: 105, lean: 22 })

/** Crouched on what he has just climbed or landed on, ready to go on. */
export const CROUCH = pose({ thighRight: -45, shinRight: 75, thighLeft: -30, shinLeft: 70, lean: 12, rise: 4, armRight: -40, armLeft: -25 })

/** Both hands up on a rope, hanging his weight off it, his legs trailing. */
export const HANG = pose({ armRight: -170, foreRight: -5, armLeft: -165, foreLeft: -5, thighRight: -10, shinRight: 20, thighLeft: 8, shinLeft: 25 })

/** Leaning into what stands ahead of him, both hands flat on it. */
export const PUSH = pose({ armRight: -80, foreRight: -10, armLeft: -70, foreLeft: -15, lean: 12, thighRight: -20, shinRight: 10, thighLeft: 20, shinLeft: 5 })

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
