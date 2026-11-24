import { paletteVars } from '../shared/paletteVars'

// Soul Map's palette, every colour of the world once: the ash and stone of a ruined kingdom at dusk, one
// warm fire in it, the gold of its banners and the foes in it. His armour reads the steel, mail, leather
// and the blue surcoat; his face reads HERO_IDENTITY.
//
// The SVG art reads SOUL; SOUL_VARS sets the same values as --soul-* variables on the world's root, so the
// class strings (bg-[color:var(--soul-deep)]) and the CSS modules paint them too. The keys abyss, deep,
// cavern, rock, glow, moss, lantern, text and textSoft are also read by the theme registry.
//
// Text pairs (WCAG): text on deep 14.1:1, textSoft on cavern 12.0:1, glow on deep 9.6:1, lantern on panel
// 10.2:1, ink on glow 11.4:1.

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

  // The dusk sky over the ruins, high to the horizon haze, and the fog low over the floor
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

  // Banner gold, the lit menu highlight, and the moss on the old stone
  glow: '#e3c27a',
  glowDeep: '#8f7337',
  lantern: '#f0cf86',
  moss: '#7fb36a',

  // His armour: steel, mail, leather, the plain blue surcoat, the gold cord of his mongkhon, the wraps of his gloves
  steelLight: '#c9ccce',
  steel: '#8b9095',
  steelDark: '#474b50',
  mail: '#6e7174',
  leather: '#6a4a2e',
  leatherDark: '#3b2818',
  surcoat: '#30508a',
  surcoatDark: '#1b2f57',
  cord: '#d9a441',
  wraps: '#a3322a',

  // The foes: a hollow's dried skin and its rags, the demon's hide, belly and horn, a shield knight's iron
  hollow: '#7d6c5a',
  hollowDark: '#463a30',
  rag: '#57493b',
  hide: '#5d5247',
  hideDark: '#352d27',
  belly: '#7f6d59',
  iron: '#3d3f42',
  ironLight: '#6c7075',

  // The old wood of a great door, and the pale fog wall
  wood: '#4b3624',
  woodDark: '#2c1f14',
  mist: '#e8e4da',

  // Lettering
  text: '#ebe0c8',
  textSoft: '#e6d4ae',
} as const

export const SOUL_VARS = paletteVars('soul', SOUL)

// One carved serif for every word of the world, the cut of the game's banners and menus.
export const CARVED = "[font-family:var(--soul-carved),Georgia,'Times_New_Roman',serif]"
