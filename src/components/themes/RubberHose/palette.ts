import { paletteVars } from '../shared/paletteVars'

// Rubber Hose's palette, every colour of the world once: the sepia paper of a 1930s cartoon, its ink
// line, the watercolour washes of the big top and the isle map, the faded red and gold of a circus
// poster, the film stock round the frame. The SVG art reads HOSE; HOSE_VARS puts the same
// values on the world's root as --hose-* variables, which the CSS modules and the few Tailwind
// arbitrary values read, so no colour is written twice.

export const HOSE = {
  // The paper, light to dark
  paper: '#f7ead0',
  paperSepia: '#e8d4b0',
  paperDark: '#d4c4a0',
  highlight: '#fff8e7',

  // The ink line and its softer brown
  ink: '#2a2015',
  inkSoft: '#4a3a25',
  shadow: '#8a7a60',
  shadowDark: '#5a4a35',

  // Poster accents
  red: '#c41e3a',
  redDark: '#8b0000',
  redDeep: '#5a0000',
  blue: '#2b4570',
  gold: '#c9a227',
  orange: '#d4652f',

  // The watercolour washes: the isle map's sea and its meadow and shade, the wood of the pole and the
  // bridge, the ring's sawdust and the footlights' glow
  skyWash: '#d9e2d0',
  meadow: '#9aa86f',
  meadowDark: '#6f7d4a',
  boards: '#7a5532',
  footlight: '#f3d98a',

  // His own clothes in the sepia washes: the System Engineer's teal shirt and slate trousers, the Musician's
  // black tee and black trousers, his shoes
  engineerShirt: '#5f8f8a',
  trousers: '#4a5670',
  drummerShirt: '#2e2a26',
  blackTrousers: '#3c3631',
  shoe: '#4a2e1a',

  // The film stock round the frame and its sprocket holes
  film: '#1a1510',
  filmHole: '#0a0805',
} as const

export const HOSE_VARS = paletteVars('hose', HOSE)
