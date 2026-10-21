import { paletteVars } from '../shared/paletteVars'

// Silhouette's palette: black shapes against a lit sky, depth by fog. The page is near black with fog
// grey text; each profession's level is lit by its own sky, cold dawn for the System Engineer, an ember
// sunset for the Musician and a crimson dusk for the Martial Artist, with every shape in front of it a
// shade darker the nearer it stands, and a rim of light on the edges that face the sky.
//
// This is the one source of the world's colours: SVG fills read the constants, class strings read the
// same values as CSS variables (SHADE_VARS, set once on the world's root).
//
// Text pairs: text on panel 10.4:1, muted on panel 7.8:1, dim on panel 5.4:1 and on raised 5.0:1,
// heading on void 14.6:1, black on text 12.6:1, rim on void 12.7:1.
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
  text: '#cccccc',
  heading: '#dddddd',
  glow: '#eeeeee',
  rim: '#f2c98a',
  ember: '#e3893a',
  sun: '#f6b26b',
  // His clothes: the coat, the trousers and the gloves.
  coat: '#0d0d0d',
  trousers: '#161616',
  glove: '#3a0d0d',
  // The three skies, top to horizon, and the fog layers in front of each, far to near; the fog band
  // over the ground carries its own transparency.
  dawnTop: '#1b2329',
  dawnLow: '#8fa3a8',
  dawnFar: '#5d6d72',
  dawnMid: '#2c3438',
  dawnFog: '#cfe0e34d',
  dawnRim: '#cfe0e3',
  emberTop: '#1d1310',
  emberLow: '#e3893a',
  emberFar: '#8a4a26',
  emberMid: '#3a1e12',
  emberFog: '#f2c98a33',
  crimsonTop: '#1a0c0f',
  crimsonLow: '#c24a36',
  crimsonFar: '#7a2a22',
  crimsonMid: '#2f1012',
  crimsonFog: '#e3893a33',
} as const

// One profession's light: the sky and fog band as classes over the variables, the layer fills and the
// rim as colours for SVG.
export interface SkyLight {
  sky: string
  fog: string
  far: string
  mid: string
  rim: string
}

export const SKY: Record<'dawn' | 'ember' | 'crimson', SkyLight> = {
  dawn: {
    sky: 'from-[color:var(--sh-dawn-top)] to-[color:var(--sh-dawn-low)]',
    fog: 'via-[color:var(--sh-dawn-fog)]',
    far: SHADE.dawnFar,
    mid: SHADE.dawnMid,
    rim: SHADE.dawnRim,
  },
  ember: {
    sky: 'from-[color:var(--sh-ember-top)] to-[color:var(--sh-ember-low)]',
    fog: 'via-[color:var(--sh-ember-fog)]',
    far: SHADE.emberFar,
    mid: SHADE.emberMid,
    rim: SHADE.rim,
  },
  crimson: {
    sky: 'from-[color:var(--sh-crimson-top)] to-[color:var(--sh-crimson-low)]',
    fog: 'via-[color:var(--sh-crimson-fog)]',
    far: SHADE.crimsonFar,
    mid: SHADE.crimsonMid,
    rim: SHADE.rim,
  },
}

/** The palette as CSS variables (--sh-black, --sh-dawn-top and so on), set once on the world's root. */
export const SHADE_VARS = paletteVars('sh', SHADE)

// Typewriter type, the title cards of a silhouette game.
export const TYPEWRITER = "font-['Courier_New',Consolas,monospace]"
