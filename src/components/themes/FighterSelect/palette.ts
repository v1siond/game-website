// The arcade versus palette, for the world's SVG art: the night of the stage, player one blue (him),
// player two red (the challenger), the gold of the round call, the green of a full health bar, chrome for
// the cabinet metal. FS_VARS puts the same values on the world's root as --fs-* variables, which
// world.module.css, fight.module.css and the Tailwind arbitrary values read, so no colour is written twice.

import { paletteVars } from '../shared/paletteVars'

export const FS = {
  night: '#07081a',
  panel: '#12142e',
  panelLight: '#1d2046',
  p1: '#2f7bff',
  p1Light: '#6aa6ff',
  p2: '#ff2e4d',
  p2Dark: '#a3122a',
  gold: '#ffd23f',
  orange: '#ff8a1f',
  health: '#3ddc6a',
  cyan: '#3fe6f0',
  chrome: '#c9cede',
  steel: '#5b6078',
  ink: '#03030a',
  flash: '#ffffff',
  // His gi, lit and in its two cel shades, the black belt, and the deepest tone of his skin for far limbs
  gi: '#f4f1ea',
  giShade: '#b8bdd6',
  giDeep: '#7d84a6',
  belt: '#17171f',
  skinDeep: '#5e3219',
} as const

export const FS_VARS = paletteVars('fs', FS)
