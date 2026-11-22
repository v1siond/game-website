import { turnAbout, type Point } from './turnAbout'

// The pose of a jointed hero as numbers, the math the theatre worlds share (the DOM writer is
// src/components/themes/shared/rig.ts): each limb's turn at its joint, the body's rise and lean, and how far
// each knee comes toward the viewer on a front view stride. A scene blends two poses with `mix` (the walk
// between props and its act at one), so every frame is a function of the scroll. A world adds its own
// numbers (blades, a reticle) to the pose; `mix` carries them too.

export const LIMBS = ['armRight', 'foreRight', 'armLeft', 'foreLeft', 'thighRight', 'shinRight', 'thighLeft', 'shinLeft'] as const

export type Limb = (typeof LIMBS)[number]

/** Each limb's turn in degrees; the body's rise in viewBox units (negative is up) and lean in degrees; how
 *  far each knee comes toward the viewer, 0 to 1. */
export type RigPose = Record<Limb, number> & { rise: number; lean: number; kneeRight: number; kneeLeft: number }

export const STAND: RigPose = {
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
}

/** The pose `t` of the way from `a` to `b`, over every number the poses carry. */
export function mix<Pose extends RigPose>(a: Pose, b: Pose, t: number): Pose {
  const from = a as unknown as Record<string, number>
  const to = b as unknown as Record<string, number>
  return Object.fromEntries(Object.keys(from).map((key) => [key, from[key] + (to[key] - from[key]) * t])) as unknown as Pose
}

/** Which way a figure faces: 1 right, -1 left, 0 toward the viewer. */
export type Facing = 1 | -1 | 0

// How far a thigh swings either side of straight down on a profile step, and how far the swinging shin folds back.
const STEP_DEG = 25
const FOLD_DEG = 30

/** The front view stride: a knee comes up toward the viewer, the other side's arm swings. */
function frontStride(phase: number): RigPose {
  const swing = Math.sin(phase * Math.PI)
  const right = Math.max(0, swing)
  const left = Math.max(0, -swing)
  return { ...STAND, rise: -2 * Math.abs(swing), kneeRight: right, kneeLeft: left, shinRight: -7 * right, shinLeft: 7 * left, armLeft: 8 * right, armRight: -8 * left }
}

/** The profile stride: one leg swings from behind him to ahead of him, the way he faces, while the planted
 *  one slides back under him; the legs trade every unit of phase, the arms swing against them. */
function profileStride(phase: number, facing: 1 | -1): RigPose {
  const cycle = ((phase % 2) + 2) % 2
  const t = cycle % 1
  // a positive turn is clockwise on screen, which carries a hanging foot to the left
  const swinging = facing * STEP_DEG * Math.cos(Math.PI * t)
  const fold = facing * FOLD_DEG * Math.sin(Math.PI * t)
  const right = cycle < 1
  const thighRight = right ? swinging : -swinging
  const thighLeft = right ? -swinging : swinging
  return {
    ...STAND,
    rise: -2 * Math.sin(Math.PI * t),
    thighRight,
    thighLeft,
    shinRight: right ? fold : 0,
    shinLeft: right ? 0 : fold,
    armRight: -0.6 * thighRight,
    armLeft: -0.6 * thighLeft,
  }
}

/** The stride at `phase` (one step per unit, the phase rising as he goes on), facing the viewer or in profile. */
export const walk = (phase: number, facing: Facing = 0): RigPose => (facing === 0 ? frontStride(phase) : profileStride(phase, facing))

/** An arm's joints and the hand as drawn, in the figure's viewBox units. */
export interface ArmPivots {
  shoulder: Point
  elbow: Point
  hand: Point
}

/** A leg's joints and the foot as drawn, in the figure's viewBox units. */
export interface LegPivots {
  hip: Point
  knee: Point
  foot: Point
}

/** Where the foot ends up with the thigh turned `thigh` degrees at the hip and the shin `shin` at the knee. */
export const footAt = ({ hip, knee, foot }: LegPivots, thigh: number, shin: number): [number, number] => turnAbout(turnAbout(foot, shin, knee), thigh, hip)

/** Where the hand ends up with the upper arm turned `arm` degrees at the shoulder and the forearm `fore` at
 *  the elbow: the forearm turns first about the elbow, then the whole arm about the shoulder. */
export const handAt = ({ shoulder, elbow, hand }: ArmPivots, arm: number, fore: number): [number, number] =>
  turnAbout(turnAbout(hand, fore, elbow), arm, shoulder)
