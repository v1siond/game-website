import type { CSSProperties } from 'react'
import { paletteVars } from '../shared/paletteVars'

// Tropical Platformer's palette: a jungle at sunset turning to night, warm barrel wood, steel hoops and
// sun gold, the saturated pre-rendered colours of 3D jungle platformers. SVG art reads COLORS directly; Tailwind
// classes read the same values as CSS variables, set once on the world's root by PALETTE_VARS.

export const COLORS = {
  // the world's card on the worlds list (src/themes/themes.ts reads these)
  canopy: '#063806',
  leafDark: '#0b4d0b',
  fruitGold: '#FF9900',
  sandLight: '#DEB887',
  sun: '#FFD700',
  wood: '#8B4513',
  woodDark: '#4a2208',
  // the light text on dark wood and leaf
  parchment: '#f6e7c8',
  // the laptop screen, and the fighter's mongkhon and shorts band
  lagoon: '#00CED1',
  seaDeep: '#1f4fbf',
  // the sunset the hero stands in, and the black shapes in front of it
  sunCore: '#fff4c2',
  sunGold: '#ffc93c',
  sunsetOrange: '#f2771f',
  sunsetRed: '#cf3b26',
  dusk: '#6e2747',
  duskDeep: '#3a1430',
  shadow: '#140b0a',
  shadowSoft: '#2a1612',
  // the jungle floor and its leaves
  jungleDeep: '#0b2213',
  jungle: '#17401f',
  moss: '#2f6b2c',
  fern: '#5fa83a',
  // barrels, planks and steel hoops
  bark: '#6b3f1d',
  barkDark: '#2e1a0b',
  plank: '#c98d4a',
  plankLight: '#e8b874',
  hoop: '#4f545c',
  hoopLight: '#b9bec6',
  burst: '#fffdf4',
  // the four letters, the target rings
  letter: '#ffd23f',
  target: '#d1301f',
  // night at the end of the level
  nightSky: '#101a3a',
  nightDeep: '#070c20',
  moon: '#f6f0cf',
  firefly: '#e9ff8f',
  lamp: '#ffb347',
  // the banana bunch on the counter and beside every level sign
  banana: '#ffd84a',
  bananaLit: '#fff3a6',
  bananaShade: '#c9861b',
  stem: '#5a3a1a',
  // the sandy jungle path
  dirt: '#c99a5a',
  dirtDark: '#8a5a2c',
} as const

export type ColorName = keyof typeof COLORS

// The light of each scene, after the source's levels: the backlit sunset, the dusk jungle with its
// banded treeline, the day jungle under a pale sky, the misty treetop village with its lanterns, the
// purple cave of the hoard, and night. Every scenery shape reads its colours from the tone it sits in
// (scenery.tsx sets them as --tone-* variables), so one drawing serves every scene.
export interface ToneColors {
  skyHigh: string
  skyLow: string
  farLit: string
  far: string
  leafLit: string
  leaf: string
  leafShade: string
  rim: string
  trunk: string
  bloom: string
}

export type Tone = 'sunset' | 'dusk' | 'jungle' | 'treetop' | 'cave' | 'night'

export const TONES: Record<Tone, ToneColors> = {
  sunset: {
    skyHigh: '#6e2747',
    skyLow: '#f2771f',
    farLit: '#5a2340',
    far: '#3a1430',
    leafLit: '#2a1612',
    leaf: '#1d0f0c',
    leafShade: '#140b0a',
    rim: '#f2771f',
    trunk: '#1d0f0c',
    bloom: '#3a1418',
  },
  dusk: {
    skyHigh: '#3a1450',
    skyLow: '#f4a23a',
    farLit: '#3e5a2a',
    far: '#22371c',
    leafLit: '#3f8a2a',
    leaf: '#1f5420',
    leafShade: '#0a2410',
    rim: '#ffb347',
    trunk: '#3a2414',
    bloom: '#b8323e',
  },
  jungle: {
    skyHigh: '#4b4a7a',
    skyLow: '#f3e6c0',
    farLit: '#3a6a35',
    far: '#1f4626',
    leafLit: '#7cc243',
    leaf: '#3a8a2c',
    leafShade: '#0f3317',
    rim: '#d9f58a',
    trunk: '#4a2f18',
    bloom: '#d8434f',
  },
  treetop: {
    skyHigh: '#0d3a40',
    skyLow: '#2b8a8a',
    farLit: '#1d5f63',
    far: '#0f3d42',
    leafLit: '#4f9a5a',
    leaf: '#2a6a3e',
    leafShade: '#0c2a24',
    rim: '#ffcf6b',
    trunk: '#5a3a22',
    bloom: '#ffb347',
  },
  cave: {
    skyHigh: '#1a0b24',
    skyLow: '#3a1d4a',
    farLit: '#7a4a96',
    far: '#4a2a62',
    leafLit: '#a87acb',
    leaf: '#6a3e88',
    leafShade: '#25122f',
    rim: '#d8b4f0',
    trunk: '#3a1f48',
    bloom: '#ffd84a',
  },
  night: {
    skyHigh: '#070c20',
    skyLow: '#101a3a',
    farLit: '#1f5560',
    far: '#123040',
    leafLit: '#3aa5a0',
    leaf: '#1d6466',
    leafShade: '#0a2a30',
    rim: '#8fe0d8',
    trunk: '#14262c',
    bloom: '#7a2a4a',
  },
}

/** Each tone's colours as --tone-<name>, set on the scene that holds the shapes. */
export const TONE_VARS = Object.fromEntries(
  (Object.keys(TONES) as Tone[]).map((tone) => [tone, paletteVars('tone', { ...TONES[tone] })]),
) as Record<Tone, CSSProperties>

// Every colour as --tp-<name> (camelCase becomes kebab case: leafDark is --tp-leaf-dark).
export const PALETTE_VARS = paletteVars('tp', COLORS)
