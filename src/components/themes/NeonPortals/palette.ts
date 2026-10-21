import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// The time travel world's colours (the 1998 platformer's time machine hub, Warped, named in code only):
// the hub's violet and teal machinery under a deep night, the warp tunnel's blue, the fruit's red and
// orange, crate wood, the TNT red and the nitro green, the gem, crystal and relic tones, and him as the
// bandicoot: orange fur, blue jeans, red sneakers, with his own skin on the muzzle, his dark hair and
// beard and his black oval eyes (HERO_IDENTITY). The SVG art reads these values and the page reads the
// same values as --np-* variables (PORTAL_VARS on the root), so this file is their one source.
//
// Text on the night (VOID), measured: WHITE 17.6:1, MUTED 9.3:1, ORANGE 9.4:1, BLUE 8.8:1, VIOLET 7.9:1,
// GREEN 11.7:1, GOLD 13.8:1, TEAL 12.1:1; on a PANEL card WHITE 14.5:1, MUTED 7.6:1, ORANGE 7.7:1,
// BLUE 7.3:1, VIOLET 6.5:1, GOLD 11.4:1. VOID ink on ORANGE 9.4:1, on PLANK_LIT, METAL and GOLD (the
// buttons and the clock); GOLD on TNT 5.3:1 (the crate's word). The art colours (fur, jeans, trainers,
// gloves, crates, crystal, mask wood) are read from the remaster's pixels (research 2026-10-21-warped-v2).

export const PORTAL = {
  // the night over the hub, darkest first
  VOID: '#0b0718',
  CHAMBER: '#160e2e',
  PANEL: '#221844',
  SEAM: '#3a2d66',
  NIGHT: '#2b1d5c',
  HAZE: '#4a2f8c',

  // the time machine: violet plating, teal light strips, brass trims, the clock faces
  STONE: '#5b5f86',
  STONE_LIT: '#8b8fb8',
  STONE_DARK: '#2e3052',
  PLATE: '#3b2a78',
  PLATE_LIT: '#6a4fc4',
  TEAL: '#3fe0d0',
  TEAL_DEEP: '#0f7f86',
  BRASS: '#d6a23c',
  BRASS_DARK: '#7a5418',

  WHITE: '#f4f1e8',
  MUTED: '#b3adcf',

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

  // the crates: wood, its bands, TNT, nitro, metal and the checkpoint
  PLANK: '#a8622f',
  PLANK_LIT: '#f3c483',
  PLANK_DARK: '#753f25',
  BAND: '#6b3a12',
  TNT: '#9f2509',
  TNT_DARK: '#5a1306',
  NITRO: '#5cc102',
  NITRO_DARK: '#0f5e1a',
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

  // the hub's level pads, the time trial clock and the score digits' ramp (read from the remaster's pixels)
  PAD: '#0155f1',
  CLOCK: '#fffe0a',
  HUD_TOP: '#f06a10',
  HUD_LOW: '#a8b004',

  GRID: '#2b2a6b',
} as const

/** The palette as CSS variables (--np-void, --np-stone-lit and so on), set once on the world's root. */
export const PORTAL_VARS = paletteVars('np', PORTAL)
