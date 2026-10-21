import type { CSSProperties } from 'react'

// Rubber Hose's palette, every colour of the world once: the sepia paper of a 1930s cartoon, its ink
// line, the faded red and gold of a theatre poster, the film stock round the frame. The SVG art reads
// HOSE; HOSE_VARS puts the same values on the world's root as --hose-* variables, which
// world.module.css, scenes.module.css and the few Tailwind arbitrary values read, so no colour is
// written twice.

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

  // The film stock round the frame and its sprocket holes
  film: '#1a1510',
  filmHole: '#0a0805',
} as const

type HoseColor = keyof typeof HOSE

// paperSepia becomes --hose-paper-sepia.
const varName = (key: HoseColor) => `--hose-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`

export const HOSE_VARS = Object.fromEntries(
  (Object.keys(HOSE) as HoseColor[]).map((key) => [varName(key), HOSE[key]]),
) as CSSProperties
