import { paletteVars } from '../shared/paletteVars'

// Retro RPG's palette: a 16 bit role playing game's command windows. White type in hard white bordered
// windows on black, the cursor arrow and the picked command in yellow, green and sky for the lines a window
// names things in. Each place of the walk has its own colours.
//
// This is the one source of the world's colours: SVG fills read the constants, class strings read the
// same values as CSS variables (RPG_VARS, set once on the world's root). The keys void, night, gold,
// text, muted, sky, green, border, windowLow and windowTop also feed the theme registry.
//
// Text pairs on void (#000): text 21:1, muted 16.1:1 (7.7:1 on the purple behind the footer), gold
// 19.6:1, green 15.2:1, sky 13.4:1, purple 7.4:1, void on gold 19.6:1.
export const RPG = {
  void: '#000000',
  night: '#0b0b12',
  windowLow: '#000000',
  windowTop: '#101018',
  border: '#ffffff',
  borderShade: '#5a5a66',
  text: '#ffffff',
  muted: '#e1e1e5',
  gold: '#ffff3c',
  green: '#3cff6a',
  sky: '#6fe3ff',
  purple: '#c58cff',
  red: '#d42a2a',
  // The encounter floor: the dark grid the boxes sit over.
  grid: '#1c1c2a',
  // The battle backdrop behind him: a field at dusk, its sky bands and the far hills.
  duskHigh: '#1b2350',
  duskLow: '#4a3a78',
  hillFar: '#2a2f5e',
  hillNear: '#1d4a3a',
  // The save point's light.
  runeGlow: '#7ff0ff',
  runeCore: '#e8ffff',
  // His sprite (sprite.ts): the dark outline, his hair and beard lifted to read on black, his own clothes
  // per profession (the System Engineer's teal shirt and jeans, the Musician's black tee and black jeans,
  // the Martial Artist's red shorts and gold wraps), the sticks' wood and the snare's red shell.
  spriteLine: '#1e0f0c',
  spriteHair: '#45261f',
  engineerShirt: '#2f8a8c',
  jeans: '#2c4f8a',
  drummerShirt: '#2c2a34',
  blackJeans: '#4a4852',
  shorts: '#c8301f',
  wraps: '#f0b030',
  stickWood: '#efe0b0',
  snare: '#c43a3a',
  // The cast he meets (npcs.ts): the critter's shell and shine, the villagers' and the bandmates' clothes.
  critter: '#5a2c78',
  critterShine: '#a070c8',
  critterBelly: '#f09028',
  coatRed: '#b8442e',
  coatGreen: '#3f8a4a',
  coatBlue: '#3a5ab0',
  coatGold: '#c89a30',
  villagerHair: '#6a4a2a',
  // The places he walks through as the page scrolls (zones.tsx): the grey green stone ruins with moss,
  // the snow town of log houses among the pines, the crystal cave, the volcano over its lava channel, the
  // market town with its awnings.
  stone: '#5c6658',
  stoneLit: '#7f8a78',
  stoneDark: '#33392f',
  moss: '#5f9a3a',
  mossDark: '#2f5a24',
  snow: '#85a3d8',
  snowShade: '#7281b1',
  snowCap: '#cfdbff',
  pine: '#233832',
  pineLit: '#426377',
  wood: '#c69158',
  woodDark: '#88473b',
  caveWall: '#22283a',
  caveFloor: '#2e3448',
  caveLine: '#40486a',
  crystal: '#40ffff',
  crystalViolet: '#b080ff',
  heatSky: '#3a1a14',
  basalt: '#2a2422',
  basaltLit: '#4a3c36',
  ash: '#5a4a48',
  lava: '#ff3a1a',
  lavaCore: '#ffd23c',
  townGrass: '#8fbf5a',
  townWall: '#efe0c0',
  townBeam: '#6a4428',
  townRoof: '#a8402a',
  awning: '#d8c870',
  // The chests' and the counters' wood: warm boards and their dark seams.
  shopWood: '#ae853b',
  shopDark: '#73553b',
} as const

/** The palette as CSS variables (--rpg-void, --rpg-gold and so on), set once on the world's root. */
export const RPG_VARS = paletteVars('rpg', RPG)

// Pixel type: the Silkscreen face the root shell loads (RootShell.tsx sets --font-silkscreen), a
// monospace face until it arrives. Body text stays in the monospace face, the way the game's dialogue does.
export const PIXEL = "[font-family:var(--font-silkscreen),'Courier_New',monospace]"
export const MONO = "[font-family:'Courier_New',ui-monospace,monospace]"
