import { ramp } from '@/lib/scroll/stage'

// A stand in for the shared section scene player (C55, src/lib/scroll/player.ts on c55-player) until it
// lands: the same playhead shape, played from the scroll instead of the clock. Removed when the player
// merges and the theatre hands each writer its playhead.

/** Each action's length in ms, in order. */
export type SceneScript = readonly number[]

/** The action playing, how far it has played (eased, 0 to 1), and whether the script is over. */
export interface Playhead {
  action: number
  t: number
  done: boolean
}

const easeInOut = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

export const sceneEnd = (script: SceneScript): Playhead => ({ action: Math.max(0, script.length - 1), t: 1, done: true })

/** Where the script is `elapsed` ms in. */
export function playheadAt(script: SceneScript, elapsed: number): Playhead {
  let start = 0
  for (const [action, length] of script.entries()) {
    if (elapsed < start + length) return { action, t: easeInOut(Math.max(0, (elapsed - start) / length)), done: false }
    start += length
  }
  return sceneEnd(script)
}

// The stand in plays the script over this stretch of the scene's scroll progress.
const STUB_FROM = 0.06
const STUB_TO = 0.36

/** The playhead the stand in reads off the scene's scroll progress. */
export const stubPlay = (script: SceneScript, progress: number): Playhead =>
  playheadAt(script, ramp(progress, STUB_FROM, STUB_TO) * script.reduce((sum, ms) => sum + ms, 0))
