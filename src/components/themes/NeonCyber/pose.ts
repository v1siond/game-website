import s from './merc.module.css'

// The merc posed by the scroll: every joint of his figure (merc.tsx) as a number, written as a transform
// on its group, each group turning round its own joint (the origins in merc.module.css). A scene blends
// two poses (the walk between props and its action at one) with `mix`, so every frame is a function of
// the scroll. The angles are the ones his CSS motions end on (walk, dash, scan, hack, drum, kick, sit,
// blades), so he looks the same as in the rig.

export interface MercPose {
  /** The body's rise in viewBox units (negative is up), its lean in degrees. */
  rise: number
  lean: number
  armRight: number
  foreRight: number
  armLeft: number
  foreLeft: number
  thighRight: number
  shinRight: number
  thighLeft: number
  shinLeft: number
  /** How far each knee comes toward the viewer on the front view stride, 0 to 1. */
  kneeRight: number
  kneeLeft: number
  /** 0 to 1: the mantis blades out, the reticle locked, the cable and deck out, the glyphs' climb. */
  blades: number
  reticle: number
  jack: number
  glyphs: number
}

export const STAND: MercPose = {
  rise: 0,
  lean: 0,
  armRight: 0,
  foreRight: 0,
  armLeft: 0,
  foreLeft: 0,
  thighRight: 0,
  shinRight: 0,
  thighLeft: 0,
  shinLeft: 0,
  kneeRight: 0,
  kneeLeft: 0,
  blades: 0,
  reticle: 0,
  jack: 0,
  glyphs: 0,
}

const KEYS = Object.keys(STAND) as Array<keyof MercPose>

/** The pose `t` of the way from `a` to `b`. */
export const mix = (a: MercPose, b: MercPose, t: number): MercPose =>
  Object.fromEntries(KEYS.map((key) => [key, a[key] + (b[key] - a[key]) * t])) as unknown as MercPose

const pose = (partial: Partial<MercPose>): MercPose => ({ ...STAND, ...partial })

/** The street stride at `phase` (one step per unit): a knee comes up and the other side's arm swings. */
export function walk(phase: number): MercPose {
  const right = Math.max(0, Math.sin(phase * Math.PI))
  const left = Math.max(0, -Math.sin(phase * Math.PI))
  return pose({ rise: -2 * Math.abs(Math.sin(phase * Math.PI)), kneeRight: right, kneeLeft: left, shinRight: -7 * right, shinLeft: 7 * left, armLeft: 8 * right, armRight: -8 * left })
}

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

// The group of each joint, found once per stage by its class in merc.module.css.
const JOINTS = {
  body: s.body,
  armRight: s.armRight,
  foreRight: s.foreRight,
  armLeft: s.armLeft,
  foreLeft: s.foreLeft,
  thighRight: s.thighRight,
  shinRight: s.shinRight,
  thighLeft: s.thighLeft,
  shinLeft: s.shinLeft,
  bladeRight: s.bladeRight,
  bladeLeft: s.bladeLeft,
  reticle: s.reticle,
  jack: s.jack,
  glyphs: s.glyphs,
} as const

export type MercJoints = { [Name in keyof typeof JOINTS]: SVGElement | null }

/** His joints inside `root`, the group that holds one MercFigure. */
export const mercJoints = (root: Element): MercJoints =>
  Object.fromEntries(Object.entries(JOINTS).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as MercJoints

const write = (el: SVGElement | null, transform: string, opacity?: number): void => {
  if (!el) return
  el.style.transform = transform
  if (opacity !== undefined) el.style.opacity = opacity.toFixed(3)
}

const turn = (deg: number): string => `rotate(${deg.toFixed(1)}deg)`

/** Writes `p` on his joints: transforms and opacity only. */
export function setMercPose(j: MercJoints, p: MercPose): void {
  write(j.body, `translateY(${p.rise.toFixed(2)}px) rotate(${p.lean.toFixed(1)}deg)`)
  write(j.armRight, turn(p.armRight))
  write(j.foreRight, turn(p.foreRight))
  write(j.armLeft, turn(p.armLeft))
  write(j.foreLeft, turn(p.foreLeft))
  write(j.thighRight, `${turn(p.thighRight)} scaleY(${(1 - 0.18 * p.kneeRight).toFixed(3)})`)
  write(j.thighLeft, `${turn(p.thighLeft)} scaleY(${(1 - 0.18 * p.kneeLeft).toFixed(3)})`)
  write(j.shinRight, `${turn(p.shinRight)} scaleY(${(1 - 0.08 * p.kneeRight).toFixed(3)})`)
  write(j.shinLeft, `${turn(p.shinLeft)} scaleY(${(1 - 0.08 * p.kneeLeft).toFixed(3)})`)
  const blade = `scale(${(0.2 + 0.8 * p.blades).toFixed(3)})`
  write(j.bladeRight, blade, p.blades)
  write(j.bladeLeft, blade, p.blades)
  write(j.reticle, 'none', p.reticle)
  write(j.jack, 'none', p.jack)
  write(j.glyphs, `translateY(${(6 - 16 * p.glyphs).toFixed(2)}px)`)
}
