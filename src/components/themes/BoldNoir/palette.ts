// Bold Noir's palette, the colours its SVG art is drawn in: a graphic novel night in black, white and the
// greys between, with one red accent for what the eye must land on (a tie, a glove, a curtain, a strike).
// The page's surfaces paint the same colours from world.module.css; text and borders use them as
// Tailwind arbitrary values.

export const NOIR = {
  // The night and its shadows, darkest first
  ink: '#0a0a0a',
  coal: '#161616',
  smoke: '#2a2a2a',
  ash: '#5c5c5c',
  fog: '#a3a3a3',

  // The light: lamp, window, paper
  paper: '#f2efe6',

  // The one accent
  red: '#ff0033',
  redDeep: '#8c0019',
} as const
