import { paletteVars } from '../shared/paletteVars'

// Retro RPG's palette: a 16 bit role playing game at night. The page is a deep night blue; every panel
// is a dialogue window (a blue gradient inside a white pixel border with a grey inner line), its cursor
// gold. Each profession's level has its own light: a daytime overworld meadow for the System Engineer,
// a starry night camp around the fire for the Musician, an arena courtyard at dusk for the Martial
// Artist.
//
// This is the one source of the world's colours: SVG fills read the constants, class strings read the
// same values as CSS variables (RPG_VARS, set once on the world's root).
//
// Text pairs: text on window low 16.8:1 and on window top 9.3:1, muted on window low 11.9:1 and on
// window top 6.6:1, gold 12.1:1, green 11.2:1 and sky 10.5:1 on window low (5.8:1 or more on window
// top), void on gold 14.1:1.
export const RPG = {
  void: '#060a1f',
  night: '#0b1236',
  windowTop: '#2a3d9e',
  windowLow: '#0d1650',
  border: '#f4f4f4',
  borderShade: '#8a93b8',
  text: '#ffffff',
  muted: '#d3d8ee',
  gold: '#ffd75e',
  green: '#8ee69a',
  sky: '#9fd3f7',
  // The daytime overworld: sky, far mountains, the trees, the grass and the dirt path.
  dayTop: '#3d7fd6',
  dayLow: '#a9dcf5',
  mountain: '#6f84c2',
  snow: '#e9f1ff',
  tree: '#22602f',
  grass: '#3f9a3a',
  grassDark: '#2a6b2c',
  path: '#c9a26b',
  pathEdge: '#8d6a3e',
  // The towns along the path and the castle at its end.
  wall: '#efe2c0',
  roof: '#c4473a',
  stone: '#8b8f9e',
  stoneDark: '#4c5064',
  lamp: '#ffe9a0',
  // The night camp: the sky, the stars, the hills, the tents and the fire.
  nightTop: '#050822',
  nightLow: '#1d2a6b',
  star: '#fff6c8',
  hill: '#121a45',
  tent: '#7a5a3a',
  fire: '#ff8a2a',
  fireCore: '#ffd75e',
  // The arena at dusk: the sky, the walls, the sand, the banners and the ropes.
  duskTop: '#2b1a4a',
  duskLow: '#e88a5a',
  arenaWall: '#6a4a5e',
  sand: '#d9b77a',
  sandEdge: '#a8834c',
  banner: '#c4473a',
  rope: '#f4f4f4',
  // His clothes and the props he carries.
  tunic: '#3554c4',
  vest: '#b0302c',
  trousers: '#5a3d2a',
  boot: '#3a2416',
  belt: '#ffd75e',
  shorts: '#c4302c',
  glove: '#b0202a',
  stick: '#e9d3a0',
  eye: '#120c18',
  pad: '#ffd75e',
  holder: '#2a2440',
} as const

/** The palette as CSS variables (--rpg-void, --rpg-window-top and so on), set once on the world's root. */
export const RPG_VARS = paletteVars('rpg', RPG)

// Pixel type, the menus of a 16 bit role playing game: the Silkscreen face the root shell loads
// (RootShell.tsx sets --font-silkscreen), a monospace face until it arrives.
export const PIXEL = "[font-family:var(--font-silkscreen),'Courier_New',monospace]"
