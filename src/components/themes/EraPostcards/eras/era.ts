// What every era picture is: six layers on the shared canvas, from the sky to the foreground, and a binder
// that caches the nodes the scroll moves and returns the per frame writer. The writer takes:
//   p  the scene's progress, 0 when its stage starts to rise, 1 when it has sunk;
//   f  how many of the section's items have scrolled past the reading line, fractional (0 to count).
// The props a section counts (photos, mile signs, lock rings, lanterns, crates, shards, screens, torches) are
// drawn once per item, so the picture holds as many as the section has cards.

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

export type EraWriter = (p: number, f: number) => void

export interface Era {
  build: (input: EraInput) => Layers
  bind: (stage: Element, input: EraInput) => EraWriter
}

/** The share of item i that has been reached, 0 to 1. */
export const reached = (f: number, i: number): number => Math.min(1, Math.max(0, f - i))

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t))

/** The ease in and out of a 0 to 1 time. */
export const ease = (t: number): number => {
  const c = clamp01(t)
  return c * c * (3 - 2 * c)
}

/** A move inside one card's time u (0 to 1): it rises by `up`, holds at its peak (1), and sinks from `down`;
 *  a `down` of 1 or more holds the peak to the card's end. A stopped scroll mid card shows the peak. */
export function peakOf(u: number, up: number, down: number): number {
  if (down >= 1) return ease(u / up)
  return ease(u / up) * (1 - ease((u - down) / (1 - down)))
}
