import { PLAY_S } from '@/components/themes/shared/loops'

// The golem's spawn in the chaos zone (chaosZone.tsx): the meteor falls, the explosion, the rocks assemble,
// the final golem fades in and the assembly hides under it. As first drawn it ran to 7.5 s from the page
// opening (the golem's 1 s fade in from 6.5 s); BD29 holds every animation to PLAY_S, so every phase time and
// every spawn animation's length is that drawing scaled by SPAWN_FIT, the order and the ratios kept.
const DRAWN_MS = { meteor: 2000, explosion: 3500, assembling: 4200, final: 6500, hidden: 7000, settled: 7500 } as const

export type SpawnMoment = keyof typeof DRAWN_MS

export const SPAWN_FIT = (PLAY_S * 1000) / DRAWN_MS.settled

/** When each moment of the spawn comes, in ms from the page opening. */
export const SPAWN_AT_MS = Object.fromEntries(
  Object.entries(DRAWN_MS).map(([moment, ms]) => [moment, Math.round(ms * SPAWN_FIT)]),
) as Record<SpawnMoment, number>

/** A spawn animation's length or delay as drawn, in seconds, fitted by the same ratio. */
export const spawnS = (seconds: number) => Number((seconds * SPAWN_FIT).toFixed(3))
