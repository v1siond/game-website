import { NOIR } from './palette'

// The other side of the night: a guard of the building, or a foe in a fight, cut as one flat ink shape edged
// in red with a pale mask over its face and two red slits for eyes. It is drawn round its feet (x 0, y 0),
// facing the way it is drawn, about as tall as him. Its body and its mask are groups the scene's writer
// moves: the body falls, the mask flies.

export const SHADOW_H = 290

/** A guard or a foe at its feet, its body in `data-fx="{name}"` and its mask in `data-fx="{name}-mask"`. */
export function Shadow({ name, facing = 1 }: { name: string; facing?: 1 | -1 }) {
  return (
    <g transform={`scale(${facing} 1)`}>
      <g data-fx={name}>
        <path
          d="M-34 0 L-26 -120 L-48 -126 L-40 -206 Q0 -224 40 -206 L48 -126 L26 -120 L34 0 L10 0 L4 -96 L-4 -96 L-10 0 Z"
          fill={NOIR.ink}
          stroke={NOIR.red}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M-40 -204 L-62 -110 L-48 -104 L-30 -170 M40 -204 L66 -116 L52 -108 L30 -170" fill={NOIR.ink} stroke={NOIR.red} strokeWidth="4" strokeLinejoin="round" />
        <circle cx={0} cy={-246} r={30} fill={NOIR.ink} stroke={NOIR.red} strokeWidth="4" />
        <g data-fx={`${name}-mask`}>
          <path d="M-26 -262 Q0 -276 26 -262 L22 -236 Q0 -226 -22 -236 Z" fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
          <path d="M-16 -252 L-6 -248 M16 -252 L6 -248" stroke={NOIR.red} strokeWidth="4" />
        </g>
      </g>
    </g>
  )
}
