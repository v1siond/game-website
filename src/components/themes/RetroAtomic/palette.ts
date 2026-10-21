// Retro Atomic's palette, every colour of the world once: the green phosphor of the wrist terminal's
// tube on its near black glass, the olive and brown plastic of the device round it, the shelter's blue
// and yellow, the cream, ink and flat blue of the mascot posters, the rust and dust of the wasteland
// outside and the warning red. The SVG art reads the constants; ATOMIC_COLORS feeds the `atomic` colour
// group in tailwind.config.ts, so the class strings (text-atomic-phosphor, border-atomic-phosphor/40)
// and atomic.module.css (theme(), with its opacity) paint the same values.

// TUBE: the phosphor and the glass it glows on. The phosphor is the series' default HUD green, the
// game ini's iHUDColor 18, 255, 21. Phosphor on glass measures 13.8:1, dim on glass 7.1:1, glass on a
// phosphor fill (the picked row) 13.8:1; ink on cream 14.8:1, cream on poster blue 5.3:1.
export const PHOSPHOR = '#12ff15'
export const PHOSPHOR_DIM = '#0fb812'
export const PHOSPHOR_DEEP = '#0a5c0c'
export const GLASS = '#03140a'
export const GLASS_EDGE = '#062a15'

// DEVICE: the wrist terminal's moulded plastic, its rubber and its metal fittings.
export const OLIVE = '#4b4f36'
export const OLIVE_DARK = '#2c2f1f'
export const OLIVE_LIGHT = '#6d7250'
export const BAKELITE = '#3b2a1f'
export const RUBBER = '#16150f'
export const BRASS = '#b08d3c'
export const CHROME = '#c9cbb8'

// SHELTER: the blue jumpsuit and the yellow trim, the steel of the door and its frame.
export const SHELTER_BLUE = '#1d4e89'
export const SHELTER_BLUE_DARK = '#123358'
export const SHELTER_YELLOW = '#f5c400'
export const STEEL = '#3a3d34'
export const STEEL_LIGHT = '#5d6154'
export const STEEL_EDGE = '#7c8072'

// POSTER: the cartoon cards, flat cream paper, ink outline, poster blue.
export const CREAM = '#f1e6c8'
export const CREAM_SHADE = '#d9c99f'
export const POSTER_INK = '#16140f'
export const POSTER_BLUE = '#2a5d9f'

// OUTSIDE: the wasteland's dust and rust, the warning lamp's red.
export const DUST = '#c2945a'
export const DUST_DARK = '#5e4429'
export const RUST = '#9a4a1c'
export const WARNING_RED = '#d8392b'
export const WARNING_RED_LIGHT = '#ff6b5c'

// BACKGROUNDS AND TEXT: the shelter's dark, the panel behind the device, the grey of worn lettering.
export const INK = '#0b0c09'
export const PANEL = '#121410'
export const BUNKER = '#1b1d17'
export const ASH = '#b3b49f'


// The `atomic` Tailwind colour group, one entry per palette colour the page's classes and atomic.module.css paint.
export const ATOMIC_COLORS = {
  phosphor: PHOSPHOR,
  'phosphor-dim': PHOSPHOR_DIM,
  'phosphor-deep': PHOSPHOR_DEEP,
  glass: GLASS,
  'glass-edge': GLASS_EDGE,
  olive: OLIVE,
  'olive-dark': OLIVE_DARK,
  'olive-light': OLIVE_LIGHT,
  bakelite: BAKELITE,
  rubber: RUBBER,
  brass: BRASS,
  blue: SHELTER_BLUE,
  'blue-dark': SHELTER_BLUE_DARK,
  yellow: SHELTER_YELLOW,
  steel: STEEL,
  'steel-light': STEEL_LIGHT,
  'steel-edge': STEEL_EDGE,
  cream: CREAM,
  'cream-shade': CREAM_SHADE,
  'poster-ink': POSTER_INK,
  'poster-blue': POSTER_BLUE,
  dust: DUST,
  'dust-dark': DUST_DARK,
  rust: RUST,
  red: WARNING_RED,
  'red-light': WARNING_RED_LIGHT,
  ink: INK,
  panel: PANEL,
  bunker: BUNKER,
  ash: ASH,
} as const
