import type { Profession } from '@/lib/cv/professions'
import { STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, type RigJoints } from '../shared/rig'
import k from './knight.module.css'

// His knight posed by the scene player, on the shared rig (rigPose, ../shared/rig), heavy and committed as
// the game plays him: a slow wind up, a short hit, a settle. He is seen from the side, facing right, so a
// limb swung ahead of him turns negative, a shin folding back turns positive, a positive lean tips him
// forward and a positive rise sinks him. His near side (the shield arm) is the rig's right, his far side
// (the weapon hand) its left. A knight's pose also carries `grip`, the turn of what the far hand holds at
// the hand, set from where the blade should point (`blade`: 0 straight down, -90 ahead, -180 straight up).

export type KnightPose = RigPose & { grip: number }

// The sword hangs from the hand turned 80 degrees ahead (knight.tsx), so its line is the arm's two turns,
// that turn and the grip.
const DRAWN_TURN = -80

/** A pose with the blade pointing `blade` degrees from straight down. */
const pose = (partial: Partial<RigPose>, blade = -70): KnightPose => {
  const rig = { ...STAND, ...partial }
  return { ...rig, grip: blade - rig.armLeft - rig.foreLeft - DRAWN_TURN }
}

/** Each profession's guard: the shield up before him and the blade low ahead, the mallets ready, the Muay
 *  Thai guard. */
const KIT: Record<Profession, KnightPose> = {
  engineer: pose({ armRight: -25, foreRight: -55, armLeft: -15, foreLeft: -35 }, -65),
  drummer: pose({ armRight: -40, foreRight: -50, armLeft: -35, foreLeft: -50 }, -95),
  fighter: pose({ armRight: -35, foreRight: -115, armLeft: -20, foreLeft: -120 }, -90),
}

/** He stands in his guard. */
export const guard = (profession: Profession): KnightPose => KIT[profession]

/** His heavy stride at `phase` (rising as he goes on), in profile, the guard held. */
export function walk(profession: Profession, phase: number): KnightPose {
  const stride = rigWalk(phase, 1)
  const kit = KIT[profession]
  return { ...kit, rise: stride.rise, thighRight: stride.thighRight, thighLeft: stride.thighLeft, shinRight: stride.shinRight, shinLeft: stride.shinLeft, armLeft: kit.armLeft + 0.3 * stride.armLeft }
}

/** He blends from `a` to `b` over `t`, the grip with them. */
export const blend = (a: KnightPose, b: KnightPose, t: number): KnightPose => mix(a, b, t)

/** Sat on the ground by the fire, his knees up and his arms on them, his weight back. */
export const SIT = pose({ rise: 26, lean: -6, thighRight: -80, shinRight: 105, thighLeft: -70, shinLeft: 110, armRight: -50, foreRight: -45, armLeft: -30, foreLeft: -40 }, -100)

/** Sat, the flask in his near hand raised to his mouth, his head tipped back with it. */
export const DRINK = { ...SIT, lean: -12, armRight: -150, foreRight: 95 }

/** On the ledge's edge, both hands high, the blade hung point down before him for the plunge. */
export const RAISE = pose({ armRight: -150, foreRight: 30, armLeft: -150, foreLeft: 30, lean: -4 }, 0)

/** Falling, his knees drawn up, the blade still point down. */
export const FALL = pose({ armRight: -120, foreRight: 20, armLeft: -120, foreLeft: 20, thighRight: -50, shinRight: 70, thighLeft: -20, shinLeft: 60 }, 0)

/** Landed, crouched deep over it, the blade driven down with both hands. */
export const PLUNGED = pose({ rise: 16, lean: 22, thighRight: -75, shinRight: 105, thighLeft: -10, shinLeft: 95, armRight: -40, foreRight: -15, armLeft: -40, foreLeft: -15 }, 0)

/** The parry: the shield arm thrown out and up ahead of him, turning the blow aside, his weight back. */
export const PARRY = pose({ armRight: -125, foreRight: -15, armLeft: 10, foreLeft: -30, lean: -8, thighRight: -20, shinRight: 10, thighLeft: 15, shinLeft: 5 }, -40)

/** The riposte: a lunge, his weight on the front leg, the blade driven ahead and down into what kneels
 *  before him. */
export const RIPOSTE = pose({ rise: 8, lean: 16, thighRight: -50, shinRight: 45, thighLeft: 30, shinLeft: 15, armRight: -30, foreRight: -40, armLeft: -80, foreLeft: -5 }, -105)

/** The near hand held out ahead, feeling for the fog, the blade low. */
export const FEEL = pose({ armRight: -85, foreRight: -10, armLeft: -10, foreLeft: -25 }, -40)

/** Tucked into the dodge roll: knees to his chest, arms in, his head down. */
export const TUCKED = pose({ rise: 20, lean: 40, thighRight: -120, shinRight: 140, thighLeft: -110, shinLeft: 140, armRight: -70, foreRight: -80, armLeft: -60, foreLeft: -80 }, -130)

/** The blade raised high behind his head for a heavy blow. */
export const WIND = pose({ armLeft: -175, foreLeft: -20, armRight: -30, foreRight: -50, lean: -6, thighRight: -20, shinRight: 10 }, -230)

/** The heavy blow landed, the blade brought down ahead of him, his weight on the front leg. */
export const STRUCK = pose({ armLeft: -70, foreLeft: -15, armRight: -25, foreRight: -50, lean: 14, rise: 6, thighRight: -40, shinRight: 35, thighLeft: 25, shinLeft: 10 }, -80)

/** The heavy blow, `t` of the way: the wind up to 0.55, the swing down by 0.75, then held. */
export function blow(profession: Profession, t: number): KnightPose {
  if (t < 0.55) return blend(KIT[profession], WIND, ramp(t, 0, 0.55))
  return blend(WIND, STRUCK, ramp(t, 0.55, 0.75))
}

/** Both hands flat on a great door, his weight thrown against it, his legs driving. */
export const PUSH = pose({ armRight: -80, foreRight: -15, armLeft: -75, foreLeft: -20, lean: 18, thighRight: -30, shinRight: 20, thighLeft: 30, shinLeft: 10 }, -100)

/** The near hand up on a lever's handle. */
export const GRIP = pose({ armRight: -130, foreRight: -15, armLeft: -15, foreLeft: -35, lean: 2 }, -65)

/** The lever hauled down and back, his weight on it. */
export const HAUL = pose({ armRight: -55, foreRight: -30, armLeft: -10, foreLeft: -35, lean: -6, rise: 6, thighRight: -25, shinRight: 30, thighLeft: 10, shinLeft: 10 }, -65)

/** The front kick: the near knee chambered high (`t` to 0.4), then the sole driven straight out. */
const CHAMBER = { thighRight: -85, shinRight: 100, lean: -6 }
const KICKED = { thighRight: -95, shinRight: -5, lean: -16 }
export function kick(profession: Profession, t: number): KnightPose {
  const kit = KIT[profession]
  const chambered = { ...kit, ...CHAMBER }
  if (t < 0.4) return blend(kit, chambered, ramp(t, 0, 0.4))
  return blend(chambered, { ...kit, ...KICKED }, ramp(t, 0.4, 0.6))
}

/** Down on his far knee before what stands at his feet, both hands to it. */
export const KNEEL = pose({ rise: 20, lean: 10, thighRight: -85, shinRight: 90, thighLeft: 20, shinLeft: 95, armRight: -70, foreRight: -20, armLeft: -60, foreLeft: -25 }, -40)

/** Kneeling, both hands lifting a lid up and over ahead of him. */
export const LIFT = pose({ rise: 20, lean: 2, thighRight: -85, shinRight: 90, thighLeft: 20, shinLeft: 95, armRight: -130, foreRight: -10, armLeft: -120, foreLeft: -15 }, -40)

// ---- his joints: the shared rig's writer (setRigPose) poses them, the grip turns what the far hand holds ----

const LIMB_CLASSES = {
  body: k.whole,
  armRight: k.armNear,
  foreRight: k.foreNear,
  armLeft: k.armFar,
  foreLeft: k.foreFar,
  thighRight: k.legNear,
  shinRight: k.shinNear,
  thighLeft: k.legFar,
  shinLeft: k.shinFar,
}

export interface KnightJoints {
  rig: RigJoints
  grip: SVGElement | null
}

/** His groups inside `root`, the group that holds one Knight. */
export const knightJoints = (root: Element): KnightJoints => ({ rig: rigJoints(root, LIMB_CLASSES), grip: root.querySelector<SVGElement>(`.${k.grip}`) })
