import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// Dark Fantasy's palette, every colour of the world once: the void of the caverns, the ethereal soul light,
// the spirit gold and brass of the old kingdom, forest, stone and bone, the bug's shell and its infection,
// his face, cloak and blade, each area's own light, and the fire and pool sparks of a battle. The SVG art and inline styles
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
  // Brass as text: the same hue lifted to 9 to 1 on the caverns; brass itself stays on lines and borders.
  brassText: '#cbb591',
  // The Email me plate: brass lightened in its own hue so the void ink on it reads 7.2 to 1.
  brassPlate: '#b89968',
  copper: '#8b6914',

  // Forest, stone, bone and metal
  forestGreen: '#4a8f4a',
  mossGreen: '#2d5a2d',
  stoneGrey: '#4a4a4a',
  stoneDark: '#333333',
  bone: '#e8e4dc',
  silver: '#a0a0a0',
  // Silver as text: lifted to 10.9 to 1 on the panels; silver itself stays on the icons and the blade.
  silverText: '#c8c8c8',
  lavender: '#b7a9d9',
  white: '#ffffff',

  // The registry's text, rims and panels
  // The dialogue box surface (.df-panel, .df-card), opaque so the stage behind never shows through.
  panel: '#15102b',
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

  // Him: his own face (heroIdentity), his cloak and his blade
  skin: HERO_IDENTITY.skin,
  skinShade: HERO_IDENTITY.skinShade,
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyes: HERO_IDENTITY.eyes,
  cloak: '#3d4a5c',
  cloakDark: '#2a3545',
  blade: '#c8c8c8',

  // The areas' own lights and what lives in them: the acid of the overgrowth, the spores of the wastes, the
  // rain of the city, the lanterns of the deep, the duelist's moss green, the blade fighters' ochre, the mage's
  // robe, the sleepers' dream and the champion's torn cloak
  acid: '#9be04a',
  spore: '#d8b060',
  rain: '#8fb4ff',
  lantern: '#ffcf7a',
  moss: '#6f8f62',
  mossDark: '#3f5a38',
  ochre: '#a8823c',
  ochreDark: '#5e4620',
  robe: '#2b3a6a',
  robeDark: '#18224a',
  dream: '#e6dcff',
  torn: '#3a2e2a',

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
