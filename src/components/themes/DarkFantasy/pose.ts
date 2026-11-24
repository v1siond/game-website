import { STAND as RIG_STAND, mix, walk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import { bell, fadeTo, transformTo } from '../shared/stageNodes'
import { PARTS, type Part } from './wanderer'
import s from './wanderer.module.css'

// The wanderer posed by his scene's actions, on the shared rig (rigPose, ../shared/rig): his limbs as the rig's
// numbers, plus his own on top: the head's nod in degrees (positive looks down) and what shows beside him, each
// 0 to 1 (the three slashes, the soul gathering, the dash's shadow). His near side (the nail arm and the near
// leg) is the rig's right, his far side its left; he faces right, so a negative turn swings a limb ahead.

export type WandererPose = RigPose & { head: number } & Record<Part, number>

const STAND: WandererPose = { ...RIG_STAND, head: 0, arc: 0, downArc: 0, upArc: 0, focus: 0, shade: 0 }

const pose = (partial: Partial<WandererPose>): WandererPose => ({ ...STAND, ...partial })

/** At rest: the nail arm bent forward, the nail held low ahead (wanderer.module.css draws the same). */
export const REST = pose({ armRight: -10, foreRight: -50 })

/** The guard: the nail up level ahead of him, the knees bent a little. */
export const GUARD = pose({ armRight: -45, foreRight: -55, thighRight: -12, shinRight: 14, thighLeft: 10, shinLeft: 10, rise: 1.5, lean: 4 })

/** The nail drawn from rest into the guard, `t` of the way. */
export const draw = (t: number): WandererPose => mix(REST, GUARD, t)

// The slash: the nail up over his head behind him, then cut down through the front to low ahead.
const WIND = pose({ ...GUARD, armRight: -170, foreRight: -20, lean: -6 })
const CUT = pose({ ...GUARD, armRight: -25, foreRight: -15, lean: 12 })

/** One slash from `from`, `t` of the way: the wind up, the cut with the white crescent ahead, back to `from`. */
export function slash(t: number, from: WandererPose = GUARD): WandererPose {
  if (t < 0.3) return mix(from, WIND, ramp(t, 0, 0.3))
  if (t < 0.55) return { ...mix(WIND, CUT, ramp(t, 0.3, 0.45)), arc: bell(t, 0.3, 0.6) }
  return { ...mix(CUT, from, ramp(t, 0.55, 1)), arc: bell(t, 0.3, 0.6) }
}

/** In the air, the knees tucked, the nail held up ahead. */
export const AIR = pose({ thighRight: -50, shinRight: 70, thighLeft: -20, shinLeft: 50, armRight: -40, foreRight: -70, rise: -2 })

/** The downward strike in the air: the nail straight down under him and the crescent under his soles, `t` of
 *  the way into the strike (lit through its middle). */
export const downStrike = (t: number): WandererPose => ({
  ...mix(AIR, pose({ thighRight: -60, shinRight: 90, thighLeft: -50, shinLeft: 90, armRight: 0, foreRight: 0, rise: -4, lean: 4 }), ramp(t, 0, 0.35)),
  downArc: bell(t, 0.25, 0.85),
})

/** The up strike: the nail swung up over him and the crescent over his horns, `t` of the way. */
export const upStrike = (t: number, from: WandererPose = GUARD): WandererPose => {
  const up = pose({ ...from, armRight: -175, foreRight: -5, lean: -8 })
  return { ...mix(from, up, bell(t, 0, 0.8)), upArc: bell(t, 0.2, 0.75) }
}

/** The dash: leant hard into it, the cloak and the nail trailing, the shadow streaming behind, `t` of the way. */
const DASH = pose({ lean: 22, armRight: 35, foreRight: -15, armLeft: 40, foreLeft: -10, thighRight: -25, shinRight: 30, thighLeft: 35, shinLeft: 30 })
export const dash = (t: number, from: WandererPose = AIR): WandererPose => ({ ...mix(from, DASH, ramp(t, 0, 0.15) * (1 - ramp(t, 0.85, 1))), shade: bell(t, 0.05, 1) })

/** On the wall: crouched against it, the knees up, the far hand on the stone, sliding. */
export const CLING = pose({ thighRight: -70, shinRight: 90, thighLeft: -45, shinLeft: 85, armLeft: -110, foreLeft: -30, armRight: -30, foreRight: -60, rise: 2, lean: -8 })

/** The run at `phase` (one stride per unit): a long stride leant forward, the nail held low. */
export function run(phase: number): WandererPose {
  const stride = walk(phase, 1)
  return pose({
    ...stride,
    thighRight: 1.4 * stride.thighRight,
    thighLeft: 1.4 * stride.thighLeft,
    shinRight: 1.8 * stride.shinRight,
    shinLeft: 1.8 * stride.shinLeft,
    lean: 10,
    armRight: -20,
    foreRight: -50,
    armLeft: 1.6 * stride.armLeft,
    foreLeft: -40,
  })
}

/** Focus: he stands still, knees bent and head bowed, the nail lowered, while the soul gathers round him. */
const FOCUS = pose({ thighRight: -18, shinRight: 30, thighLeft: 14, shinLeft: 30, rise: 3, armRight: 5, foreRight: -15, armLeft: -40, foreLeft: -60, head: 10 })
export const focus = (t: number): WandererPose => ({ ...mix(GUARD, FOCUS, ramp(t, 0, 0.2) * (1 - ramp(t, 0.85, 1))), focus: ramp(t, 0.1, 0.3) * (1 - ramp(t, 0.8, 1)) })

/** The soul spell: the far hand thrust out ahead, the body thrown back by the cast, `t` of the way. */
const CAST = pose({ ...GUARD, armLeft: -90, foreLeft: -5, armRight: 20, foreRight: -30, lean: -10 })
export const cast = (t: number): WandererPose => mix(GUARD, CAST, bell(t, 0, 1))

/** Sat on the bench: the thighs ahead level, the shins down, the nail laid across his knees. */
export const SIT = pose({ thighRight: -86, shinRight: 86, thighLeft: -80, shinLeft: 80, rise: 9, armRight: -60, foreRight: -30, armLeft: -50, foreLeft: -40, head: 4 })

/** The rest at the bench: the head bowed as the bench light rises, `t` of the way. */
export const rest = (t: number): WandererPose => ({ ...SIT, head: 4 + 8 * ramp(t, 0, 0.5), focus: 0.5 * ramp(t, 0.2, 0.6) })

/** Both hands held up before his face, a sheet held open between them, his head tipped up to it. */
export const HOLD = pose({ armRight: -125, foreRight: -20, armLeft: -130, foreLeft: -15, head: -6 })

/** The charge of the great slash: crouched, the nail drawn back behind him, the soul brightening on it. */
const CHARGE = pose({ thighRight: -30, shinRight: 40, thighLeft: 20, shinLeft: 40, rise: 5, armRight: 70, foreRight: -30, lean: -6, focus: 0.35 })
export const charge = (t: number): WandererPose => mix(GUARD, CHARGE, t)

/** The great slash out of the charge: the nail swept all the way round ahead of him, the crescent lit. */
const SWEPT = pose({ ...GUARD, armRight: -100, foreRight: -10, lean: 18, thighRight: -40, shinRight: 30, thighLeft: 30, shinLeft: 10 })
export const greatSlash = (t: number): WandererPose => ({ ...mix(CHARGE, SWEPT, ramp(t, 0, 0.35)), focus: 0.35 * (1 - ramp(t, 0, 0.2)), arc: bell(t, 0.05, 0.7) })

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

export type WandererJoints = RigJoints & { head: SVGElement | null; shadow: SVGElement | null; parts: [Part, SVGElement | null][] }

const part = (root: Element, name: string): SVGElement | null => root.querySelector<SVGElement>(`[data-part="${name}"]`)

/** His groups inside `root`, the group that holds one WandererSprite. */
export const wandererJoints = (root: Element): WandererJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  head: part(root, 'head'),
  shadow: part(root, 'shadow'),
  parts: PARTS.map((name) => [name, part(root, name)]),
})

// His shadow is gone once he is this high off the floor, in the scene's units.
const SHADOW_GONE = 60

/** Writes `p` on his groups, `lift` off the floor: the rig's limbs, then his head, his shadow and what shows
 *  beside him. Transforms and opacity only. */
export function setWandererPose(j: WandererJoints, p: WandererPose, lift = 0): void {
  setRigPose(j, p)
  fadeTo(j.shadow, 0.45 * Math.max(0, 1 - lift / SHADOW_GONE))
  // the head bows at the neck
  transformTo(j.head, `rotate(${p.head.toFixed(1)} 54 54)`)
  j.parts.forEach(([name, el]) => fadeTo(el, p[name]))
}
