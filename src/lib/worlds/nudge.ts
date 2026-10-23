// The rules behind the worlds nudge: which worlds a visitor has seen, when the one time hint may show,
// which world "Next world" opens, and which palette tokens the launcher reads in. No DOM here; the
// useWorldsNudge hook is the thin adapter over storage, timers and scroll.
import { contrastRatio } from '@/lib/contrast'
import type { ThemeColors } from '@/themes/themes'

export const SEEN_STORAGE_KEY = 'portfolio-worlds-seen'
export const HINT_OFFERED_KEY = 'portfolio-worlds-hint-offered'

/** The hint waits this long after the page opened, so it never interrupts the first read. */
export const HINT_MIN_MS = 20000

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
  offeredThisVisit: boolean
  pickerOpened: boolean
  seenCount: number
}

/** True once a first time visitor has read a while and scrolled a screen, and never twice in a visit. */
export function mayOfferHint(moment: HintMoment): boolean {
  if (moment.offeredThisVisit || moment.pickerOpened) return false
  if (moment.seenCount > 1) return false
  if (moment.elapsedMs < HINT_MIN_MS) return false
  return moment.scrolledPx >= moment.viewportPx
}

/** A random world the visitor has not seen yet; any other world once they have seen them all. */
export function pickNextWorld(ids: readonly string[], currentId: string, seen: readonly string[], random: () => number): string {
  const others = ids.filter((id) => id !== currentId)
  const unseen = others.filter((id) => !seen.includes(id))
  const pool = unseen.length > 0 ? unseen : others
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]
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
