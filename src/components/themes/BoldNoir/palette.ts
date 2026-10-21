import { paletteVars } from '../shared/paletteVars'

// Bold Noir's palette, the colours its SVG art is drawn in: a graphic novel night in black, white and the
// greys between, with one red accent for what the eye must land on (a tie, a glove, a curtain, a strike).
// The page's surfaces, text and borders read the same colours as the CSS variables NOIR_VARS sets on
// the world's root.

export const NOIR = {
  // The night and its shadows, darkest first
  ink: '#0a0a0a',
  coal: '#161616',
  smoke: '#2a2a2a',
  ash: '#5c5c5c',
  fog: '#a3a3a3',

  // The light: lamp, window, paper, and the paper in shadow
  paper: '#f2efe6',
  paperDim: '#d6d3cb',

  // The one accent
  red: '#ff0033',
  redDeep: '#8c0019',
} as const

/** The palette as CSS variables (--noir-ink, --noir-paper-dim and so on), set once on the world's root. */
export const NOIR_VARS = paletteVars('noir', NOIR)
