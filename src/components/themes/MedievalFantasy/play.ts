// How the realm's living loops play since BD29: each starts when its zone or section shows, has ended
// within PLAY_S of that, and holds its last frame. A cycle (a flame, a sway, a pulse) plays as many whole
// cycles as fit, so it rests on the frame it started from; one longer than PLAY_S plays once over PLAY_S.
// A stream of particles (rain, snow, wind) plays the first PLAY_S of its fall at its own pace, from where
// it starts, and holds there, a still of the storm.

export const PLAY_S = 5

// Seconds as a CSS time, rounded so a sum like 1.8 + 0.1 prints as 1.9s.
const secs = (seconds: number) => `${Number(seconds.toFixed(3))}s`

/** How many whole cycles of `seconds` fit in `room` seconds, one at least. */
export const cyclesIn = (seconds: number, room = PLAY_S) => Math.max(Math.floor(room / seconds), 1)

/** A looping keyframe as whole cycles that end within PLAY_S of the start, `delay` (s) waited first. */
export function cycles(name: string, seconds: number, timing: string, delay = 0): string {
  const room = PLAY_S - Math.max(delay, 0)
  const cycle = Math.min(seconds, room)
  return `${name} ${secs(cycle)} ${timing} ${cyclesIn(cycle, room)} forwards`
}

/** The first PLAY_S of a looping fall at its own pace, from `delay` (s, negative when already under way). */
export function slice(name: string, seconds: number, timing: string, delay = 0): string {
  return `${name} ${secs(seconds)} ${timing} ${((PLAY_S - delay) / seconds).toFixed(3)} forwards`
}
