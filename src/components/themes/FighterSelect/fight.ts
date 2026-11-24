import type { Playhead } from '@/lib/scroll/player'
import type { FighterPose } from './poses'

// A round of the tour as the shared scene player plays it (src/lib/scroll/player.ts): one to three actions,
// each a run of beats in which both fighters hold a move, each beat over its share of the action. Where an
// action is comes from the playhead alone, so the round plays forward on the way down and back on the way
// up. Plain data and rules, no React.

/** What the scene reacts to on a beat: a hit landing, the special's command lighting, the super's flash,
 *  the parry's flash, the knockout. */
export type Mark = 'hit' | 'input' | 'flash' | 'parry' | 'ko'

export interface Beat {
  hero: FighterPose
  partner: FighterPose
  mark?: Mark
  /** Its share of the action against the other beats' (1 when left out). */
  share?: number
}

export interface Action {
  /** How long the action plays, in ms. */
  ms: number
  beats: readonly Beat[]
}

// A hit lands this far into its beat.
const LANDS = 0.4

const shareOf = (beat: Beat): number => beat.share ?? 1

/** The beat an action is in at `t` (0 to 1) and how far through it. */
export function beatIn({ beats }: Action, t: number): { index: number; t: number } {
  const total = beats.reduce((sum, beat) => sum + shareOf(beat), 0)
  let start = 0
  for (const [index, beat] of beats.entries()) {
    const end = start + shareOf(beat) / total
    if (t < end || index === beats.length - 1) return { index, t: Math.min(1, (t - start) / (end - start)) }
    start = end
  }
  return { index: 0, t: 0 }
}

/** How many hits have landed across the round's actions by `play`. */
export function hitsUpTo(actions: readonly Action[], play: Playhead): number {
  const hits = (beats: readonly Beat[]) => beats.filter((beat) => beat.mark === 'hit').length
  const before = actions.slice(0, play.action).reduce((sum, action) => sum + hits(action.beats), 0)
  const action = actions[play.action]
  const { index, t } = beatIn(action, play.t)
  const landed = hits(action.beats.slice(0, index))
  return before + landed + (action.beats[index].mark === 'hit' && t >= LANDS ? 1 : 0)
}
