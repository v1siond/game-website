import { paletteVars } from '../shared/paletteVars'

// Mythic's palette, every colour of the world once: the underworld escape painted in ink over colour.
// The crimson marble and gold of the great hall with its blood red pool, the four regions the page goes
// down (the teal brick of the first, the magma of the second, the gold light over the green fields of
// the third, the red temple and the dawn of the surface), the mirror's darkness, the boons' rarity
// ladder, the parchment of the codex and the prophecies, and his own kit (the Spartan's tattoo, rage,
// leather, kilt, bronze and blades). The SVG art reads MYTH; MYTH_VARS puts the same values on the
// world's root as --myth-* variables for the CSS modules and the Tailwind arbitrary values.

export const MYTH = {
  // ---- the backdrop and the codex (src/themes/themes.ts reads sky, bone, panel and gold for the worlds menu and the error screen)
  // the backdrop the world opens on
  sky: '#1d0b14',
  // the parchment of the codex and the prophecies, and the dark ink set on it
  marble: '#efe2c4',
  marbleShade: '#d4c19a',
  ink: '#1c1116',
  inkSoft: '#4a3640',
  // blood red and its deep, the gold of laurel and bronze, the teal of the soul lamps
  terracotta: '#b3122a',
  terracottaDeep: '#6e0a18',
  gold: '#e3b24f',
  aegean: '#0f5a5a',

  // ---- text and surfaces
  bone: '#f3e6cc',
  boneShade: '#c9b48c',
  panel: '#150a10',
  panelEdge: '#3a1a24',
  goldDeep: '#8a6420',
  goldPale: '#f7dd92',

  // ---- the great hall
  hallHigh: '#12060c',
  hallLow: '#4a0f1e',
  crimson: '#7d1626',
  blood: '#c2142b',
  bloodDeep: '#5c0613',
  pool: '#9e0e1f',
  poolLight: '#e8384a',
  column: '#3a1420',
  columnLight: '#6a2434',
  fire: '#ff8a2a',
  fireCore: '#ffd36b',

  // ---- the first region: teal brick and soul lamps
  tartHigh: '#061214',
  tartLow: '#163234',
  brick: '#1f3a3c',
  soul: '#6fe0cf',

  // ---- the second region: basalt and magma
  aspHigh: '#140604',
  aspLow: '#4a1806',
  basalt: '#2a1410',
  magma: '#ff6a1a',

  // ---- the third region: gold light over green fields
  elyHigh: '#0b2230',
  elyLow: '#2a5e4c',
  elyLight: '#ffe6a0',
  elyGreen: '#7fd18a',

  // ---- the red temple and the surface's dawn
  styxHigh: '#160307',
  styxLow: '#420914',
  dawn: '#ffb27a',
  dawnPale: '#ffeccf',

  // ---- the mirror's darkness
  darkness: '#8a52e0',
  darknessDeep: '#2a0f52',

  // ---- the boons' rarity ladder, lowest to highest
  common: '#f2ede4',
  rare: '#57b2ff',
  epic: '#c084ff',
  heroic: '#ff5a4a',

  // ---- his kit: the ink line, the ash, the tattoo and the rage, leather, kilt, bronze, blades, wraps
  inkLine: '#16090e',
  ash: '#e4ded4',
  tattoo: '#c4161c',
  rage: '#ff3b1f',
  rageCore: '#ffd36b',
  rim: '#f0a070',
  leather: '#6a3e24',
  leatherShade: '#3a2014',
  kilt: '#a81c22',
  kiltShade: '#5e0d12',
  bronze: '#c08a40',
  steel: '#a4aab0',
  steelShade: '#4c5258',
  bladeFire: '#ff8a2a',
  wrap: '#efe7da',
} as const

export const MYTH_VARS = paletteVars('myth', MYTH)
