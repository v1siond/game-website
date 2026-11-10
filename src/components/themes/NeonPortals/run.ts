import type { Lens } from './lens'

// The run through a level: scrolling the level's window through the screen moves him down the path into the
// screen, the camera trailing behind him the way the source game's camera follows its hero (research
// 2026-11-09-c44-neon-portals-r2, notes 5). Progress 0 is the window entering from the bottom of the screen,
// 1 is it half way up, the shared scroll lines (src/lib/scroll/progress.ts).
//
// The path runs from z 0 toward negative z; the era's key piece (a crate, the sphinx, the gong) stands at its
// end. The lens is set per window shape: the desktop window is 21 by 9 and the phone one 4 by 3 (390 px wide
// screens and up to the md break), and a narrower window gets a wider, higher lens from further back, so on
// both he and the key piece stay in frame (run.test.ts reads it at both).

/** Where he stops, short of the end piece, in model units. */
export const RUN_END_Z = -24
export const END_PIECE_Z = -27.5
/** The ground covered by one stride of the run clip. */
const STRIDE = 1.9
/** From here on he has reached the end piece and plays his moment there. */
const ARRIVE_AT = 0.94

export const PHONE_WINDOW = 4 / 3
export const DESKTOP_WINDOW = 21 / 9

interface RunFrame {
  heroZ: number
  /** Where in the run clip's stride he is, 0 to 1. */
  stride: number
  arrived: boolean
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export function runAt(progress: number): RunFrame {
  const place = clamp01(progress)
  const distance = -RUN_END_Z * place
  // `|| 0` turns the -0 of the start into 0
  return { heroZ: -distance || 0, stride: (distance / STRIDE) % 1, arrived: place >= ARRIVE_AT }
}

interface Framing {
  fov: number
  back: number
  height: number
  lookY: number
  ahead: number
}

const PHONE: Framing = { fov: 58, back: 7.4, height: 3.6, lookY: 1.4, ahead: 8 }
const DESKTOP: Framing = { fov: 38, back: 7, height: 3, lookY: 1.5, ahead: 8 }

const framingFor = (aspect: number): Framing => {
  const w = clamp01((aspect - PHONE_WINDOW) / (DESKTOP_WINDOW - PHONE_WINDOW))
  const mix = (key: keyof Framing) => PHONE[key] + (DESKTOP[key] - PHONE[key]) * w
  return { fov: mix('fov'), back: mix('back'), height: mix('height'), lookY: mix('lookY'), ahead: mix('ahead') }
}

/** The level camera at a progress, for a window of this width over height. */
export function levelLens(progress: number, aspect: number): Lens {
  const { heroZ } = runAt(progress)
  const framing = framingFor(aspect)
  return {
    position: [0, framing.height, heroZ + framing.back],
    target: [0, framing.lookY, heroZ - framing.ahead],
    fov: framing.fov,
    aspect,
  }
}
