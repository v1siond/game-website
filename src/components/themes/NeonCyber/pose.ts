import { STAND as RIG_STAND, mix as rigMix, walk as rigWalk, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import s from './figure.module.css'

// His poses for the scroll scenes, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's numbers
// plus his kit on top, the arm blade opened, the optics lit, the calves charged. He stands side on facing
// right, so a negative angle swings an arm or a thigh forward and a positive one folds a shin back; the far
// limbs are the right ones, the near limbs (the chrome arm) the left. Every pose keeps each part on the joint
// it hangs from, so a scene blends two of them with `mix` and nothing comes apart.

/** The rig's pose and, 0 to 1: the arm blade opened, the optics lit, the calves charged for a jump. */
export type HeroPose = RigPose & { blade: number; optics: number; charge: number }

export const STAND: HeroPose = { ...RIG_STAND, blade: 0, optics: 0, charge: 0 }

export const mix = (a: HeroPose, b: HeroPose, t: number): HeroPose => rigMix(a, b, t)

const pose = (partial: Partial<HeroPose>): HeroPose => ({ ...STAND, ...partial })

/** The street stride at `phase`, one step per unit. */
export const walk = (phase: number): HeroPose => pose(rigWalk(phase, 1))

/** The sprint at `phase`: the stride opened wide, leaning in, the forearms bent and pumping against the legs. */
export function run(phase: number): HeroPose {
  const stride = rigWalk(phase, 1)
  return pose({
    ...stride,
    rise: stride.rise * 2,
    thighRight: stride.thighRight * 1.7,
    thighLeft: stride.thighLeft * 1.7,
    shinRight: stride.shinRight * 2.4,
    shinLeft: stride.shinLeft * 2.4,
    armRight: stride.armRight * 2.2,
    armLeft: stride.armLeft * 2.2,
    foreRight: -80,
    foreLeft: -80,
    lean: 14,
    optics: 1,
  })
}

/** On guard with the arm blade `t` open: the chrome forearm up before him, the blade out past the fist, the near foot ahead. */
export const guard = (t: number): HeroPose =>
  pose({ armLeft: -40 * t, foreLeft: -62 * t, armRight: -30 * t, foreRight: -90 * t, thighLeft: -14 * t, shinLeft: 8 * t, thighRight: 14 * t, shinRight: 6 * t, rise: 2 * t, lean: 4 * t, blade: t, optics: t })

/** The chrome hand raised `t` of the way at a target `up` degrees above level, the optics lit. */
export const aim = (t: number, up: number): HeroPose => pose({ armLeft: -(90 + up) * t, foreLeft: -6 * t, lean: -3 * t, optics: t })

/** Crouched low in cover: the thighs forward, the shins folded back under him so both boots stay down. */
export const CROUCH: HeroPose = pose({ rise: 20, lean: 6, thighRight: -60, shinRight: 106, thighLeft: -58, shinLeft: 104, armRight: -30, foreRight: -70, armLeft: -40, foreLeft: -60 })

/** The grab from behind: a step in, both arms round a neck before him, leaning into it. */
export const GRAB: HeroPose = pose({ lean: 10, thighLeft: -24, shinLeft: 14, thighRight: 12, armRight: -88, foreRight: -62, armLeft: -78, foreLeft: -72, optics: 1 })

/** Down on one knee's depth with the taken guard, still holding him round the neck. */
export const HOLD_LOW: HeroPose = { ...CROUCH, armRight: -88, foreRight: -62, armLeft: -78, foreLeft: -72, optics: 1 }

/** The chrome hand reached out level to a port `t` of the way. */
export const reach = (t: number): HeroPose => pose({ armLeft: -78 * t, foreLeft: -10 * t, optics: t })

/** Wound for a jump, the calves charging `t`: the crouch with the arms swung back. */
export const charge = (t: number): HeroPose => ({ ...mix(STAND, CROUCH, 0.8 * t), armRight: 40 * t, armLeft: 50 * t, foreRight: -20 * t, foreLeft: -20 * t, charge: t })

/** Off the ground: the legs straight down under him, the arms thrown up. */
export const LAUNCH: HeroPose = pose({ thighRight: 12, shinRight: 18, thighLeft: -8, shinLeft: 10, armRight: -150, foreRight: -20, armLeft: -160, foreLeft: -15, charge: 1 })

/** Tucked in the air: both knees up, the arms forward for balance. */
export const TUCK: HeroPose = pose({ thighRight: -84, shinRight: 116, thighLeft: -96, shinLeft: 118, armRight: -40, foreRight: -60, armLeft: -50, foreLeft: -50, lean: 8, charge: 1 })

/** The dash with the blade open: low and leaning far in, the stride wide, the blade arm swept back. */
export const DASH: HeroPose = pose({ lean: 24, rise: 6, thighLeft: -56, shinLeft: 40, thighRight: 44, shinRight: 76, armLeft: 50, foreLeft: -30, armRight: -40, foreRight: -70, blade: 1, optics: 1 })

/** The cut `t` of the way: the blade from over his shoulder down through the line in front of him. */
export const slash = (t: number): HeroPose =>
  pose({ armLeft: -170 + 120 * t, foreLeft: -20 + 10 * t, armRight: -20, foreRight: -70, lean: 4 + 12 * t, thighLeft: -30, shinLeft: 20, thighRight: 20, shinRight: 30, rise: 3, blade: 1, optics: 1 })

/** A call taken `t` of the way: the chrome hand at his jaw, the optics lit. */
export const call = (t: number): HeroPose => pose({ armLeft: -15 * t, foreLeft: -150 * t, optics: t })

/** The sticks up over his head `t` of the way, clicking the count in. */
export const sticksUp = (t: number, click: number): HeroPose =>
  pose({ armRight: -150 * t, foreRight: (-20 - 14 * click) * t, armLeft: -160 * t, foreLeft: (-10 + 14 * click) * t })

/** The sticks on the snare before him: each forearm striking on its half of `phase`, the far one a beat after. */
export function drum(phase: number): HeroPose {
  const hit = Math.abs(Math.sin(phase * Math.PI))
  const near = phase % 2 < 1 ? hit : 0
  const far = hit - near
  return pose({ armRight: -6, armLeft: -12, foreRight: -78 + 34 * far, foreLeft: -75 + 34 * near })
}

/** The fighter's guard: both fists up before his chin, the near foot ahead. */
export const GUARD: HeroPose = pose({ armRight: -45, foreRight: -100, armLeft: -35, foreLeft: -110, thighLeft: -12, thighRight: 12 })

/** The parry `t` of the way: the near forearm swept out and down across the jab, leaning off it. */
export const parry = (t: number): HeroPose => ({ ...GUARD, armLeft: -35 - 35 * t, foreLeft: -110 + 50 * t, lean: -5 * t })

/** The knee `t` of the way: the near knee driven up, the shin folded under it, the fists still up. */
export const knee = (t: number): HeroPose => ({ ...GUARD, thighLeft: -12 - 78 * t, shinLeft: 100 * t, thighRight: 12 - 4 * t, lean: -4 * t, rise: -3 * t })

/** The roundhouse `t` of the way: the near leg swung up straight, leaning back off it, the far arm thrown back. */
export const roundhouse = (t: number): HeroPose => ({ ...GUARD, thighLeft: -12 - 90 * t, shinLeft: -4 * t, thighRight: 12 - 4 * t, lean: -14 * t, armRight: -45 + 75 * t, foreRight: -100 + 70 * t })

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

const KIT_CLASSES = { blade: s.blade, optics: s.optics }

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

/** Writes `p` on his groups: the rig's limbs, then his kit: the blade turning open at the wrist as it shows,
 *  the optics, the calves' charge (a variable his charge lines read). Transforms and opacity only. */
export function setHeroPose(j: HeroJoints, p: HeroPose): void {
  setRigPose(j, p)
  show(j.blade, Math.min(1, p.blade * 3))
  if (j.blade) j.blade.style.transform = `rotate(${(160 * (1 - p.blade)).toFixed(1)}deg)`
  show(j.optics, p.optics)
  j.body?.style.setProperty('--charge', p.charge.toFixed(3))
}
