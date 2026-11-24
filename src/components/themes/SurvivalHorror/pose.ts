import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import { fadeTo } from '../shared/stageNodes'
import s from './figure.module.css'

// His poses for the scenes, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's numbers plus
// his kit on top, the flashlight's beam, the revolver drawn and the paper in his hand. He is drawn side on
// facing right: a negative angle swings an arm or a thigh forward, toward what he faces, and a positive
// lean tips him forward.

/** The rig's pose and, 0 to 1: the beam on, the revolver drawn, a paper in his hand. */
export type SurvivorPose = RigPose & { light: number; gun: number; paper: number }

export const STAND: SurvivorPose = { ...RIG_STAND, light: 0, gun: 0, paper: 0 }

export const mix = (a: SurvivorPose, b: SurvivorPose, t: number): SurvivorPose => rigMix(a, b, t)

const pose = (partial: Partial<SurvivorPose>): SurvivorPose => ({ ...STAND, ...partial })

/** The careful walk forward at `phase` (one step per unit), the light held low ahead. */
export const walk = (phase: number): SurvivorPose => pose({ ...rigWalk(phase, 1), armLeft: -35, foreLeft: -15, lean: 3, light: 1 })

/** The run forward at `phase`: longer strides, leaning in, the far arm pumping, the light swinging ahead. */
export function run(phase: number): SurvivorPose {
  const stride = rigWalk(phase, 1)
  return pose({ ...stride, thighRight: 1.6 * stride.thighRight, thighLeft: 1.6 * stride.thighLeft, shinRight: 1.8 * stride.shinRight, shinLeft: 1.8 * stride.shinLeft, rise: 2 * stride.rise, lean: 12, armRight: 1.4 * stride.armRight, foreRight: -70, armLeft: -40, foreLeft: -20, light: 1 })
}

/** The flashlight raised `t` of the way and its beam on, pointed ahead and a little down. */
export const raiseLight = (t: number): SurvivorPose => pose({ armLeft: -70 * t, foreLeft: -8 * t, lean: 2 * t, light: t })

/** The beam swept `t` of the way up the room and down again, the light held out. */
export const sweep = (t: number): SurvivorPose => pose({ armLeft: -70 - 40 * Math.sin(t * Math.PI), foreLeft: -8, lean: 2 - 4 * Math.sin(t * Math.PI), light: 1 })

/** Reading: the page held up in his far hand `t` of the way, the light on it. */
export const read = (t: number): SurvivorPose => pose({ armRight: -75 * t, foreRight: -60 * t, armLeft: -50, foreLeft: -40 * t, lean: 3, paper: t, light: 1 })

/** Pulling a drawer toward him `t` of the way, leaning to it; the file in his hand at the end. */
export const pull = (t: number): SurvivorPose => pose({ armRight: -80 + 30 * t, foreRight: -10, lean: 8 - 6 * t, armLeft: -40, foreLeft: -20, light: 1, paper: t > 0.85 ? 1 : 0 })

/** The shove: leaning hard into the crate, both hands on it, the legs driving with `phase`. */
export function shove(phase: number): SurvivorPose {
  const swing = Math.sin(phase * Math.PI)
  return pose({ lean: 20, armRight: -80, foreRight: -10, armLeft: -84, foreLeft: -8, thighRight: -26 + 28 * swing, thighLeft: 4 - 28 * swing, shinRight: 22, shinLeft: 26 })
}

/** Turning a dial at chest height through one notch, `t` of the way: the far hand on it, the wrist rolling. */
export const turn = (t: number): SurvivorPose => pose({ armRight: -82, foreRight: -30 - 25 * Math.sin(t * Math.PI), armLeft: -45, foreLeft: -35, lean: 5, light: 1 })

/** Aiming `t` of the way: the revolver up level with the light under it, both arms out. */
export const aim = (t: number): SurvivorPose => pose({ armRight: -88 * t, foreRight: -4 * t, armLeft: -40 - 42 * t, foreLeft: -20 + 14 * t, lean: -2 * t, gun: t > 0.2 ? 1 : 0, light: 1 })

/** Crouched low, gathering for a jump. */
export const CROUCH: SurvivorPose = pose({ rise: 18, lean: 10, thighRight: -55, thighLeft: -40, shinRight: 75, shinLeft: 65, armRight: -30, foreRight: -40, armLeft: -40, foreLeft: -30, light: 1 })

/** Lighting a wall lamp `t` of the way: the far arm reaching up to it. */
export const reach = (t: number): SurvivorPose => pose({ armRight: -150 * t, foreRight: -10 * t, armLeft: -35, foreLeft: -15, lean: -3 * t, light: 1 })

/** The guard of a fight up close, both fists up before his face. */
export const GUARD: SurvivorPose = pose({ armRight: -25, foreRight: -115, armLeft: -40, foreLeft: -105, lean: 3 })

/** The block `t` of the way: the near forearm raised across his face. */
export const block = (t: number): SurvivorPose => pose({ armRight: -25, foreRight: -115, armLeft: -40 - 25 * t, foreLeft: -105 - 40 * t, lean: 3 - 9 * t })

/** The kick `t` of the way: the knee up, then the shin driven out, leaning back. */
export function kick(t: number): SurvivorPose {
  const knee = Math.min(1, t * 2)
  const out = Math.max(0, t * 2 - 1)
  return pose({ armRight: -25, foreRight: -115, armLeft: -40, foreLeft: -105, lean: -10 * t, thighLeft: -55 * knee - 30 * out, shinLeft: 85 * knee - 85 * out })
}

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
