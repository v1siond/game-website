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
} as const

export type ColorName = keyof typeof COLORS

// Every colour as --tp-<name> (camelCase becomes kebab case: leafDark is --tp-leaf-dark).
export const PALETTE_VARS = paletteVars('tp', COLORS)
