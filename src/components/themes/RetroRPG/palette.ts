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
// Text pairs on void (#000): text 21:1, muted 16.1:1 (7.7:1 on the purple behind the footer), gold
// 19.6:1, orange 9.6:1, green 15.2:1, sky 13.4:1, purple 7.4:1, soul 5.3:1 (used at 14px bold or larger,
// or for shapes only), void on gold 19.6:1 and void on orange 9.6:1.
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
  orange: '#ff9a2e',
  green: '#3cff6a',
  sky: '#6fe3ff',
  purple: '#c58cff',
  soul: '#ff2020',
  soulShine: '#ffb0b0',
  hpBack: '#c41818',
  pellet: '#ffffff',
  // The encounter floor: the dark grid the boxes sit over.
  grid: '#1c1c2a',
  // The battle backdrop behind him: the dark green panel grid, its far rows dimmer, a low green haze.
  panelNear: '#22b04a',
  panelFar: '#0f5a26',
  haze: '#0a2a14',
  // The ruins' wall: violet brick, its lit top and mortar, the light from above.
  wall: '#3b2457',
  wallLit: '#6a4294',
  mortar: '#1e1030',
  beam: '#fff6c8',
  // The save star's light.
  starCore: '#fffbe0',
  starGlow: '#ffd23c',
  // His sprite (sprite.ts): the room's dark brown outline, his hair and beard lifted to read on black, the
  // blue sweater with its two magenta stripes, brown shorts, the sticks' wood and the snare's red shell.
  spriteLine: '#1e0f0c',
  spriteHair: '#45261f',
  sweater: '#67a4e0',
  sweaterStripe: '#e607f8',
  spriteShorts: '#7a4a26',
  stickWood: '#efe0b0',
  snare: '#c43a3a',
  // The places he walks through as the page scrolls (zones.tsx), sampled from the game's rooms (research
  // 2026-10-21-w4-retro-rpg): the violet ruins with red leaves, the snow with its pines and wooden booth,
  // the navy waterfall lit only by cyan glow, the orange and red heat zone, the pastel town.
  ruinsWall: '#84357d',
  ruinsFloor: '#a349a4',
  ruinsPath: '#b962b9',
  leaf: '#e82313',
  leafDark: '#801111',
  snow: '#85a3d8',
  snowShade: '#7281b1',
  snowCap: '#cfdbff',
  pine: '#233832',
  pineLit: '#426377',
  wood: '#c69158',
  woodDark: '#88473b',
  waterWall: '#1a1f56',
  waterFloor: '#1a1445',
  waterLine: '#362f79',
  glow: '#40ffff',
  heatGround: '#b55515',
  heatRock: '#932111',
  heatDeep: '#6a090b',
  slate: '#15242e',
  lava: '#ff3a1a',
  lavaCore: '#ffd23c',
  townGrass: '#c5db9c',
  townWall: '#f7f3bd',
  townMint: '#bdfbbd',
  townRoof: '#a4a26b',
  // The chests' wood: warm boards and their dark seams.
  shopWood: '#ae853b',
  shopDark: '#73553b',
} as const

/** The palette as CSS variables (--rpg-void, --rpg-soul and so on), set once on the world's root. */
export const RPG_VARS = paletteVars('rpg', RPG)

// Pixel type: the Silkscreen face the root shell loads (RootShell.tsx sets --font-silkscreen), a
// monospace face until it arrives. Body text stays in the monospace face, the way the game's dialogue does.
export const PIXEL = "[font-family:var(--font-silkscreen),'Courier_New',monospace]"
export const MONO = "[font-family:'Courier_New',ui-monospace,monospace]"
