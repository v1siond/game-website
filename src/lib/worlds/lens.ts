// The rules behind the launcher's turned face and the lens: which face the corner button shows (the world
// count, the one time turn, or him in the next world), and where the lens finds its still and his figure in
// it. No DOM here; the useWorldsNudge hook and WorldLens are the thin adapters over storage, observers and
// pointer events.
/** The face turn: 0.3 s over, 2 s lifted, 0.3 s settled, once per visit. Every moment ends inside 5 s. */
export const FACE_TURN_MS = 2600

/** The face turn played this visit (sessionStorage), so it never plays twice. */
export const FACE_TURNED_KEY = 'portfolio-worlds-face-turned'

/** The widths the capture takes each hero's lens still at, the wide one first. */
export const LENS_WIDTHS = [1440, 390] as const

export type LensWidth = (typeof LENS_WIDTHS)[number]

// The viewport heights the stills are taken at (scripts/capture-world-previews.mjs uses the same pairs).
export const STILL_HEIGHT: Record<LensWidth, number> = { 1440: 900, 390: 844 }

// With no figure found, the lens looks at the middle of the hero's upper part, where every hero names him.
const FALLBACK_DEPTH = 0.4

/**
 * Where the page's hero stands against the screen: 'in' view, scrolled 'out' (or a page with no hero), or
 * 'unknown' while the page has not yet said (a world still loading its chunk).
 */
export type HeroView = 'in' | 'out' | 'unknown'

export type LauncherFace = 'count' | 'turn' | 'face'

export interface FaceMoment {
  hero: HeroView
  /** The C31 hint card is open under the launcher; the first turn waits for it to close, so the two never meet. */
  hintOpen: boolean
  turnedThisVisit: boolean
  /** The turn started and its FACE_TURN_MS have not passed yet. */
  turning: boolean
}

/**
 * The launcher's face: the world count while the hero is in view (or not yet known), the turn the first time
 * the hero leaves the screen with the hint not open, and him in the next world after.
 */
export function launcherFace(moment: FaceMoment): LauncherFace {
  if (moment.hero !== 'out') return 'count'
  if (moment.turning) return 'turn'
  if (moment.turnedThisVisit) return 'face'
  if (moment.hintOpen) return 'count'
  return 'turn'
}

/** The lens still of a world's hero, taken at 1440 px for a wide screen and 390 px for a phone. */
export function lensStill(id: string, wide: boolean): string {
  const width: LensWidth = wide ? 1440 : 390
  return `/world-previews/${id}-${width}.webp`
}

/** His figure in a world, cropped by the capture, the turned face's portrait. */
export const portraitOf = (id: string): string => `/world-previews/portraits/${id}.webp`

export interface LensPoint {
  x: number
  y: number
}

const isPair = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length === 2 && value.every((n) => typeof n === 'number' && Number.isFinite(n))

const entryOf = (focus: unknown, id: string, width: LensWidth): unknown => {
  if (!focus || typeof focus !== 'object') return null
  const world = (focus as Record<string, unknown>)[id]
  if (!world || typeof world !== 'object') return null
  return (world as Record<string, unknown>)[width]
}

const fallbackPoint = (width: LensWidth): LensPoint => ({
  x: width / 2,
  y: Math.round(STILL_HEIGHT[width] * FALLBACK_DEPTH),
})

/**
 * The point of a still the lens centres on: the centre of his figure as the capture measured it
 * (public/world-previews/focus.json, `{ id: { 1440: [x, y], 390: [x, y] } }`), else the middle of the
 * hero's upper part. Anything unreadable falls to that middle.
 */
export function lensFocus(focus: unknown, id: string, width: LensWidth): LensPoint {
  const entry = entryOf(focus, id, width)
  if (!isPair(entry)) return fallbackPoint(width)
  return { x: entry[0], y: entry[1] }
}
