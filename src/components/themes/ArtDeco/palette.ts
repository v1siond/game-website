import { paletteVars } from '../shared/paletteVars'

// The palette of the city under the sea: surface teal sinking to the abyss, brass and gold, the
// maroon of its theatre boards, the cream of its posters and one red for a spark. The world's one
// colour source: the registry reads it, the root sets it as --deco-* variables and every class reads
// those. Gold and cream on abyss measure over 9:1; mist on deep sea 9:1.

export const DECO_COLORS = {
  // The water, from the lit shallows to the floor
  tealLight: '#00AAAA',
  waterGlow: '#41c8e8',
  seaMid: '#0d3050',
  deepSea: '#0A2540',
  deepSeaDark: '#102030',
  abyss: '#05101a',

  // The drowned city beyond the great window: the far towers in the fog and their spires
  farCity: '#0a2a33',
  skylineFar: '#0a2236',

  // The glass tunnel's sea on its pane, and the kelp in front of every chamber
  tunnelSea: '#1d5a52',
  kelp: '#0f3a2e',

  // Brass and gold
  brassDark: '#8B7320',
  brassMid: '#B8860B',
  gold: '#D4AF37',
  goldBright: '#F0C850',
  // The same golds a step lighter, for lettering only: the shapes, borders and glows keep gold and
  // goldBright, the words on the panels and red boards reach 7:1.
  goldText: '#E3CB7C',
  goldBrightText: '#F4D882',
  // The ventures banner titles: the thin display letters only reach about three quarters of their colour
  // over the red, so they take the palest gold, which still renders 7:1 on bloodDark.
  goldPaleText: '#FBEEC8',
  // The picked machine row, a paler gold under the abyss letters for the same reason (7:1 as rendered).
  goldPick: '#EFD892',
  // The brass in shadow: the lab shutter's and the machine's blind slats and the gaps between them, the
  // bathysphere's rim and its bolt heads
  brassShadow: '#6b5818',
  brassLine: '#3a2c08',
  brassRimDark: '#4a3a0c',
  boltHead: '#5a4610',

  // Bronze
  bronze: '#CD7F32',

  // The dark wood and lacquer of the city's furniture: the vending cabinet and the hall's frame from top to
  // floor, the bronze panels of the plaques, the crates and the programme, the marquee box, the recorders
  cabinetTop: '#2a1a10',
  cabinetMid: '#170d08',
  cabinetFoot: '#0f0905',
  bronzePanel: '#1a140a',
  theatreBox: '#1a0606',
  recorderCase: '#2a1d0c',

  // Sea glass: the vending machine's case and its engineer prop, the lab window, the diary cards
  machineGlass: '#0f3550',
  machineGlassDeep: '#07182a',
  machineProp: '#14324a',
  diaryCard: '#0d2a42',
  diaryCardDeep: '#071624',

  // Neon and the spark of an overload
  neonPink: '#FF0066',
  spark: '#ff5a3c',

  // Maroon theatre boards
  bloodDark: '#660000',
  blood: '#8B0000',
  // The edge of a ventures banner, so the cloth deepens from bloodDark behind the title outward, the stage's
  // valance and the board under the vending machine's thin marquee letters
  bloodDeep: '#3F0000',

  // His painted costume: the grey heather cable knit sweater, the slacks, the pipe wrench and the blue
  // crackle of the electric charge in his veins
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
  revival: '#3fe0b0',

  // The project photographs' paper, top to foot
  photoPaper: '#f6ecd6',
  photoPaperShade: '#e6d6b4',

  // Poster paper and text
  ivory: '#FFFFF0',
  cream: '#FAF0E6',
  mist: '#d0c8b8',
  sepia: '#3a2a14',
} as const

/** The palette as CSS variables (--deco-gold, --deco-deep-sea and so on), set once on the world's root. */
export const DECO_VARS = paletteVars('deco', DECO_COLORS)
