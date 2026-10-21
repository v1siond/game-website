import { paletteVars } from '../shared/paletteVars'

// Tropical Platformer's palette: an island at midday, jungle greens, warm wood, lagoon blues, ripe fruit
// and sun gold, the saturated colours of 3D tropical platformers. SVG art reads COLORS directly; Tailwind
// classes read the same values as CSS variables, set once on the world's root by PALETTE_VARS.

export const COLORS = {
  // jungle
  leaf: '#228B22',
  leafLight: '#32CD32',
  leafDark: '#0b4d0b',
  canopy: '#063806',
  // lagoon and sky
  lagoon: '#00CED1',
  lagoonDeep: '#008B8B',
  sea: '#1E90FF',
  seaLight: '#00BFFF',
  seaDeep: '#1f4fbf',
  night: '#0a1f5c',
  // beach
  sand: '#F4A460',
  sandLight: '#DEB887',
  sandDark: '#D2691E',
  // the light text on dark wood and leaf
  parchment: '#f6e7c8',
  // wood
  wood: '#8B4513',
  woodMid: '#A0522D',
  woodLight: '#CD853F',
  woodDark: '#4a2208',
  // fruit and sun
  fruit: '#FF6600',
  fruitGold: '#FF9900',
  fruitShine: '#FFCC66',
  sunset: '#E85D00',
  ember: '#a33f00',
  sun: '#FFD700',
  // crates and danger
  hazard: '#e02020',
  hazardDark: '#9e1010',
  iron: '#6b7078',
  ironLight: '#9aa0a8',
  // gems
  gemClear: '#E0E0E0',
  gemRed: '#FF3366',
  gemBlue: '#00CCFF',
  gemGreen: '#00FF99',
  gemYellow: '#FFFF00',
  gemPurple: '#CC44FF',
  // the warp portal
  warp: '#8B00FF',
  warpPink: '#FF69B4',
  crystal: '#6B238E',
  crystalLight: '#9932CC',
  lime: '#44FF44',
} as const

export type ColorName = keyof typeof COLORS

// Every colour as --tp-<name> (camelCase becomes kebab case: leafDark is --tp-leaf-dark).
export const PALETTE_VARS = paletteVars('tp', COLORS)
