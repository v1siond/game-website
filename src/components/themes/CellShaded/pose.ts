import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { opacityTo, rigJoints, type RigJoints, setRigPose } from '../shared/rig'
import s from './sprite.module.css'

// The commando posed by his scene's playhead, on the shared rig (rigPose, ../shared/rig): his limbs as the
// rig's numbers, plus his own gear on top, each 0 to 1: the wrist computer's hologram, the turret deployed
// before him, its muzzle flash, how far he is built up on the station's pad, the rifle in his hands and its
// own flash. He stands side on facing right, so a negative turn swings an arm or a thigh forward and a
// positive one folds a shin back; his near side (the shoulder pad, the rifle hand) is the rig's right, his
// far side its left. His thigh is 35 units to the knee and his shin 50 to the sole, which sets how far a
// bent leg drops him (rise).

export type CelPose = RigPose & { holo: number; turret: number; flash: number; built: number; rifle: number; muzzle: number }

const STAND: CelPose = { ...RIG_STAND, holo: 0, turret: 0, flash: 0, built: 1, rifle: 0, muzzle: 0 }

const pose = (partial: Partial<CelPose>): CelPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the commando's arms down, the sticks forward over the snare, the Muay
 *  Thai guard with both gloves up before his chin and the near foot ahead. */
const KIT: Record<Profession, CelPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -15, foreRight: -55, armLeft: -10, foreLeft: -60 }),
  fighter: pose({ armRight: -40, foreRight: -105, armLeft: -50, foreLeft: -100, thighRight: -12, thighLeft: 12 }),
}

/** Down on the far knee: the far thigh straight down and its shin folded back flat on the sand, the near
 *  knee up before him with its foot planted under it. */
const KNEEL: Partial<CelPose> = { rise: 45, thighRight: -80, shinRight: 127, thighLeft: 0, shinLeft: 90 }

// The rifle shouldered and aimed right: the near arm out level along it, the far hand under the barrel.
const AIM = { armRight: -90, foreRight: 0, armLeft: -60, foreLeft: -40, rifle: 1 }

/** The trigger pulled through `t` 0.4 to 0.7: three flashes at the muzzle, the rifle kicking up with each. */
const fire = (t: number): Pick<CelPose, 'muzzle' | 'foreRight'> => {
  const burst = ramp(t, 0.4, 0.7)
  const shot = burst > 0 && burst < 1 ? Math.abs(Math.sin(burst * Math.PI * 3)) : 0
  return { muzzle: shot, foreRight: -6 * shot }
}

/** Aim and fire standing: the rifle comes off his back into his hands, up on the target, the burst, then
 *  held on it with the smoke clearing. */
export function shoot(t: number): CelPose {
  const aimed = mix(STAND, pose({ ...AIM, thighRight: -10, thighLeft: 10, lean: -2 }), ramp(t, 0, 0.35))
  return { ...aimed, ...fire(t), rifle: ramp(t, 0, 0.15) }
}

/** The slide into cover: down on the far hip with the near leg out ahead and the far one tucked (`t` to
 *  0.4), then up on one knee behind the cover with the rifle over it and the burst fired. */
const SLIDE = pose({ rise: 55, thighRight: -75, shinRight: 0, thighLeft: -20, shinLeft: 130, lean: -12, armRight: -60, foreRight: -20, armLeft: 30, foreLeft: -40, rifle: 1 })
const OVER = pose({ ...KNEEL, ...AIM, lean: 4 })
export function slide(t: number): CelPose {
  const low = t < 0.4 ? mix(STAND, SLIDE, ramp(t, 0, 0.15)) : mix(SLIDE, OVER, ramp(t, 0.4, 0.55))
  return { ...low, ...fire(t + 0.1), rifle: ramp(t, 0, 0.1) }
}

/** The ground slam: crouched to jump with the arms swung back, tucked in the air with both fists over his
 *  head, then landed on a knee with both fists driven into the sand before him. */
const CROUCH = pose({ rise: 30, thighRight: -55, shinRight: 100, thighLeft: -50, shinLeft: 95, armRight: 30, foreRight: -30, armLeft: 40, foreLeft: -30, lean: 8 })
const TUCK = pose({ thighRight: -100, shinRight: 130, thighLeft: -90, shinLeft: 125, armRight: -165, foreRight: -10, armLeft: -160, foreLeft: -10 })
const SLAM = pose({ ...KNEEL, armRight: -25, foreRight: -10, armLeft: -15, foreLeft: -10, lean: 22 })
export function slam(t: number): CelPose {
  if (t < 0.2) return mix(STAND, CROUCH, t / 0.2)
  if (t < 0.6) return mix(CROUCH, TUCK, ramp(t, 0.2, 0.35))
  return mix(TUCK, SLAM, ramp(t, 0.6, 0.72))
}

/** At the chest: down on a knee with both hands on the lid before him (`t` to 0.45), then up on his feet
 *  with his near fist thrown up at the light. */
const LID = pose({ ...KNEEL, armRight: -55, foreRight: -25, armLeft: -45, foreLeft: -35, lean: 10 })
const CHEER = pose({ armRight: -170, foreRight: -10, armLeft: 15, foreLeft: -40, lean: -3 })
export const loot = (t: number): CelPose => (t < 0.45 ? mix(STAND, LID, ramp(t, 0, 0.25)) : mix(LID, CHEER, ramp(t, 0.5, 0.75)))

/** The mantle up a ledge before him: both hands up on its edge, the near knee up onto it, then standing
 *  on it and the rifle aimed off it and fired. */
const REACH_UP = pose({ armRight: -170, foreRight: 0, armLeft: -165, foreLeft: 0, rise: -4 })
const KNEE_UP = pose({ thighRight: -95, shinRight: 100, armRight: -120, foreRight: -40, armLeft: -110, foreLeft: -40 })
export function mantle(t: number): CelPose {
  if (t < 0.15) return mix(STAND, REACH_UP, t / 0.15)
  if (t < 0.4) return mix(REACH_UP, KNEE_UP, ramp(t, 0.15, 0.3))
  const top = mix(KNEE_UP, pose({ ...AIM, thighRight: -10, thighLeft: 10 }), ramp(t, 0.4, 0.55))
  return { ...top, ...fire(t + 0.15), rifle: ramp(t, 0.4, 0.5) }
}

/** Knocked down onto the far knee, leaning back, the guard dropped, `t` of the way. */
const DOWN = pose({ ...KNEEL, lean: -12, armRight: 20, foreRight: -30, armLeft: 30, foreLeft: -20 })
export const down = (profession: Profession, t: number): CelPose => mix(KIT[profession], DOWN, t)

/** The comeback from the knee: a rising uppercut as he springs back to his feet, `t` of the way, the
 *  near fist held high. */
const UPPERCUT = pose({ armRight: -160, foreRight: -30, armLeft: -50, foreLeft: -100, lean: -4, rise: -6 })
export const comeback = (t: number): CelPose => mix(DOWN, UPPERCUT, t)

/** The wrist computer up by his face, its hologram lit, working it, `t` of the way. */
const WRIST = pose({ armRight: -40, foreRight: -110, lean: -2 })
export function hack(profession: Profession, t: number): CelPose {
  const held = mix(KIT[profession], WRIST, ramp(t, 0, 0.4))
  return { ...held, foreRight: held.foreRight + 8 * Math.sin(t * Math.PI * 6) * ramp(t, 0.3, 0.4), holo: ramp(t, 0.2, 0.5) }
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

/** The sticks on the snare before him: each forearm drops its tip onto the head on its half of `phase`,
 *  `t` of the way into the roll. */
export function drum(t: number, phase: number): CelPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const near = phase % 2 < 1 ? beat : 0
  const far = beat - near
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 25 * near * t, foreLeft: kit.foreLeft + 25 * far * t }
}

/** The engineer deploys his turret before him and works it from the wrist computer, the turret firing at
 *  the end; the others raise a fist to the sky. */
export function deploy(profession: Profession, t: number): CelPose {
  if (profession !== 'engineer') return mix(KIT[profession], pose({ armRight: -165, foreRight: -10 }), ramp(t, 0, 0.6))
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

/** Writes `p` on his groups: the rig's limbs, then his gear. Transforms and opacity only. */
export function setCelPose(j: CelJoints, p: CelPose): void {
  setRigPose(j, p)
  opacityTo(j.body, p.built)
  opacityTo(j.holo, p.holo)
  opacityTo(j.turret, p.turret)
  opacityTo(j.flash, p.flash)
  opacityTo(j.rifle, p.rifle)
  opacityTo(j.muzzle, p.muzzle)
  opacityTo(j.sling, 1 - p.rifle)
}
