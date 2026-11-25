import { paletteVars } from '../shared/paletteVars'

// Mythic's palette, every colour of the world once, painted in ink over colour: the crimson and gold of the
// great hall, the places of the northern journey behind the page (the snow wood, the lake, the ring of light,
// the iron mountain, the sea of the dead, the frozen shore, the peak), the parchment of the codex, his wool and
// leather kit with the axe's frost, and the apprentice's hood. The SVG art reads MYTH; MYTH_VARS puts the same values on the
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
  // blood red and its deep and the gold of laurel and bronze
  terracotta: '#b3122a',
  terracottaDeep: '#6e0a18',
  gold: '#e3b24f',

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
  // The top of the blood button, a step deeper than blood so the bone words on it read 7:1
  bloodPlate: '#960f21',
  fire: '#ff8a2a',
  fireCore: '#ffd36b',

  // ---- the soul lamps

  // ---- the green and gold glow of the ring of light
  elyLow: '#2a5e4c',
  elyLight: '#ffe6a0',

  // ---- the dark red of the gate's lintel
  styxHigh: '#160307',


  // ---- his kit: the ink line, the cloak's crest red, leather, bronze and steel
  inkLine: '#16090e',
  // ---- the chain of the tech stack climb
  chainSteel: '#4a4a58',
  // ---- the clouds and the pyre's ash
  cloud: '#f4e6c8',
  ash: '#e4ded4',
  crest: '#c4161c',
  rim: '#f0a070',
  leather: '#6a3e24',
  leatherShade: '#3a2014',
  bronze: '#c08a40',
  steel: '#a4aab0',
  steelShade: '#4c5258',
  // ---- the frost of his axe and the fur of his mantle
  frost: '#8fd4ff',
  // ---- the carved stone, iron and wood of the realms: the title stones, the rims, the realm doors
  stone: '#d6dde0',
  stoneShade: '#a3afb5',
  iron: '#5d6870',
  ironDeep: '#2c3338',
  wood: '#6a4428',
  woodShade: '#3a2516',
  frostCore: '#e8f7ff',
  fur: '#4e4034',
  furLight: '#8a7460',
  wrap: '#efe7da',
  // ---- the north of the journey: his wool tunic, the snow, the apprentice's hood, the places in order
  wool: '#6a5c48',
  woolShade: '#3e3428',
  snow: '#e6edf2',
  snowShade: '#a9b8c4',
  hood: '#4f6a52',
  hoodShade: '#2e4232',
  youthSkin: '#e2b48e',
  woodHigh: '#1c2a36',
  woodLow: '#6a7f8e',
  pine: '#1e3028',
  pineLight: '#35503e',
  lakeHigh: '#2a3e4a',
  lakeLow: '#8fa8b0',
  lakeWater: '#5f7f88',
  lightHigh: '#f4ecc8',
  lightLow: '#c9b77a',
  mountainHigh: '#14161c',
  mountainLow: '#4a4842',
  deadHigh: '#1a2024',
  deadLow: '#5a666a',
  shoreHigh: '#e8a070',
  shoreLow: '#cfd8e0',
  peakHigh: '#6f8aa6',
  peakLow: '#e8eef2',
  ember: '#ff9a3a',
} as const

export const MYTH_VARS = paletteVars('myth', MYTH)
