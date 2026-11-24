import { paletteVars } from '../shared/paletteVars'

// Bold Noir's palette: the black and white mode of the 1947 detective game the world is drawn from, black
// slabs and white paper cut on diagonals, with one loud red for the menu's pick, the calling card and what
// lights as he works a case (the tie, the roof light, the clue, the stars). Paper on red
// measures 5:1, so a red box that carries paper text is the deeper redPlate (7:1); ink text sits on paper.

export const NOIR = {
  // The night and its shadows, darkest first
  ink: '#0a0a0a',
  coal: '#161616',
  smoke: '#2a2a2a',
  ash: '#5c5c5c',
  fog: '#a3a3a3',

  // The paper of the calling cards and the speech boxes
  paper: '#f7f5ef',
  paperDim: '#d6d3cb',

  // The one loud colour and its shadow
  red: '#d50018',
  redPlate: '#aa0013',
  redDeep: '#7a0010',
} as const

/** The palette as CSS variables (--noir-ink, --noir-paper-dim and so on), set once on the world's root. */
export const NOIR_VARS = paletteVars('noir', NOIR)
