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

  // The city: street, alley walls, towers, steel, panels and chrome
  street: '#1a0a2a',
  alley: '#1d1030',
  tower: '#2a1240',
  panel: '#2a1840',
  steel: '#3a2456',
  chrome: '#8a8a92',

  // The hero's costume
  jacket: '#23202e',
  jeans: '#2d2a3d',
  shoe: '#15121c',
  shorts: '#e8eef0',
  stickWood: '#f5d28a',
  gloveTrim: '#ffd1e3',
} as const

export type NeonColor = keyof typeof NEON

export const NEON_VARS = paletteVars('neon', NEON)
