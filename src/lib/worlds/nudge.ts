// The rules behind the worlds nudge: which worlds a visitor has seen and entered this visit, when the one
// time hint may show and where it may open, which world comes next in the tour, the order the picker lists
// the worlds in, and which palette tokens the launcher reads in. No DOM here; the useWorldsNudge hook is
// the thin adapter over storage, timers and scroll.
import { contrastRatio } from '@/lib/contrast'
import type { ThemeColors } from '@/themes/themes'

export const SEEN_STORAGE_KEY = 'portfolio-worlds-seen'
export const HINT_OFFERED_KEY = 'portfolio-worlds-hint-offered'
/** The worlds entered this visit (sessionStorage), the measure the hint and the picker are judged by. */
export const VISIT_STORAGE_KEY = 'portfolio-worlds-visit'

/**
 * The fixed tour the hint and the picker offer the worlds in: first the worlds that read most unlike each
 * other, then the rest. Holds every world id once (worldsNudge.test.ts checks it against themes.ts).
 */
export const TOUR_ORDER: readonly string[] = [
  'medieval-fantasy',
  'neon-portals',
  'survival-horror',
  'art-deco',
  'retro-rpg',
  'rubber-hose',
  'neon-cyber',
  'soul-map',
  'tropical-platformer',
  'bold-noir',
  'fighter-select',
  'cell-shaded',
  'mythic',
  'retro-atomic',
  'silhouette',
  'adventure-paths',
  'dark-fantasy',
  'era-postcards',
]

/** Set once the wardrobe's fan of outfits has played (sessionStorage), so it plays once per visit. */
export const WARDROBE_FAN_KEY = 'portfolio-worlds-wardrobe-fan'

/** How long the wardrobe's outfits stay fanned out of the plate, in and out included (BD26: under 5 s). */
export const WARDROBE_FAN_MS = 2750

/** The hint waits this long after the page opened, so it never interrupts the first read. */
export const HINT_MIN_MS = 20000

/** How long the open hint keeps checking that nothing slid or faded in under it, the QA window. */
export const HINT_WATCH_MS = 3000

const AAA_TEXT = 7
const BLACK = '#000000'
const WHITE = '#ffffff'

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const parseList = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** The stored list of seen worlds, cleaned to known ids, each once; anything unreadable is nothing seen. */
export function readSeen(raw: string | null, knownIds: readonly string[]): string[] {
  if (!raw) return []
  const parsed = parseList(raw)
  if (!isStringArray(parsed)) return []
  return [...new Set(parsed)].filter((id) => knownIds.includes(id))
}

export function markSeen(seen: string[], id: string): string[] {
  if (seen.includes(id)) return seen
  return [...seen, id]
}

export interface HintMoment {
  elapsedMs: number
  scrolledPx: number
  viewportPx: number
  /** The page's full height (document scrollHeight), to tell a page that cannot scroll a screen. */
  pageHeightPx: number
  offeredThisVisit: boolean
  pickerOpened: boolean
  seenCount: number
}

// A page shorter than two screens cannot scroll a full screen, so the read time alone stands for the scroll.
const scrollMet = ({ scrolledPx, viewportPx, pageHeightPx }: HintMoment): boolean =>
  scrolledPx >= viewportPx || pageHeightPx - viewportPx < viewportPx

/**
 * True once a first time visitor has read a while and scrolled a screen (or is on a page that cannot
 * scroll one), and never twice in a visit.
 */
export function mayOfferHint(moment: HintMoment): boolean {
  if (moment.offeredThisVisit || moment.pickerOpened) return false
  if (moment.seenCount > 1) return false
  if (moment.elapsedMs < HINT_MIN_MS) return false
  return scrollMet(moment)
}

/** A stored list of worlds with one more entered: unreadable lists start over, each world counts once. */
export function recordWorld(raw: string | null, id: string, knownIds: readonly string[]): string[] {
  return markSeen(readSeen(raw, knownIds), id)
}

/**
 * The world the hint and the picker offer next: the first world of the tour the visitor has not seen and is
 * not in now. Once every world was seen, the one after the current world in the tour, wrapping at the end.
 */
export function nextInTour(currentId: string, seen: readonly string[]): string {
  const unseen = TOUR_ORDER.find((id) => id !== currentId && !seen.includes(id))
  if (unseen) return unseen
  return TOUR_ORDER[(TOUR_ORDER.indexOf(currentId) + 1) % TOUR_ORDER.length]
}

// An id outside the tour stands just before its start, so next is the first world and previous the last.
const tourStep = (currentId: string, step: 1 | -1): string => {
  const at = TOUR_ORDER.indexOf(currentId)
  if (at === -1) return step === 1 ? TOUR_ORDER[0] : TOUR_ORDER[TOUR_ORDER.length - 1]
  return TOUR_ORDER[(at + step + TOUR_ORDER.length) % TOUR_ORDER.length]
}

/** The world after the current one in TOUR_ORDER, wrapping at the end: the wardrobe's next outfit. */
export const followingInTour = (currentId: string): string => tourStep(currentId, 1)

/** The world before the current one in TOUR_ORDER, wrapping at the start: the wardrobe's previous outfit. */
export const previousInTour = (currentId: string): string => tourStep(currentId, -1)

export type PickerMark = 'next' | 'unseen' | 'seen' | 'here'

export interface PickerEntry {
  id: string
  mark: PickerMark
}

/**
 * The picker's order: the next unseen world first (the up next card), the other unseen worlds, the seen
 * ones, and the world the visitor is in last. Each group keeps the tour order.
 */
export function orderForPicker(currentId: string, seen: readonly string[]): PickerEntry[] {
  const others = TOUR_ORDER.filter((id) => id !== currentId)
  const unseen = others.filter((id) => !seen.includes(id))
  const seenOthers = others.filter((id) => seen.includes(id))
  return [
    ...unseen.map((id, index): PickerEntry => ({ id, mark: index === 0 ? 'next' : 'unseen' })),
    ...seenOthers.map((id): PickerEntry => ({ id, mark: 'seen' })),
    { id: currentId, mark: 'here' },
  ]
}

/** A box on screen in viewport pixels, the shape getBoundingClientRect gives. */
export interface ScreenBox {
  left: number
  top: number
  right: number
  bottom: number
}

const hasArea = (box: ScreenBox): boolean => box.right > box.left && box.bottom > box.top

const overlaps = (a: ScreenBox, b: ScreenBox): boolean =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom

/** True when no text or control box shares any area with the hint's box; touching an edge is clear. */
export function coversNothing(box: ScreenBox, under: readonly ScreenBox[]): boolean {
  return !under.some((other) => hasArea(other) && overlaps(box, other))
}

/** The computed box and styles of an element, enough to tell whether its text is drawn at all. */
export interface HiddenProbe {
  width: number
  height: number
  overflow: string
  position: string
  clip: string
  clipPath: string
}

const CLIPPED_TO_NOTHING = 'rect(0px, 0px, 0px, 0px)'
const OUT_OF_FLOW = ['absolute', 'fixed']

/**
 * True for text kept for screen readers only (Tailwind sr-only and the common variants): a box of 1 by 1
 * px or less that clips its overflow, an absolute or fixed box clipped to nothing, or one clipped by
 * inset(50%). Nothing of it is drawn, so the hint may sit over it.
 */
export function isVisuallyHidden({ width, height, overflow, position, clip, clipPath }: HiddenProbe): boolean {
  if (width <= 1 && height <= 1 && overflow !== 'visible') return true
  if (OUT_OF_FLOW.includes(position) && clip === CLIPPED_TO_NOTHING) return true
  return clipPath === 'inset(50%)'
}

export type WatchVerdict = 'watch' | 'close' | 'done'

/**
 * The open hint's check, once per frame: done once HINT_WATCH_MS have passed since it opened, closed when
 * text or a control is under it before then, else watched another frame.
 */
export function hintWatch({ openedAtMs, nowMs, covered }: { openedAtMs: number; nowMs: number; covered: boolean }): WatchVerdict {
  if (nowMs - openedAtMs >= HINT_WATCH_MS) return 'done'
  if (covered) return 'close'
  return 'watch'
}

const readsAtAAA = (fill: string) => (color: string): boolean => contrastRatio(color, fill) >= AAA_TEXT

/**
 * The launcher and the hint sit on the world's own background. The label takes the first of accent,
 * highlight and text that reads at AAA on it; running text takes the text token, or the label colour
 * when the text token is too faint. The outer hairline is black or white, whichever is farther from the
 * fill, so the launcher's rings stay 3 to 1 apart from any page luminance behind them.
 */
export function launcherColors(colors: ThemeColors): { text: string; body: string; fill: string; edge: string } {
  const fill = colors.background
  const readable = readsAtAAA(fill)
  const text = [colors.accent, colors.highlight, colors.text].find(readable) ?? colors.text
  const body = readable(colors.text) ? colors.text : text
  const edge = contrastRatio(fill, BLACK) > contrastRatio(fill, WHITE) ? BLACK : WHITE
  return { text, body, fill, edge }
}
