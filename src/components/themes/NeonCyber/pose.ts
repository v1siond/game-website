import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './figure.module.css'

// His poses for the scroll scenes, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's numbers
// plus his kit on top, the blade drawn, the visor lit, the wrist deck lit and the data climbing off it. He
// faces right: a negative angle swings an arm or a thigh forward. The angles are the ones his CSS motions in
// the rig end on, so he looks the same in the profession menu.

/** The rig's pose and, 0 to 1: the blade drawn, the visor lit, the deck lit, the glyphs' climb. */
export type HeroPose = RigPose & { blade: number; visor: number; deck: number; glyphs: number }

export const STAND: HeroPose = { ...RIG_STAND, blade: 0, visor: 0, deck: 0, glyphs: 0 }

export const mix = (a: HeroPose, b: HeroPose, t: number): HeroPose => rigMix(a, b, t)

const pose = (partial: Partial<HeroPose>): HeroPose => ({ ...STAND, ...partial })

/** The street stride at `phase`. */
export const walk = (phase: number): HeroPose => pose(rigWalk(phase))

/** The sprint: leaning in, arms back, the thighs scissoring with `phase`. */
export function run(phase: number): HeroPose {
  const swing = Math.sin(phase * Math.PI)
  return pose({ lean: 12, armRight: 38, armLeft: 38, foreRight: -22, foreLeft: -22, thighRight: -9 - 33 * swing, thighLeft: -9 + 33 * swing, shinRight: 38, shinLeft: 38, visor: 1 })
}

/** The guard with the blade drawn `t` of the way: the blade forward and up, the deck hand raised. */
export const guard = (t: number): HeroPose => pose({ armRight: -50 * t, foreRight: -40 * t, armLeft: -20 * t, foreLeft: -60 * t, lean: 4 * t, blade: t, visor: t })

/** The hack: the deck arm out level toward the target `t` of the way, the deck and visor lit, the data climbing with `climb`. */
export const hack = (t: number, climb: number): HeroPose => pose({ armLeft: -84 * t, foreLeft: -8 * t, lean: 3 * t, deck: t, visor: t, glyphs: climb * t })

/** Crouched in cover: the body down, the knees deep, leaning in. */
export const CROUCH: HeroPose = pose({ rise: 24, lean: 10, thighRight: -62, thighLeft: -40, shinRight: 82, shinLeft: 70, armRight: -20, foreRight: -40, armLeft: -30, foreLeft: -50 })

/** The takedown `t` of the way: the lunge out of cover, both hands driving forward and down. */
export const takedown = (t: number): HeroPose =>
  pose({ lean: 18 * t, rise: 8 * t, thighRight: -42 * t, shinRight: 40 * t, thighLeft: 24 * t, shinLeft: 20 * t, armRight: -105 * t, foreRight: -20 * t, armLeft: -80 * t, foreLeft: -35 * t, visor: t })

/** The leap between walls: both knees tucked, the arms back for balance. */
export const LEAP: HeroPose = pose({ thighRight: -48, thighLeft: -30, shinRight: 70, shinLeft: 60, armRight: 40, foreRight: -30, armLeft: 30, foreLeft: -30, lean: 8, visor: 1 })

/** Hanging from the grapple line: the deck arm straight up holding the line, the legs swung together `swing` (-1 back to 1 forward). */
export const hang = (swing: number): HeroPose =>
  pose({ armLeft: -172, foreLeft: 0, armRight: -30, foreRight: -30, thighRight: -18 * swing - 6, thighLeft: -18 * swing + 4, shinRight: 22, shinLeft: 14, lean: -6 * swing, deck: 1, visor: 1 })

/** The deflect `t` of the way: the blade swept up across him to meet a shot coming at his chest. */
export const deflect = (t: number): HeroPose => pose({ armRight: -60 - 70 * t, foreRight: -70 + 40 * t, armLeft: -15, foreLeft: -50, lean: -4 * t, thighRight: -16, shinRight: 16, blade: 1, visor: 1 })

/** The cut `t` of the way: the blade from high over his shoulder down through the line in front of him. */
export const cut = (t: number): HeroPose =>
  pose({ armRight: -160 + 120 * t, foreRight: -30 + 10 * t, armLeft: 10, foreLeft: -40, lean: 14 * t, thighRight: -38 * t, shinRight: 34 * t, thighLeft: 14 * t, shinLeft: 10 * t, blade: 1, visor: 1 })

/** The held draw before the finisher: low, the blade back along his side, everything wound. */
export const WIND: HeroPose = pose({ rise: 14, lean: 16, armRight: 60, foreRight: -10, armLeft: -40, foreLeft: -60, thighRight: -50, shinRight: 60, thighLeft: 22, shinLeft: 30, blade: 1, visor: 1 })

/** The sticks on the snare: the rest pose of the kit, each forearm striking on its half of `phase`. */
export function drum(phase: number): HeroPose {
  const hit = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? hit : 0
  return pose({ armRight: 14, armLeft: -14, foreRight: -30 - 25 * right, foreLeft: 30 + 25 * (hit - right) })
}

/** Seated in the cab: the body down, the thighs out level, the shins down. */
export const SIT: HeroPose = pose({ rise: 18, thighRight: -72, thighLeft: -72, shinRight: 72, shinLeft: 72, armLeft: -12, foreLeft: -70 })

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

const KIT_CLASSES = { blade: s.blade, hilt: s.hilt, visor: s.visor, deck: s.deck, glyphs: s.glyphs }

export type HeroJoints = RigJoints & Record<keyof typeof KIT_CLASSES, SVGElement | null>

/** His groups inside `root`, the group that holds one HeroFigure. */
export const heroJoints = (root: Element): HeroJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  ...(Object.fromEntries(Object.entries(KIT_CLASSES).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as Record<keyof typeof KIT_CLASSES, SVGElement | null>),
})

const show = (el: SVGElement | null, opacity: number): void => {
  if (!el) return
  el.style.opacity = opacity.toFixed(3)
}

/** Writes `p` on his groups: the rig's limbs, then his kit. Transforms and opacity only. */
export function setHeroPose(j: HeroJoints, p: HeroPose): void {
  setRigPose(j, p)
  show(j.blade, p.blade)
  show(j.hilt, 1 - p.blade)
  show(j.visor, p.visor)
  show(j.deck, 0.35 + 0.65 * p.deck)
  show(j.glyphs, p.glyphs > 0 ? 1 - p.glyphs * 0.6 : 0)
  if (j.glyphs) j.glyphs.style.transform = `translateY(${(6 - 16 * p.glyphs).toFixed(2)}px)`
}
