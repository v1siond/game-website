import { clamp01 } from '@/lib/scroll/progress'

// The projected film round Rubber Hose's page, played by the scroll (src/hooks/useScrollFollow): the
// sprocket holes run past as the page moves, the grain jumps between its frames, the projector flickers
// now and then, and the notes rise over the first screen. Every value is a function of the scroll alone,
// so scrolling up draws the same frames back and every pass plays them again.

/** One sprocket hole and its gap, the strip's repeat in px. */
export const REEL_HOLE_PX = 32

// The strip runs a quarter of the page's travel; the grain changes frame every this many px.
const REEL_RATE = 0.25
const GRAIN_STEP_PX = 60
const GRAIN_FRAMES: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [-3, 2],
  [2, -3],
  [-2, -2],
  [3, 3],
]
// A flicker every this many px of travel, at most this bright.
const FLICKER_EVERY_PX = 540
const FLICKER_MAX = 0.08

export interface ReelFrame {
  /** The sprocket holes' offset, 0 up to one hole, in px. */
  reel: number
  /** The grain tile's offset, in % of its size. */
  grainX: number
  grainY: number
  /** The projector's flicker over the page, an opacity. */
  flicker: number
  /** How far the notes have risen, 0 at the page top to 1 a screen down. */
  notes: number
}

export function reelAt(scroll: number, viewport: number): ReelFrame {
  const travel = Math.max(0, scroll)
  const [grainX, grainY] = GRAIN_FRAMES[Math.floor(travel / GRAIN_STEP_PX) % GRAIN_FRAMES.length]
  // a short flash near the start of each stretch, dark the rest of it
  const into = (travel % FLICKER_EVERY_PX) / FLICKER_EVERY_PX
  const flicker = travel > 0 && into < 0.04 ? FLICKER_MAX * Math.sin((Math.PI * into) / 0.04) : 0
  return {
    reel: (travel * REEL_RATE) % REEL_HOLE_PX,
    grainX,
    grainY,
    flicker,
    notes: viewport > 0 ? clamp01(travel / viewport) : 1,
  }
}
