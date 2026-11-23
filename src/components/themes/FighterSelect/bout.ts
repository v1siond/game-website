import { ramp } from '@/lib/scroll/stage'
import type { FighterPose } from './poses'

// A bout is a round between him and his sparring partner in a section's scene: the lead beats while the
// scene rises, one exchange per card of the section as that card scrolls up (the exchanges cycle, so cards
// in turn can play different links of a chain), and the close once the last card is past. Each beat holds
// both fighters' poses and the mark the scene reacts to (a wave clash, the super's flash). An exchange can
// take several beats (block, then punish), spread over its card's scroll. Where the scene is in its bout is
// a function of the scroll alone (beatAt), so the bout plays forwards on the way down and back on the way
// up. Plain data and rules, no React.

export type Mark = 'hit' | 'clash' | 'flash'

export interface Beat {
  hero: FighterPose
  partner?: FighterPose
  mark?: Mark
}

export interface Bout {
  lead: readonly Beat[]
  /** The exchange each card plays, card i taking cards[i % cards.length]. */
  cards: readonly (readonly Beat[])[]
  close: readonly Beat[]
}

/** A bout laid out for a section of `count` cards: every beat in order, and where card k's beats start
 *  (starts[count] is the first beat of the close). */
export interface Plan {
  beats: readonly Beat[]
  starts: readonly number[]
}

export function planOf({ lead, cards, close }: Bout, count: number): Plan {
  const exchanges = Array.from({ length: count }, (_, k) => cards[k % cards.length])
  const starts = exchanges.reduce<number[]>((all, exchange) => [...all, all[all.length - 1] + exchange.length], [lead.length])
  return { beats: [...lead, ...exchanges.flat(), ...close], starts }
}

/** How many beats carrying this mark have played up to and including the beat at index. */
export const marksUpTo = (beats: readonly Beat[], index: number, mark: Mark): number =>
  beats.slice(0, index + 1).filter((beat) => beat.mark === mark).length

// The lead plays over this stretch of the scene's progress, before the first card; the close over this one,
// once the last card is past.
const LEAD = [0.06, 0.24] as const
const CLOSE = [0.74, 0.9] as const

/** A stretch of `beats` beats played to `share` (0 to 1): the beat it is in and how far through it. */
const along = (beats: number, share: number): { at: number; t: number } => {
  const played = beats * share
  const at = Math.min(beats - 1, Math.floor(played))
  return { at, t: Math.min(1, played - at) }
}

/** Where a scene is in its bout: the beat's index in the plan, how far through it, and the card it belongs
 *  to (-1 in the lead, `count` in the close), from the cards reached and the scene's progress. */
export interface Place {
  index: number
  t: number
  card: number
}

export function beatAt({ lead, close }: Bout, { starts }: Plan, cardsReached: number, progress: number): Place {
  const count = starts.length - 1
  if (count > 0 && cardsReached >= count && close.length > 0) {
    const { at, t } = along(close.length, ramp(progress, ...CLOSE))
    return { index: starts[count] + at, t, card: count }
  }
  if (count > 0 && (cardsReached > 0 || lead.length === 0)) {
    const card = Math.min(count - 1, Math.floor(cardsReached))
    const beats = starts[card + 1] - starts[card]
    const { at, t } = along(beats, Math.min(1, cardsReached - card))
    return { index: starts[card] + at, t, card }
  }
  const { at, t } = along(lead.length, ramp(progress, ...LEAD))
  return { index: at, t, card: -1 }
}
