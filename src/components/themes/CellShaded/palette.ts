// Cell Shaded's palette, every colour of the world once: the inked wasteland of a looter shooter drawn
// like a comic. Flat saturated fills under one black ink line, hatching in the shadows: the teal noon
// sky over ochre dunes and rust mesas, the dusk and the night the page crosses, the bounty board's wood,
// the rarity ladder of the loot (white, green, blue, purple, orange), the red of the flavour text and
// the critical hit, the respawn station's hologram blue. The SVG art reads the constants; the root sets
// them all as --cel-<key> (paletteVars), so cel.module.css and the class strings paint the same values.

export const CEL = {
  // The ink line round every shape and the paper the cards are printed on
  ink: '#141414',
  inkSoft: '#2b2b33',
  paper: '#fbf3df',
  paperShade: '#eadcb8',
  white: '#ffffff',

  // The comic accents of the lettering
  sky: '#3fc4e8',
  skyDeep: '#1d6fa8',
  sun: '#ffd23f',
  orange: '#ff7a1a',
  magenta: '#e8318a',
  violet: '#5b3a9a',
  night: '#24214a',
  red: '#e2362c',
  green: '#5fc14a',
  sand: '#f2c66d',
  steel: '#8a93a6',
  steelDark: '#4d5466',

  // The sky per zone, high to low: noon over the desert, dusk over the loot field, night at the station
  noonHigh: '#2a9fb0',
  noonLow: '#8fe0d8',
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

  // The bounty board's planks and its paper notices
  plank: '#a8743f',
  plankShade: '#6e4524',
  notice: '#f6ecd2',

  // The loot rarity ladder, lowest to highest
  common: '#f4f4f0',
  uncommon: '#4ccf3a',
  rare: '#2f7bff',
  epic: '#9b3df0',
  legendary: '#ff8a00',

  // The red flavour line on a card and the critical hit text
  flavour: '#b3170c',
  crit: '#ff2a1a',

  // The respawn station's hologram and its glow
  holo: '#38d6ff',
  holoDeep: '#0c6f9a',
} as const

export type CelColor = keyof typeof CEL
