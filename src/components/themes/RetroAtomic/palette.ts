// Retro Atomic's palette, every colour of the world once: the phosphor green of a tube terminal,
// shelter blue and atomic yellow, rocket red, the dust and rust outside, the bunker's steel. The SVG art
// reads the constants; ATOMIC_COLORS feeds the `atomic` colour group in tailwind.config.ts, so the class
// strings (text-atomic-phosphor, border-atomic-phosphor/30) and world.module.css (theme(), with its
// opacity) paint the same values.

// PHOSPHOR: the tube terminal
export const PHOSPHOR_GREEN = '#14FF00'
export const PHOSPHOR_GREEN_DIM = '#10CC00'
export const PHOSPHOR_GREEN_DARK = '#0D9900'
export const SCREEN_BG = '#001a00'

// SHELTER: the civil defence blue and yellow
export const SHELTER_BLUE = '#0066CC'
export const SHELTER_BLUE_DARK = '#004499'
export const ATOMIC_YELLOW = '#FFD700'
export const ATOMIC_YELLOW_DIM = '#FFCC00'

// ROCKET: the space age red
export const ROCKET_RED = '#CC0000'
export const ROCKET_RED_DARK = '#990000'
export const ROCKET_RED_LIGHT = '#FF4D4D'

// DUST AND RUST: outside the shelter
export const DUST_BROWN = '#8B7355'
export const DUST_BROWN_DARK = '#4A3728'
export const DUST_BROWN_MID = '#6B5344'
export const RUST_ORANGE = '#B7410E'
export const RUST_DARK = '#8B3A0E'

export const TERMINAL_AMBER = '#FF9900'

// BACKGROUNDS AND TEXT: the terminal black page, the rusted panel's dark, the bunker's wall, the ash grey
// of worn lettering
export const INK = '#0a0a08'
export const PANEL_BG = '#0d0d0a'
export const BUNKER_BG = '#1a1a16'
export const ASH = '#A3A38C'

// BUNKER: the steel, lamps and fittings the scroll scenes are built from
export const STEEL = '#23261f'
export const STEEL_LIGHT = '#3d4136'
export const STEEL_EDGE = '#5a5e50'
export const CHROME = '#c9cbb8'
export const CASING = '#8f8a6a'
export const LAMP_GLOW = '#ffe9a8'
export const VELVET = '#5a1020'
export const VELVET_FOLD = '#3d0a15'

// The `atomic` Tailwind colour group, one entry per palette colour the page's classes and world.module.css paint.
export const ATOMIC_COLORS = {
  phosphor: PHOSPHOR_GREEN,
  'phosphor-dim': PHOSPHOR_GREEN_DIM,
  screen: SCREEN_BG,
  blue: SHELTER_BLUE,
  'blue-dark': SHELTER_BLUE_DARK,
  yellow: ATOMIC_YELLOW,
  'yellow-dim': ATOMIC_YELLOW_DIM,
  red: ROCKET_RED,
  'red-light': ROCKET_RED_LIGHT,
  dust: DUST_BROWN,
  'dust-mid': DUST_BROWN_MID,
  'dust-dark': DUST_BROWN_DARK,
  rust: RUST_ORANGE,
  'rust-dark': RUST_DARK,
  amber: TERMINAL_AMBER,
  ink: INK,
  panel: PANEL_BG,
  bunker: BUNKER_BG,
  ash: ASH,
  steel: STEEL,
  'steel-light': STEEL_LIGHT,
  'steel-edge': STEEL_EDGE,
  velvet: VELVET,
  'velvet-fold': VELVET_FOLD,
} as const
