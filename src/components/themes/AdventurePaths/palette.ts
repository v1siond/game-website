import { paletteVars } from '../shared/paletteVars'

// Adventure Paths' palette: an explorer's map at dusk. Night forest behind the page, parchment for the
// field journal, the red route line drawn across the map, compass gold, mossy stone ruins and the teal
// glow of the old glyphs. SVG fills read the constants; the page reads the same values as CSS variables
// (`--ap-parchment` and so on) that the world's root sets once, so every colour has one owner.
//
// Text pairs: ink on parchment 13.2:1, soft ink on parchment 7.7:1, route red on parchment 4.8:1 and on
// the journal page 5.4:1, forest on parchment 6.4:1, parchment on night 13.4:1, on canopy 10:1 and on
// forest 6.4:1, gold on canopy 5.6:1 and on night 7.6:1, edge on night 7.4:1, ink on gold 7.5:1, white
// on route red 6:1, white on the black HUD bar 21:1, the coin gold on the HUD 14:1.
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
  // Bright as the 16 bit overworld map (research image 28): blue sea, light sand paths, grass green
  // plateaus on tan cliffs.
  SEA: '#4f9cf0',
  SEA_DEEP: '#1f5cc8',
  SAND: '#f0d898',
  MEADOW: '#62c840',
  MEADOW_DARK: '#2f8c2c',
  CLIFF: '#e0a060',
  CLIFF_DARK: '#9c5c2c',
  // The map's fall, once every landmark has been visited: the meadow turns orange brown and the sea teal.
  FALL: '#d0913f',
  FALL_DARK: '#8a4e22',
  TEAL: '#3f9a92',
  // The blue of the overalls and the blue switch; white on it 6.4:1.
  BLUE: '#2f5fae',
  // The levels behind the page, sampled from the research images (notes.md): the day sky, pill hills far
  // off and round hills with eyes near, the grass and soil of the ground, the clouds with faces.
  SKY_HIGH: '#2c78e8',
  SKY_LOW: '#a0dcff',
  HILL_FAR: '#88d0c0',
  HILL_FAR_EDGE: '#3c8c84',
  HILL_NEAR: '#40b048',
  HILL_NEAR_DARK: '#1f7a2c',
  GRASS: '#68d040',
  SOIL: '#c87430',
  SOIL_DARK: '#7a3c14',
  CLOUD: '#ffffff',
  CLOUD_SHADE: '#b8d8f8',
  // The other zones: the sky level's mint, the underground's black and teal bricks, the night's navy
  // and teal hills, the fortress's gold blocks on the dark, the sunset's amber over the pipe rocks.
  MINT: '#a8f0e8',
  CAVE: '#000000',
  CAVE_BRICK: '#008890',
  CAVE_BRICK_DARK: '#00505c',
  NIGHT_SKY: '#203050',
  NIGHT_HILL: '#509070',
  FORT: '#2c1c18',
  FORT_GOLD: '#e0a040',
  FORT_GOLD_DARK: '#906020',
  SUNSET_HIGH: '#f09848',
  SUNSET_LOW: '#f8e0a0',
  ROCK: '#c87858',
  ROCK_DARK: '#8c4c38',
  // The things he hits: the ? block and its used shell, bricks, coins, pipes, the note block, the HUD.
  BLOCK: '#f8c030',
  BLOCK_DARK: '#b86c08',
  USED: '#a8683c',
  BRICK: '#c8501c',
  BRICK_DARK: '#6c2008',
  COIN: '#f8d038',
  PIPE: '#40b040',
  PIPE_LIGHT: '#a8f088',
  PIPE_DARK: '#1c6020',
  HUD: '#000000',
} as const

/** The palette as CSS variables, set once on the world's root. */
export const TRAIL_VARS = paletteVars('ap', TRAIL)

// Field journal type: the serif of an expedition log for headings, a plain sans for reading.
export const JOURNAL_SERIF = "font-['Georgia','Times_New_Roman',serif]"
