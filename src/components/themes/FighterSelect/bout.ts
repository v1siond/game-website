import { ramp } from '@/lib/scroll/stage'
import type { FighterPose } from './poses'

// A bout is a short scripted exchange between him and his sparring partner in a section's scene: the lead
// beats while the scene rises, one beat per card of the section as that card scrolls up, and the close once
// the last card is past, each beat holding both fighters' poses, with the marks the scene reacts to (a dent
// in the car, a target lit, a call slammed on the screen). Where the scene is in its bout is a function of
// the scroll alone (beatAt), so the bout plays forwards on the way down and back on the way up. Plain data
// and rules, no React.

export type Mark = 'hit' | 'light' | 'ko' | 'perfect' | 'flash' | 'wreck'

export interface Beat {
  hero: FighterPose
  partner?: FighterPose
  mark?: Mark
}

export interface Bout {
  lead: readonly Beat[]
  item: Beat
  close: readonly Beat[]
}

/** The bout's beats in order for a section of `count` cards. */
export const beatsOf = ({ lead, item, close }: Bout, count: number): Beat[] => [...lead, ...Array.from({ length: count }, () => item), ...close]

/** How many beats carrying this mark have played up to and including the beat at index. */
export const marksUpTo = (beats: readonly Beat[], index: number, mark: Mark): number =>
  beats.slice(0, index + 1).filter((beat) => beat.mark === mark).length

/** Whether a beat carrying this mark has played by the beat at index. */
export const reached = (beats: readonly Beat[], index: number, mark: Mark): boolean => marksUpTo(beats, index, mark) > 0

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

/** The beat the scene is in (its index in beatsOf) and how far through it, from the cards reached and the scene's progress. */
export function beatAt({ lead, close }: Bout, count: number, cardsReached: number, progress: number): { index: number; t: number } {
  if (cardsReached >= count && close.length > 0) {
    const { at, t } = along(close.length, ramp(progress, ...CLOSE))
    return { index: lead.length + count + at, t }
  }
  if (cardsReached > 0 || lead.length === 0) {
    const card = Math.min(count - 1, Math.floor(cardsReached))
    return { index: lead.length + Math.max(0, card), t: Math.min(1, cardsReached - Math.max(0, card)) }
  }
  const { at, t } = along(lead.length, ramp(progress, ...LEAD))
  return { index: at, t }
}
