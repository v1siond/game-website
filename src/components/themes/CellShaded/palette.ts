// Cell Shaded's palette, the colours its SVG art is drawn in: flat cel bands with one hard ink line, the
// way toon shaded games paint a sunset, a stage or a rooftop ring. The page's surfaces paint the same
// colours from world.module.css; text and borders use them as Tailwind arbitrary values.

export const CEL = {
  // The ink line around every shape and the paper it is drawn on
  ink: '#141414',
  inkSoft: '#2b2b33',
  paper: '#fbf3df',
  paperShade: '#eadcb8',

  // The sky in flat bands, day to dusk
  sky: '#3fc4e8',
  skyDeep: '#1d6fa8',
  sun: '#ffd23f',
  orange: '#ff7a1a',
  magenta: '#e8318a',
  violet: '#5b3a9a',
  night: '#24214a',

  // Accents
  red: '#e2362c',
  green: '#5fc14a',
  sand: '#f2c66d',
  steel: '#8a93a6',
} as const
