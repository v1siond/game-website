import type { CSSProperties } from 'react'
import { paletteVars } from '../shared/paletteVars'

// Tropical Platformer's palette: a jungle at sunset turning to night, warm wood and sun gold, river and
// lagoon water, the temple's stone, the saturated colours of 16-bit jungle platformers. SVG art reads
// COLORS directly; Tailwind classes read the same values as CSS variables, set once on the world's root
// by PALETTE_VARS.

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
  // his own clothes: the System Engineer's tee, jeans and trainers, the Musician's vest and black jeans
  tee: '#2f7f8f',
  jeans: '#35527e',
  trainers: '#e8e2d4',
  vest: '#262322',
  blackJeans: '#3a3533',
  // the worlds list's secondary, the lagoon's water light to deep, and the temple's stone
  lagoon: '#00CED1',
  water: '#2b8fb0',
  waterDeep: '#155a78',
  stone: '#8d8a7a',
  stoneDark: '#55534a',
  // the coconut's husk and the gem inside it
  husk: '#6b4a2a',
  gem: '#7fe3d0',
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
  // bark and planks
  bark: '#6b3f1d',
  barkDark: '#2e1a0b',
  plank: '#c98d4a',
  // The plank under body text only, a step lighter: under the grain it paints #c7a485, 7.15:1 with
  // bark-dark; borders and letters keep plank.
  plankText: '#deba91',
  plankLight: '#e8b874',
  // the nail heads in a plank's corners
  nail: '#b9bec6',
  nailShade: '#4f545c',
  // the dark boards the sections are read on, top to bottom, and the deep wood under the plates
  boardTop: '#24150a',
  boardBottom: '#160c05',
  plateTop: '#2a180b',
  woodDeep: '#1a0f06',
  // night at the end of the run: the sky, the moon, the camp's fire and lanterns
  nightSky: '#101a3a',
  nightDeep: '#070c20',
  moon: '#f6f0cf',
  lamp: '#ffb347',
} as const

export type ColorName = keyof typeof COLORS

// The light of each scene: the backlit sunset, the dusk jungle with its banded treeline, the day jungle
// under a pale sky, the misty giant tree with its lanterns, and night. Every scenery shape reads its
// colours from the tone it sits in (scenery.tsx sets them as --tone-* variables), so one drawing serves
// every scene.
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

export type Tone = 'sunset' | 'dusk' | 'jungle' | 'treetop' | 'night'

export const TONES: Record<Tone, ToneColors> = {
  // the sunset's planes are its dusk and orange and the black shapes in front of the light
  sunset: {
    skyHigh: COLORS.dusk,
    skyLow: COLORS.sunsetOrange,
    farLit: '#5a2340',
    far: COLORS.duskDeep,
    leafLit: COLORS.shadowSoft,
    leaf: '#1d0f0c',
    leafShade: COLORS.shadow,
    rim: COLORS.sunsetOrange,
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
    rim: COLORS.lamp,
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
  night: {
    skyHigh: COLORS.nightDeep,
    skyLow: COLORS.nightSky,
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
