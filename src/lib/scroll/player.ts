// Pure timing behind a section's scene player (useTheatre): a scene is a short script of one to three
// different actions that plays on time once its section arrives in view, each action eased and long enough
// to be read, then holds its end frame. It never steps per card and never scrubs with the scroll: the clock
// starts once and runs on, so a scene scrolled back to shows its end frame. Also the cross transition between
// stages: the next stage dissolves in over the one under it, so the screen never dips to dark. No DOM here.

import { clamp01 } from './progress'

/** The least time an action takes, so it can be seen. */
export const MIN_ACTION_MS = 1200

/** The most a whole scene takes. */
export const MAX_SCENE_MS = 5000

/** A scene plays at most this many actions. */
export const MAX_ACTIONS = 3

/** A scene's clock starts once its stage is this visible. */
export const ARRIVE_VIS = 0.6

/** Each action's wished length in ms, in order. */
export type SceneScript = readonly number[]

/** Where a scene is: the action playing, how far it has played (eased, 0 to 1), and whether the script is over. */
export interface Playhead {
  action: number
  t: number
  done: boolean
}

/** When the scene's clock started, in ms; null until it arrives. */
export interface SceneClock {
  startedAt: number | null
}

export const IDLE_CLOCK: SceneClock = { startedAt: null }

/** Ease in and out: slow out of rest, fastest at the middle, slow into the end. */
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * The script's lengths as played: at most MAX_ACTIONS, each at least MIN_ACTION_MS, and the time over the
 * minimum shared out so the whole scene fits in MAX_SCENE_MS.
 */
export function actionLengths(script: SceneScript): number[] {
  const kept = script.slice(0, MAX_ACTIONS)
  const extras = kept.map((ms) => Math.max(0, ms - MIN_ACTION_MS))
  const extra = extras.reduce((sum, ms) => sum + ms, 0)
  const budget = MAX_SCENE_MS - kept.length * MIN_ACTION_MS
  const share = extra > budget ? budget / extra : 1
  return extras.map((ms) => MIN_ACTION_MS + ms * share)
}

/** The scene's end frame: the last action done. */
export const sceneEnd = (script: SceneScript): Playhead => ({ action: Math.max(0, Math.min(script.length, MAX_ACTIONS) - 1), t: 1, done: true })

/** Where the scene is `elapsedMs` after it started. */
export function playheadAt(script: SceneScript, elapsedMs: number): Playhead {
  const lengths = actionLengths(script)
  let start = 0
  for (const [action, length] of lengths.entries()) {
    if (elapsedMs < start + length) return { action, t: easeInOut(clamp01((elapsedMs - start) / length)), done: false }
    start += length
  }
  return sceneEnd(script)
}

/** The clock once the stage is `vis` visible at `now`: started on arrival, never again. */
export const arrive = (clock: SceneClock, vis: number, now: number): SceneClock => (clock.startedAt === null && vis >= ARRIVE_VIS ? { startedAt: now } : clock)

/** How each stage is drawn in the cross transition, and the stage the page is in. */
export interface Cross {
  layers: Array<{ shown: boolean; opacity: number }>
  lead: number
}

/**
 * The stages in page order, each by how far it has risen (0 to 1): the last fully risen one is drawn whole
 * (the first stage counts as risen), the ones after it dissolve in over it, eased, and the ones under it are
 * hidden. The page is in the last stage at least half risen.
 */
export function crossOf(rises: readonly number[]): Cross {
  const base = rises.reduce((top, rise, i) => (rise >= 1 ? i : top), 0)
  const lead = rises.reduce((top, rise, i) => (rise >= 0.5 ? i : top), 0)
  const layers = rises.map((rise, i) => {
    if (i < base) return { shown: false, opacity: 0 }
    if (i === base) return { shown: true, opacity: 1 }
    return { shown: rise > 0, opacity: easeInOut(clamp01(rise)) }
  })
  return { layers, lead }
}
