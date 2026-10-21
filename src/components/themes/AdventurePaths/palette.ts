import { paletteVars } from '../shared/paletteVars'

// Adventure Paths' palette: an explorer's map at dusk. Night forest behind the page, parchment for the
// field journal, the red route line drawn across the map, compass gold, mossy stone ruins and the teal
// glow of the old glyphs. SVG fills read the constants; the page reads the same values as CSS variables
// (`--ap-parchment` and so on) that the world's root sets once, so every colour has one owner.
//
// Text pairs: ink on parchment 13.2:1, soft ink on parchment 7.7:1, route red on parchment 4.8:1 and on
// the journal page 5.4:1, forest on parchment 6.4:1, parchment on night 13.4:1, on canopy 10:1 and on
// forest 6.4:1, gold on canopy 5.6:1 and on night 7.6:1, edge on night 7.4:1, ink on gold 7.5:1, white
// on route red 6:1.
export const TRAIL = {
  NIGHT: '#14211a',
  CANOPY: '#1f3a2b',
  FOREST: '#2f5a3a',
  MOSS: '#6f8f4e',
  PARCHMENT: '#f3e6c4',
  PAGE: '#fbf3dc',
  EDGE: '#c9a86a',
  INK: '#2b1d0e',
  INK_SOFT: '#5a4026',
  ROUTE: '#b23a22',
  GOLD: '#e0a530',
  LANTERN: '#ffd58a',
  STONE: '#9a927f',
  STONE_DARK: '#5c584e',
  SKY: '#8fb4cf',
  DUSK: '#f2b56b',
  RIVER: '#4f8fb0',
  RUNE: '#59d8c6',
  WOOD: '#7a4e2a',
  BARK: '#3e2a1a',
  // The map's watercolour washes over the parchment: the sea, the sand of the shore, the meadow on the
  // plateau tops and the brown cliff faces under them, each with its shade.
  SEA: '#86aebb',
  SEA_DEEP: '#4f7f93',
  SAND: '#ead39a',
  MEADOW: '#a9bf6e',
  MEADOW_DARK: '#6f8f45',
  CLIFF: '#a8743f',
  CLIFF_DARK: '#6e4523',
  // The map's fall, once every landmark has been visited: the meadow turns orange brown and the sea teal.
  FALL: '#d0913f',
  FALL_DARK: '#8a4e22',
  TEAL: '#3f9a92',
  // The blue of the overalls and the blue switch; white on it 6.4:1.
  BLUE: '#2f5fae',
} as const

/** The palette as CSS variables, set once on the world's root. */
export const TRAIL_VARS = paletteVars('ap', TRAIL)

// Field journal type: the serif of an expedition log for headings, a plain sans for reading.
export const JOURNAL_SERIF = "font-['Georgia','Times_New_Roman',serif]"
