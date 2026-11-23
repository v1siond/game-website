import { clamp01 } from './progress'
import { ramp } from './stage'

// The side-scroll camera of a theatre scene where the figure holds his place and the world moves under him,
// one obstacle per card of the section (the theatre's `reached`, fractional). Each card is a beat: a short
// connector run in which the floor scrolls one spacing to bring the card's obstacle under him, then the move
// itself, which holds its end once done. Scroll up runs the same frames back.

export interface Track {
  /** How far the floor has scrolled under him. */
  offset: number
  /** The card whose beat is playing. */
  at: number
  /** The connector run of that beat, 0 to 1. */
  run: number
  /** The move of that beat, 0 to 1, held at 1 once done. */
  act: number
}

/** The ease of the connector's scroll (a smoothstep), so a world can match a figure's stride to it. */
export const trackEase = (t: number): number => {
  const k = clamp01(t)
  return k * k * (3 - 2 * k)
}

/**
 * The beat `reached` cards in, of `count`, the obstacles `spacing` apart on the floor; `run` is the share of
 * each card the connector takes. At and past the last card it is the settled frame: the last move done.
 */
export function trackAt(reached: number, count: number, spacing: number, run = 0.3): Track {
  const at = Math.min(Math.max(0, Math.floor(reached)), count - 1)
  const into = Math.min(1, Math.max(0, reached - at))
  const running = clamp01(into / run)
  return { offset: spacing * (at + trackEase(running)), at, run: running, act: ramp(into, run, 1) }
}
