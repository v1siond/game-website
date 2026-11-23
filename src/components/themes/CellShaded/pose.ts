import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './sprite.module.css'

// The commando posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus his own gear on top, each 0 to 1: the wrist computer's hologram, the turret deployed
// beside him, its muzzle flash, how far he is built up on the station's pad, the rifle in his hands and
// its own flash. He faces the viewer, so
// his front side (the viewer's right, the shoulder pad) is the rig's right, his back side its left, and
// he runs with the rig's front stride.

export type CelPose = RigPose & { holo: number; turret: number; flash: number; built: number; rifle: number; muzzle: number }

const STAND: CelPose = { ...RIG_STAND, holo: 0, turret: 0, flash: 0, built: 1, rifle: 0, muzzle: 0 }

const pose = (partial: Partial<CelPose>): CelPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the commando's arms down, the sticks up, the Muay Thai guard. */
const KIT: Record<Profession, CelPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -10, foreRight: 35, armLeft: 10, foreLeft: -35 }),
  fighter: pose({ armRight: 20, foreRight: 140, armLeft: -20, foreLeft: -140 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): CelPose => KIT[profession]

// Squatting `deg` at the hips: each thigh turns out at the hip and its shin folds back twice as far, so the
// foot comes back under him, and the body drops by what the bent legs lose in height (thigh and shin, 79
// units long). A positive turn is clockwise on screen, which swings the viewer's right leg in.
const LEG = 79
const squat = (deg: number): Partial<CelPose> => ({
  thighRight: -deg,
  shinRight: 2 * deg,
  thighLeft: deg,
  shinLeft: -2 * deg,
  rise: LEG * (1 - Math.cos((deg * Math.PI) / 180)),
})

/** His run between beats at `phase` (rising as he goes on): the rig's front stride, the commando's arms
 *  pumping, the sticks and the guard kept up. */
export function run(profession: Profession, phase: number): CelPose {
  const stride = rigWalk(phase, 0)
  const kit = KIT[profession]
  const swing = profession === 'engineer' ? 2 : 0
  return {
    ...kit,
    rise: stride.rise * 2,
    lean: 4,
    kneeRight: stride.kneeRight,
    kneeLeft: stride.kneeLeft,
    shinRight: stride.shinRight,
    shinLeft: stride.shinLeft,
    armRight: kit.armRight + swing * stride.armRight,
    armLeft: kit.armLeft + swing * stride.armLeft,
  }
}

// The rifle shouldered and aimed right: the front arm out level along it, the back hand across under it.
const AIM = { armRight: -90, foreRight: 0, armLeft: -62, foreLeft: -38, rifle: 1 }

/** The trigger pulled through `t` 0.4 to 0.7: three flashes at the muzzle, the rifle kicking up with each. */
const fire = (t: number): Pick<CelPose, 'muzzle' | 'foreRight'> => {
  const burst = ramp(t, 0.4, 0.7)
  const shot = burst > 0 && burst < 1 ? Math.abs(Math.sin(burst * Math.PI * 3)) : 0
  return { muzzle: shot, foreRight: -6 * shot }
}

/** Aim and fire standing: the rifle comes off his back into his hands, up on the target, the burst, then
 *  held on it with the smoke clearing. */
export function shoot(t: number): CelPose {
  const aimed = mix(STAND, pose({ ...AIM, thighRight: -6, thighLeft: 8, lean: -2 }), ramp(t, 0, 0.35))
  return { ...aimed, ...fire(t), rifle: ramp(t, 0, 0.15) }
}

/** The slide into cover: down on the back hip with the front leg out ahead (`t` to 0.4), then up on one
 *  knee behind the cover with the rifle over it and the burst fired. */
const SLIDE = pose({ ...squat(70), thighRight: -80, shinRight: 10, kneeRight: 0, lean: -10, armRight: -40, foreRight: -40, armLeft: 50, foreLeft: 20, rifle: 1 })
const OVER = pose({ ...squat(56), kneeLeft: 0.8, ...AIM, lean: 2 })
export function slide(t: number): CelPose {
  const low = t < 0.4 ? mix(STAND, SLIDE, ramp(t, 0, 0.15)) : mix(SLIDE, OVER, ramp(t, 0.4, 0.55))
  return { ...low, ...fire(t + 0.1), rifle: ramp(t, 0, 0.1) }
}

/** The ground slam: crouched to jump, tucked in the air with both fists over his head, then landed low on
 *  two fists driven into the sand. */
const CROUCH = pose({ ...squat(40), armRight: 30, foreRight: 30, armLeft: -30, foreLeft: -30, lean: 4 })
const TUCK = pose({ ...squat(55), rise: 0, armRight: -165, foreRight: -10, armLeft: 165, foreLeft: 10 })
const SLAM = pose({ ...squat(64), armRight: -40, foreRight: -30, armLeft: 40, foreLeft: 30, lean: 4 })
export function slam(t: number): CelPose {
  if (t < 0.2) return mix(STAND, CROUCH, t / 0.2)
  if (t < 0.6) return mix(CROUCH, TUCK, ramp(t, 0.2, 0.35))
  return mix(TUCK, SLAM, ramp(t, 0.6, 0.72))
}

/** At the chest: down on his knees with both hands on the lid (`t` to 0.45), then up on his feet with a
 *  fist thrown up at the light. */
const LID = pose({ ...squat(58), kneeRight: 0.6, kneeLeft: 0.6, armRight: -50, foreRight: -40, armLeft: -20, foreLeft: -60, lean: 6 })
const CHEER = pose({ armRight: -165, foreRight: -10, armLeft: 20, foreLeft: -40, lean: -3 })
export const loot = (t: number): CelPose => (t < 0.45 ? mix(STAND, LID, ramp(t, 0, 0.25)) : mix(LID, CHEER, ramp(t, 0.5, 0.75)))

/** The mantle up a ledge: both hands up on its edge, a knee up, then standing on it and the rifle aimed
 *  off it and fired. */
const REACH_UP = pose({ armRight: -170, foreRight: 0, armLeft: 170, foreLeft: 0, rise: -4 })
const KNEE_UP = pose({ ...squat(30), thighRight: -70, shinRight: 100, kneeRight: 1, armRight: -120, foreRight: 40, armLeft: 120, foreLeft: -40 })
export function mantle(t: number): CelPose {
  if (t < 0.15) return mix(STAND, REACH_UP, t / 0.15)
  if (t < 0.4) return mix(REACH_UP, KNEE_UP, ramp(t, 0.15, 0.3))
  const top = mix(KNEE_UP, pose({ ...AIM, thighRight: -6, thighLeft: 8 }), ramp(t, 0.4, 0.55))
  return { ...top, ...fire(t + 0.15), rifle: ramp(t, 0.4, 0.5) }
}

/** The comeback: knocked down onto one knee, the guard dropped (`t` to 0.3), then a rising uppercut from
 *  the knee as he springs back to his feet, the fist held high. */
const DOWN = pose({ ...squat(60), kneeLeft: 1, lean: -14, armRight: 40, foreRight: 60, armLeft: -40, foreLeft: -60 })
const UPPERCUT = pose({ armRight: -150, foreRight: 30, armLeft: -20, foreLeft: -140, lean: -4, rise: -6 })
export function comeback(profession: Profession, t: number): CelPose {
  if (t < 0.3) return mix(KIT[profession], DOWN, ramp(t, 0, 0.12))
  return mix(DOWN, UPPERCUT, ramp(t, 0.45, 0.65))
}

/** The wrist computer up by his face, its hologram lit, working it, `t` of the way. */
const WRIST = pose({ armRight: -30, foreRight: 110, lean: -2 })
export function hack(profession: Profession, t: number): CelPose {
  const held = mix(KIT[profession], WRIST, ramp(t, 0, 0.4))
  return { ...held, foreRight: held.foreRight + 8 * Math.sin(t * Math.PI * 6) * ramp(t, 0.3, 0.4), holo: ramp(t, 0.2, 0.5) }
}

/** The front leg chambered (`t` to 0.45), then kicked out at the prop, the guard held. */
const CHAMBER = pose({ thighRight: -70, shinRight: 90, kneeRight: 0.6, lean: 6 })
const KICK = pose({ thighRight: -80, shinRight: 0, lean: 12 })
export function kick(profession: Profession, t: number): CelPose {
  const kit = KIT[profession]
  const legs = t < 0.45 ? mix(kit, CHAMBER, t / 0.45) : mix(CHAMBER, KICK, ramp(t, 0.45, 0.65))
  return { ...kit, thighRight: legs.thighRight, shinRight: legs.shinRight, kneeRight: legs.kneeRight, lean: legs.lean }
}

/** The sticks on the drum: each forearm strikes on its half of `phase`, `t` of the way into the roll. */
export function drum(t: number, phase: number): CelPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 25 * right * t, foreLeft: kit.foreLeft - 25 * left * t }
}

/** The engineer deploys his turret beside him and works it from the wrist computer, the turret firing at
 *  the end; the others raise a fist to the sky. */
export function deploy(profession: Profession, t: number): CelPose {
  if (profession !== 'engineer') return mix(KIT[profession], pose({ armRight: -160, foreRight: -10 }), t)
  return { ...hack(profession, t), turret: ramp(t, 0, 0.3), flash: Math.max(0, Math.sin(t * Math.PI * 8)) * ramp(t, 0.6, 0.7) }
}

/** Built up on the pad from his feet, `t` of the way, the hologram fading as he stands whole. */
export const build = (profession: Profession, t: number): CelPose => ({ ...KIT[profession], built: ramp(t, 0.1, 0.7), holo: Math.min(ramp(t, 0, 0.2), 1 - ramp(t, 0.7, 0.9)) })

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
  holo: SVGElement | null
  turret: SVGElement | null
  flash: SVGElement | null
  rifle: SVGElement | null
  muzzle: SVGElement | null
  sling: SVGElement | null
}

const one = (root: Element, className: string): SVGElement | null => root.querySelector<SVGElement>(`.${className}`)

/** His groups inside `root`, the group that holds one CommandoSprite. */
export const celJoints = (root: Element): CelJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  holo: one(root, s.sprHolo),
  turret: one(root, s.sprTurret),
  flash: one(root, s.sprFlash),
  rifle: one(root, s.sprRifle),
  muzzle: one(root, s.sprMuzzle),
  sling: one(root, s.sprSling),
})

const opacity = (el: SVGElement | null, value: number): void => {
  if (el) el.style.opacity = value.toFixed(3)
}

/** Writes `p` on his groups: the rig's limbs, then his gear. Transforms and opacity only. */
export function setCelPose(j: CelJoints, p: CelPose): void {
  setRigPose(j, p)
  if (j.body) j.body.style.opacity = p.built.toFixed(3)
  opacity(j.holo, p.holo)
  opacity(j.turret, p.turret)
  opacity(j.flash, p.flash)
  opacity(j.rifle, p.rifle)
  opacity(j.muzzle, p.muzzle)
  opacity(j.sling, 1 - p.rifle)
}
