import { paletteVars } from '../shared/paletteVars'

// The palette of the city under the sea: surface teal sinking to the abyss, brass and gold, the
// maroon of its theatre boards, the cream of its posters and one red for a spark. The world's one
// colour source: the registry reads it, the root sets it as --deco-* variables and every class reads
// those. Gold and cream on abyss measure over 9:1; mist on deep sea 9:1.

export const DECO_COLORS = {
  // The water, from the surface to the floor
  surface: '#1c5a6e',
  tealDark: '#006666',
  tealLight: '#00AAAA',
  waterGlow: '#41c8e8',
  seaMid: '#0d3050',
  deepSea: '#0A2540',
  deepSeaDark: '#102030',
  abyss: '#05101a',

  // Brass and gold
  brassDark: '#8B7320',
  brassMid: '#B8860B',
  gold: '#D4AF37',
  goldBright: '#F0C850',

  // Bronze
  bronzeDark: '#8B4513',
  bronze: '#CD7F32',

  // Neon and the spark of an overload
  neonPink: '#FF0066',
  spark: '#ff5a3c',

  // Maroon theatre boards
  bloodDark: '#660000',
  blood: '#8B0000',

  // His painted costume: the grey heather cable knit sweater, the slacks, the pipe wrench and the blue
  // crackle of the electric plasmid in his veins
  knit: '#7c7a74',
  knitShade: '#4a4843',
  knitLight: '#a3a19a',
  slacks: '#2e2b27',
  shoe: '#3a2414',
  steel: '#9aa0a4',
  steelShade: '#4f5458',
  rust: '#8a4320',
  bolt: '#7fe0ff',
  boltCore: '#effcff',

  // The revival chamber's life light
  vita: '#3fe0b0',

  // The guardian's helmet ports: amber while he minds his own walk, red once provoked
  portCalm: '#ffc94a',
  portAngry: '#ff3b2a',
  diver: '#6b4a2a',
  diverDark: '#3a2814',
  sisterDress: '#e8b4bc',

  // Poster paper and text
  ivory: '#FFFFF0',
  cream: '#FAF0E6',
  mist: '#d0c8b8',
  sepia: '#3a2a14',
} as const

/** The palette as CSS variables (--deco-gold, --deco-deep-sea and so on), set once on the world's root. */
export const DECO_VARS = paletteVars('deco', DECO_COLORS)
