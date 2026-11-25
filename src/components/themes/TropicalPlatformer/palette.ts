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

/** The troop: him and his four friends, our own, each with his own colour (research/2026-11-25-deep-dk64 §2: one
 *  colour per ape, his fruit, his pad, his door and his lamp in it). */
export type Ape = 'him' | 'lemur' | 'orangutan' | 'tamarin' | 'silverback'

export const TROOP: Record<Ape, string> = {
  him: '#ffc93c',
  lemur: '#e0382c',
  orangutan: '#2f86e8',
  tamarin: '#9a52e0',
  silverback: '#3fb83a',
}

/** The troop in the order the game frees them and the order their pads, doors and lamps stand in. */
export const TROOP_ORDER: readonly Ape[] = ['him', 'lemur', 'orangutan', 'tamarin', 'silverback']

export type ColorName = keyof typeof COLORS

// The light of each place of the run, one palette per world as the game it comes from gives each world its own
// (research/2026-11-25-footage-dk64, Look): his isle by day after the storm, the green jungle under a blue sky,
// the orange desert temple, the grey steel toy factory, the deep blue cove of wrecks, the mushroom forest, the
// purple castle in the rain, the dark steel hideout, the bright ring and the sunset sea. Every scenery shape
// reads its colours from the tone it sits in (scenery.tsx sets them as --tone-* variables), so one drawing
// serves every place.
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
  /** The water of a place by the sea, its deep and its lit crest. */
  sea: string
  seaLit: string
}

export type Tone = 'isle' | 'jungle' | 'desert' | 'factory' | 'cove' | 'fungi' | 'castle' | 'helm' | 'ring' | 'sea'

export const TONES: Record<Tone, ToneColors> = {
  // his isle the morning after the storm: green palms, a pale blue sky, the sea round it
  isle: { skyHigh: '#3f7fc4', skyLow: '#d6eef2', farLit: '#4a9a6a', far: '#2a6a4a', leafLit: '#7cc243', leaf: '#3a8a2c', leafShade: '#0f3317', rim: '#e9ffb0', trunk: '#5a3a1e', bloom: '#d8434f', sea: '#1f6fa8', seaLit: '#7fd0e8' },
  // the jungle: lush greens under a blue sky
  jungle: { skyHigh: '#3a78c0', skyLow: '#d9f0d0', farLit: '#3a6a35', far: '#1f4626', leafLit: '#7cc243', leaf: '#3a8a2c', leafShade: '#0f3317', rim: '#d9f58a', trunk: '#4a2f18', bloom: '#d8434f', sea: '#1f4626', seaLit: '#3a6a35' },
  // the desert temple: orange sand and red stone under a hot sky
  desert: { skyHigh: '#c8562a', skyLow: '#ffd08a', farLit: '#e09a52', far: '#b0602e', leafLit: '#eab066', leaf: '#c8803e', leafShade: '#6a2e14', rim: '#fff0b0', trunk: '#9a3e24', bloom: '#3aa8a0', sea: '#c8803e', seaLit: '#eab066' },
  // the toy factory: dark grey steel and the toys' bright colours
  factory: { skyHigh: '#14161c', skyLow: '#343844', farLit: '#4a505c', far: '#262a32', leafLit: '#7a828e', leaf: '#4a525c', leafShade: '#121418', rim: '#ffd24a', trunk: '#3a3e46', bloom: '#e8463a', sea: '#262a32', seaLit: '#4a505c' },
  // the cove of wrecks: deep blue water in the dark
  cove: { skyHigh: '#040a1e', skyLow: '#103562', farLit: '#1d4a7a', far: '#0c2644', leafLit: '#2a6a8a', leaf: '#16405a', leafShade: '#051224', rim: '#8fd8ff', trunk: '#3a2a1e', bloom: '#ffd24a', sea: '#0c3a6c', seaLit: '#4a9ad0' },
  // the mushroom forest by day (its night falls over it in its place)
  fungi: { skyHigh: '#3a8ad0', skyLow: '#cfeccf', farLit: '#4a9a5a', far: '#2a6a3a', leafLit: '#8acb4a', leaf: '#3f8a2c', leafShade: '#0f3317', rim: '#f0ffb0', trunk: '#e2d2b2', bloom: '#d83a3a', sea: '#2a6a3a', seaLit: '#4a9a5a' },
  // the castle in the rain: purple and black, green moss on the stones
  castle: { skyHigh: '#0c0618', skyLow: '#3e1c50', farLit: '#3a2a4e', far: '#1c1230', leafLit: '#55703e', leaf: '#2e3a2a', leafShade: '#0a0a10', rim: '#c0b0ff', trunk: '#4c4660', bloom: '#ffb347', sea: '#2a2438', seaLit: '#5a5070' },
  // the hideout in the fortress's head: dark steel under a red alarm
  helm: { skyHigh: '#0a0c10', skyLow: '#20252e', farLit: '#3a424e', far: '#1a1e26', leafLit: '#5a6470', leaf: '#2e343e', leafShade: '#0a0c10', rim: '#ff5a3a', trunk: '#2a3038', bloom: '#ff3a2a', sea: '#1a1e26', seaLit: '#3a424e' },
  // the ring under the lights: a dark crowd, the blue mat and its red stars, white ropes
  ring: { skyHigh: '#04050c', skyLow: '#141a34', farLit: '#2a3460', far: '#10142a', leafLit: '#3a6ae0', leaf: '#2446b0', leafShade: '#0a1440', rim: '#ffffff', trunk: '#c8ccd8', bloom: '#e02a2a', sea: '#10142a', seaLit: '#2a3460' },
  // the sunset sea on the way home: dusk and orange, the shapes black against it
  sea: { skyHigh: COLORS.dusk, skyLow: COLORS.sunsetOrange, farLit: '#5a2340', far: COLORS.duskDeep, leafLit: COLORS.shadowSoft, leaf: '#1d0f0c', leafShade: COLORS.shadow, rim: COLORS.sunsetOrange, trunk: '#1d0f0c', bloom: '#ffc93c', sea: '#6a2a44', seaLit: '#f2a24a' },
}

/** Each tone's colours as --tone-<name>, set on the scene that holds the shapes. */
export const TONE_VARS = Object.fromEntries(
  (Object.keys(TONES) as Tone[]).map((tone) => [tone, paletteVars('tone', { ...TONES[tone] })]),
) as Record<Tone, CSSProperties>

// Every colour as --tp-<name> (camelCase becomes kebab case: leafDark is --tp-leaf-dark).
export const PALETTE_VARS = paletteVars('tp', COLORS)
