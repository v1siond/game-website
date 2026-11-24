import { SH } from './palette'

// The hunched shape that comes at him out of the dark, drawn as a silhouette with its feet on (0, 0), facing
// left toward him. The scenes move it whole by its transform (./scenes); nothing inside it moves. The pursuer
// has joints and paces of its own (./pursuer).

const LINE = SH.void

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
