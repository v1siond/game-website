import { paletteVars } from '../shared/paletteVars'

// The warp world's colours: a stone hub under a violet night, each portal a swirl of its own colour, the
// warm orange of the fruit and the title letters, crate wood, and the cool gem and crystal tones. The
// SVG art reads these values, the page reads the same values as --np-* variables (PORTAL_VARS on the
// root), so this file is their one source.
//
// Text on the night (VOID), measured: WHITE 17.6:1, MUTED 9.3:1, ORANGE 9.4:1, BLUE 8.8:1, VIOLET 7.9:1,
// GREEN 11.7:1, GOLD 13.8:1; on a PANEL card WHITE 14.5:1, MUTED 7.6:1, ORANGE 7.7:1, BLUE 7.3:1,
// VIOLET 6.5:1. VOID ink on ORANGE 9.4:1 and on PLANK 9.1:1 (the buttons and the crate label).

export const PORTAL = {
  // the night over the hub, darkest first
  VOID: '#0b0718',
  CHAMBER: '#160e2e',
  PANEL: '#221844',
  SEAM: '#3a2d66',
  NIGHT: '#2b1d5c',
  HAZE: '#4a2f8c',

  // hub stone, lit from the portals
  STONE: '#5b5f86',
  STONE_LIT: '#8b8fb8',
  STONE_DARK: '#2e3052',

  WHITE: '#f4f1e8',
  MUTED: '#b3adcf',

  // the fruit, the title letters and the lit trims
  ORANGE: '#ff9a1f',
  ORANGE_DEEP: '#c4520a',
  FRUIT_RED: '#e8461e',
  LEAF: '#4fbf3a',

  // the three warp swirls
  BLUE: '#38b6ff',
  VIOLET: '#c08bff',
  GREEN: '#5fe06a',

  // the crate, its bands and the stamp
  PLANK: '#e0a458',
  PLANK_DARK: '#9a5a22',
  BAND: '#6b3a12',

  // the gem, the crystal and the stopwatch digits
  GEM: '#9ff3ff',
  CRYSTAL: '#ff5fd2',
  GOLD: '#ffd23f',

  GRID: '#2b2a6b',
} as const

/** The palette as CSS variables (--np-void, --np-stone-lit and so on), set once on the world's root. */
export const PORTAL_VARS = paletteVars('np', PORTAL)
