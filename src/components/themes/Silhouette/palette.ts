import { paletteVars } from '../shared/paletteVars'

// Silhouette's palette: black shapes against a pale grey glow, depth by fog, as the game is drawn. The page
// is near black with fog grey text. The pictures hold no colour at all, as the game's do (C59 frames): only
// his eyes, the worm and the far window glow, white. Each profession's level keeps the grey and tints its
// mist so slightly it reads as the hour, a cold grey for the System Engineer, a warm one for the Musician and
// a faintly red one for the Martial Artist, with every shape in front of it a shade darker the nearer it
// stands, and a grey rim of light on the edges that face the sky. The rim colour (rim) is the page's accent
// for focus and the levers only.
//
// This is the one source of the world's colours: SVG fills read the constants, class strings read the
// same values as CSS variables (SHADE_VARS, set once on the world's root).
//
// Text pairs: text on panel 10.4:1, mutedText on panel 10.7:1, dimText on panel 9.0:1 and on raised 8.4:1,
// heading on void 14.6:1, black on text 12.6:1, rim on void 12.7:1. dim and muted stay on ropes, levers
// and dashed borders; their Text twins paint the words.
export const SHADE = {
  black: '#000000',
  void: '#050505',
  night: '#0a0a0a',
  panel: '#121212',
  raised: '#1a1a1a',
  edge: '#2a2a2a',
  fog: '#3a3a3a',
  dim: '#8a8a8a',
  muted: '#aaaaaa',
  dimText: '#b4b4b4',
  mutedText: '#c4c4c4',
  text: '#cccccc',
  heading: '#dddddd',
  glow: '#eeeeee',
  rim: '#f2c98a',
  // the world card's accents (src/themes/themes.ts); no picture of the world uses them
  ember: '#e3893a',
  sun: '#f6b26b',
  // His clothes: the coat, the trousers and the gloves.
  coat: '#0d0d0d',
  trousers: '#161616',
  glove: '#3a0d0d',
  // The three skies, top to horizon, and the fog layers in front of each, far to near; the fog band
  // over the ground carries its own transparency.
  dawnTop: '#2a2e30',
  dawnLow: '#b8bdbe',
  dawnFar: '#7d8587',
  dawnMid: '#3a3f41',
  dawnFog: '#d6dcdd4d',
  dawnRim: '#d8dcdd',
  emberTop: '#2c2a28',
  emberLow: '#bfbab4',
  emberFar: '#837e78',
  emberMid: '#3d3a37',
  emberFog: '#ddd9d44d',
  emberRim: '#dcd8d2',
  crimsonTop: '#2c2828',
  crimsonLow: '#bfb6b4',
  crimsonFar: '#847a78',
  crimsonMid: '#3d3838',
  crimsonFog: '#dcd6d54d',
  crimsonRim: '#dcd5d4',
} as const

// One light of the forest: the sky top to horizon, the far and mid layers in front of it, the fog band
// over the ground (with its own transparency) and the rim of light on the edges that face the sky.
export interface Light {
  top: string
  low: string
  far: string
  mid: string
  fog: string
  rim: string
}

export const LIGHTS = {
  dawn: { top: SHADE.dawnTop, low: SHADE.dawnLow, far: SHADE.dawnFar, mid: SHADE.dawnMid, fog: SHADE.dawnFog, rim: SHADE.dawnRim },
  ember: { top: SHADE.emberTop, low: SHADE.emberLow, far: SHADE.emberFar, mid: SHADE.emberMid, fog: SHADE.emberFog, rim: SHADE.emberRim },
  crimson: { top: SHADE.crimsonTop, low: SHADE.crimsonLow, far: SHADE.crimsonFar, mid: SHADE.crimsonMid, fog: SHADE.crimsonFog, rim: SHADE.crimsonRim },
} as const satisfies Record<string, Light>

export type LightName = keyof typeof LIGHTS

/** The palette as CSS variables (--sh-black, --sh-dawn-top and so on), set once on the world's root. */
export const SHADE_VARS = paletteVars('sh', SHADE)

// Typewriter type, the title cards of a silhouette game.
export const TYPEWRITER = "font-['Courier_New',Consolas,monospace]"
