import type { Limb, RigPose } from '@/lib/motion/rigPose'

// The writer of a jointed theatre hero (the pose math is src/lib/motion/rigPose.ts): his groups, found once
// by the world's css module classes, and a pose written on them per frame. Each group turns round the
// transform-origin the world's css gives it, so the writer sets the style transform: a world's css puts its
// kit's resting turns on the same groups as a css transform (a guard, sticks up), which would override an
// SVG transform attribute, while the inline style wins over both. Transforms only.

/** The world's css module class of each group: the body and every limb. */
export type RigClasses = Record<Limb | 'body', string>

export type RigJoints = Record<Limb | 'body', SVGElement | null>

/** His groups inside `root`, found once by the world's classes; a group the figure does not draw is null. */
export const rigJoints = (root: Element, classes: RigClasses): RigJoints =>
  Object.fromEntries(Object.entries(classes).map(([name, className]) => [name, root.querySelector<SVGElement>(`.${className}`)])) as RigJoints

const turn = (deg: number): string => `rotate(${deg.toFixed(1)}deg)`

/** A group the writers move: an SVG group or an HTML box, written through its inline style. */
type Part = SVGElement | HTMLElement | null

/** Writes a css transform on a group, for a turn and a move the plain writers below do not cover. */
export const transformStyleTo = (el: Part, transform: string): void => {
  if (el) el.style.transform = transform
}

const write = transformStyleTo

/** Turns a group `deg` degrees round its css transform-origin. */
export const rotateTo = (el: Part, deg: number): void => write(el, turn(deg))

/** Shows a group at an opacity from 0 to 1. */
export const opacityTo = (el: Part, opacity: number): void => {
  if (el) el.style.opacity = opacity.toFixed(3)
}

/** Writes `p` on his groups. A knee coming toward the viewer foreshortens its thigh and shin. */
export function setRigPose(j: RigJoints, p: RigPose): void {
  write(j.body, `translateY(${p.rise.toFixed(2)}px) rotate(${p.lean.toFixed(1)}deg)`)
  write(j.armRight, turn(p.armRight))
  write(j.foreRight, turn(p.foreRight))
  write(j.armLeft, turn(p.armLeft))
  write(j.foreLeft, turn(p.foreLeft))
  write(j.thighRight, `${turn(p.thighRight)} scaleY(${(1 - 0.18 * p.kneeRight).toFixed(3)})`)
  write(j.thighLeft, `${turn(p.thighLeft)} scaleY(${(1 - 0.18 * p.kneeLeft).toFixed(3)})`)
  write(j.shinRight, `${turn(p.shinRight)} scaleY(${(1 - 0.08 * p.kneeRight).toFixed(3)})`)
  write(j.shinLeft, `${turn(p.shinLeft)} scaleY(${(1 - 0.08 * p.kneeLeft).toFixed(3)})`)
}
