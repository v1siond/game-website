import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './survivor.module.css'
import d from './dog.module.css'
import m from './mutant.module.css'

// The survivor and his dogs posed by the scroll. His limbs are the shared rig's numbers (rigPose,
// ../shared/rig); on top, his own overlays: the level up star with the wink, the targeting reticle, the
// pistol and its flash, the held radio's tuning. The angles are the ones his CSS motions end on
// (survivor.module.css), so he looks the same on the wrist terminal. His moves are the wasteland RPG's: the
// crouched sneak, the lockpick on one knee, keying a terminal, the targeting stance and its shot, pointing a
// dog out to fetch, the guard and the block of a turn fight, turning the radio's dial. The dogs trot in
// profile, facing right, their paws swinging with the phase; the mutant of the Muay Thai scene keeps his
// guard, takes the knee or the kick, swings back on his turn, and goes down.

/** The rig's pose and, 0 to 1: the star and wink, the reticle locked on, the pistol out, its flash, and the
 *  held radio's dial (its knob and needle, 0 to 1 across the band). */
export type SurvivorPose = RigPose & { star: number; reticle: number; pistol: number; flash: number; needle: number }

export const STAND: SurvivorPose = { ...RIG_STAND, star: 0, reticle: 0, pistol: 0, flash: 0, needle: 0 }

export const mix = (a: SurvivorPose, b: SurvivorPose, t: number): SurvivorPose => rigMix(a, b, t)

const pose = (partial: Partial<SurvivorPose>): SurvivorPose => ({ ...STAND, ...partial })

/** The jaunty poster walk at `phase`, toward the viewer's right. */
export const walk = (phase: number): SurvivorPose => pose(rigWalk(phase))

/** The level up: the thumb up, a hop, the wink and the star, `t` of the way. */
export const thumbsUp = (t: number): SurvivorPose => pose({ armRight: 70 * t, foreRight: 110 * t, rise: -6 * Math.sin(Math.PI * t), star: t })

/** The wrist terminal raised and keyed, the key hand tapping with `tap`. */
export const typing = (t: number, tap: number): SurvivorPose => pose({ armLeft: 25 * t, foreLeft: 85 * t, armRight: -30 * t, foreRight: (-70 + 10 * Math.abs(Math.sin(tap * Math.PI))) * t })

/** The targeting stance, the pistol up and the reticle locked, and the shot's recoil with `shot`. */
export const aim = (t: number, shot: number): SurvivorPose =>
  pose({ armLeft: (-88 - 16 * shot) * t, foreLeft: (-4 - 14 * shot) * t, armRight: 28 * t, foreRight: -95 * t, pistol: t, reticle: t, flash: shot * t })

/** The bakelite radio held to his chest, his right hand on the knob turning the dial to `needle`. */
export const tune = (needle: number): SurvivorPose => pose({ lean: -3, armLeft: -44, foreLeft: 118, armRight: 35, foreRight: -35, needle })

/** The crouched sneak at `phase`, knees bent and the pistol held low, `t` of the way down into it. */
export const sneak = (phase: number, t = 1): SurvivorPose => {
  const step = rigWalk(phase)
  return pose({
    ...step,
    rise: (10 + step.rise) * t,
    lean: 6 * t,
    thighRight: 14 * t,
    shinRight: -26 * t,
    thighLeft: -14 * t,
    shinLeft: 26 * t,
    armLeft: -32 * t,
    foreLeft: -38 * t,
    armRight: -18 * t,
    foreRight: -40 * t,
    pistol: t,
  })
}

/** Down on one knee at the lock, the pick in his left hand worked with `pick`, the tension tool in his right. */
export const lockpick = (t: number, pick: number): SurvivorPose =>
  pose({ rise: 30 * t, kneeRight: t, shinRight: -8 * t, thighLeft: -18 * t, shinLeft: 38 * t, armLeft: -62 * t, foreLeft: (-14 + 10 * pick) * t, armRight: -34 * t, foreRight: -62 * t })

/** His left arm out, pointing a dog to the find. */
export const point = (t: number): SurvivorPose => pose({ armLeft: -100 * t, foreLeft: -6 * t, lean: -3 * t })

/** The block on the foe's turn: both forearms up before the face, leaning back. */
export const BLOCK: SurvivorPose = pose({ armRight: 58, foreRight: 122, armLeft: -58, foreLeft: -122, lean: -7, rise: 3 })

/** The guard of the fighter's kit, then the clinch knee `t` of the way. */
export const knee = (t: number): SurvivorPose =>
  pose({ armRight: 25 - 110 * t, foreRight: 150 - 125 * t, armLeft: -25 - 80 * t, foreLeft: -150 + 185 * t, lean: -8 * t, thighLeft: -105 * t, shinLeft: 115 * t })

/** The side kick `t` of the way: the thigh up, the shin out, leaning back. */
export const kick = (t: number): SurvivorPose =>
  pose({ armRight: 25 - 35 * t, foreRight: 150 - 140 * t, armLeft: -25, foreLeft: -150, lean: -16 * t, thighLeft: -96 * t, shinLeft: -4 * t })

/** The fighter's guard. */
export const GUARD: SurvivorPose = pose({ armRight: 25, foreRight: 150, armLeft: -25, foreLeft: -150 })

const LIMB_CLASSES = {
  body: s.body,
  armRight: s.armRight,
  foreRight: s.foreRight,
  armLeft: s.armLeft,
  foreLeft: s.foreLeft,
  thighRight: s.thighRight,
  shinRight: s.shinRight,
  thighLeft: s.thighLeft,
  shinLeft: s.shinLeft,
}

const OVERLAY_CLASSES = { star: s.star, winkLine: s.winkLine, eyeShut: s.eyeShut, reticle: s.reticle, pistol: s.pistol, flash: s.flash }

export type SurvivorJoints = RigJoints & Record<keyof typeof OVERLAY_CLASSES, SVGElement | null> & { root: HTMLElement | SVGElement | null }

const find = <Names extends string>(root: Element, classes: Record<Names, string>): Record<Names, SVGElement | null> =>
  Object.fromEntries(Object.entries(classes).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className as string}`)])) as Record<Names, SVGElement | null>

/** His groups inside `root`, the group that holds one SurvivorFigure. */
export const survivorJoints = (root: Element): SurvivorJoints => ({ ...rigJoints(root, LIMB_CLASSES), ...find(root, OVERLAY_CLASSES), root: root as SVGElement })

const show = (el: SVGElement | null, opacity: number, transform = 'none'): void => {
  if (!el) return
  el.style.opacity = opacity.toFixed(3)
  el.style.transform = transform
}

/** Writes `p` on his groups: the rig's limbs, then his overlays. Transforms and opacity only. */
export function setSurvivorPose(j: SurvivorJoints, p: SurvivorPose): void {
  setRigPose(j, p)
  show(j.star, p.star, `scale(${p.star.toFixed(3)}) rotate(${(-90 + 90 * p.star).toFixed(1)}deg)`)
  show(j.winkLine, p.star)
  show(j.eyeShut, 1 - p.star)
  show(j.reticle, p.reticle)
  show(j.pistol, p.pistol)
  show(j.flash, p.flash)
  // the held radio's knob and dial needle turn with --needle (survivor.module.css)
  j.root?.style.setProperty('--needle', p.needle.toFixed(3))
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
