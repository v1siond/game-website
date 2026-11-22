import { legFrom, restSpot, travelVars, type Spot } from '@/lib/motion/course'
import type { HeroFrame } from './side'

// A level scene's choreography as data: where he starts, the legs he runs or jumps one after another,
// and the spot he rests on. Each leg is a straight line or a jump arc from where the last one ended;
// the track's CSS (side.module.css) animates it from --from-* to --to-*. The course rules every legged world
// shares (the spot, where a leg starts, the rest spot, the travel variables) are src/lib/motion/course.ts;
// a spot's lift here is in px. No React here, so the rules are tested alone.

export interface Leg<P extends string = string> {
  pose: P
  frame: HeroFrame
  path: 'line' | 'arc'
  to: Spot
  ms: number
  ease?: string
  /** How far over the higher end a jump arc rises, in px. */
  peak?: number
}

export interface Course<P extends string = string> {
  start: Spot
  legs: readonly Leg<P>[]
  rest: { pose: P; frame: HeroFrame }
  /** One shot moves he plays from his rest spot, back to it. */
  moves?: readonly Leg<P>[]
}

/** What the track shows for a pose: the leg playing and where it starts, or the rest pose standing still. */
export interface Motion {
  pose: string
  frame: HeroFrame
  /** 'glide' eases to a new spot when the spot changes, for moves picked by the visitor. */
  path: 'line' | 'arc' | 'still' | 'glide'
  from: Spot
  to: Spot
  ms: number
  ease?: string
  peak?: number
}

export function motionOf(course: Course, pose: string): Motion {
  const index = course.legs.findIndex((leg) => leg.pose === pose)
  const rest = restSpot(course)
  if (index >= 0) return { ...course.legs[index], from: legFrom(course, index) }
  const move = course.moves?.find((leg) => leg.pose === pose)
  if (move) return { ...move, from: rest }
  return { pose, frame: course.rest.frame, path: 'still', from: rest, to: rest, ms: 0 }
}

/** One hop toward a target along a row of spots, the way he crosses platforms one at a time. */
export interface Hop {
  from: number
  at: number
}

export function hopToward(hop: Hop, target: number): Hop {
  if (hop.at === target) return { from: target, at: target }
  return { from: hop.at, at: hop.at + Math.sign(target - hop.at) }
}

/** The CSS variables the track reads for a motion (see side.module.css): the shared travel, the ease and the arc's peak. */
export function motionVars(motion: Motion): Record<string, string | number> {
  return { ...travelVars(motion), '--ease': motion.ease ?? 'linear', '--peak': motion.peak ?? 40 }
}
