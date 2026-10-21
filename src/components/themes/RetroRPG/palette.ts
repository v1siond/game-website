import { paletteVars } from '../shared/paletteVars'

// Retro RPG's palette: a lo-fi pixel role playing game where every encounter happens on a black screen
// inside a hard white box. White type, orange command buttons that turn yellow when the cursor sits on
// them, a red heart for the visitor's soul, green and yellow for health, cyan and purple for the rare
// coloured attacks. Each profession gets its own encounter light: cyan code rain for the System Engineer,
// purple beat notes for the Musician, the orange strike sparks for the Martial Artist.
//
// This is the one source of the world's colours: SVG fills read the constants, class strings read the
// same values as CSS variables (RPG_VARS, set once on the world's root). The keys void, night, gold,
// text, muted, sky, green, border, windowLow and windowTop also feed the theme registry.
//
// Text pairs on void (#000): text 21:1, muted 13.3:1, gold 19.6:1, orange 9.6:1, green 15.2:1,
// sky 13.4:1, purple 7.4:1, soul 5.3:1 (used at 14px bold or larger, or for shapes only), void on gold
// 19.6:1 and void on orange 9.6:1.
export const RPG = {
  void: '#000000',
  night: '#0b0b12',
  windowLow: '#000000',
  windowTop: '#101018',
  border: '#ffffff',
  borderShade: '#5a5a66',
  text: '#ffffff',
  muted: '#d2d2d8',
  gold: '#ffff3c',
  orange: '#ff9a2e',
  orangeDark: '#a8501a',
  green: '#3cff6a',
  sky: '#6fe3ff',
  purple: '#c58cff',
  soul: '#ff2020',
  soulShine: '#ffb0b0',
  hpBack: '#c41818',
  pellet: '#ffffff',
  // The encounter floor: the dark grid the boxes sit over, and the dim far layer of the starfield.
  grid: '#1c1c2a',
  far: '#3a3a52',
  // The battle backdrop behind him: the dark green panel grid, its far rows dimmer, a low green haze.
  panelNear: '#22b04a',
  panelFar: '#0f5a26',
  haze: '#0a2a14',
  // The room he stands in before the encounter: violet brick, a lit floor of tiles, the light from above.
  wall: '#3b2457',
  wallLit: '#6a4294',
  mortar: '#1e1030',
  floor: '#7e5aa8',
  floorDark: '#4c3270',
  beam: '#fff6c8',
  // The save star's light.
  starCore: '#fffbe0',
  starGlow: '#ffd23c',
  // His clothes and the props he carries, in flat pixel colours.
  tunic: '#3a6fd8',
  stripe: '#9a5ad8',
  vest: '#c43a3a',
  trousers: '#3a2e52',
  boot: '#5a3a24',
  belt: '#ffff3c',
  shorts: '#d83030',
  glove: '#c41818',
  stick: '#efe0b0',
  eye: '#000000',
} as const

/** The palette as CSS variables (--rpg-void, --rpg-soul and so on), set once on the world's root. */
export const RPG_VARS = paletteVars('rpg', RPG)

// Pixel type: the Silkscreen face the root shell loads (RootShell.tsx sets --font-silkscreen), a
// monospace face until it arrives. Body text stays in the monospace face, the way the game's dialogue does.
export const PIXEL = "[font-family:var(--font-silkscreen),'Courier_New',monospace]"
export const MONO = "[font-family:'Courier_New',ui-monospace,monospace]"
