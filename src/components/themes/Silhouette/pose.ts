import type { Profession } from '@/lib/cv/professions'
import { STAND, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, type RigJoints } from '../shared/rig'
import s from './figure.module.css'

// His figure posed by the scene player through the game's verbs (run, jump, hang, climb, haul, duck,
// march, reach, strike, knock), on the shared rig (rigPose, ../shared/rig). He is seen from the side, facing right, so a limb
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
function walk(profession: Profession, phase: number): RigPose {
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

/** Knees tucked in the air over a gap or a trap, his arms reaching ahead. */
export const TUCK = pose({ thighRight: -60, shinRight: 80, thighLeft: -40, shinLeft: 85, armRight: -70, armLeft: -50, lean: 8 })

/** Hauling himself over a ledge: his hands pressing down on its edge, the front knee up onto it. */
export const CLIMB = pose({ armRight: -30, foreRight: -70, armLeft: -25, foreLeft: -70, thighRight: -95, shinRight: 105, lean: 22 })

/** Crouched on what he has just climbed or landed on, ready to go on. */
export const CROUCH = pose({ thighRight: -45, shinRight: 75, thighLeft: -30, shinLeft: 70, lean: 12, rise: 4, armRight: -40, armLeft: -25 })



/** His hand driven out flat at what stands at head height ahead of him: a switch struck. */
export const STRIKE = pose({ armRight: -100, foreRight: -5, lean: 6, thighRight: -25, shinRight: 15, thighLeft: 15, shinLeft: 5 })

/** Stood still, his weight back a little, looking ahead at something far off. */
export const LOOK = pose({ lean: -6, armRight: 8, armLeft: 6 })

/** Leaning back with both hands out low ahead of him, hauling what floats at his feet in to the edge. */
export const HAUL = pose({ lean: -20, armRight: -60, foreRight: -15, armLeft: -55, foreLeft: -15, thighRight: -35, shinRight: 30, thighLeft: 25, shinLeft: 15 })

/** Flat on his front in a hollow, his arms over his head, as something bounds over him. */
export const DUCK = pose({ lean: 84, armRight: -170, foreRight: 0, armLeft: -165, foreLeft: 0, thighRight: 6, thighLeft: -4 })

/** Bound in the wrapping: his arms pinned at his sides, his legs together. */
export const BOUND = pose({ armRight: 2, foreRight: 0, armLeft: 2, foreLeft: 0, thighRight: 0, shinRight: 0, thighLeft: 0, shinLeft: 0 })

/** Both arms straight up over his head, reaching for what hangs above. */
export const REACH = pose({ armRight: -172, foreRight: 0, armLeft: -160, foreLeft: -6, lean: -4 })

/** His near hand up at a door at chest height, knuckles to it. */
export const KNOCK = pose({ armRight: -78, foreRight: -70, lean: 4 })

/** A stiff, driven walk at `phase`, his arms hanging dead at his sides: he is being walked. */
export function march(phase: number): RigPose {
  const stride = rigWalk(phase, 1)
  return { ...stride, thighRight: stride.thighRight * 0.6, thighLeft: stride.thighLeft * 0.6, armRight: 0, foreRight: 0, armLeft: 0, foreLeft: 0, lean: -4 }
}

/** Lying on his back in the grass, the way he wakes: his body laid down flat behind his feet. */
export const LYING = pose({ lean: -86 })

/** Sitting up out of the grass, his knees drawn up under him. */
export const SITTING_UP = pose({ lean: -40, rise: 6, thighRight: -70, shinRight: 70, thighLeft: -70, shinLeft: 70, armRight: 20, armLeft: 25 })

/** His feet under him, pushing up to stand, his weight forward. */
export const RISING = pose({ lean: 14, rise: 8, thighRight: -50, shinRight: 80, thighLeft: -50, shinLeft: 80, armRight: -20, armLeft: -10 })


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
