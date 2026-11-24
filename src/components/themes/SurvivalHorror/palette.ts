import { paletteVars } from '../shared/paletteVars'

// Survival Horror's palette: an old house at night lit by one lamp at a time. Near black shadows, the
// sepia browns of panelled wood and old paper, olive for the damp, rust for worn metal, a dark red
// leather for the gloves and the curtains, brass and lamp flame for the light, cream and fog grey for the type.
//
// The one source of the world's colours: SVG fills read SH, class strings and world.module.css read the
// same values as --sh-* variables (SH_VARS, set once on the world's root).
//
// Text pairs: cream on paper 9.2:1, fogText on paper 8.5:1, brassText on paper 8.8:1, flameText on paper 8.5:1,
// ivory on the rust plate 7.7:1, void on flame 9.6:1; brass, fog and flame keep painting lamps, frames and lines.
export const SH = {
  void: '#0f0a08',
  shadow: '#1a1410',
  panel: '#231a13',
  paper: '#2e2419',
  sepia: '#3d3020',
  wood: '#5c4a38',
  olive: '#4a4a30',
  rust: '#7a4a34',
  // The lit button's plate: rust deepened so ivory reads 7 to 1 and more on it.
  rustPlate: '#643d2b',
  leather: '#5a1e1a',
  brass: '#c49050',
  brassText: '#ddc09c',
  flame: '#e8a860',
  flameText: '#ecb87d',
  cream: '#d8c8a8',
  ivory: '#f0e8d8',
  fog: '#a8a090',
  fogText: '#c6c1b6',
  ash: '#706860',
  steel: '#4a5258',
  // His boots.
  boot: '#20160f',
  // His kit: the worn canvas jacket in shade and in the lamp light, the dark top, the grey trousers, the
  // belt and holster, the gun metal.
  jacket: '#5e5136',
  jacketShade: '#3b3222',
  jacketLit: '#7d6c48',
  top: '#1a1a1e',
  cargo: '#45443e',
  strap: '#2a1c12',
  gunmetal: '#2c3034',
  // The shapes in the dark: the pursuer's long coat and the hunched shape's skin.
  coat: '#16171a',
  coatLit: '#2b2d32',
  shape: '#3a3530',
  // The night through the windows, and the lamp light through the lit room's door.
  moon: '#9fb4c8',
  lampLight: '#f2c890',
} as const

export const SH_VARS = paletteVars('sh', SH)
