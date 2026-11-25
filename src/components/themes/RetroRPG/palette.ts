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
  // The portrait in the job boxes (npcs.ts).
  coatGreen: '#3f8a4a',
  villagerHair: '#6a4a2a',
  // The places of the underground the page runs through (zones.tsx), in the source game's order and
  // colours: the violet brick ruins with their red leaves, the snow forest among the pines, the dark blue
  // cave of glowing water plants, the hot lab country over its lava.
  stone: '#6a4f8c',
  stoneLit: '#8a6aae',
  stoneDark: '#3a2a54',
  moss: '#b83a3a',
  mossDark: '#6a1e2a',
  snow: '#85a3d8',
  snowShade: '#7281b1',
  snowCap: '#cfdbff',
  pine: '#233832',
  pineLit: '#426377',
  wood: '#c69158',
  woodDark: '#88473b',
  caveWall: '#0e1a3a',
  caveFloor: '#152448',
  caveLine: '#24407a',
  crystal: '#40ffff',
  crystalViolet: '#b080ff',
  heatSky: '#3a1a14',
  basalt: '#2a2422',
  basaltLit: '#4a3c36',
  ash: '#5a4a48',
  lava: '#ff3a1a',
  lavaCore: '#ffd23c',
  // The weaver's stall in the hot country: its posts, the stripes of its roof and the awning.
  townBeam: '#6a4428',
  townRoof: '#a8402a',
  awning: '#d8c870',
  // The stall's counter: warm boards and their dark seams.
  shopWood: '#ae853b',
  shopDark: '#73553b',
  // The grey royal city before the barrier, and the wall of light itself.
  royalSky: '#24242c',
  royalWall: '#5e5e6a',
  royalLit: '#8e8e9c',
  royalDark: '#3a3a44',
  barrier: '#e8f4ff',
  // The surface at sunset, seen from the cliff at the end of the run.
  sunsetHigh: '#3a2a6a',
  sunsetMid: '#c8583a',
  sunsetLow: '#f0a040',
  cliff: '#4a3428',
  cliffLit: '#7a5438',
  duskGrass: '#3e5a30',
  // The cast he meets on the way (npcs.ts), each drawn for this page.
  lantern: '#f0c060',
  lanternRim: '#a83a2a',
  robe: '#5a46a8',
  robeTrim: '#e8d8a0',
  helmet: '#c8c8d8',
  scarf: '#d83a3a',
  guardSuit: '#3a5a9a',
  owl: '#8a6a48',
  owlWing: '#5a422e',
  armour: '#4a5a7a',
  visor: '#40ffff',
  weaver: '#8a4ab0',
  weaverDress: '#4a2a68',
  chrome: '#b8b8c8',
  jukebox: '#c83a5a',
  champion: '#7a7a88',
  cape: '#8a1e2a',
  kidShirt: '#3a8ac8',
  straw: '#d8b860',
} as const

/** The palette as CSS variables (--rpg-void, --rpg-gold and so on), set once on the world's root. */
export const RPG_VARS = paletteVars('rpg', RPG)

// Pixel type: the Silkscreen face the root shell loads (RootShell.tsx sets --font-silkscreen), a
// monospace face until it arrives. Body text stays in the monospace face, the way the game's dialogue does.
export const PIXEL = "[font-family:var(--font-silkscreen),'Courier_New',monospace]"
export const MONO = "[font-family:'Courier_New',ui-monospace,monospace]"
