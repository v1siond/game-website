// Cell Shaded's palette, every colour of the world once: the inked desert drawn like a comic. Flat
// saturated fills under one black ink line, hatching in the shadows: the teal noon sky over ochre dunes
// and rust mesas, the dusk and the night the page crosses, the bounty board's wood, the rarity ladder of
// the loot (white, green, blue, purple, orange), the red of the flavour text and the achievement stars,
// the station's hologram blue. The SVG art reads the constants; the root sets
// them all as --cel-<key> (paletteVars), so cel.module.css and the class strings paint the same values.

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
  magenta: '#e8318a',
  night: '#24214a',
  red: '#e2362c',
  // The red's cel shadow side: his tee, his Muay Thai shorts and the heavy bag
  redShade: '#9e2219',
  sand: '#f2c66d',
  steel: '#8a93a6',
  steelDark: '#4d5466',

  // The sky per hour, high to low: noon over the desert, dusk over the loot chests, night at the station
  noonHigh: '#2a9fb0',
  noonMid: '#5cc4c9',
  noonLow: '#8fe0d8',
  // The town's afternoon sky over the sand and the orange
  townHigh: '#3b8fb0',
  duskHigh: '#5b2b5e',
  duskLow: '#f2793a',
  nightHigh: '#0f1230',
  nightLow: '#3a2f6e',

  // The desert: dunes, mesas and their shadow sides, the scrub
  dune: '#e8b86a',
  duneShade: '#c98a46',
  mesa: '#c4612f',
  mesaShade: '#8d3b20',
  rock: '#6b3a26',
  scrub: '#6f8a3a',
  // The scrub olive in shadow: his plate carrier's shadow side and its mag pouches
  scrubShade: '#4c5a3a',

  // The bounty board's planks and its paper notices
  plank: '#a8743f',
  plankLight: '#9a6836',
  plankShade: '#6e4524',
  notice: '#f6ecd2',

  // The musician's jeans and their shadow side
  denim: '#2c3a5c',
  denimShade: '#1b2440',

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

  // The station's hologram and its glow
  holo: '#38d6ff',
  holoDeep: '#0c6f9a',
} as const
