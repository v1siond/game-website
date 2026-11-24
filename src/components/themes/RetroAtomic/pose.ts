import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './dweller.module.css'
import d from './dog.module.css'
import m from './mutant.module.css'

// The dweller, his dogs and the mutant posed by a scene's playhead. His limbs are the shared rig's numbers
// (rigPose, ../shared/rig); he stands side on facing right, so a negative turn swings an arm or a thigh
// forward and a positive one folds a shin back, his near side the rig's right. On top, each 0 to 1, what he
// holds: the pistol and its flash, the bobblehead and its bob, the syringe, the radio and its dial, and his
// wrist computer's needle and its red alarm. His thigh is 24 units to the knee and his shin 24 to the sole,
// which sets how far a bent leg drops him (rise, positive down). The dogs trot in profile; the mutant keeps
// his guard, takes the knee or the kick, swings back on his turn and goes down.

export type DwellerPose = RigPose & {
  pistol: number
  flash: number
  held: number
  bob: number
  syringe: number
  radio: number
  dial: number
  gauge: number
  alarm: number
}

export const STAND: DwellerPose = { ...RIG_STAND, pistol: 0, flash: 0, held: 0, bob: 0, syringe: 0, radio: 0, dial: 0, gauge: 0, alarm: 0 }

export const mix = (a: DwellerPose, b: DwellerPose, t: number): DwellerPose => rigMix(a, b, t)

export const pose = (partial: Partial<DwellerPose>): DwellerPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the dweller's arms down, the sticks forward, the Muay Thai guard with both
 *  wraps up before his chin and the near foot ahead. */
export const KIT: Record<Profession, DwellerPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -15, foreRight: -55, armLeft: -10, foreLeft: -60 }),
  fighter: pose({ armRight: -40, foreRight: -105, armLeft: -50, foreLeft: -100, thighRight: -12, thighLeft: 12 }),
}

/** His profile stride at `phase`, facing right. */
export const walk = (phase: number): DwellerPose => pose(rigWalk(phase, 1))

/** Down on the far knee: the far thigh straight down and its shin folded back flat, the near knee up before
 *  him with its shin straight down to the foot. */
export const KNEEL: Partial<DwellerPose> = { rise: 21, thighRight: -80, shinRight: 80, thighLeft: 0, shinLeft: 90 }

/** The wrist computer raised before his face, the far hand's finger on its dial. */
export const WRIST: Partial<DwellerPose> = { armRight: -70, foreRight: -85, armLeft: -55, foreLeft: -70 }

/** The near forearm raised across before his eyes against the glare, leaning back a little. */
export const SHADE: Partial<DwellerPose> = { armRight: -150, foreRight: 10, lean: -4 }

/** The pistol up and level, the far hand under the near one. */
export const AIM: Partial<DwellerPose> = { armRight: -90, foreRight: 0, armLeft: -78, foreLeft: -14, thighRight: -10, thighLeft: 10, pistol: 1 }

/** Both hands low before him at the lock, the pick and the tension tool. */
export const PICK: Partial<DwellerPose> = { armRight: -55, foreRight: -25, armLeft: -45, foreLeft: -30 }

/** The near arm out at chest height, reaching; then the find held up before his face. */
export const REACH: Partial<DwellerPose> = { armRight: -88, foreRight: -6 }
export const HOLD_UP: Partial<DwellerPose> = { armRight: -55, foreRight: -95 }

/** The far hand's syringe driven into the near upper arm. */
export const JAB: Partial<DwellerPose> = { armRight: -15, armLeft: -70, foreLeft: -75, syringe: 1 }

/** The near arm out, pointing the dog to the find. */
export const POINT: Partial<DwellerPose> = { armRight: -95, foreRight: -5, lean: 2 }

/** The radio held at his chest, the far hand under it and the near one on its dial. */
export const RADIO: Partial<DwellerPose> = { armRight: -60, foreRight: -60, armLeft: -50, foreLeft: -55, radio: 1 }

/** Both hands forward on a terminal's keys at chest height. */
export const KEYS: Partial<DwellerPose> = { armRight: -72, foreRight: -22, armLeft: -62, foreLeft: -26 }

/** The block on the foe's turn: both forearms up before the face, leaning back. */
export const BLOCK: Partial<DwellerPose> = { armRight: -55, foreRight: -115, armLeft: -50, foreLeft: -120, lean: -7, thighRight: -12, thighLeft: 14 }

/** The clinch knee: both wraps pulling down at the head, the near knee driven up and forward. */
export const KNEE: Partial<DwellerPose> = { armRight: -110, foreRight: -40, armLeft: -100, foreLeft: -45, thighRight: -105, shinRight: 110, lean: 4 }

/** The side kick: the near leg out level at the head, leaning back to it, the guard kept. */
export const KICK: Partial<DwellerPose> = { armRight: -40, foreRight: -105, armLeft: -50, foreLeft: -100, thighRight: -95, shinRight: 0, lean: -16, rise: 2 }

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

const GEAR_CLASSES = {
  pistol: s.pistol,
  flash: s.flash,
  held: s.held,
  heldHead: s.heldHead,
  syringe: s.syringe,
  radio: s.radio,
  dial: s.dial,
  needle: s.needle,
  alarm: s.alarm,
}

const find = <Names extends string>(root: Element, classes: Record<Names, string>): Record<Names, SVGElement | null> =>
  Object.fromEntries(Object.entries(classes).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className as string}`)])) as Record<Names, SVGElement | null>

export type DwellerJoints = RigJoints & Record<keyof typeof GEAR_CLASSES, SVGElement | null>

/** His groups inside `root`, the group that holds one DwellerFigure. */
export const dwellerJoints = (root: Element): DwellerJoints => ({ ...rigJoints(root, LIMB_CLASSES), ...find(root, GEAR_CLASSES) })

const show = (el: SVGElement | null, opacity: number, transform?: string): void => {
  if (!el) return
  el.style.opacity = opacity.toFixed(3)
  if (transform) el.style.transform = transform
}

const spin = (el: SVGElement | null, deg: number): void => {
  if (el) el.style.transform = `rotate(${deg.toFixed(1)}deg)`
}

/** Writes `p` on his groups: the rig's limbs, then what he holds. The bobblehead turns against his arm so it
 *  stands upright in his hand. Transforms and opacity only. */
export function setDwellerPose(j: DwellerJoints, p: DwellerPose): void {
  setRigPose(j, p)
  show(j.pistol, p.pistol)
  show(j.flash, p.flash)
  show(j.held, p.held, `rotate(${(-(p.armRight + p.foreRight)).toFixed(1)}deg)`)
  spin(j.heldHead, 14 * p.bob)
  show(j.syringe, p.syringe)
  show(j.radio, p.radio)
  spin(j.dial, -120 + 240 * p.dial)
  spin(j.needle, -60 + 120 * p.gauge)
  show(j.alarm, p.alarm)
}

// ---- the dog ----

export interface DogPose {
  /** The paws' swing, -1 to 1, front and hind pairs against each other. */
  stride: number
  /** 0 standing, 1 sitting; 1 nose down digging. */
  sit: number
  dig: number
  /** 0 to 1: the head lifted, ears pricked toward something. */
  look: number
}

/** The trot at `phase`: the paws swing a full cycle per unit. */
export const trot = (phase: number): DogPose => ({ stride: Math.sin(phase * 2 * Math.PI), sit: 0, dig: 0, look: 0 })

export const SITTING: DogPose = { stride: 0, sit: 1, dig: 0, look: 0 }

export const STANDING: DogPose = { stride: 0, sit: 0, dig: 0, look: 0 }

export const mixDog = (a: DogPose, b: DogPose, t: number): DogPose => ({
  stride: a.stride + (b.stride - a.stride) * t,
  sit: a.sit + (b.sit - a.sit) * t,
  dig: a.dig + (b.dig - a.dig) * t,
  look: a.look + (b.look - a.look) * t,
})

const DOG_CLASSES = { body: d.dogBody, head: d.dogHead, tail: d.dogTail, hindFar: d.dogHindFar, frontFar: d.dogFrontFar, hindNear: d.dogHindNear, frontNear: d.dogFrontNear }

export type DogJoints = Record<keyof typeof DOG_CLASSES, SVGElement | null>

export const dogJoints = (root: Element): DogJoints => find(root, DOG_CLASSES)

const set = (el: SVGElement | null, transform: string): void => {
  if (el) el.style.transform = transform
}

/** Writes the dog's pose: the paws' swing, the sit folding the hind legs under, the dig pitching him nose down. */
export function setDogPose(j: DogJoints, { stride, sit, dig, look }: DogPose): void {
  const paw = 24 * stride * (1 - sit) * (1 - dig)
  set(j.frontNear, `rotate(${paw.toFixed(1)}deg)`)
  set(j.hindFar, `rotate(${paw.toFixed(1)}deg)`)
  set(j.frontFar, `rotate(${(-paw).toFixed(1)}deg)`)
  set(j.hindNear, `rotate(${(-paw).toFixed(1)}deg)`)
  const fold = `translate(${(6 * sit).toFixed(2)}px, ${(17 * sit).toFixed(2)}px) rotate(${(-85 * sit - 8 * dig).toFixed(1)}deg)`
  if (sit > 0 || dig > 0) {
    set(j.hindNear, fold)
    set(j.hindFar, fold)
  }
  set(j.body, `rotate(${(-14 * sit + 12 * dig).toFixed(1)}deg) translateY(${(4 * sit + 2 * dig + Math.abs(stride) * -1.5).toFixed(2)}px)`)
  set(j.head, `rotate(${(-12 * sit + 18 * dig - 14 * look).toFixed(1)}deg)`)
  set(j.tail, `rotate(${(-62 * sit + 14 * stride).toFixed(1)}deg)`)
}

// ---- the mutant ----

/** The mutant's turns in degrees (his body also shifts and drops, in his viewBox's units). */
export interface FoePose {
  shift: number
  drop: number
  lean: number
  torso: number
  head: number
  armNear: number
  foreNear: number
  armFar: number
  foreFar: number
  thighNear: number
  shinNear: number
  thighFar: number
  shinFar: number
}

/** The brawler's guard, fists up before the face. */
export const FOE_GUARD: FoePose = { shift: 0, drop: 0, lean: 0, torso: 0, head: 0, armNear: 25, foreNear: 110, armFar: 35, foreFar: 112, thighNear: 0, shinNear: 0, thighFar: 0, shinFar: 0 }

/** Doubled over the knee to the gut. */
export const FOE_KNEED: FoePose = { ...FOE_GUARD, shift: 6, torso: -22, head: -16, armNear: -5, foreNear: 55 }

/** Rocked back by the kick to the head, arms flung. */
export const FOE_KICKED: FoePose = { ...FOE_GUARD, shift: 7, lean: 9, head: 24, armNear: -40, foreNear: 40, armFar: -60 }

/** His swing on his turn: the near fist thrown at the survivor, leaning in. */
export const FOE_SWING: FoePose = { ...FOE_GUARD, shift: -12, lean: -8, armNear: 80, foreNear: 20 }

/** Down on the far knee, the head bowed. */
export const FOE_DOWN: FoePose = { shift: 0, drop: 18, lean: 0, torso: -10, head: -14, armNear: 18, foreNear: 40, armFar: 8, foreFar: 112, thighNear: 72, shinNear: -78, thighFar: -6, shinFar: -84 }

export const mixFoe = (a: FoePose, b: FoePose, t: number): FoePose =>
  Object.fromEntries(Object.keys(a).map((key) => [key, a[key as keyof FoePose] + (b[key as keyof FoePose] - a[key as keyof FoePose]) * t])) as unknown as FoePose

const FOE_CLASSES = {
  body: m.body,
  torso: m.torso,
  head: m.head,
  armNear: m.armNear,
  foreNear: m.foreNear,
  armFar: m.armFar,
  foreFar: m.foreFar,
  thighNear: m.thighNear,
  shinNear: m.shinNear,
  thighFar: m.thighFar,
  shinFar: m.shinFar,
}

export type FoeJoints = Record<keyof typeof FOE_CLASSES, SVGElement | null>

export const foeJoints = (root: Element): FoeJoints => find(root, FOE_CLASSES)

const turnTo = (el: SVGElement | null, deg: number): void => set(el, `rotate(${deg.toFixed(1)}deg)`)

/** Writes the mutant's pose: transforms only. */
export function setFoePose(j: FoeJoints, p: FoePose): void {
  set(j.body, `translate(${p.shift.toFixed(2)}px, ${p.drop.toFixed(2)}px) rotate(${p.lean.toFixed(1)}deg)`)
  turnTo(j.torso, p.torso)
  turnTo(j.head, p.head)
  turnTo(j.armNear, p.armNear)
  turnTo(j.foreNear, p.foreNear)
  turnTo(j.armFar, p.armFar)
  turnTo(j.foreFar, p.foreFar)
  turnTo(j.thighNear, p.thighNear)
  turnTo(j.shinNear, p.shinNear)
  turnTo(j.thighFar, p.thighFar)
  turnTo(j.shinFar, p.shinFar)
}
