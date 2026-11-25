import type { Playhead, SceneScript } from '@/lib/scroll/player'

// What every era picture is: six layers on the shared canvas, from the sky to the foreground, a script of
// one to three different actions (each one's length in ms) that the scroll plays at no more than its own
// speed (src/lib/scroll/player.ts), and a binder that caches the nodes the scene moves and returns the per frame
// writer. The writer takes:
//   p     the scene's progress, 0 when its stage starts to rise, 1 when its section has gone by: the
//         ambient drift only (smoke, sand, petals), never his actions;
//   play  where the script is: the action playing and how far, eased, then its end frame held.
// The markup a build returns is the scene's end frame, the picture reduced motion shows.

export const LAYERS = ['sky', 'far', 'mid', 'near', 'figure', 'fg'] as const

export type Layer = (typeof LAYERS)[number]

export type Layers = Record<Layer, string>

/** What an era is built from: the number of items its section counts and, where its art needs them, each
 *  job's start year (the highway's mile signs) and how many ventures are his own products (the keystone). */
export interface EraInput {
  count: number
  years: readonly number[]
  featured: number
}

export type EraWriter = (p: number, play: Playhead) => void

export interface Era {
  /** Where he stands across the canvas, the x his side's shift is worked out from. */
  place: number
  /** The layers that hold him and what he acts on, moved with him to his side; his own layer when none. */
  moves?: readonly Layer[]
  script: SceneScript
  build: (input: EraInput) => Layers
  bind: (stage: Element, input: EraInput) => EraWriter
}

/** How far action `i` of the script has played: done before it, `t` while it plays, none after. */
export const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** The end frame of a script, every action done. */
export const END: Playhead = { action: 2, t: 1, done: true }
