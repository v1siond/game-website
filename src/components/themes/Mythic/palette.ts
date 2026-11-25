import { paletteVars } from '../shared/paletteVars'

// Mythic's palette, every colour of the world once: the crimson, bronze and gold of the Greek war god games,
// the bone and marble of the chrome, his kit (the crimson cloth, the bronze, the red hot edge of his blades),
// and the places of the run in its order, each in the colour the footage gives it: the storm green sea, night
// blue burning Athens, the ochre sandstorm, the warm stone of the temple, the grey storm of the last duel, night
// blue Rhodes under cyan lightning, the bright sky and white marble of the island, the green bog, the black
// chasm and the gold of the mountain of the gods. The SVG art reads MYTH; MYTH_VARS puts the same values on
// the world's root as --myth-* variables for the CSS modules and the Tailwind arbitrary values.

export const MYTH = {
  // ---- the chrome (src/themes/themes.ts reads sky, hallLow, gold, bone, boneShade, terracotta, goldPale,
  // goldDeep, panel and panelEdge for the worlds menu and the error screen)
  sky: '#1d0b14',
  marble: '#efe2c4',
  marbleShade: '#d4c19a',
  ink: '#1c1116',
  inkSoft: '#4a3640',
  terracotta: '#b3122a',
  terracottaDeep: '#6e0a18',
  gold: '#e3b24f',
  goldDeep: '#8a6420',
  goldPale: '#f7dd92',
  bone: '#f3e6cc',
  boneShade: '#c9b48c',
  panel: '#150a10',
  panelEdge: '#3a1a24',
  hallHigh: '#12060c',
  hallLow: '#4a0f1e',
  crimson: '#7d1626',
  blood: '#c2142b',
  // The top of the blood button, a step deeper than blood so the bone words on it read 7:1
  bloodPlate: '#960f21',
  // the portraits' glow and the gate's lintel
  elyLow: '#5a2a16',
  elyLight: '#ffd9a0',
  styxHigh: '#160307',

  // ---- his kit: the ink line, the crimson cloth, bronze, leather, the blades and their chains
  inkLine: '#16090e',
  kilt: '#b0141f',
  kiltShade: '#640a12',
  bronze: '#c08a40',
  bronzeLight: '#e8b868',
  bronzeShade: '#6e4a1e',
  leather: '#6a3e24',
  leatherShade: '#3a2014',
  steel: '#b4b8bc',
  chain: '#8a8478',
  wrap: '#efe7da',
  crest: '#c4161c',
  rim: '#f0a070',
  fire: '#ff8a2a',
  fireCore: '#ffd36b',
  fireRed: '#e8341a',

  // ---- the Aegean in the storm: the green sea, the foam and rain, the ship, the serpent
  seaHigh: '#141f1c',
  seaLow: '#56705f',
  sea: '#2c463d',
  seaFoam: '#c9d8cc',
  deck: '#5a3c24',
  deckShade: '#33210f',
  serpent: '#3f6b5a',
  serpentShade: '#22403a',
  serpentBelly: '#a9b98a',

  // ---- Athens at night, burning, and the war god over it
  athensHigh: '#0b1022',
  athensLow: '#3a2440',
  city: '#171826',
  godBronze: '#2b1d1a',
  godPlate: '#5a3a2a',
  robe: '#ece4d6',
  robeShade: '#b3a690',

  // ---- the desert of lost souls and the chained Titan
  sandHigh: '#b98a4c',
  sandLow: '#e6c48c',
  sand: '#c89c5c',
  titan: '#77716a',
  titanShade: '#48433d',

  // ---- the architect's temple: warm stone and torchlight
  templeHigh: '#24140a',
  templeLow: '#7a5432',
  templeStone: '#b48c5c',
  templeShade: '#6a4a2c',

  // ---- the grey storm of the last duel
  stormHigh: '#15191d',
  stormLow: '#5c6469',

  // ---- Rhodes at night under the bronze giant and the cyan lightning
  rhodesHigh: '#0a1230',
  rhodesLow: '#2c3c66',
  lightning: '#9fe8ff',
  giant: '#8a5a24',
  giantLight: '#d89a4a',
  giantEye: '#7fe0ff',

  // ---- the bright sky, the white island, the winged horse, the griffin and the stone steeds
  skyHigh: '#4f93cc',
  skyLow: '#e6f0f6',
  cloud: '#f4ecdc',
  whiteMarble: '#f2eee6',
  wing: '#fbfaf6',
  wingShade: '#c8c6c0',
  griffin: '#a87440',
  griffinShade: '#5e3c1e',
  steed: '#a29c92',
  steedShade: '#67625a',

  // ---- the bog of the forgotten and its undead king
  bogHigh: '#101e15',
  bogLow: '#4a6a3c',
  bogWater: '#2b4630',
  mist: '#a8c0a0',
  rot: '#6a6a48',
  rotShade: '#3c3c28',
  mail: '#4c5048',

  // ---- the great chasm and the winged man
  chasmHigh: '#040609',
  chasmLow: '#2a2e36',
  rock: '#3c3e46',
  feather: '#ddd2bc',
  featherShade: '#8a7e68',
  oldSkin: '#c9a07a',

  // ---- the mountain of the gods and the earth Titan
  olympusHigh: '#f2c25e',
  olympusLow: '#fff0c8',
  olympusRock: '#9a8a78',
  earth: '#5f6a4c',
  earthShade: '#363e2a',
  moss: '#7a9450',
} as const

export const MYTH_VARS = paletteVars('myth', MYTH)
