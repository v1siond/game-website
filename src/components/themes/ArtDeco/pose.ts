import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { opacityTo, rigJoints, type RigJoints, rotateTo, setRigPose } from '../shared/rig'
import s from './sprite.module.css'

// The passenger posed by his scene's actions, on the shared rig (rigPose, ../shared/rig): his limbs as the
// rig's numbers, plus what he holds, each 0 to 1: the coil strapped on and its sparks, the coin, the study
// card, the radio handset, the plate camera and its flash, the sticks, and his shadow on the floor (none
// while he is in the sea). His front side is the rig's right, his back side its left; he faces right. A
// negative turn swings a limb forward and up.

export type DecoPose = RigPose & {
  head: number
  coil: number
  sparks: number
  coin: number
  card: number
  handset: number
  camera: number
  flash: number
  sticks: number
  shadow: number
}

const STAND: DecoPose = { ...RIG_STAND, head: 0, coil: 0, sparks: 0, coin: 0, card: 0, handset: 0, camera: 0, flash: 0, sticks: 0, shadow: 1 }

const pose = (partial: Partial<DecoPose>): DecoPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the arms hanging, both sticks raised, the Muay Thai guard. */
const KIT: Record<Profession, DecoPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -20, foreRight: -70, armLeft: -25, foreLeft: -75, sticks: 1 }),
  fighter: pose({ armRight: -35, foreRight: -135, armLeft: -25, foreLeft: -145, thighRight: -6 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): DecoPose => KIT[profession]

/** His kit with only the legs walking (the stride at `phase`), the arms swinging only when they hang free. */
export function stride(profession: Profession, phase: number): DecoPose {
  const step = walk(phase, 1)
  const kit = KIT[profession]
  const legs = { rise: step.rise, thighRight: step.thighRight, shinRight: step.shinRight, thighLeft: step.thighLeft, shinLeft: step.shinLeft }
  if (profession !== 'engineer') return { ...kit, ...legs }
  return { ...kit, ...legs, armRight: step.armRight, armLeft: step.armLeft }
}

// ---- in the sea ----

/** Treading water with his head up: the arms sculling out to the sides, the legs pedalling. */
export const tread = (phase: number): DecoPose => {
  const scull = Math.sin(phase * Math.PI)
  return pose({ armRight: -70 + 14 * scull, foreRight: -20, armLeft: 60 - 14 * scull, foreLeft: 20, thighRight: -20 + 12 * scull, shinRight: 30, thighLeft: 10 - 12 * scull, shinLeft: 30, shadow: 0 })
}

/** The crawl, lying forward on the water (the body turned flat round his feet): the arms wheel over in
 *  turn, the legs flutter. */
export const swim = (phase: number): DecoPose => {
  const wheel = Math.cos(phase * Math.PI)
  const kick = Math.sin(phase * Math.PI * 2)
  return pose({ lean: 80, armRight: -90 - 90 * wheel, foreRight: -10, armLeft: -90 + 90 * wheel, foreLeft: -10, thighRight: 8 * kick, thighLeft: -8 * kick, shinRight: 10, shinLeft: 10, head: -14, shadow: 0 })
}

// ---- at a machine ----

/** One arm reaching out ahead to a handle, a dial or a slot, at the given turns. */
const reach = (profession: Profession, armRight: number, foreRight: number, t: number): DecoPose => mix(KIT[profession], { ...KIT[profession], armRight, foreRight }, t)

/** The sphere's lever pulled: the hand up on its grip (`t` to 0.4), then hauled down. */
export const pull = (profession: Profession, t: number): DecoPose => {
  const up = reach(profession, -150, -25, ramp(t, 0, 0.4))
  return { ...mix(up, { ...up, armRight: -65, foreRight: -15, lean: 6 }, ramp(t, 0.45, 0.85)) }
}

/** Leaning in at the round window, his face to the light. */
export const gaze = (profession: Profession, t: number): DecoPose => mix(KIT[profession], { ...KIT[profession], lean: 5, head: -6, armLeft: -30, foreLeft: -40 }, t)

/** The radio's handset lifted from its hook to his ear. */
export const listen = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], { ...KIT[profession], armRight: -35, foreRight: -135, head: 6 }, t), handset: ramp(t, 0.35, 0.5) })

/** Gone still in the dark: low on bent knees, the head turned back toward the glass. */
export const holdStill = (profession: Profession, t: number): DecoPose =>
  mix(KIT[profession], { ...KIT[profession], thighRight: -42, shinRight: 52, thighLeft: 18, shinLeft: 48, rise: 12, lean: 4, head: -10 }, t)

/** The coil taken up and strapped over the front forearm: the arm across the body, the back hand on it. */
export const strapOn = (profession: Profession, t: number): DecoPose => ({
  ...mix(KIT[profession], { ...KIT[profession], armRight: -40, foreRight: -85, armLeft: -62, foreLeft: -88 }, ramp(t, 0, 0.4)),
  coil: ramp(t, 0.35, 0.55),
  sparks: ramp(t, 0.7, 0.9) * 0.5,
})

/** The coiled hand thrust down at the water and the spark sent into it, `t` of the way. */
export const shock = (profession: Profession, t: number): DecoPose => ({
  ...mix(KIT[profession], { ...KIT[profession], armRight: -42, foreRight: -6, lean: 10, thighRight: -18, shinRight: 14, rise: 4 }, ramp(t, 0, 0.3)),
  coil: 1,
  sparks: Math.max(0.5, ramp(t, 0.2, 0.35) * (1 - 0.5 * ramp(t, 0.8, 1))),
})

/** The coiled hand up on the door's panel, turning its tiles one by one. */
export const route = (profession: Profession, t: number): DecoPose => {
  const held = reach(profession, -105, -25, ramp(t, 0, 0.2))
  return { ...held, foreRight: held.foreRight + 12 * Math.sin(Math.PI * 6 * ramp(t, 0.2, 0.8)), coil: 1, sparks: 0.5 }
}

/** A coin fed to a machine's slot: the arm out level, the coin gone from his fingers at the slot. */
export const pay = (profession: Profession, t: number): DecoPose => ({ ...reach(profession, -72, -12, ramp(t, 0, 0.35)), coin: ramp(t, 0, 0.1) * (1 - ramp(t, 0.4, 0.5)) })

// Down low: the front knee up ahead of him, the back knee on the floor, the body dropped to match.
const LOW = { thighRight: -80, shinRight: 85, thighLeft: 10, shinLeft: 85, rise: 16 }

/** On one knee at a low wall box, both hands in its wires, working them. */
export const rewire = (profession: Profession, t: number): DecoPose => {
  const held = mix(KIT[profession], { ...KIT[profession], ...LOW, armRight: -78, foreRight: -35, armLeft: -68, foreLeft: -30, lean: 6 }, ramp(t, 0, 0.3))
  return { ...held, foreRight: held.foreRight + 10 * Math.sin(Math.PI * 4 * ramp(t, 0.3, 0.8)), sparks: 0.6 * Math.sin(Math.PI * ramp(t, 0.35, 0.85)) }
}

// ---- the camera ----

/** The plate camera brought up to his eye and aimed at the ceiling, `t` of the way; it stays up while the
 *  flash goes. */
const AIM = pose({ armRight: -78, foreRight: -118, head: -18, lean: -4 })
export const aim = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], { ...AIM, armLeft: KIT[profession].armLeft, foreLeft: KIT[profession].foreLeft }, ramp(t, 0, 0.6)), camera: ramp(t, 0.1, 0.3) })

/** The camera lowered and the study card it gave read in his hand. */
const READ = pose({ armRight: -40, foreRight: -70, head: 10 })
export const study = (profession: Profession, t: number): DecoPose => ({ ...mix(aim(profession, 1), { ...READ, armLeft: KIT[profession].armLeft, foreLeft: KIT[profession].foreLeft }, t), camera: 1 - ramp(t, 0.2, 0.4), card: 1 })

// ---- the little ones ----

/** Down on one knee at a distance, the open hand held out low. */
export const offer = (profession: Profession, t: number): DecoPose => mix(KIT[profession], { ...pose({ ...LOW, armRight: -62, foreRight: -12, head: 6 }) }, t)

/** Walking her out beside him: the stride, the front hand held low and out to hold hers. */
export const lead = (profession: Profession, phase: number): DecoPose => ({ ...stride(profession, phase), armRight: -22, foreRight: -6 })

// ---- the kit ----

// Sat on the band's stool: the thighs level, the shins down, the body dropped onto the seat.
const SAT = { thighRight: -82, shinRight: 82, thighLeft: -76, shinLeft: 76, rise: 20 }

/** Sat at the kit with the sticks, each forearm striking on its half of `phase`, `t` of the way in. */
export function drum(t: number, phase: number): DecoPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  return pose({ ...SAT, armRight: -24, foreRight: -62 + 32 * right * t, armLeft: -30, foreLeft: -66 + 32 * left * t, head: 3 * beat * t, sticks: 1 })
}

/** From standing to sat on the stool, `t` of the way, the sticks coming up. */
export const sitDown = (profession: Profession, t: number): DecoPose => ({ ...mix(KIT[profession], drum(0, 0), t), sticks: 1 })

// ---- the fight ----

/** The shoulder charge slipped: he drops low and sways back out of its line, the guard kept. */
export const slip = (profession: Profession, t: number): DecoPose => mix(KIT[profession], pose({ ...KIT.fighter, lean: -16, rise: 16, thighRight: -34, shinRight: 46, thighLeft: 22, shinLeft: 34 }), t)

/** The guard up, his eyes lifted to the lamps raised on the catwalk over him. */
export const lookUp = (t: number): DecoPose => ({ ...KIT.fighter, head: -12 * t })

/** The knee (`t` to 0.5), then the round kick out of it, the guard held. */
const KNEE = pose({ thighRight: -85, shinRight: 95, lean: -6 })
const KICK = pose({ thighRight: -80, shinRight: 0, lean: -6 })
export function strike(t: number): DecoPose {
  const kit = KIT.fighter
  const legs = t < 0.5 ? mix(kit, KNEE, t / 0.5) : mix(KNEE, KICK, (t - 0.5) / 0.5)
  return { ...kit, thighRight: legs.thighRight, shinRight: legs.shinRight, lean: legs.lean }
}

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

const KIT_CLASSES = { head: s.head, coil: s.coil, sparks: s.sparks, coin: s.coin, card: s.card, handset: s.handset, camera: s.camera, flash: s.flash, shadow: s.shadow }

export type DecoJoints = RigJoints &
  Record<keyof typeof KIT_CLASSES, SVGElement | null> & {
    sticks: SVGElement[]
  }

/** His groups inside `root`, the group that holds one SurvivorSprite. */
export const decoJoints = (root: Element): DecoJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  ...(Object.fromEntries(Object.entries(KIT_CLASSES).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as Record<keyof typeof KIT_CLASSES, SVGElement | null>),
  sticks: Array.from(root.querySelectorAll<SVGElement>(`.${s.sticks}`)),
})

/** Writes `p` on his groups: the rig's limbs, then what he holds. Transforms and opacity only. */
export function setDecoPose(j: DecoJoints, p: DecoPose): void {
  setRigPose(j, p)
  rotateTo(j.head, p.head)
  opacityTo(j.coil, p.coil)
  opacityTo(j.sparks, p.sparks)
  opacityTo(j.coin, p.coin)
  opacityTo(j.card, p.card)
  opacityTo(j.handset, p.handset)
  opacityTo(j.camera, p.camera)
  opacityTo(j.flash, p.flash)
  opacityTo(j.shadow, p.shadow)
  for (const stick of j.sticks) opacityTo(stick, p.sticks)
}
