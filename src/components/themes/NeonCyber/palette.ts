import { paletteVars } from '../shared/paletteVars'

// Neon Cyber's palette, every colour of the world once: the night city's void and dusk, the neon tubes
// (magenta, cyan, hot pink, yellow, green, orange, violet), the steel and walls of its alleys, and the
// costume of the hero. The SVG art and inline styles read NEON; NEON_VARS puts the same values on the
// world's root as --neon-* variables, which the Tailwind arbitrary values (bg-[color:var(--neon-void)])
// read, and the theme registry reads NEON, so no colour is written twice.

export const NEON = {
  // The night: the void behind everything, the dusk band, the registry's panels and rims
  void: '#0a0512',
  dusk: '#150a20',
  surface: '#150a1a',
  surfaceHover: '#201025',
  rim: '#4020a0',
  ice: '#e0f0ff',
  muted: '#8080a0',

  // The neon tubes
  magenta: '#ff00ff',
  cyan: '#00ffff',
  hotPink: '#ff0066',
  pinkText: '#ff3385',
  yellow: '#ffff00',
  green: '#00ff66',
  led: '#00ff00',
  orange: '#ff6600',
  violet: '#9966cc',
  violetText: '#b388e6',
  lilac: '#c4a3e6',

  // The optics HUD: the loud yellow that carries data, red line work for the chrome only (red words on
  // the dark ground fail contrast), the scanner's colour key (gold for work, green for what can be
  // breached, blue for what can be used, red for the fight record) and the thermal layer's cold and heat.
  hud: '#f3e600',
  hudDim: '#8f8700',
  chromeRed: '#ff3b4e',
  data: '#5ef2ff',
  gold: '#ffc23d',
  hack: '#3dff9a',
  use: '#4da3ff',
  cold: '#2d4bff',
  heat: '#ff5a1f',
  ink: '#07060c',
  ash: '#c9c4da',
  glass: '#120d1e',

  // The city: street, alley walls, towers, steel, panels and chrome
  street: '#1a0a2a',
  alley: '#1d1030',
  tower: '#2a1240',
  panel: '#2a1840',
  steel: '#3a2456',
  chrome: '#8a8a92',

  // The districts the page scrolls through: Watson's dusk and concrete, the megabuilding's pink tube and
  // fog, the Badlands' sunset (sampled from the store screenshots, research 2026-10-21-w4-neon-cyber)
  watsonDusk: '#53381d',
  concrete: '#2e2a26',
  pinkTube: '#ff3c9a',
  sunset: '#aa5a2c',
  sunsetGlow: '#e5a868',

  // The hero's costume
  jacket: '#e8b80f',
  jacketLit: '#f7d84a',
  jeans: '#2d2a3d',
  shoe: '#15121c',
  shorts: '#e8eef0',
  stickWood: '#f5d28a',
  gloveTrim: '#ffd1e3',
} as const

export type NeonColor = keyof typeof NEON

export const NEON_VARS = paletteVars('neon', NEON)
