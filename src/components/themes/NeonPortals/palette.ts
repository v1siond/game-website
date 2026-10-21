import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// The time travel world's colours (the 1998 platformer's time machine hub, Warped, named in code only),
// taken from the game's screens (research 2026-10-21-warped-v2): the hub's deep navy night with its
// magenta glow and stars, the warp rooms' stone, planks and glossy blue level pads, the logo's yellow
// letters with their red-brown edge, the level names' orange to red ramp, the score digits' orange to
// yellow green ramp, the crate wood with its X brace and the yellow green marks outlined in red, the
// TNT red and gold, the nitro greens, the steel, and him as the bandicoot: orange fur, blue jeans, red
// sneakers, with his own skin on the muzzle, his dark hair and beard and his black oval eyes
// (HERO_IDENTITY). The SVG art reads these values and the page reads the same values as --np-*
// variables (PORTAL_VARS on the root), so this file is their one source.
//
// Text on the night (VOID), measured: WHITE 17.9:1, MUTED 10.2:1, ORANGE 9.5:1, TITLE 13.9:1, GOLD
// 14.0:1, TEAL 13.2:1, HUD_TOP 6.5:1, HUD_LOW 8.5:1, NAME_LOW 7.0:1; on a PANEL card WHITE 14.6:1, MUTED
// 8.3:1, GOLD 11.4:1, TEAL 10.8:1, VIOLET 6.6:1, GREEN 9.7:1. VOID ink on ORANGE 9.5:1, GOLD 14.0:1,
// TEAL 13.2:1, STONE_LIT 8.1:1 and PLANK_LIT 7.4:1 (the buttons and the crate name plates); WHITE on
// PAD 5.9:1 (the level pad buttons).

export const PORTAL = {
  // the night over the hub, darkest first, and its magenta glow (HAZE)
  VOID: '#07031f',
  CHAMBER: '#120a45',
  PANEL: '#1b1258',
  SEAM: '#342a86',
  NIGHT: '#1b0b6e',
  HAZE: '#7a1a8c',

  // the warp rooms: castle stone, indigo plating, the electric cyan and blue of the warp, gold trims
  STONE: '#6f6c58',
  STONE_LIT: '#a9a58a',
  STONE_DARK: '#3e4336',
  PLATE: '#2a1f7a',
  PLATE_LIT: '#4b3cc0',
  TEAL: '#4fe3ff',
  TEAL_DEEP: '#1b4fd8',
  BRASS: '#f2c230',
  BRASS_DARK: '#8a5a10',

  WHITE: '#f4f1e8',
  MUTED: '#b9b3e0',

  // the fruit, the title letters and the lit trims
  ORANGE: '#ff9a1f',
  ORANGE_DEEP: '#c4520a',
  FRUIT_RED: '#e8461e',
  FRUIT_DEEP: '#9e2410',
  LEAF: '#4fbf3a',
  LEAF_DARK: '#23701c',

  // the warp tunnel and the three hub swirls
  BLUE: '#38b6ff',
  BLUE_DEEP: '#1446b8',
  VIOLET: '#c08bff',
  GREEN: '#5fe06a',

  // the crates: wood, its frame and X brace, the marks, TNT, nitro, metal and the bounce slats
  PLANK: '#b5602c',
  PLANK_LIT: '#d98a4e',
  PLANK_DARK: '#7a3a1c',
  BAND: '#5a2a12',
  TNT: '#9f2509',
  TNT_DARK: '#5a1306',
  CRATE_EDGE: '#3a1a0c',
  MARK: '#b8d23a',
  MARK_EDGE: '#c0201a',
  PINE: '#e8b46a',
  NITRO: '#5cc102',
  NITRO_BAND: '#c6e83a',
  NITRO_DARK: '#2f6a06',
  METAL: '#bab6bb',
  METAL_DARK: '#4b5463',

  // the gem, the crystal, the relics and the time trial clock
  GEM: '#9ff3ff',
  CRYSTAL: '#b48ad0',
  CRYSTAL_DEEP: '#674183',
  GOLD: '#ffd23f',
  SAPPHIRE: '#3c6dff',
  PLATINUM: '#dfe6ee',

  // him as the bandicoot
  FUR: '#d7842c',
  FUR_LIT: '#f2b742',
  FUR_DARK: '#962d08',
  JEANS: '#001db2',
  JEANS_DARK: '#171e48',
  SNEAKER: '#a22524',
  SNEAKER_DARK: '#5c2828',
  SOLE: '#cfc3b6',
  GLOVE: '#582a23',
  MUZZLE: HERO_IDENTITY.skin,
  MUZZLE_SHADE: HERO_IDENTITY.skinShade,
  HAIR: HERO_IDENTITY.hair,
  BEARD: HERO_IDENTITY.beard,
  EYE: HERO_IDENTITY.eyes,
  TOOTH: '#fffaf0',
  MOUTH: '#5a1410',

  // the floating mask: carved wood, its paint and feathers
  MASK_WOOD: '#b52302',
  MASK_LIT: '#d9582a',
  MASK_DARK: '#5e1402',
  MASK_LIP: '#e8a23a',

  // the hub's level pads on their grey rings, the time trial clock, the score digits' ramp, the logo's
  // letters and the level names' ramp (read from the game's pixels)
  PAD: '#0155f1',
  PAD_DARK: '#013694',
  PAD_LIT: '#6fa8ff',
  PAD_RING: '#5c5f6b',
  PLANK_FLOOR: '#6b4a2a',
  PLANK_FLOOR_DARK: '#3f2d1b',
  CLOCK: '#fffe0a',
  HUD_TOP: '#f06a10',
  HUD_LOW: '#a8b004',
  TITLE: '#ffd21a',
  TITLE_EDGE: '#7a1e08',
  NAME_TOP: '#ffc21f',
  NAME_LOW: '#ff6a1a',

} as const

/** The palette as CSS variables (--np-void, --np-stone-lit and so on), set once on the world's root. */
export const PORTAL_VARS = paletteVars('np', PORTAL)
