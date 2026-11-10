// A seeded random generator, so a world that draws a board from a seed deals the same board every time.

/** mulberry32: a 32 bit state stepped by a fixed odd constant, numbers in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A 32 bit seed hashed from a text, so one slug always seeds the same stream. */
export const seedOf = (text: string): number =>
  [...text].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 2654435761) >>> 0, 1779033703)
