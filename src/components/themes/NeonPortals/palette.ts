import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { paletteVars } from '../shared/paletteVars'

// The world's one colour source: the warp corridor's night, the panels the text sits on, and one neon pair
// per era (a1, a2) with the facade fill of its gate and the shape of its opening. The page reads PORTAL as
// --np-* variables (PORTAL_VARS on the root); the tunnel's SVG art reads ERAS; the runner reads FIGURE.
//
// Every text pair is on an opaque panel, never on the art. WCAG ratio, measured with contrast.py:
// INK on PANEL 16.9:1, on RAISED 15.6:1; MUTED on PANEL 11.3:1, on RAISED 10.5:1; WHITE on PANEL 19.1:1;
// PANEL on GOLD 13.3:1; each era's tint (ERA_TINT_SHARE of the way from a1 to white) 10.6:1 or more on
// PANEL and 9.8:1 or more on RAISED, the highway's the lowest, and PANEL on a tint (the lit button) the
// same. AAA (7:1) everywhere.
export const PORTAL = {
  VOID: '#070418',
  PANEL: '#120b26',
  RAISED: '#1b1238',
  SEAM: '#3a2f8f',
  INK: '#f3effc',
  MUTED: '#cbc3e2',
  WHITE: '#ffffff',
  GOLD: '#ffd34d',
  CYAN: '#5cf2ff',
  VIOLET: '#b88cff',
  PLATINUM: '#eaf6ff',
  SAPPHIRE: '#5aa8ff',
} as const

export const PORTAL_VARS = paletteVars('np', PORTAL)

export interface EraLook {
  /** The era's two neon colours: its rails, gate lines and the cards' edge (a1), its accents (a2). */
  a1: string
  a2: string
  /** The fill of its gate facade. */
  wall: string
  shape: GateShape
}

export type GateShape = 'ellipse' | 'arch' | 'rounded' | 'pointed' | 'hex' | 'trapezoid' | 'gable' | 'chamfer'

// One per room, each the machine's portal into one of the run's places (sets/ draws the place itself), in
// our own time and look, never a place from a game.
export const ERAS = {
  hub: { a1: '#5cf2ff', a2: '#b88cff', wall: '#0d0828', shape: 'ellipse' },
  village: { a1: '#ffc35c', a2: '#8ff06a', wall: '#1a1006', shape: 'arch' },
  swamp: { a1: '#ff8a3d', a2: '#ff4a3d', wall: '#1c0a04', shape: 'pointed' },
  highway: { a1: '#ff5db8', a2: '#ffa24c', wall: '#1e0716', shape: 'rounded' },
  colosseum: { a1: '#ffd166', a2: '#43f5e4', wall: '#171006', shape: 'trapezoid' },
  glass: { a1: '#4fd8ff', a2: '#ff8a3d', wall: '#04121c', shape: 'hex' },
  tower: { a1: '#5ff0c8', a2: '#ffd34d', wall: '#071418', shape: 'chamfer' },
  sky: { a1: '#9fd4ff', a2: '#ff8f5a', wall: '#0a1226', shape: 'chamfer' },
  core: { a1: '#ff6bf2', a2: '#ffd34d', wall: '#160626', shape: 'gable' },
  saved: { a1: '#e8fbff', a2: '#5cf2ff', wall: '#071420', shape: 'ellipse' },
} as const satisfies Record<string, EraLook>

export type Era = keyof typeof ERAS

/** The colour a room's small text takes on its panel: its a1 lifted toward white, so it reads at 9:1. */
export const ERA_TINT_SHARE = 0.45

/** Him as the corridor's runner: an orange furred original hero with his own skin on the muzzle,
 *  his dark hair as the spiky tuft, his short boxed beard, his brows and his black oval pupils, in rolled
 *  jeans and red high tops. Fur, jeans and shoes are 3:1 or more on VOID (non text), so he never sinks
 *  into the night. */
export const FIGURE = {
  fur: '#ef7a2c',
  furShade: '#b9531b',
  furLit: '#ffab62',
  earInner: '#ffc89a',
  skin: HERO_IDENTITY.skin,
  skinShade: HERO_IDENTITY.skinShade,
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyes: HERO_IDENTITY.eyes,
  eyeWhite: '#fbf7ee',
  nose: '#120c12',
  mouth: '#4a1014',
  teeth: '#fbf7ee',
  jeans: '#4a7fe0',
  jeansShade: '#2d56a8',
  cuff: '#7aa6f0',
  glove: '#8a4f28',
  gloveShade: '#5e3418',
  shoe: '#e0342a',
  shoeShade: '#9a1c16',
  sole: '#f2e6c8',
  pack: '#2a1f5e',
  stick: '#ffe1a8',
  board: '#2fd6ff',
  boardStripe: '#fff2a8',
  boulder: '#8a6a4a',
  boulderShade: '#5a4028',
  boulderLit: '#d8b48a',
  line: PORTAL.VOID,
} as const

// The wardrobe plate under him: gold on the panel, the cyan ring.
export const OUTFIT_LOOK = { plate: PORTAL.PANEL, text: PORTAL.GOLD, ring: PORTAL.CYAN }
