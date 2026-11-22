// How a world's living loops play since BD29: each starts when its zone or section shows, has ended within
// PLAY_S of that, and holds its last frame. A cycle (a flame, a sway, a pulse) plays as many whole cycles as
// fit, so it rests on the frame it started from (an alternate one in there and back pairs, swings); one longer than the time left plays once over that time,
// which also caps a delay that grows with an item's place in a row, unless less than half its cycle is left,
// when it rests on its start frame. A stream of particles (rain, snow,
// motes) plays the first PLAY_S of its fall at its own pace, from where it starts, and holds there, a still
// of the storm. Medieval Fantasy and Dark Fantasy write their loops inline, so they read the shorthand here.

import { STORY_MS } from '@/lib/motion/stepWithin'

// The story budget in seconds, for CSS times; STORY_MS owns the value.
export const PLAY_S = STORY_MS / 1000

// Seconds as a CSS time, rounded so a sum like 1.8 + 0.1 prints as 1.9s.
const secs = (seconds: number) => `${Number(seconds.toFixed(3))}s`

/** How many whole cycles of `seconds` fit in `room` seconds, one at least. */
export const cyclesIn = (seconds: number, room = PLAY_S) => Math.max(Math.floor(room / seconds), 1)

// A cycle squeezed past twice its pace reads as a twitch, so a loop with less room than this share of its own
// cycle does not play: a count of 0 with `forwards` holds its 0% keyframe, the frame it would rest on.
const MIN_PACE = 0.5

/** A looping keyframe as whole cycles that end within PLAY_S of the start, `delay` (s) waited first, so it
 *  rests on its 0% frame. */
export function cycles(name: string, seconds: number, timing: string, delay = 0): string {
  const room = PLAY_S - Math.max(delay, 0)
  if (room < seconds * MIN_PACE) return `${name} ${secs(seconds)} ${timing} 0 forwards`
  const cycle = Math.min(seconds, room)
  return `${name} ${secs(cycle)} ${timing} ${cyclesIn(cycle, room)} forwards`
}

/** An `alternate` loop as whole there and back pairs that end within PLAY_S of the start, `delay` (s) waited
 *  first, so it rests where it started: an odd count would hold its far keyframe. */
export function swings(name: string, seconds: number, timing: string, delay = 0): string {
  const room = PLAY_S - Math.max(delay, 0)
  return `${name} ${secs(seconds)} ${timing} alternate ${2 * cyclesIn(2 * seconds, room)} forwards`
}

/** How many falls of `seconds` the first PLAY_S plays from `delay` (s, negative when already under way), at
 *  most `most`, rounded down to a thousandth of a fall so it never runs past PLAY_S. */
export const sliceCount = (seconds: number, delay = 0, most = Infinity) =>
  Math.min(Math.floor(((PLAY_S - delay) / seconds) * 1000) / 1000, most)

/** The first PLAY_S of a looping fall at its own pace, from `delay` (s, negative when already under way). */
export function slice(name: string, seconds: number, timing: string, delay = 0): string {
  return `${name} ${secs(seconds)} ${timing} ${sliceCount(seconds, delay)} forwards`
}
