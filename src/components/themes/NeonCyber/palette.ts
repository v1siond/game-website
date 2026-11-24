import { paletteVars } from '../shared/paletteVars'

// Neon Cyber's palette, every colour of the world once: the city's void and dusk, the neon tubes (magenta,
// cyan, hot pink, yellow), the steel and walls of its alleys, and the hero's kit. The SVG art and inline
// styles read NEON; NEON_VARS puts the same values on the
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
  yellow: '#ffff00',

  // The HUD: the loud yellow that carries data, red line work for the chrome only (red words on the dark
  // ground fail contrast), and its accents: gold for his own work, green for the hack, blue for what can be
  // used.
  hud: '#f3e600',
  hudDim: '#8f8700',
  chromeRed: '#ff3b4e',
  data: '#5ef2ff',
  // The data cyan a step lighter for the words on the chips: a lens the scrub leaves dim (0.7) still
  // reads 7:1; the chip's frame and the city keep data.
  dataText: '#a0f8ff',
  gold: '#ffc23d',
  hack: '#3dff9a',
  use: '#4da3ff',
  ink: '#07060c',
  ash: '#dcd8e7',
  glass: '#120d1e',

  // The city: street, alley walls, towers, steel, panels and chrome
  street: '#1a0a2a',
  alley: '#1d1030',
  tower: '#2a1240',
  panel: '#2a1840',
  steel: '#3a2456',
  chrome: '#8a8a92',

  // The districts the page scrolls through: the overpass's dusk and concrete, the slab's pink tube and fog,
  // the outskirts' amber sky
  overpassDusk: '#53381d',
  concrete: '#2e2a26',
  pinkTube: '#ff3c9a',
  sunset: '#aa5a2c',
  sunsetGlow: '#e5a868',

  // The hero's kit: the cropped yellow jacket, its black panels and the collar's lit lining, the chrome
  // arm, the trousers
  jacket: '#e2b318',
  jacketShade: '#9c7a0c',
  chromeLit: '#c9ccd6',
  trousers: '#2d2a3d',
  shoe: '#15121c',
  stickWood: '#f5d28a',
} as const

export type NeonColor = keyof typeof NEON

export const NEON_VARS = paletteVars('neon', NEON)
