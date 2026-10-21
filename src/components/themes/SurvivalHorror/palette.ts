import { paletteVars } from '../shared/paletteVars'

// Survival Horror's palette: an old house at night lit by one lamp at a time. Near black shadows, the
// sepia browns of panelled wood and old paper, olive for the damp, rust for worn metal, a dark red
// leather for the gloves and the curtains, brass and lamp flame for the light, cream and fog grey for the type.
//
// The one source of the world's colours: SVG fills read SH, class strings and world.module.css read the
// same values as --sh-* variables (SH_VARS, set once on the world's root).
//
// Text pairs: cream on paper 9.2:1, fog on paper 5.9:1, brass on paper 5.4:1, flame on paper 7.4:1,
// ivory on rust 6.0:1, void on flame 9.6:1.
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
  phosphor: '#9ccf9a',
  // His clothes: the field jacket, the dark trousers and tee, the boots.
  jacket: '#4b4a2e',
  denim: '#262830',
  boot: '#20160f',
} as const

export const SH_VARS = paletteVars('sh', SH)
