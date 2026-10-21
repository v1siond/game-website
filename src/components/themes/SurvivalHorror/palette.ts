import { paletteVars } from '../shared/paletteVars'

// Survival Horror's palette: an old house at night lit by one lamp at a time. Near black shadows, the
// sepia browns of panelled wood and old paper, olive for the damp, rust for worn metal, a dark red
// leather for the gloves and the curtains, brass and lamp flame for the light, cream and fog grey for the type.
//
// The one source of the world's colours: SVG fills read SH, class strings and world.module.css read the
// same values as --sh-* variables (SH_VARS, set once on the world's root).
//
// Text pairs: cream on paper 9.2:1, fog on paper 5.9:1, brass on paper 5.4:1, flame on paper 7.4:1,
// ivory on rust 6.0:1, void on flame 9.6:1; on the monitor black: fine 10.0:1, caution 11.4:1, danger 5.7:1; ivory on either map room 5.5:1 and up.
export const SH = {
  void: '#0f0a08',
  shadow: '#1a1410',
  panel: '#231a13',
  paper: '#2e2419',
  sepia: '#3d3020',
  wood: '#5c4a38',
  olive: '#4a4a30',
  rust: '#7a4a34',
  leather: '#5a1e1a',
  brass: '#c49050',
  flame: '#e8a860',
  cream: '#d8c8a8',
  ivory: '#f0e8d8',
  fog: '#a8a090',
  ash: '#706860',
  steel: '#4a5258',
  // The boots, his and the stalker's.
  boot: '#20160f',
  // The survivor's kit: the brown leather bomber lit and in shade, its fur collar, the black top, the grey
  // cargo trousers, the rig's straps, the gun metal, the laser.
  bomber: '#6e4426',
  bomberLit: '#8f5c34',
  bomberShade: '#43281a',
  fur: '#d9c39b',
  furShade: '#a08960',
  top: '#1a1a1e',
  cargo: '#45443e',
  cargoShade: '#2e2d29',
  strap: '#2a1c12',
  gunmetal: '#2c3034',
  laser: '#ff3b30',
  // The condition screen: the trace and its word in each state.
  fine: '#62d26a',
  caution: '#e8c547',
  danger: '#f05a4a',
  monitor: '#07120a',
  // The map: a room with something left in it, a searched room, the floor between.
  roomLeft: '#963430',
  roomSearched: '#2a5a9c',
  mapFloor: '#141b24',
  // The herbs.
  herbGreen: '#3f9a46',
  herbRed: '#c23a32',
  pot: '#6a4630',
  // The stalker: the long coat, its belts, the pale grey head.
  coat: '#16171a',
  coatLit: '#2b2d32',
  stalkerSkin: '#8c857b',
  // The case lining and the trader's eyes.
  felt: '#24402e',
  feltLine: '#335a40',
  moon: '#9fb4c8',
} as const

export const SH_VARS = paletteVars('sh', SH)
