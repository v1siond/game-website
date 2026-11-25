import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { opacityTo, rigJoints, type RigJoints, setRigPose } from '../shared/rig'
import s from './sprite.module.css'

// The hunter posed by his scene's playhead, on the shared rig (rigPose, ../shared/rig): his limbs as the
// rig's numbers, plus the rifle in his hands and its muzzle flash, each 0 to 1. He stands side on facing
// right in every action, so a negative turn swings an arm or a thigh forward and a positive one folds a shin
// back; his near side (the shoulder pad, the rifle hand) is the rig's right, his far side its left. His thigh
// is 35 units to the knee and his shin 50 to the sole, which sets how far a bent leg drops him (rise).

export type CelPose = RigPose & { rifle: number; muzzle: number }

const STAND: CelPose = { ...RIG_STAND, rifle: 0, muzzle: 0 }

const pose = (partial: Partial<CelPose>): CelPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the stranger's arms down, the sticks forward over the snare, the Muay
 *  Thai guard with both gloves up before his chin and the near foot ahead. */
const KIT: Record<Profession, CelPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -15, foreRight: -55, armLeft: -10, foreLeft: -60 }),
  fighter: pose({ armRight: -40, foreRight: -105, armLeft: -50, foreLeft: -100, thighRight: -12, thighLeft: 12 }),
}

/** At rest in his profession's kit. */
export const rest = (profession: Profession): CelPose => KIT[profession]

/** Walking right at `phase` (one step per unit), side on, his kit's arms swinging with the stride. */
export function stride(profession: Profession, phase: number): CelPose {
  const step = walk(phase, 1)
  const kit = KIT[profession]
  return { ...kit, ...step, armRight: kit.armRight + step.armRight, armLeft: kit.armLeft + step.armLeft, foreRight: kit.foreRight, foreLeft: kit.foreLeft }
}

/** Down on the far knee: the far thigh straight down and its shin folded back flat on the sand, the near
 *  knee up before him with its foot planted under it. */
const KNEEL: Partial<CelPose> = { rise: 45, thighRight: -80, shinRight: 127, thighLeft: 0, shinLeft: 90 }

// The rifle shouldered and aimed right: the near arm out level along it, the far hand under the barrel.
const AIM = { armRight: -90, foreRight: 0, armLeft: -60, foreLeft: -40, rifle: 1 }

/** The trigger pulled through `t` `from` to `to`: three flashes at the muzzle, the rifle kicking up with each. */
const fire = (t: number, from = 0.4, to = 0.7): Pick<CelPose, 'muzzle' | 'foreRight'> => {
  const burst = ramp(t, from, to)
  const shot = burst > 0 && burst < 1 ? Math.abs(Math.sin(burst * Math.PI * 3)) : 0
  return { muzzle: shot, foreRight: -6 * shot }
}

/** Aim and fire standing: the rifle off his back into his hands, up on the target `raise` degrees over level,
 *  the burst through `from` to `to`, then held on it. */
export function shoot(t: number, from = 0.4, to = 0.7, raise = 0): CelPose {
  const aim = { ...AIM, armRight: AIM.armRight - raise, armLeft: AIM.armLeft - raise }
  const aimed = mix(STAND, pose({ ...aim, thighRight: -10, thighLeft: 10, lean: -2 - raise / 10 }), ramp(t, 0, 0.2))
  const kick = fire(t, from, to)
  return { ...aimed, muzzle: kick.muzzle, foreRight: aimed.foreRight + kick.foreRight, rifle: ramp(t, 0, 0.1) }
}

/** One long shot from one knee: down, the rifle up, a single flash at `at`, held. */
const SNIPE = pose({ ...KNEEL, ...AIM, lean: 4 })
export function snipe(t: number, at = 0.5): CelPose {
  const flash = ramp(t, at, at + 0.02) * (1 - ramp(t, at + 0.04, at + 0.08))
  return { ...mix(STAND, SNIPE, ramp(t, 0, 0.3)), muzzle: flash, rifle: ramp(t, 0, 0.15) }
}

/** The hand at his brow against the sun, leant a little forward, looking down the road. */
export const SQUINT = pose({ armRight: -160, foreRight: -100, lean: 4 })

/** Crouched low behind cover, the arms in over his head. */
export const DUCK = pose({ rise: 45, thighRight: -95, shinRight: 125, thighLeft: -70, shinLeft: 120, armRight: -120, foreRight: -90, armLeft: -110, foreLeft: -90, lean: 14 })

/** The near hand up at his ear, the head tipped toward it: listening to the voice. */
export const LISTEN = pose({ armRight: -150, foreRight: -135, lean: -4 })

/** Both hands down on the plunger before him, leaning into it, `t` of the way down. */
const PRESS_UP = pose({ armRight: -150, foreRight: -40, armLeft: -150, foreLeft: -40, lean: 6 })
const PRESS_DOWN = pose({ rise: 20, thighRight: -40, shinRight: 50, thighLeft: -30, shinLeft: 50, armRight: -40, foreRight: -10, armLeft: -40, foreLeft: -10, lean: 20 })
export const press = (t: number): CelPose => (t < 0.5 ? mix(STAND, PRESS_UP, ramp(t, 0, 0.5)) : mix(PRESS_UP, PRESS_DOWN, ramp(t, 0.5, 0.7)))

/** Both hands up before him to catch what flies at him. */
export const CATCH = pose({ armRight: -130, foreRight: -30, armLeft: -125, foreLeft: -40, lean: -4, rifle: 1 })

/** Both hands pushing ahead of him at chest height: a part into its slot, a relic onto a table. */
export const PUSH = pose({ armRight: -85, foreRight: -10, armLeft: -80, foreLeft: -15, lean: 10, thighRight: -14, thighLeft: 10 })

/** Sat at a wheel: the thighs level ahead, the shins down, both hands forward on the wheel. */
export const DRIVE = pose({ rise: 34, thighRight: -85, shinRight: 85, thighLeft: -80, shinLeft: 80, armRight: -70, foreRight: -30, armLeft: -65, foreLeft: -35 })

/** Knocked down on the far knee, leaning back, the guard dropped. */
const DOWN = pose({ ...KNEEL, lean: -18, armRight: 20, foreRight: -30, armLeft: 30, foreLeft: -20 })
export const down = (profession: Profession, t: number): CelPose => mix(KIT[profession], DOWN, t)

/** Down on the knee, the rifle swung up at what stands over him and emptied up into it through `from` to `to`. */
const FIRE_UP = pose({ ...KNEEL, lean: -20, armRight: -140, foreRight: 0, armLeft: -110, foreLeft: -40, rifle: 1 })
export const fireUp = (t: number, from = 0.25, to = 0.55): CelPose => ({ ...mix(DOWN, FIRE_UP, ramp(t, 0, 0.2)), ...fire(t, from, to), rifle: ramp(t, 0, 0.1) })

/** The second wind: up off the knee in one spring, the near fist high. */
const UP = pose({ armRight: -160, foreRight: -30, armLeft: -50, foreLeft: -100, lean: -4, rise: -6 })
export const secondWind = (t: number): CelPose => mix(FIRE_UP, UP, t)

/** Down on a knee at the chest, both hands on the lid (`t` to 0.45), then up with what was in it held high
 *  before him in both hands. */
const LID = pose({ ...KNEEL, armRight: -55, foreRight: -25, armLeft: -45, foreLeft: -35, lean: 10 })
const HOLD_UP = pose({ armRight: -140, foreRight: -20, armLeft: -135, foreLeft: -25, lean: -4 })
export const pry = (t: number): CelPose => (t < 0.45 ? mix(STAND, LID, ramp(t, 0, 0.25)) : mix(LID, HOLD_UP, ramp(t, 0.5, 0.75)))

/** Leaning back with the head up at the sky, the arms loose. */
export const LOOK_UP = pose({ lean: -12, armRight: 8, armLeft: -6 })

/** A map opened before him in both hands, held up to read. */
export const MAP = pose({ armRight: -100, foreRight: -50, armLeft: -95, foreLeft: -55, lean: -2 })

/** The sticks on two drums before him, `beats` strokes over `t`, the hands taking turns: each stroke lifts a
 *  stick high and brings it down on the beat. */
const STICK_UP = { arm: -75, fore: -125 }
export function drum(t: number, beats: number): CelPose {
  const kit = KIT.drummer
  const played = Math.min(t, 0.999) * beats
  const lift = t > 0 && t < 1 ? Math.sin(Math.PI * (played % 1)) : 0
  const right = Math.floor(played) % 2 === 0
  return {
    ...kit,
    lean: 6,
    armRight: right ? kit.armRight + (STICK_UP.arm - kit.armRight) * lift : kit.armRight,
    foreRight: right ? kit.foreRight + (STICK_UP.fore - kit.foreRight) * lift : kit.foreRight,
    armLeft: right ? kit.armLeft : kit.armLeft + (STICK_UP.arm - kit.armLeft) * lift,
    foreLeft: right ? kit.foreLeft : kit.foreLeft + (STICK_UP.fore - kit.foreLeft) * lift,
  }
}

/** The flying knee: the near knee driven up high before him, the far leg trailing, the guard kept, `t` of the
 *  way. */
const KNEE = pose({ thighRight: -115, shinRight: 135, thighLeft: 20, shinLeft: 50, lean: -10 })
export function flyingKnee(profession: Profession, t: number): CelPose {
  const kit = KIT[profession]
  return mix(kit, { ...KNEE, armRight: kit.armRight, foreRight: kit.foreRight, armLeft: kit.armLeft, foreLeft: kit.foreLeft, rifle: 0, muzzle: 0 }, t)
}

/** The near knee chambered high (`t` to 0.45), then the leg kicked out straight before him, leaning back
 *  off it, the guard held. */
const CHAMBER = pose({ thighRight: -85, shinRight: 110, lean: -4 })
const KICK = pose({ thighRight: -95, shinRight: -5, lean: -12 })
export function kick(profession: Profession, t: number): CelPose {
  const kit = KIT[profession]
  const legs = t < 0.45 ? mix(kit, CHAMBER, t / 0.45) : mix(CHAMBER, KICK, ramp(t, 0.45, 0.65))
  return { ...kit, thighRight: legs.thighRight, shinRight: legs.shinRight, lean: legs.lean }
}

/** A crouch in his kit, `t` of the way down. */
export const crouch = (profession: Profession, t: number): CelPose => mix(KIT[profession], { ...KIT[profession], rise: 30, thighRight: -60, shinRight: 100, thighLeft: -50, shinLeft: 95, lean: 10 }, t)

// ---- the writer ----

const LIMB_CLASSES = {
  body: s.sprRoot,
  armRight: s.sprArmF,
  foreRight: s.sprForeF,
  armLeft: s.sprArmB,
  foreLeft: s.sprForeB,
  thighRight: s.sprLegF,
  shinRight: s.sprShinF,
  thighLeft: s.sprLegB,
  shinLeft: s.sprShinB,
}

export interface CelJoints extends RigJoints {
  rifle: SVGElement | null
  muzzle: SVGElement | null
  sling: SVGElement | null
}

const one = (root: Element, className: string): SVGElement | null => root.querySelector<SVGElement>(`.${className}`)

/** His groups inside `root`, the group that holds one CommandoSprite. */
export const celJoints = (root: Element): CelJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  rifle: one(root, s.sprRifle),
  muzzle: one(root, s.sprMuzzle),
  sling: one(root, s.sprSling),
})

/** Writes `p` on his groups: the rig's limbs, then the rifle. Transforms and opacity only. */
export function setCelPose(j: CelJoints, p: CelPose): void {
  setRigPose(j, p)
  opacityTo(j.rifle, p.rifle)
  opacityTo(j.muzzle, p.muzzle)
  opacityTo(j.sling, 1 - p.rifle)
}
