import { NOIR } from './palette'

// The detective's car, a 1940s four door sedan side on and facing right, our own drawing: the long hood,
// the rounded fenders over the wheels, the fastback roof with the red roof light on it, the chrome strip
// and the headlight. Drawn from its rear bumper (x 0) on the ground (y 0), SEDAN.length long. Its window is
// cut out of the body, so a driver drawn behind it shows through. The roof light's glow is
// `data-fx="{name}-beacon"`, the headlight's beam `{name}-beam`, both at rest dark.

export const SEDAN = { length: 560, wheelR: 40, rearWheel: 120, frontWheel: 450, driver: 300 }

const BODY =
  'M6 -44 Q0 -100 40 -112 L150 -120 Q190 -238 300 -240 L340 -238 Q392 -232 420 -150 L520 -138 Q560 -128 556 -44 Z ' +
  // the window, cut out (even odd)
  'M214 -150 Q236 -222 300 -224 L336 -222 Q372 -216 392 -152 Z'

export function Sedan({ name }: { name: string }) {
  const { wheelR, rearWheel, frontWheel } = SEDAN
  return (
    <g>
      <g data-fx={`${name}-beam`} opacity="0">
        <polygon points="552,-96 1200,-170 1200,10 552,-60" fill={NOIR.paper} opacity="0.14" />
      </g>
      <path d={BODY} fill={NOIR.ink} fillRule="evenodd" stroke={NOIR.ash} strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 -86 H530" stroke={NOIR.fog} strokeWidth="4" />
      <path d="M300 -150 V-108 M222 -150 L214 -50" stroke={NOIR.smoke} strokeWidth="4" />
      {[rearWheel, frontWheel].map((x) => (
        <g key={x}>
          <path d={`M${x - wheelR - 18} -44 Q${x} ${-wheelR * 2 - 34} ${x + wheelR + 18} -44 Z`} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="4" />
          <circle cx={x} cy={-wheelR} r={wheelR} fill={NOIR.coal} stroke={NOIR.ink} strokeWidth="6" />
          <circle cx={x} cy={-wheelR} r={wheelR * 0.45} fill={NOIR.fog} />
        </g>
      ))}
      <ellipse cx={548} cy={-80} rx={10} ry={14} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
      <rect x={290} y={-258} width={30} height={18} rx={4} fill={NOIR.redDeep} stroke={NOIR.ink} strokeWidth="3" />
      <g data-fx={`${name}-beacon`} opacity="0">
        <circle cx={305} cy={-250} r={70} fill={NOIR.red} opacity="0.25" />
        <rect x={290} y={-258} width={30} height={18} rx={4} fill={NOIR.red} />
      </g>
    </g>
  )
}
