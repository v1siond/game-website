import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import { fadeTo } from '../shared/stageNodes'
import s from './figure.module.css'

// His poses for the scroll scenes, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers plus his kit on top, the flashlight's beam, the revolver drawn and the paper in his hand. He faces
// right: a negative angle swings an arm or a thigh forward.

/** The rig's pose and, 0 to 1: the beam on, the revolver drawn, a paper in his hand. */
export type SurvivorPose = RigPose & { light: number; gun: number; paper: number }

export const STAND: SurvivorPose = { ...RIG_STAND, light: 0, gun: 0, paper: 0 }

export const mix = (a: SurvivorPose, b: SurvivorPose, t: number): SurvivorPose => rigMix(a, b, t)

const pose = (partial: Partial<SurvivorPose>): SurvivorPose => ({ ...STAND, ...partial })

/** The careful walk at `phase`, the light held low ahead. */
export const walk = (phase: number): SurvivorPose => pose({ ...rigWalk(phase, 1), armLeft: -30, foreLeft: -20, light: 1 })

/** The flashlight raised `t` of the way and its beam on, pointed ahead and a little down. */
export const raiseLight = (t: number): SurvivorPose => pose({ armLeft: -70 * t, foreLeft: -8 * t, lean: 2 * t, light: t })

/** Reading: the page held up in his right hand `t` of the way, the light on it. */
export const read = (t: number): SurvivorPose => pose({ armRight: -70 * t, foreRight: -70 * t, armLeft: -45 * t, foreLeft: -60 * t, lean: 4 * t, paper: t, light: 1 })

/** Pulling a drawer `t` of the way: the right hand forward low, leaning into it, the file in his hand at the end. */
export const search = (t: number): SurvivorPose => pose({ armRight: -55 - 15 * t, foreRight: -25 + 15 * t, lean: 10 - 6 * t, armLeft: -30, foreLeft: -20, light: 1, paper: t > 0.6 ? 1 : 0 })

/** The shove: leaning hard into the crate, both hands on it, the legs driving with `phase`. */
export function shove(phase: number): SurvivorPose {
  const swing = Math.sin(phase * Math.PI)
  return pose({ lean: 22, armRight: -78, foreRight: -12, armLeft: -84, foreLeft: -10, thighRight: -24 - 18 * swing, thighLeft: 10 + 18 * swing, shinRight: 30, shinLeft: 34 })
}

/** Turning a dial at chest height `t` through one notch: the right hand on it, the wrist rolling. */
export const turn = (t: number): SurvivorPose => pose({ armRight: -78, foreRight: -40 - 20 * Math.sin(t * Math.PI), armLeft: -40, foreLeft: -50, lean: 6, light: 1 })

/** Aiming `t` of the way: the revolver up level with the light under it, both arms out. */
export const aim = (t: number): SurvivorPose => pose({ armRight: -88 * t, foreRight: -4 * t, armLeft: -40 - 40 * t, foreLeft: -50 + 40 * t, lean: -2 * t, gun: t > 0.2 ? 1 : 0, light: 1 })

/** Crouched low in a hiding place, the light off. */
export const CROUCH: SurvivorPose = pose({ rise: 22, lean: 8, thighRight: -62, thighLeft: -40, shinRight: 82, shinLeft: 70, armRight: -20, foreRight: -40, armLeft: -30, foreLeft: -50 })

/** Lighting a wall lamp `t` of the way: the right arm reaching up to it. */
export const reach = (t: number): SurvivorPose => pose({ armRight: -150 * t, foreRight: -10 * t, armLeft: -30, foreLeft: -20, lean: -4 * t, light: 1 })

/** The guard of a fight up close, both fists up. */
export const GUARD: SurvivorPose = pose({ armRight: 25, foreRight: 150, armLeft: -25, foreLeft: -150, lean: 2 })

/** The block `t` of the way: the front forearm across his face. */
export const block = (t: number): SurvivorPose => pose({ armRight: 25, foreRight: 150, armLeft: -25 - 45 * t, foreLeft: -150 + 40 * t, lean: -6 * t })

/** The kick `t` of the way: the knee up, then the shin driven out, leaning back. */
export function kick(t: number): SurvivorPose {
  const knee = Math.min(1, t * 2)
  const out = Math.max(0, t * 2 - 1)
  return pose({ armRight: 25, foreRight: 150, armLeft: -25, foreLeft: -150, lean: -10 * t, thighLeft: -55 * knee - 35 * out, shinLeft: 85 * knee - 85 * out })
}

/** Lifting the door's bar `t` of the way: both arms up under it. */
export const lift = (t: number): SurvivorPose => pose({ armRight: -120 * t, foreRight: -30 * t, armLeft: -130 * t, foreLeft: -20 * t, lean: -3 * t })

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

const KIT_CLASSES = { beam: s.beam, gun: s.gun, holster: s.holster, paper: s.paper }

export type SurvivorJoints = RigJoints & Record<keyof typeof KIT_CLASSES, SVGElement[]>

/** His groups inside `root`, the group that holds one SurvivorFigure. */
export const survivorJoints = (root: Element): SurvivorJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  ...(Object.fromEntries(Object.entries(KIT_CLASSES).map(([name, className]) => [name, Array.from(root.querySelectorAll<SVGElement>(`.${className}`))])) as Record<keyof typeof KIT_CLASSES, SVGElement[]>),
})

const show = (els: SVGElement[], opacity: number): void => {
  els.forEach((el) => fadeTo(el, opacity))
}

/** Writes `p` on his groups: the rig's limbs, then his kit. Transforms and the kit's opacity attribute only. */
export function setSurvivorPose(j: SurvivorJoints, p: SurvivorPose): void {
  setRigPose(j, p)
  show(j.beam, p.light)
  show(j.gun, p.gun)
  show(j.holster, 1 - p.gun)
  show(j.paper, p.paper)
}
