import { clamp01 } from '@/lib/scroll/progress'

// The arcs of a figure leaving the ground, as plain numbers over a move's own time t (0 to 1), for any
// world's pose functions on the shared rig: a jump's lift and a fall's distance. Outside 0 to 1 a jump is
// on the ground and a fall has not started or has landed, so a writer can hand them a move's raw time.

/** A jump's lift over t: 0 at take off and landing, `height` at the top, held near it a moment (the hang). */
export function hop(t: number, height: number): number {
  if (t <= 0 || t >= 1) return 0
  return height * (1 - (2 * t - 1) ** 4)
}

/** A fall's distance over t: from 0, speeding up, to `height` as it lands. */
export const drop = (t: number, height: number): number => height * clamp01(t) ** 2
