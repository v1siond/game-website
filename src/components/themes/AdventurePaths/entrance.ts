// The hub entrance (hero.tsx) as timing data: the map unrolls, the ink rises, the trail dots in, he drops onto
// the harbour, walks his trail to the shown profession's landmark and plays his action there. As first drawn
// it ran past 7 s; BD29 holds every animation to 5 s from the trigger, so the drawn delays, the map's own
// transitions (map.module.css reads the fit as --fit) and his walking pace are scaled by ENTRANCE_FIT, and
// his act keeps its length, so it still reads.

export const ENTRANCE_FIT = 0.58

// The entrance's beats as drawn, in ms from the trigger.
const DRAWN_MS = { inked: 950, trailed: 1500, landed: 2700, walk: 3100 } as const

export type EntranceStep = 'unrolled' | 'inked' | 'trailed' | 'landed'

/** Each beat of the entrance on its timer, fitted. */
export const ENTRANCE_STEPS: ReadonlyArray<readonly [EntranceStep, number]> = [
  ['unrolled', 0],
  ['inked', Math.round(DRAWN_MS.inked * ENTRANCE_FIT)],
  ['trailed', Math.round(DRAWN_MS.trailed * ENTRANCE_FIT)],
  ['landed', Math.round(DRAWN_MS.landed * ENTRANCE_FIT)],
]

/** When he starts the entrance walk, fitted. */
export const WALK_AT = Math.round(DRAWN_MS.walk * ENTRANCE_FIT)

// Map units a second. The overworld walk is a steady 0.8125 px a frame on a 256 px screen, about a fifth of
// the screen a second; the hub map is one screen wide, so a fifth of its width, quickened by the fit.
export const WALK_SPEED = 200 / ENTRANCE_FIT

/** How long he plays his profession's action after arriving at its landmark. */
export const ACT_MS = 1800

/** The camera's dive into the landmark he arrives at (camera-enter and mosaic-in in map.module.css). */
const DIVE_MS = 1000

// When the map's own transitions end, as drawn in map.module.css, each scaled there by --fit: the cover's
// unroll, the last ink (from inked, 380 ms after 6 steps of 90 ms), the plaque's swing and sway (760 ms, then
// 1400 ms), the last trail dot (from trailed, 260 ms after 4 legs of 560 ms) and his drop (420 ms).
const MAP_ENDS_DRAWN_MS = [
  1100,
  DRAWN_MS.inked + 380 + 6 * 90,
  DRAWN_MS.inked + 760 + 1400,
  DRAWN_MS.trailed + 4 * 560 + 260,
  DRAWN_MS.landed + 420,
]

/** When the entrance has ended, in ms from the trigger, for a walk of `walkLength` map units. */
export function entranceEndMs(walkLength: number): number {
  const arrives = WALK_AT + (walkLength / WALK_SPEED) * 1000
  return Math.max(...MAP_ENDS_DRAWN_MS.map((ms) => ms * ENTRANCE_FIT), arrives + Math.max(ACT_MS, DIVE_MS))
}
