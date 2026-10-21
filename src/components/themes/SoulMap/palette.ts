import { paletteVars } from '../shared/paletteVars'

// Soul Map's palette, every colour of the world once: the ash and stone of a ruined kingdom at dusk (the
// hard knight action game of bonfires and fog walls, named here in code only), one warm fire in it, the
// gold of its banners, the blood red of a health bar and the green of the healing flask. His armour reads
// the steel, mail, leather and the blue surcoat; his face reads HERO_IDENTITY (character.tsx).
//
// The SVG art reads SOUL; SOUL_VARS sets the same values as --soul-* variables on the world's root, so the
// class strings (bg-[color:var(--soul-deep)]) and the CSS modules paint them too. The keys abyss, deep,
// cavern, rock, glow, moss, lantern, text and textSoft are also read by the theme registry.
//
// Text pairs (WCAG): text on deep 14.1:1, textSoft on cavern 8.4:1, glow on deep 9.6:1, ember on deep 6.1:1,
// message on slab 5.3:1, lantern on panel 10.2:1, ink on glow 11.4:1. Blood is never small text; the knock
// down banner is large text in bloodBright (4.0:1 on ink).

export const SOUL = {
  // The page: ash black to the nearest stone
  ink: '#050404',
  abyss: '#0b0a09',
  deep: '#141210',
  cavern: '#1c1915',
  panel: '#17140f',
  rock: '#2a2621',
  slab: '#332e27',
  ridge: '#4a433a',
  stoneLight: '#6c6357',

  // The dusk sky over the ruins, high to the horizon haze, and the fog of a fog wall
  skyTop: '#1d1f22',
  skyMid: '#3b3b38',
  skyLow: '#7a6e5a',
  haze: '#a39580',
  fog: '#d9d4c7',

  // The fire: ember, flame, its white core, and the ash it burns in
  ember: '#e2742b',
  emberDeep: '#9c3d14',
  flame: '#f5a142',
  flameCore: '#ffe3a3',
  ash: '#5b5550',
  bone: '#c9bfa8',

  // Banner gold, the lit menu highlight, and the soapstone message's orange
  glow: '#e3c27a',
  glowDeep: '#8f7337',
  lantern: '#f0cf86',
  message: '#f39a4f',
  phantom: '#f3dd9a',

  // The red phantom of an invader: the sparring partner in the Muay Thai ring
  invaderLight: '#ff9a7a',
  invader: '#c8452f',
  invaderDeep: '#5e1810',

  // The white blue of a spirit that left a message on the floor
  spirit: '#d6e4f2',
  spiritDeep: '#6f88a6',

  // HUD colours: health, its bright banner red, stamina, the flask
  blood: '#9e2a22',
  bloodBright: '#d8432f',
  stamina: '#5f8f4a',
  moss: '#7fb36a',
  estus: '#d8a03a',

  // His armour: steel, mail, leather, the blue surcoat and its fire warding emblem, the wraps of his gloves
  steelLight: '#c9ccce',
  steel: '#8b9095',
  steelDark: '#474b50',
  mail: '#6e7174',
  leather: '#6a4a2e',
  leatherDark: '#3b2818',
  surcoat: '#30508a',
  surcoatDark: '#1b2f57',
  emblem: '#d9a441',
  wraps: '#a3322a',

  // Lettering
  text: '#ebe0c8',
  textSoft: '#c2b69d',
} as const

export type SoulColor = keyof typeof SOUL

export const SOUL_VARS = paletteVars('soul', SOUL)

// One carved serif for every word of the world, the cut of the game's banners and menus.
export const CARVED = "font-['Optimus_Princeps','Cinzel','Trajan_Pro',Georgia,'Times_New_Roman',serif]"
