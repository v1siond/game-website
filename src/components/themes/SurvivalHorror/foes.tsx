import { SH } from './palette'

// What waits in the dark of the house, drawn as silhouettes with their feet on (0, 0), facing left toward
// him: the tall pursuer in a long hooded coat who walks the rooms, and the hunched shape that comes at him
// out of the dark. The scenes move them whole by their transforms (./scenes); nothing inside them moves.

const LINE = SH.void

/** The pursuer: a head taller than him, the hood low over a face kept in shadow, the coat to his boots. */
export function Pursuer() {
  return (
    <g>
      <ellipse cx={0} cy={1} rx={22} ry={2.6} fill={SH.void} opacity={0.6} />
      <path d="M-15 0 L-12 -60 L12 -60 L16 0 Z" fill={SH.coat} stroke={LINE} strokeWidth={1.4} />
      <path d="M-20 -58 Q-22 -110 -14 -128 Q0 -136 14 -128 Q22 -110 18 -58 Z" fill={SH.coat} stroke={LINE} strokeWidth={1.4} />
      <path d="M-4 -126 L-2 -64" stroke={SH.coatLit} strokeWidth={1.6} />
      <path d="M-22 -120 L-30 -74 L-24 -72 L-16 -112 Z" fill={SH.coatLit} stroke={LINE} strokeWidth={1.4} />
      <path d="M-14 -132 Q-16 -158 0 -162 Q14 -160 13 -132 Q0 -126 -14 -132 Z" fill={SH.coat} stroke={LINE} strokeWidth={1.4} />
      <path d="M-11 -138 Q-6 -146 2 -144 L0 -134 Z" fill={SH.void} />
      <circle cx={-6} cy={-140} r={0.9} fill={SH.flame} opacity={0.8} />
    </g>
  )
}

/** The hunched shape: low on bent legs, one long arm reaching for him. */
export function Shape() {
  return (
    <g>
      <ellipse cx={0} cy={1} rx={16} ry={2.2} fill={SH.void} opacity={0.6} />
      <path d="M-8 0 L-4 -30 L4 -30 L10 0 L6 0 L1 -22 L-3 0 Z" fill={SH.shape} stroke={LINE} strokeWidth={1.2} />
      <path d="M-10 -30 Q-12 -62 4 -72 Q18 -68 16 -30 Z" fill={SH.shape} stroke={LINE} strokeWidth={1.2} />
      <path d="M-4 -60 Q-22 -54 -30 -40 L-26 -37 Q-18 -48 -2 -52 Z" fill={SH.shape} stroke={LINE} strokeWidth={1.2} />
      <ellipse cx={-6} cy={-72} rx={8} ry={9} fill={SH.shape} stroke={LINE} strokeWidth={1.2} />
      <circle cx={-10} cy={-73} r={1.1} fill={SH.cream} opacity={0.7} />
    </g>
  )
}
