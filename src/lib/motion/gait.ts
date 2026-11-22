/**
 * The walk of a figure seen from the side, facing +x, driven by the scroll. Angles are in degrees and a
 * positive one swings a limb toward his facing (+x). The phase is in turns (1 is one full stride) and comes
 * from the distance walked, so scrolling down (forward) steps him forward and scrolling up plays it back.
 */

export interface Gait {
  hipF: number
  hipB: number
  kneeF: number
  kneeB: number
  shF: number
  shB: number
  elF: number
  elB: number
  lift: number
  scarf: number
}

/** How far one full stride carries him, in canvas units at scale 1, so a walk's legs follow the ground. */
export const STRIDE_PX = 110

// He walks in from ENTRY_PX behind his first mark while the scene rises (until ENTRY_UNTIL of it), then on
// DRIFT_PX over the whole scene, more than a zoom about a point right of him takes back.
const ENTRY_PX = 160
const ENTRY_UNTIL = 0.2
const DRIFT_PX = 70

/** Where a walker stands at scene progress p so he only ever moves forward; `mark` is where the cards put him. */
export const walkOn = (mark: number, p: number): number => mark - ENTRY_PX * (1 - Math.min(1, p / ENTRY_UNTIL)) + DRIFT_PX * p

/** The walk cycle at a phase in turns, `size` scales the swing (a run is bigger). */
export function gait(phase: number, size = 1): Gait {
  const a = Math.sin(phase * Math.PI * 2)
  const b = Math.cos(phase * Math.PI * 2)
  return {
    hipF: 28 * a * size,
    hipB: -28 * a * size,
    // A knee bends while its hip angle rises (the leg swings forward through the air: d hipF/d phase has
    // the sign of b) and is straight while it falls (the foot planted, sweeping back as he moves forward).
    kneeF: -Math.max(0, b) * 50 * size - 6,
    kneeB: -Math.max(0, -b) * 50 * size - 6,
    shF: -30 * a * size,
    shB: 30 * a * size,
    elF: 30,
    elB: 30,
    lift: Math.abs(b) * 5 * size,
    scarf: Math.sin(phase * Math.PI * 4) * 6,
  }
}

/** The walk for a figure standing at x: the phase is the distance walked, in strides. */
export const gaitAt = (x: number, scale: number, size: number): Gait => gait(x / (STRIDE_PX * scale), size)
