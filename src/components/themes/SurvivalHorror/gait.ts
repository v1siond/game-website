// Leg math for the rig (./rig): where a foot lands for a pair of hip and knee turns, the turns that put a
// foot on a point, a stepping pose placed by its soles, a gait's stride, how far a figure drops so its lowest
// foot stands on the floor, and how many steps a walk takes for its distance. Same convention as the rig: viewBox units, y down, a bone drawn hanging straight
// down from its pivot, a positive turn clockwise on screen, figures facing right.

import type { Point } from '@/lib/motion/turnAbout'

export type { Point }
export type LegTurn = readonly [number, number]

/** A figure's walk or run: four keys a cycle (contact, passing, contact, passing) and how far a step goes. */
export interface Gait<Name extends string> {
  cycle: readonly [Name, Name, Name, Name]
  stride: number
}

export interface Leg {
  hip: Point
  thigh: number
  shin: number
}

const RAD = Math.PI / 180

/** Where a bone of `length` turned by `degrees` ends, from its pivot: (0, length) rotated clockwise. */
const boneEnd = (from: Point, length: number, degrees: number): Point => [from[0] - length * Math.sin(degrees * RAD), from[1] + length * Math.cos(degrees * RAD)]

/** The ankle for a hip turn and a knee turn (the knee turn is relative to the thigh). */
export function footAt(leg: Leg, [hipTurn, kneeTurn]: LegTurn): Point {
  const knee = boneEnd(leg.hip, leg.thigh, hipTurn)
  return boneEnd(knee, leg.shin, hipTurn + kneeTurn)
}

const clampUnit = (value: number) => Math.min(1, Math.max(-1, value))

/**
 * The hip and knee turns that put the ankle on `foot`, the knee bent forward (a positive knee turn), as
 * a facing-right figure's knee bends. A point out of reach gets the leg straight and pointing at it.
 */
export function turnFor(leg: Leg, foot: Point): LegTurn {
  const dx = foot[0] - leg.hip[0]
  const dy = foot[1] - leg.hip[1]
  const reach = Math.min(Math.hypot(dx, dy), leg.thigh + leg.shin)
  const toFoot = Math.atan2(-dx, dy) / RAD
  const atHip = Math.acos(clampUnit((leg.thigh ** 2 + reach ** 2 - leg.shin ** 2) / (2 * leg.thigh * reach))) / RAD
  const atKnee = Math.acos(clampUnit((leg.thigh ** 2 + leg.shin ** 2 - reach ** 2) / (2 * leg.thigh * leg.shin))) / RAD
  return [toFoot - atHip, 180 - atKnee]
}

/** A figure's two legs, each from its hip. */
export interface Legs {
  back: Leg
  front: Leg
}

/** The leg turns of a pose, the part of it the gait math reads. */
export interface LegRow {
  backLeg: LegTurn
  frontLeg: LegTurn
}

const tenth = (value: number) => Math.round(value * 10) / 10

/**
 * A figure's stepping pose from where its soles are: each sole's point (on the floor, or above it when
 * lifted) and how far the figure is lowered. The turns come from turnFor, so a planted sole is on the floor
 * exactly and a knee always bends forward; they are rounded to a tenth of a degree.
 */
export const feetFor =
  (legs: Legs) =>
  (drop: number, back: Point, front: Point): LegRow & { drop: number } => {
    const turn = (leg: Leg, sole: Point): LegTurn => {
      const [hip, knee] = turnFor(leg, [sole[0], sole[1] - drop])
      return [tenth(hip), tenth(knee)]
    }
    return { drop, backLeg: turn(legs.back, back), frontLeg: turn(legs.front, front) }
  }

/**
 * A figure's gaits from its poses: a cycle's stride is how far both soles sweep, on average, from its first
 * contact to its second, in the stage's units (`toStage` turns a length of the figure's viewBox into them).
 */
export const gaitFor =
  <Name extends string>(legs: Legs, poses: Record<Name, LegRow>, toStage: (length: number) => number) =>
  (cycle: Gait<Name>['cycle']): Gait<Name> => {
    const from = poses[cycle[0]]
    const to = poses[cycle[2]]
    const sweep = (sweepOf(legs.back, from.backLeg, to.backLeg) + sweepOf(legs.front, from.frontLeg, to.frontLeg)) / 2
    return { cycle, stride: toStage(sweep) }
  }

/** How far to lower the figure (viewBox units, negative raises it) so its lowest foot is on `floor`. */
export function plantedDrop(floor: number, legs: ReadonlyArray<readonly [Leg, LegTurn]>): number {
  return floor - Math.max(...legs.map(([leg, turn]) => footAt(leg, turn)[1]))
}

/** How far a planted sole moves under the figure from one contact pose to the next: one step's travel. */
export function sweepOf(leg: Leg, from: LegTurn, to: LegTurn): number {
  return Math.abs(footAt(leg, to)[0] - footAt(leg, from)[0])
}

/** The whole steps a walk of `distance` takes at `stride` a step, at least one. */
export function stepsFor(distance: number, stride: number): number {
  return Math.max(1, Math.round(Math.abs(distance) / stride))
}
