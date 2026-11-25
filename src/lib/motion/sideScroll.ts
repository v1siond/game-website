// The side scroller's camera over one continuous level: the level is a run of stretches laid end to end,
// one per scene, and in each the camera follows him from where the scene starts him on screen to where it
// holds him at its end. Everything is a function of the playhead's share t alone, so a scene scrolled back
// draws the same frames in reverse. Layers further back move a share of what the camera moves (parallax),
// and their shapes are scattered by position, not by scene, so two scenes side by side draw the same trees.

/** One stretch of the level: where he starts it and where he ends it, in level units. */
export interface Stretch {
  from: number
  to: number
}

/** Each scene's stretch, laid right after the one before from 0, given how far he goes in each. */
export function stretchesOf(lengths: readonly number[]): Stretch[] {
  let from = 0
  return lengths.map((length) => {
    const stretch = { from, to: from + length }
    from = stretch.to
    return stretch
  })
}

/** Where on screen a scene starts him and where it holds him at its end, in canvas units. */
export interface Framing {
  start: number
  hold: number
}

const smooth = (t: number): number => t * t * (3 - 2 * t)

/** How far the camera has moved along the stretch at t: none at its start, at its end enough that he
 *  stands at the hold. It eases out of rest and into it, so it trails him while he runs. */
export const cameraAt = (t: number, length: number, { start, hold }: Framing): number => smooth(t) * (start + length - hold)

/** The left edge of a layer that moves `share` of the camera, when the camera's left edge is at `left`. */
export const layerLeft = (share: number, left: number): number => share * left

/** One scattered shape: where it stands and a share from 0 to 1 to vary its size or kind by. */
export interface Scattered {
  at: number
  share: number
}

// A fixed pseudo random share per slot and seed: the same on every call and in every scene.
const shareOf = (slot: number, seed: number): number => {
  const x = Math.sin(slot * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Shapes along [from, to): one per `spacing`, each nudged within its slot, the same wherever the range
 *  starts, so a stretch and the next one agree on what stands where. */
export function scatter(from: number, to: number, spacing: number, seed: number): Scattered[] {
  const shapes: Scattered[] = []
  for (let slot = Math.floor(from / spacing); slot * spacing < to; slot += 1) {
    const share = shareOf(slot, seed)
    const at = slot * spacing + share * spacing * 0.6
    if (at >= from && at < to) shapes.push({ at, share })
  }
  return shapes
}
