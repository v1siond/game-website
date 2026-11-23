import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './sprite.module.css'

// The commando posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus his own gear on top, each 0 to 1: the wrist computer's hologram, the turret deployed
// beside him, its muzzle flash, and how far he is built up on the station's pad. He faces the viewer, so
// his front side (the viewer's right, the shoulder pad) is the rig's right, his back side its left, and
// he walks with the rig's front stride.

export type CelPose = RigPose & { holo: number; turret: number; flash: number; built: number }

const STAND: CelPose = { ...RIG_STAND, holo: 0, turret: 0, flash: 0, built: 1 }

const pose = (partial: Partial<CelPose>): CelPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the commando's arms down, the sticks up, the Muay Thai guard. */
const KIT: Record<Profession, CelPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -10, foreRight: 35, armLeft: 10, foreLeft: -35 }),
  fighter: pose({ armRight: 20, foreRight: 140, armLeft: -20, foreLeft: -140 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): CelPose => KIT[profession]

/** His stride at `phase` (rising as he goes on), on the rig's front stride; the commando swings his arms
 *  with it, the sticks and the guard stay up. */
export function walk(profession: Profession, phase: number): CelPose {
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

/** Both fists up over his head (`t` to 0.5), then brought down hard on the prop beside him. */
const OVERHEAD = pose({ armRight: -165, foreRight: -10, armLeft: 165, foreLeft: 10, rise: -4 })
const POUND = pose({ armRight: -70, foreRight: 20, armLeft: 40, foreLeft: -20, lean: 6, rise: 3 })
export function pound(profession: Profession, t: number): CelPose {
  if (t < 0.5) return mix(KIT[profession], OVERHEAD, t / 0.5)
  return mix(OVERHEAD, POUND, ramp(t, 0.5, 0.7))
}

/** The front hand out flat at the prop on his right, `t` of the way. */
const POINT = pose({ armRight: -85, foreRight: -5, lean: -2 })
export const point = (profession: Profession, t: number): CelPose => mix(KIT[profession], POINT, t)

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
}

const one = (root: Element, className: string): SVGElement | null => root.querySelector<SVGElement>(`.${className}`)

/** His groups inside `root`, the group that holds one CommandoSprite. */
export const celJoints = (root: Element): CelJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  holo: one(root, s.sprHolo),
  turret: one(root, s.sprTurret),
  flash: one(root, s.sprFlash),
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
}
