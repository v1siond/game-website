// Pure timing behind a section's scene player (useTheatre): a scene is a short script of one to three
// different actions, each eased and long enough to be read, played by the scroll the way the Rockstar VI
// site plays its scenes: scrolling down plays it forward, scrolling up plays it back, every pass plays it
// again and nothing moves while the scroll rests. The scroll sets where the scene should be; the drawn scene
// follows it at no more than the scene's own speed, easing out of rest and into its stop like the settle, so
// a small flick never races a long action (his 11-23 words, C55: "controlled speed of animations, similar to
// the smooth scroll effect, but applied to the animations"). Also the cross transition between stages: the
// next stage dissolves in over the one under it, so the screen never dips to dark. No DOM here.

import { clamp01 } from './progress'
import { FIRST_FRAME_MS, SETTLE_TAU_MS } from './stage'

/** The least time an action takes, so it can be seen. */
export const MIN_ACTION_MS = 1200

/** The most a whole scene takes. */
export const MAX_SCENE_MS = 5000

/** A scene plays at most this many actions. */
export const MAX_ACTIONS = 3

/** Each action's wished length in ms, in order. */
export type SceneScript = readonly number[]

/** Where a scene is: the action playing, how far it has played (eased, 0 to 1), and whether the script is over. */
export interface Playhead {
  action: number
  t: number
  done: boolean
}

/** Ease in and out: slow out of rest, fastest at the middle, slow into the end. */
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

// Each script's lengths, worked out once: a script is a constant of its scene, asked for every frame.
const LENGTHS = new WeakMap<SceneScript, readonly number[]>()

/**
 * The script's lengths as played: at most MAX_ACTIONS, each at least MIN_ACTION_MS, and the time over the
 * minimum shared out so the whole scene fits in MAX_SCENE_MS.
 */
export function actionLengths(script: SceneScript): readonly number[] {
  const known = LENGTHS.get(script)
  if (known) return known
  const kept = script.slice(0, MAX_ACTIONS)
  const extras = kept.map((ms) => Math.max(0, ms - MIN_ACTION_MS))
  const extra = extras.reduce((sum, ms) => sum + ms, 0)
  const budget = MAX_SCENE_MS - kept.length * MIN_ACTION_MS
  const share = extra > budget ? budget / extra : 1
  const lengths = extras.map((ms) => MIN_ACTION_MS + ms * share)
  LENGTHS.set(script, lengths)
  return lengths
}

/** The scene's end frame: the last action done. */
export const sceneEnd = (script: SceneScript): Playhead => ({ action: Math.max(0, Math.min(script.length, MAX_ACTIONS) - 1), t: 1, done: true })

/** Where a scene rests: its end frame, the one reduced motion, a settled stage and a scroll back show; a scene
 *  with no script has one frame, done. */
export const restingPlay = (script: SceneScript | undefined): Playhead => sceneEnd(script ?? [])

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

/** The time before the ease: the t that easeInOut turns into `eased`. */
const uneased = (eased: number): number => (eased < 0.5 ? Math.cbrt(eased / 4) : 1 - Math.cbrt(2 * (1 - eased)) / 2)

/** How long the scene has played at `play`, in ms: the even clock behind the eased playhead, for a thing that moves at a steady pace. */
export function elapsedOf(script: SceneScript, { action, t }: Playhead): number {
  const lengths = actionLengths(script)
  const before = lengths.slice(0, action).reduce((sum, ms) => sum + ms, 0)
  return before + uneased(t) * lengths[action]
}

/** How long the whole scene plays, in ms. */
export const sceneLength = (script: SceneScript): number => actionLengths(script).reduce((sum, ms) => sum + ms, 0)

/** How each stage is drawn in the cross transition, and the stage the page is in. */
export interface Cross {
  layers: Array<{ shown: boolean; opacity: number }>
  lead: number
}

/** Which way the page is going: down the page plays the scenes on, up plays them back. */
export type Heading = 'down' | 'up'

// The page turns once the scroll has travelled this many px back from the furthest point it reached, so a
// touch rubber band or a 2 px wheel reversal in the middle of a dissolve does not cut the stage coming in,
// and a slow climb, however slow, turns all the same.
const TURN_PX = 8

/** The way the page is going and the furthest point the scroll has reached going that way. */
export interface Way {
  heading: Heading
  mark: number
}

/** The way the page is going once the scroll is at `position`: from the scroll's travel since its last turn,
 *  not from how far the drawing lags behind, so a scroll up too slow to build a lag still cuts on the way back.
 *  The page starts going down. */
export function wayOf(position: number, was: Way | null): Way {
  if (!was) return { heading: 'down', mark: position }
  const down = was.heading === 'down'
  const further = down ? position > was.mark : position < was.mark
  if (further) return { heading: was.heading, mark: position }
  if (Math.abs(position - was.mark) > TURN_PX) return { heading: down ? 'up' : 'down', mark: position }
  return was
}

/**
 * The stages in page order, each by how far it has risen (0 to 1): the last fully risen one is drawn whole
 * (the first stage counts as risen). On the way down the ones after it dissolve in over it, eased, so the
 * screen never dips to dark; on the way back the page cuts to it and the stage it leaves is gone at once, so
 * two scenes and their casts are never left one over the other (his 11-24 words). The ones under it are
 * hidden. The page is in the last stage at least half risen, or on the way back in the one it returns to.
 */
export function crossOf(rises: readonly number[], heading: Heading = 'down'): Cross {
  const base = rises.reduce((top, rise, i) => (rise >= 1 ? i : top), 0)
  const layers = rises.map((rise, i) => {
    if (i < base) return { shown: false, opacity: 0 }
    if (i === base) return { shown: true, opacity: 1 }
    if (heading === 'up') return { shown: false, opacity: 0 }
    return { shown: rise > 0, opacity: easeInOut(clamp01(rise)) }
  })
  if (heading === 'up') return { layers, lead: base }
  return { layers, lead: rises.reduce((top, rise, i) => (rise >= 0.5 ? i : top), 0) }
}

/** Where the drawn scene is (ms into it), how fast it moves (ms of scene per ms), and the time of its last frame. */
export interface Follower {
  drawn: number
  speed: number
  at: number | null
}

export const IDLE_FOLLOWER: Follower = { drawn: 0, speed: 0, at: null }

/** A scene at rest where the scroll puts it (`progress` 0 to 1 of the scroll that plays it): a stage out of
 *  view, or one the scroll flew past, is drawn at that frame with no catch up; only the stage the page is in
 *  plays at its own pace. */
export const restAt = (script: SceneScript, progress: number, now: number): Follower => ({ drawn: clamp01(progress) * sceneLength(script), speed: 0, at: now })

/** The drawn scene never runs faster than the scene itself: one ms of it per ms. */
const MAX_SPEED = 1
// The speed eases toward the one wanted over this time constant, so the scene eases out of rest.
const SPEED_TAU_MS = 90
// Within this many ms of scene the drawing snaps to where the scroll says and rests.
const REST_MS = 1
// A frame after a long pause (a hidden tab) counts as this many ms at most.
const MAX_FRAME_MS = 100

/**
 * One frame of the scene following the scroll: `progress` (0 to 1 over the scroll that plays the scene) sets
 * where the scene should be; the speed wanted is the way left over the settle's time constant, capped at the
 * scene's own speed, and the speed eases toward it, so the drawn scene eases out of rest, runs no faster than
 * the scene, slows into its stop and never passes it, forward or back. `playing` asks for the next frame
 * until it rests where the scroll says.
 */
export function follow(follower: Follower, script: SceneScript, progress: number, now: number): { follower: Follower; play: Playhead; playing: boolean } {
  const target = clamp01(progress) * sceneLength(script)
  const dt = follower.at === null ? FIRST_FRAME_MS : Math.min(MAX_FRAME_MS, Math.max(0, now - follower.at))
  const gap = target - follower.drawn
  if (Math.abs(gap) < REST_MS) return { follower: { drawn: target, speed: 0, at: now }, play: playheadAt(script, target), playing: false }
  const wanted = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, gap / SETTLE_TAU_MS))
  const speed = follower.speed + (wanted - follower.speed) * (1 - Math.exp(-dt / SPEED_TAU_MS))
  const step = speed * dt
  const passed = Math.sign(gap) !== Math.sign(gap - step)
  const drawn = passed ? target : follower.drawn + step
  return { follower: { drawn, speed: passed ? 0 : speed, at: now }, play: playheadAt(script, drawn), playing: !passed }
}

/** A stage's scene drawn and whether it still plays. */
export interface StagePlay {
  /** The leading stage's follower; none for every other stage, which rests where the scroll puts it. */
  follower: Follower | null
  play: Playhead
  playing: boolean
}

/**
 * One frame of a stage's scene at the scroll's `played` share of it. The stage the page is in (`lead`) plays
 * at its own pace from its follower; a stage just bound, or just become the lead, has none and starts at rest
 * where the scroll puts it, so a rebind (a profession switch) never replays the scene from its start. Every
 * other stage is drawn where the scroll puts it and keeps no follower, so none plays catching up under or over
 * another.
 */
export function stagePlay(follower: Follower | null, script: SceneScript | undefined, played: number, now: number, lead: boolean): StagePlay {
  if (!script) return { follower: null, play: restingPlay(undefined), playing: false }
  if (!lead) return { follower: null, play: playheadAt(script, clamp01(played) * sceneLength(script)), playing: false }
  return follow(follower ?? restAt(script, played, now), script, played, now)
}

/** A move the scroll plays by itself (a prop's move as the camera passes it), by its key. */
export interface PacedMove {
  key: string
  /** Where the scroll puts the move, 0 to 1. */
  target: number
  /** Close enough to be seen playing; further off it rests where the scroll puts it. */
  near: boolean
}

/**
 * One frame of the moves in view, each played at the shared player's pace: a move held from the frame before
 * and near follows the scroll; a move first seen or far off rests where the scroll puts it. Only the moves
 * given are kept, so a move left in mid play (its room left, the hub, reduced motion) is forgotten and rests
 * when seen again, and with no move in view nothing asks for a frame.
 */
export function pacedMoves(held: ReadonlyMap<string, Follower>, moves: readonly PacedMove[], script: SceneScript, now: number): { followers: Map<string, Follower>; phases: number[]; playing: boolean } {
  const followers = new Map<string, Follower>()
  const length = sceneLength(script)
  let playing = false
  const phases = moves.map(({ key, target, near }) => {
    const was = held.get(key)
    if (!was || !near) {
      followers.set(key, restAt(script, target, now))
      return target
    }
    const step = follow(was, script, target, now)
    followers.set(key, step.follower)
    playing ||= step.playing
    return step.follower.drawn / length
  })
  return { followers, phases, playing }
}
