// Cell Shaded's palette, every colour of the world once: the wasteland drawn like a comic book in thick ink
// with hatching, the way the looter shooter it comes from looks in its footage (research notes, Look): dusty
// tan, ochre and rust under a washed out sky in the badlands, cold purple and blue at the dig and on the scrap
// coast, salt white on the flats, snow white and steel grey at the vault, and the night over it. Over that, the
// game's own colours: the rarity ladder of the loot (white, green, blue, purple, orange), the red of the boss
// cards and the damage numbers' sun, the shield blue of the voice and the digital build. The SVG art reads the
// constants; the root sets them all as --cel-<key> (paletteVars), so cel.module.css and the class strings
// paint the same values.

export const CEL = {
  // The ink line round every shape and the paper the cards are printed on
  ink: '#141414',
  inkSoft: '#2b2b33',
  paper: '#fbf3df',
  // The paper's shade, for the site chrome's surfaces (themes.ts)
  paperShade: '#eadcb8',
  white: '#ffffff',

  // The comic accents of the lettering
  // The deep sky blue, the site chrome's accent (themes.ts)
  skyDeep: '#1d6fa8',
  sun: '#ffd23f',
  orange: '#ff7a1a',
  red: '#e2362c',
  // The red's cel shadow side: his tee, his Muay Thai shorts
  redShade: '#9e2219',
  sand: '#f2c66d',
  steel: '#8a93a6',
  steelDark: '#4d5466',
  steelLight: '#c3c9d4',

  // The badlands: the washed out sky, the haze on the horizon, the rust ridges, the ochre dunes, the tan
  // ground and their shadow sides
  dustSky: '#9fb2bb',
  haze: '#e7d6ae',
  mesa: '#b0673a',
  mesaShade: '#7a4126',
  dune: '#cfa66a',
  duneShade: '#a77b46',
  ground: '#d8b57f',
  groundShade: '#b08654',
  rock: '#6b3a26',
  scrub: '#6f7a3a',
  // The scrub olive in shadow: his plate carrier's shadow side and its mag pouches
  scrubShade: '#4c5a3a',
  // The rust on sheet metal and wrecks
  rust: '#8e4a24',
  sheet: '#9a9488',
  sheetShade: '#6c675f',

  // The afternoon over the mine
  noonDust: '#c2ad8c',
  noonHaze: '#ecc58c',
  // The dig at dusk
  duskSky: '#6c5a86',
  duskHaze: '#e39a64',
  duskRidge: '#7a4a5a',
  duskRidgeShade: '#4e2f40',
  duskGround: '#b98a62',
  duskGroundShade: '#8c6243',
  // The scrap coast, cold
  coastSky: '#5d6f8f',
  coastHaze: '#aab5c2',
  coastRidge: '#4f5a6e',
  coastRidgeShade: '#343d4f',
  coastGround: '#8d8a7d',
  coastGroundShade: '#66645b',
  // The salt flats
  saltSky: '#a6bfcc',
  saltHaze: '#eef0ea',
  saltRidge: '#9aa3b1',
  saltRidgeShade: '#737c8b',
  salt: '#f1efe6',
  saltShade: '#cfd2d2',
  // The vault in the snow
  vaultSky: '#7487a6',
  vaultHaze: '#d9e1ea',
  vaultRidge: '#5e6b80',
  vaultRidgeShade: '#414b5c',
  snow: '#f4f6f8',
  snowShade: '#c7d0dc',
  // The night at the end
  night: '#24214a',
  nightHigh: '#0f1230',
  nightLow: '#3a2f6e',
  nightRidge: '#2a2448',
  nightGround: '#4a3d5e',
  nightGroundShade: '#352b47',

  // The bounty board's planks and its paper notices
  plank: '#a8743f',
  plankLight: '#9a6836',
  plankShade: '#6e4524',
  notice: '#f6ecd2',

  // The musician's jeans and their shadow side
  denim: '#2c3a5c',
  denimShade: '#1b2440',

  // The raiders' sack hoods and their stitching
  sack: '#c9b089',
  sackShade: '#97805d',
  // The flesh of the hive and the beasts' hides
  flesh: '#e3c3b0',
  fleshShade: '#b98f7d',
  hide: '#8a6a4a',
  hideShade: '#5e4630',

  // The loot rarity ladder, lowest to highest
  common: '#f4f4f0',
  uncommon: '#4ccf3a',
  rare: '#2f7bff',
  epic: '#9b3df0',
  legendary: '#ff8a00',

  // The red flavour line on a card and the achievement star
  flavour: '#b3170c',
  // The flavour red a step deeper for its words on the card paper, 7:1 even on the paper's shade; the
  // stamp's frame keeps flavour.
  flavourText: '#861108',
  crit: '#ff2a1a',
  // The boss card: its name's red, the hot orange it fades to
  bossRed: '#c3161b',
  bossHot: '#f3801f',

  // The shield blue of the voice, the scope's glass and the digital build
  holo: '#38d6ff',
  holoDeep: '#0c6f9a',
  // The vault's purple: its weak points and the monster's glow
  eldritch: '#b43df0',
} as const
