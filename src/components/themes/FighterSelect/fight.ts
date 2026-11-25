import type { Playhead } from '@/lib/scroll/player'
import type { FighterPose } from './poses'

// A round of the tour as the shared scene player plays it (src/lib/scroll/player.ts): one to three actions,
// each a run of beats in which both fighters hold a move, each beat over its share of the action. Where an
// action is comes from the playhead alone, so the round plays forward on the way down and back on the way
// up. Plain data and rules, no React.

/** What the scene reacts to on a beat: a hit landing, or the knockout blow (a hit too). */
export type Mark = 'hit' | 'ko'

export interface Beat {
  hero: FighterPose
  partner: FighterPose
  mark?: Mark
  /** Its share of the action against the other beats' (1 when left out). */
  share?: number
  /** The share of his own life bar a blow on this beat takes, blocked or not. */
  chip?: number
  /** The hit stop: his strip and the partner's frozen at these points of their moves (0 to 1) for the beat. */
  hold?: readonly [number, number]
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

const landsBy = (beat: Beat, t: number): boolean => t >= LANDS

/** The sum of `count` over the beats played by `play`, a beat counting once its blow lands. */
function sumUpTo(actions: readonly Action[], play: Playhead, count: (beat: Beat) => number): number {
  const total = (beats: readonly Beat[]) => beats.reduce((sum, beat) => sum + count(beat), 0)
  const before = actions.slice(0, play.action).reduce((sum, action) => sum + total(action.beats), 0)
  const action = actions[play.action]
  const { index, t } = beatIn(action, play.t)
  const landing = action.beats[index]
  return before + total(action.beats.slice(0, index)) + (landsBy(landing, t) ? count(landing) : 0)
}

const isHit = (beat: Beat): number => (beat.mark === 'hit' || beat.mark === 'ko' ? 1 : 0)

/** How many hits have landed across the round's actions by `play`, the knockout blow among them. */
export const hitsUpTo = (actions: readonly Action[], play: Playhead): number => sumUpTo(actions, play, isHit)

/** Both life bars at `play` (0 to 1): the rival's drained hit by hit to nothing at the last one, his own by
 *  the chip of every blow he takes. */
export function lifeOf(actions: readonly Action[], play: Playhead): { hero: number; rival: number } {
  const total = actions.reduce((sum, action) => sum + action.beats.reduce((n, beat) => n + isHit(beat), 0), 0)
  const landed = hitsUpTo(actions, play)
  const chipped = sumUpTo(actions, play, (beat) => beat.chip ?? 0)
  return { hero: Math.round((1 - chipped) * 1000) / 1000, rival: total ? 1 - landed / total : 1 }
}

/** What a section is in the arcade run: the select screen, a fight, the scrap yard, or the ending. */
export type RunBeat = 'select' | 'fight' | 'bonus' | 'ending'

/** A section's place in the run: the stage the HUD calls it, the score it starts from and the points it adds. */
export interface RunStop {
  stage: string
  before: number
  award: number
}

// A fight's points grow stage by stage; the scrap yard pays its own.
const FIGHT_POINTS = 20000
const FIGHT_STEP = 10000
const BONUS_POINTS = 50000

const stageName = (beat: RunBeat, fight: number, last: boolean): string => {
  if (beat === 'bonus') return 'SCRAP YARD'
  if (beat === 'ending') return 'ALL CLEAR'
  if (last) return 'FINAL STAGE'
  return `STAGE ${Math.max(1, fight)}`
}

/** One credit of the run over the page's sections in order: the fights numbered, the last one final, and the
 *  score carried from each stage to the next, so the HUD reads as one run on every path. */
export function runOf(beats: readonly RunBeat[]): RunStop[] {
  const fights = beats.filter((beat) => beat === 'fight').length
  let fight = 0
  let score = 0
  return beats.map((beat) => {
    if (beat === 'fight') fight += 1
    const award = beat === 'fight' ? FIGHT_POINTS + FIGHT_STEP * fight : beat === 'bonus' ? BONUS_POINTS : 0
    const stop = { stage: stageName(beat, fight, beat === 'fight' && fight === fights), before: score, award }
    score += award
    return stop
  })
}

/** The score as the cabinet writes it: seven digits, zeros in front. */
export const scoreText = (score: number): string => String(Math.floor(score)).padStart(7, '0')
