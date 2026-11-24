import { paletteVars } from '../shared/paletteVars'

// Mythic's palette, every colour of the world once, painted in ink over colour: the crimson marble and gold
// of the great hall, the eras behind the page (the storm sea, the magma, the harbour under the bronze giant,
// the mountain at dawn), the parchment of the tech stack and the prophecies, and his own kit (the fur mantle,
// leather, bronze and steel, the axe's frost). The SVG art reads MYTH; MYTH_VARS puts the same values on the
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
  // The foot of a picked talent plate, a lighter gold than goldDeep so the ink name on it reads 7:1
  goldPlate: '#cf9630',

  // ---- the great hall
  hallHigh: '#12060c',
  hallLow: '#4a0f1e',
  crimson: '#7d1626',
  blood: '#c2142b',
  // The top of the blood button, a step deeper than blood so the bone words on it read 7:1
  bloodPlate: '#960f21',
  bloodDeep: '#5c0613',
  pool: '#9e0e1f',
  column: '#3a1420',
  columnLight: '#6a2434',
  fire: '#ff8a2a',
  fireCore: '#ffd36b',

  // ---- the soul lamps
  soul: '#6fe0cf',

  // ---- the second region: basalt and magma
  aspHigh: '#140604',
  aspLow: '#4a1806',
  basalt: '#2a1410',
  magma: '#ff6a1a',

  // ---- the third region: gold light over green fields
  elyLow: '#2a5e4c',
  elyLight: '#ffe6a0',
  elyGreen: '#7fd18a',

  // ---- the red temple and the surface's dawn
  styxHigh: '#160307',
  styxLow: '#420914',
  dawn: '#ffb27a',
  dawnPale: '#ffeccf',


  // ---- the storm at sea and its serpent
  storm: '#384838',
  stormHigh: '#0e1a1c',
  hydra: '#5a6a52',
  hydraShade: '#2c3628',
  hydraEye: '#9ef06a',

  // ---- the bronze giant over the harbour at night
  giant: '#4a6a58',
  giantEye: '#7fd8ff',
  harbourNight: '#202838',

  // ---- the mountain over the clouds at dawn
  olympus: '#a88868',


  // ---- his kit: the ink line, the cloak's crest red, leather, bronze and steel
  inkLine: '#16090e',
  // ---- the chain of the tech stack climb
  chainSteel: '#4a4a58',
  // ---- the eras behind the page: the storm sea with the serpent, the harbour city under the bronze giant, the mountain at dawn
  stormLow: '#2a3a38',
  sea: '#405050',
  seaFoam: '#c8d8d0',
  sail: '#a89050',
  lightning: '#e8f4ff',
  hydraBelly: '#7a8a5a',
  harbourHigh: '#101828',
  bronzeGiantLight: '#7a9a78',
  city: '#18202c',
  smoke: '#3a3a44',
  olympusHigh: '#485868',
  olympusLow: '#e3b24f',
  olympusRock: '#6a5a50',
  cloud: '#f4e6c8',
  waterfall: '#d8ecf4',
  ash: '#e4ded4',
  crest: '#c4161c',
  rim: '#f0a070',
  leather: '#6a3e24',
  leatherShade: '#3a2014',
  kiltShade: '#5e0d12',
  bronze: '#c08a40',
  steel: '#a4aab0',
  steelShade: '#4c5258',
  bladeFire: '#ff8a2a',
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
} as const

export const MYTH_VARS = paletteVars('myth', MYTH)
