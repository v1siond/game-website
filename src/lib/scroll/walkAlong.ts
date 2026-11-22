import { clamp01 } from './progress'
import { ramp } from './stage'

// A theatre hero walking a row of props, one per card of the section, driven by how many cards have been
// read (the theatre's `reached`, fractional): he acts at prop i when its card is half read and walks to the
// next one between, so he only ever goes forward as the scroll goes down and plays back on the way up.

export interface Along {
  /** Where his feet are. */
  x: number
  /** The prop he is at or walking on from. */
  at: number
  /** 1 midway between props, walking; 0 at one. */
  moving: number
  /** How far into his act at a prop he is, 0 to 1; 0 until he reaches the first prop. */
  act: number
}

/**
 * His place along the props `xs` with `reached` cards read, standing `offset` from each prop; before the
 * first card nears the line he waits `entry` short of the first prop and walks in as it does.
 */
export function walkAlong(xs: readonly number[], reached: number, offset: number, entry: number): Along {
  const last = xs.length - 1
  if (reached < 0.5) {
    const walkedIn = clamp01(reached / 0.5)
    return { x: xs[0] + offset - entry * (1 - walkedIn), at: 0, moving: Math.sin(Math.PI * walkedIn) * Math.min(1, reached * 8), act: ramp(reached, 0.3, 0.5) }
  }
  const along = Math.min(last, reached - 0.5)
  const at = Math.floor(along)
  const step = along - at
  const moving = at < last ? Math.sin(Math.PI * step) : 0
  return { x: xs[at] + (xs[Math.min(last, at + 1)] - xs[at]) * step + offset, at, moving, act: 1 - moving }
}
