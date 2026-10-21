import type { FighterPose } from './poses'

// A bout is a short scripted exchange between him and his sparring partner, played once when its scene
// scrolls in: a list of beats, each holding both fighters' poses for its time, with the marks the scene
// reacts to (a dent in the car, a card lit, a call slammed on the screen). The scene shows the beat the
// clock has reached and counts the marks played so far; the last beat is held. Plain data and rules, no
// React, so the timing is tested alone; the hook that plays it is in boutPlayer.ts.

export type Mark = 'hit' | 'light' | 'ko' | 'perfect' | 'flash' | 'wreck'

export interface Beat {
  hero: FighterPose
  partner?: FighterPose
  ms: number
  mark?: Mark
}

/** How many beats carrying this mark have played up to and including the beat at index. */
export const marksUpTo = (beats: readonly Beat[], index: number, mark: Mark): number =>
  beats.slice(0, index + 1).filter((beat) => beat.mark === mark).length

/** Whether a beat carrying this mark has played by the beat at index. */
export const reached = (beats: readonly Beat[], index: number, mark: Mark): boolean => marksUpTo(beats, index, mark) > 0

/** The beat after this one, or this one again once the bout is over. */
export const nextBeat = (beats: readonly Beat[], index: number): number => Math.min(index + 1, beats.length - 1)

/** The bout's last beat, the one reduced motion shows at once. */
export const lastBeat = (beats: readonly Beat[]): number => Math.max(0, beats.length - 1)
