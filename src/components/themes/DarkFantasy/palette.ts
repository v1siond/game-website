import { paletteVars } from '../shared/paletteVars'

// Dark Fantasy's palette, every colour of the world once: the void of the caverns, the ethereal soul light,
// the spirit gold and brass of the old kingdom, forest, stone and bone, the bug's shell and its infection,
// the knight's cloak, nail and beard, and the fire and pool sparks of a battle. The SVG art and inline styles
// read DARK_FANTASY; DARK_FANTASY_VARS puts the same values on the world's root as --df-* variables, which
// the Tailwind arbitrary values (ring-[color:var(--df-spirit-gold)]) read, so no colour is written twice.

export const DARK_FANTASY = {
  // The caverns: void layers behind everything
  void: '#0f0a1a',
  voidDeep: '#1a1025',
  voidPurple: '#150f25',
  black: '#000000',

  // Soul light
  ethereal: '#41c8e8',
  etherealDark: '#5ecfef',
  soulBlue: '#50e0ff',

  // The old kingdom: spirit gold, brass, copper
  spiritGold: '#e8c841',
  spiritGoldDark: '#d4af37',
  brass: '#b08d57',
  copper: '#8b6914',

  // Forest, stone, bone and metal
  forestGreen: '#4a8f4a',
  mossGreen: '#2d5a2d',
  stoneGrey: '#4a4a4a',
  stoneDark: '#333333',
  bone: '#e8e4dc',
  silver: '#a0a0a0',
  lavender: '#b7a9d9',
  white: '#ffffff',

  // The registry's text, rims and panels
  text: '#c8d4e8',
  textMuted: '#6b7a94',
  violet: '#9966cc',
  rim: '#2a2540',
  surfaceHover: '#1f1835',

  // The bug: shell, mask and the infection
  shell: '#3a3055',
  shellMid: '#2a2040',
  shellDark: '#1a1525',
  bugMask: '#4a4565',
  bugMaskLight: '#5a5575',
  infected: '#ff6b35',
  infectedBright: '#ff9955',
  infectedDark: '#cc4420',
  infectedGlow: '#ff8833',

  // The knight: mask shade, cloak, nail and beard
  maskShade: '#e8e8e8',
  cloak: '#3d4a5c',
  cloakDark: '#2a3545',
  nail: '#c8c8c8',
  beard: '#4a3c2e',
  beardDark: '#3a2c1e',

  // Battle: dust, fire, blood and the pool sparks
  dustLight: '#bbbbbb',
  dust: '#aaaaaa',
  dustDark: '#999999',
  flameOrange: '#ff7b00',
  flameAmber: '#ff9500',
  flameYellow: '#ffaa00',
  flameDeep: '#cc5500',
  flameRed: '#ff4400',
  bloodDark: '#cc3300',
  poolOrange: '#ff5500',
  poolAmber: '#ff7700',
  poolRed: '#ee4400',
  poolGreen: '#00ff44',
  poolGreenMid: '#22ee55',
  poolGreenLight: '#33ff66',
} as const

export type DarkFantasyColor = keyof typeof DARK_FANTASY

export const DARK_FANTASY_VARS = paletteVars('df', DARK_FANTASY)
