import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// The world's one colour source, the time travel platformer's 2D layer (research 2026-11-09-c44-r4 part 1,
// values sampled 10-21 and 11-09): the warp room's navy night with its magenta glow over a dark sea, the
// title's fat yellow capitals with their red brown edge, the X braced crate's planks, the riveted iron
// box, the three pads (red, blue, gold), the save monitor's pale green, and one colour key per era. The
// page reads PORTAL as --np-* variables (PORTAL_VARS on the root); the SVG art reads the constants.
//
// Text pairs, WCAG ratio: WHITE on VOID 18.1:1, on CHAMBER 16.6:1, on PANEL 15.4:1, on BOARD 18.2:1, on
// WOOD_DEEP 16.4:1; MUTED on PANEL 10.4:1, on VOID 12.2:1, on BOARD 12.3:1; GOLD on PANEL 11.5:1, on VOID
// 13.5:1, on CHAMBER 12.5:1, on BOARD 13.6:1, on WOOD_DEEP 12.3:1; SCREEN_TEXT on BOARD 17.0:1; INK on CREAM
// 16.7:1, on TAG 13.9:1, on GOLD 13.0:1, on ORANGE 8.8:1, on GLASS_TEXT 13.8:1, on SAND 11.4:1, on IRON_FACE
// 14.6:1, on LILAC 9.3:1, on LAMP 15.6:1; INK_SOFT on CREAM 10.3:1; WOOD_TEXT on CREAM 9.3:1; WHITE on
// GLASS 14.7:1, GLASS_TEXT on GLASS 11.7:1; WHITE on RED_DEEP 10.1:1. Every other colour is art only.
export const PORTAL = {
  // The night and its panels.
  VOID: '#0a0530',
  CHAMBER: '#160b46',
  PANEL: '#1d1352',
  SEAM: '#3a2f8f',
  BOARD: '#0b0b12',
  WHITE: '#fbf6ea',
  MUTED: '#cfc8ee',
  GOLD: '#ffd24a',
  ORANGE: '#ff9a1f',
  TITLE_EDGE: '#7a2a10',
  VIOLET: '#c08bff',
  BLUE: '#38b6ff',
  MAGENTA: '#a8237a',
  // The card faces: the crate's inner panel, its tags and the ink on them.
  CREAM: '#fbf1dc',
  TAG: '#f2dcae',
  SAND: '#e8c590',
  LAMP: '#ffe9a8',
  LILAC: '#c9a7ff',
  INK: '#1a0f12',
  INK_SOFT: '#4a3428',
  WOOD_TEXT: '#6a2e12',
  // The crate: planks lit, mid and dark, and the deep wood a plate is cut from.
  WOOD_LIT: '#c87e5b',
  WOOD: '#753f25',
  WOOD_DARK: '#442d21',
  WOOD_DEEP: '#2a1206',
  // The iron box and the riveted floors.
  IRON_FACE: '#dfe3ec',
  IRON: '#bab6bb',
  IRON_DARK: '#68646a',
  FLOOR: '#5d6b5f',
  FLOOR_DARK: '#36423a',
  // The glass sphere and the save monitor.
  GLASS: '#10204a',
  GLASS_TEXT: '#b8e3ff',
  ARC: '#9fe8ff',
  SCREEN: '#06140c',
  SCREEN_TEXT: '#b6ffcc',
  // The pads, lit and deep: red drummer, blue engineer, gold fighter.
  PAD_RED: '#e0283a',
  PAD_RED_DEEP: '#590102',
  PAD_BLUE: '#2a7bff',
  PAD_BLUE_DEEP: '#013694',
  PAD_GOLD: '#f2b21e',
  PAD_GOLD_DEEP: '#7a4a08',
  RED_DEEP: '#7a1414',
  // The decorative berries and the gems.
  BERRY: '#9a4ae0',
  LIME: '#a8e040',
  GEM_RED: '#ff3a5a',
  GEM_BLUE: '#3a8aff',
  GEM_GREEN: '#3ae08a',
  GEM_VIOLET: '#b45aff',
  GEM_CLEAR: '#e6f6ff',
  // The sea, the stars and the glow over the horizon.
  SEA: '#050320',
  SEA_LIGHT: '#1b1660',
  STAR: '#fff6d8',
  GLOW: '#5a1a6a',
} as const

export const PORTAL_VARS = paletteVars('np', PORTAL)

/** Him: the hero's colour blocks (rolled jeans, brown fingerless gloves, red high tops, a tan top), with
 *  his own skin, hair, beard and eyes from HERO_IDENTITY. */
export const FIGURE = {
  skin: HERO_IDENTITY.skin,
  skinShade: HERO_IDENTITY.skinShade,
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyes: HERO_IDENTITY.eyes,
  eyeWhite: '#fbf7ee',
  shine: '#ffffff',
  mouth: '#4a1014',
  teeth: '#fbf7ee',
  top: '#e6c08a',
  topShade: '#c49a62',
  jeans: '#2f5fc4',
  jeansShade: '#1f3f8a',
  cuff: '#5a8ae0',
  string: '#fbf6ea',
  glove: '#6a3a1e',
  gloveShade: '#4a2612',
  shoe: '#d42a20',
  shoeShade: '#8e1414',
  lace: '#f2e6c8',
  line: '#1a0f12',
  spinWhite: '#ffffff',
  spinPink: '#ff8ac8',
  stick: '#e0b07a',
  band: '#e0283a',
  wrap: '#fbf6ea',
} as const

/** The art of each era the backdrop dresses the night with, and of the rooms the hero's sphere shows. */
export const ERA = {
  hub: { far: '#1a1450', near: '#0e0a36', light: '#ffd24a' },
  medieval: { hill: '#b8902e', hillFar: '#7a6420', cone: '#2f62c8', coneDark: '#1c3c86', wall: '#d8c8a0', flame: '#ff9a1f', flameCore: '#ffe9a8' },
  tomb: { stone: '#c89a5a', stoneDark: '#8a6232', band: '#2f8a6a', paint: '#c43a1a', shaft: '#ffe9a8' },
  wall: { stone: '#6f7a62', stoneDark: '#4a5442', hill: '#3a4a3a', banner: '#c4302a', pole: '#2a1206' },
  future: { tower: '#2a1a5a', towerDark: '#170d3a', window: '#ffd23f', neonPink: '#ff3a8a', neonTeal: '#3affd8' },
  underwater: { water: '#0b6a7a', deep: '#043a4a', weed: '#7a3aa8', weedLight: '#a85ae0', sand: '#c4b47a' },
  arabian: { dome: '#1c2a6a', domeDark: '#111a48', wall: '#2a3a7a', lamp: '#ff9a3a', lampCore: '#ffe9a8' },
  prehistoric: { rock: '#1a1616', rockLight: '#3a302c', lava: '#ff5a1a', lavaCore: '#ffc44a', fern: '#1f4a24' },
} as const

export const GEMS = [PORTAL.GEM_RED, PORTAL.GEM_BLUE, PORTAL.GEM_GREEN, PORTAL.GEM_VIOLET] as const

// The world's buttons and the plate under the outfit switch: gold on the deep wood of a crate.
export const OUTFIT_LOOK = { plate: PORTAL.WOOD_DEEP, text: PORTAL.GOLD, ring: PORTAL.ORANGE }

/** The eras the backdrop dresses the night with, one per section, the hub's night for the rest. */
export type Era = keyof typeof ERA
