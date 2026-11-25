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

  // A machine's lamp once it is on his side
  allClear: '#3fe0b0',

  // Neon and the spark of an overload
  neonPink: '#FF0066',
  spark: '#ff5a3c',

  // Maroon theatre boards
  bloodDark: '#660000',
  blood: '#8B0000',
  // The edge of a ventures banner, so the cloth deepens from bloodDark behind the title outward, the stage's
  // valance and the board under the vending machine's thin marquee letters
  bloodDeep: '#3F0000',

  // His painted costume: a passenger's white shirt with its sleeves rolled, the braces, the waistcoat the
  // Musician wears over it, the slacks and shoes; the spark coil's copper and the blue of its spark
  shirt: '#e9e4d8',
  shirtShade: '#a9aab0',
  braces: '#5a2a1c',
  waistcoat: '#262a36',
  slacks: '#2e2b27',
  shoe: '#3a2414',
  copper: '#b8673a',
  copperDark: '#6e3418',
  steel: '#9aa0a4',
  steelShade: '#4f5458',
  bolt: '#7fe0ff',
  boltCore: '#effcff',

  // The night sea of the crash: the sky, the black water, the moon's path on it and the burning fuel
  nightSky: '#081426',
  nightHorizon: '#1a2c48',
  nightSea: '#040b16',
  moonPath: '#9fb6d6',
  fire: '#ff8a1c',
  fireCore: '#ffd75a',
  smoke: '#1c1a1c',
  plane: '#c9cdd2',
  planeShade: '#7d848c',

  // The rooms: the clinic's tiles, the greenhouse's leaves, the ballroom's walls and the pump hall's paint
  tile: '#b9c9bd',
  tileShade: '#7d9384',
  leaf: '#2f6b4a',
  leafDark: '#173d2b',
  ballroom: '#3a0d14',
  pumpWall: '#1d2a26',

  // The city's people: a tenant's rags, the tonic's glow in his eyes, the little one's raincoat and her lamp,
  // the guardian's copper, the giant's swollen glow
  rags: '#4b4036',
  ragsDark: '#2a231d',
  barnacle: '#c8c0a8',
  tonic: '#b6ff6a',
  raincoat: '#e6b422',
  raincoatShade: '#a57a10',
  lamp: '#ffd98a',
  giantGlow: '#ff5a2a',

  // The morning at the surface
  dawnSky: '#f4c890',
  daySky: '#8cc4e8',
  daySea: '#2e7fa6',
  stone: '#c9a27a',
  stoneShade: '#8e6a48',

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
