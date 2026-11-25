// The arcade versus palette of the early 90s fighters, for the world's SVG art and classes: the deep blue
// of the select screen and its orange world map, player one blue (him), player two red (the challenger),
// the yellow life bar over its red loss, the red KO badge, the orange to yellow of the round call
// lettering with its navy outline, the green of a running job, and the stage colours. FS_VARS puts the same values on the world's root as --fs-* variables, which
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
  // his own headband, a deep teal: not the 2P red, not the rival's gold
  headband: '#0f8a8a',
  headbandDark: '#075252',
  gold: '#ffd23f',
  orange: '#ff8a1f',
  health: '#3ddc6a',
  cyan: '#3fe6f0',
  chrome: '#c9cede',
  steel: '#5b6078',
  ink: '#03030a',
  // The select screen's sea and its deep edge, the map's land and coast
  select: '#1530b8',
  selectDeep: '#071463',
  land: '#e8923a',
  coast: '#ffd27a',
  // The fight HUD: life left, life lost, the KO badge, and the navy every call letter is outlined in
  hudYellow: '#f8e800',
  hudRed: '#e01818',
  ko: '#c8102e',
  // The KO red a step deeper behind small white numbers (the round count, the job badge): 7.1:1
  koPlate: '#b10e29',
  navy: '#0a1060',
  // The round call lettering, lit at the top and burning orange at the foot
  callTop: '#fff27a',
  callBottom: '#ff7a10',
  flash: '#ffffff',
  // His gi, lit and in its two cel shades, the black belt, and the deepest tone of his skin for far limbs
  gi: '#f4f1ea',
  giShade: '#b8bdd6',
  giDeep: '#7d84a6',
  belt: '#17171f',
  skinDeep: '#5e3219',
  // The dark power of the leader behind the tournament, lit and deep
  power: '#8a3ae0',
  powerDeep: '#4a1488',
  // The sponsor's emblem that hangs on every stage
  emblem: '#7a0c1e',
  // His rival of the same school: the forest green gi in its two cel shades, the tan skin, the dark hair
  rivalGi: '#2f7a4a',
  rivalGiShade: '#1e5634',
  rivalGiDeep: '#0f3420',
  rivalSkin: '#d9a27a',
  rivalSkinShade: '#a8704c',
  rivalHair: '#2a1a12',
  // His rival's sash, tied where a belt would be
  rivalSash: '#e0a530',
  rivalSashShade: '#9a6a14',
} as const

export const FS_VARS = paletteVars('fs', FS)
