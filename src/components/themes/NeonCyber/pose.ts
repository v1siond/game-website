import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type ArmPivots, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './merc.module.css'

// The merc posed by the scroll, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's numbers, plus his
// own kit on top, the mantis blades, the optic reticle, the jack cable and deck and the quickhack's glyphs.
// The angles are the ones his CSS motions in the rig end on, so he looks the same in the quickhack menu.

/** The rig's pose and, 0 to 1: the mantis blades out, the reticle locked, the cable and deck out, the glyphs' climb. */
export type MercPose = RigPose & { blades: number; reticle: number; jack: number; glyphs: number }

export const STAND: MercPose = { ...RIG_STAND, blades: 0, reticle: 0, jack: 0, glyphs: 0 }

export const mix = (a: MercPose, b: MercPose, t: number): MercPose => rigMix(a, b, t)

const pose = (partial: Partial<MercPose>): MercPose => ({ ...STAND, ...partial })

/** The street stride at `phase`. */
export const walk = (phase: number): MercPose => pose(rigWalk(phase))

/** The time slow dash: leaning in, arms back, the thighs scissoring with `phase`. */
export function dash(phase: number): MercPose {
  const swing = Math.sin(phase * Math.PI)
  return pose({ lean: 12, armRight: 38, armLeft: 38, foreRight: -22, foreLeft: -22, thighRight: -9 - 33 * swing, thighLeft: -9 + 33 * swing, shinRight: 38, shinLeft: 38 })
}

/** The hand at the temple and the reticle locked on, `t` of the way up. */
export const scan = (t: number): MercPose => pose({ armRight: 119 * t, foreRight: 121 * t, reticle: t })

/** The deck raised on the chrome palm, the cable out, the glyphs climbing with `climb`. */
export const hack = (t: number, climb: number): MercPose => pose({ armLeft: -30 * t, foreLeft: -50 * t, jack: t, glyphs: climb * t })

/** The hop on the cyberlegs, `t` of the way up: the body rises, both knees tuck. */
export const hop = (t: number): MercPose => pose({ rise: -26 * t, thighRight: -35 * t, thighLeft: -35 * t, shinRight: 60 * t, shinLeft: 60 * t })

/** The sticks on the snare: the rest pose of the kit, each forearm striking on its half of `phase`. */
export function drum(phase: number): MercPose {
  const hit = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? hit : 0
  return pose({ armRight: 14, armLeft: -14, foreRight: -30 - 25 * right, foreLeft: 30 + 25 * (hit - right) })
}

/** The guard of the fighter's kit and the roundhouse `t` of the way through: knee up, then the shin out. */
export function kick(t: number): MercPose {
  const knee = Math.min(1, t * 2)
  const out = Math.max(0, t * 2 - 1)
  return pose({ armRight: 25, foreRight: 150, armLeft: -25, foreLeft: -150, lean: -8 * t, thighLeft: -55 * knee - 35 * out, shinLeft: 85 * knee - 85 * out })
}

/** Sitting: the body down, the thighs out level, the shins down. */
export const SIT: MercPose = pose({ rise: 18, thighRight: -72, thighLeft: -72, shinRight: 72, shinLeft: 72, armLeft: -12, foreLeft: -70 })

/** The blades folded out `t` of the way and the arms crossing into the slash. */
export const slash = (t: number): MercPose => pose({ blades: t, armRight: 30 * t, armLeft: -30 * t, lean: 4 * t })

/** His right arm's joints and hand in his viewBox (the origins in merc.module.css), for where his hand is. */
export const RIGHT_ARM: ArmPivots = { shoulder: [32, 48], elbow: [30.5, 66], hand: [30.5, 88] }

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

const KIT_CLASSES = { bladeRight: s.bladeRight, bladeLeft: s.bladeLeft, reticle: s.reticle, jack: s.jack, glyphs: s.glyphs }

export type MercJoints = RigJoints & Record<keyof typeof KIT_CLASSES, SVGElement | null>

/** His groups inside `root`, the group that holds one MercFigure. */
export const mercJoints = (root: Element): MercJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  ...(Object.fromEntries(Object.entries(KIT_CLASSES).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as Record<keyof typeof KIT_CLASSES, SVGElement | null>),
})

const show = (el: SVGElement | null, transform: string, opacity: number): void => {
  if (!el) return
  el.style.transform = transform
  el.style.opacity = opacity.toFixed(3)
}

/** Writes `p` on his groups: the rig's limbs, then his kit. Transforms and opacity only. */
export function setMercPose(j: MercJoints, p: MercPose): void {
  setRigPose(j, p)
  const blade = `scale(${(0.2 + 0.8 * p.blades).toFixed(3)})`
  show(j.bladeRight, blade, p.blades)
  show(j.bladeLeft, blade, p.blades)
  show(j.reticle, 'none', p.reticle)
  show(j.jack, 'none', p.jack)
  if (j.glyphs) j.glyphs.style.transform = `translateY(${(6 - 16 * p.glyphs).toFixed(2)}px)`
}
