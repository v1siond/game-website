import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// The world's one colour source (the time machine platformer, Warped, named in code only; research
// 2026-10-21-warped-v2 for the sampled values): the page (night, panels, text, the logo's yellow name, the
// level names' orange to red ramp, the save monitor's green), the three warp pads, him (orange fur, tan
// chest, brown fingerless gloves, rolled blue jeans, red high tops, his own skin, hair, beard and eyes from
// HERO_IDENTITY) and every era's 3D scene. The page reads PORTAL as --np-* variables (PORTAL_VARS on the
// root); the 3D reads PORTAL, MODEL and ERA_COLOURS directly.
//
// Text, measured with the WCAG formula: WHITE on VOID 17.3:1, on CHAMBER 15.9:1, on PANEL 15.0:1; MUTED on
// PANEL 9.5:1, on VOID 11.0:1; GOLD on PANEL 11.5:1; ORANGE on PANEL 8.0:1; TITLE on VOID 13.5:1, on CHAMBER
// 12.5:1; LEVEL_TOP on BAND 11.4:1 and LEVEL_LOW 7.1:1; VOID on ORANGE 9.2:1, on GOLD 13.2:1, on WHITE 17.3:1;
// SCREEN_TEXT on SCREEN 15.0:1, WHITE on SCREEN 16.7:1; WHITE on PAD_BLUE_DEEP 7.8:1, on PAD_RED_DEEP 8.2:1;
// VOID on PAD_GOLD 8.6:1. Non text: the SEAM edge is decoration only; the focus ring is GOLD, 13.2:1 on VOID.

export const PORTAL = {
  VOID: '#0a0530',
  CHAMBER: '#140c45',
  PANEL: '#1a1150',
  SEAM: '#3a2f8f',
  BAND: '#07031f',
  WHITE: '#f6f1e4',
  MUTED: '#c4bde8',
  GOLD: '#ffcf3a',
  ORANGE: '#ff9a1f',
  TITLE: '#ffd23f',
  TITLE_EDGE: '#7a2a10',
  LEVEL_TOP: '#ffb43a',
  LEVEL_LOW: '#ff6a3d',
  SCREEN: '#06140c',
  SCREEN_TEXT: '#7dff9a',
  SCREEN_RIM: '#5a6670',
  PAD_BLUE: '#2f6bff',
  PAD_BLUE_DEEP: '#1a3fb0',
  PAD_RED: '#d42a2a',
  PAD_RED_DEEP: '#8e1414',
  PAD_GOLD: '#e0a020',
  VIOLET: '#c08bff',
  BLUE: '#38b6ff',
  FRUIT: '#e8461e',
} as const

export const PORTAL_VARS = paletteVars('np', PORTAL)

/** Him, the parody hero, with his own face. */
export const MODEL = {
  fur: '#e0761e',
  chest: '#f2b742',
  muzzle: HERO_IDENTITY.skin,
  nose: '#141018',
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyeWhite: '#f4f1e8',
  pupil: HERO_IDENTITY.eyes,
  mouth: '#5a1418',
  teeth: '#f4f1e8',
  earInner: '#3a1a10',
  glove: '#5a2414',
  jeans: '#2a55c8',
  cuff: '#4f86d8',
  shoe: '#c42a2a',
  sole: '#efe4d0',
  shorts: '#c41e2a',
  band: '#f2c230',
  wrap: '#f4f1e8',
  stick: '#d9b07a',
  shadow: '#000000',
} as const

/** The warp room and the eras, each the colours of its scene (the sky is the window's CSS gradient). */
export const ERA_COLOURS = {
  room: { skyTop: '#05021f', skyLow: '#3a0f5c', stone: '#7b7862', stoneDark: '#4a4b3c', plank: '#7a5232', pedestal: '#e8e6dc', glass: '#9fe8ff', star: '#f6f1e4' },
  medieval: { skyTop: '#7fb2e6', skyLow: '#e8d6f0', ground: '#d8b24a', path: '#e6c98a', tent: '#9b3fb8', tentLight: '#f08ac0', roof: '#2f62c8', wall: '#b8b0a0', flag: '#d42a2a' },
  tomb: { skyTop: '#1a0c06', skyLow: '#5a3010', ground: '#c89a5a', path: '#e0b878', column: '#d8a860', paint: '#c43a1a', band: '#2f8a6a', sphinx: '#e0b060' },
  underwater: { skyTop: '#04304a', skyLow: '#0b7a8a', ground: '#d8c890', path: '#c4b47a', rock: '#3a6a7a', kelp: '#2f9a4a', coral: '#ff6a5a' },
  wall: { skyTop: '#2a1650', skyLow: '#f08a5a', ground: '#6a6a5a', path: '#8a8672', brick: '#9a9078', roof: '#3a2a1a', lantern: '#ff4a2a' },
  prehistoric: { skyTop: '#5ab0d0', skyLow: '#f0e0a0', ground: '#5a9a3a', path: '#a8844a', fern: '#2f7a2a', volcano: '#5a3a2a', lava: '#ff6a1a', rock: '#8a7a6a' },
  future: { skyTop: '#06021a', skyLow: '#3a0a5a', ground: '#1a1a2a', path: '#2a2a3a', tower: '#2a2f4a', neonA: '#ff3a8a', neonB: '#3affd8', neonC: '#ffd23f' },
  arabian: { skyTop: '#3a1660', skyLow: '#ff9a5a', ground: '#d8a870', path: '#e8c494', wall: '#e8d0a8', dome: '#2f8a9a', arch: '#b83a2a', gold: '#f2c230' },
  courtyard: { skyTop: '#1a2a5a', skyLow: '#f0b070', ground: '#8a5a3a', path: '#b88a5a', pillar: '#b8241a', roof: '#2a3a2a', gong: '#d8a020', gongDark: '#7a5010' },
  crate: { wood: '#c87a3a', woodDark: '#7a3a1c', fruit: '#e8461e' },
} as const
