import { SOUL } from './palette'

// The foes of the ruins, each drawn round its feet (x 0, y 0) facing left, toward him, and painted like
// him: shapes lit by gradients, a darker far side, nothing outlined. Each is a group named `id` that a
// place's reply turns round its feet (a stagger, a fall), with the limb that acts in a group of its own,
// `${id}-arm` or `${id}-shield`, turned round its shoulder. Every pivot is exported with the drawing so the
// reply turns each part round the joint it is drawn on.

/** Where a hollow's sword arm turns. */
export const HOLLOW_SHOULDER = [-18, -208] as const

/** A hollow soldier: a gaunt, stooped body of dried skin in rags, sunken eyes, a notched sword in its
 *  near hand. */
export function Hollow({ id }: { id: string }) {
  const [sx, sy] = HOLLOW_SHOULDER
  return (
    <g data-fx={id}>
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SOUL.hollow} />
          <stop offset="1" stopColor={SOUL.hollowDark} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={2} rx={46} ry={7} fill={SOUL.ink} opacity={0.5} />
      {/* the far leg and arm, in shadow */}
      <path d="M6 -126 L14 -64 L20 0" fill="none" stroke={SOUL.hollowDark} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 -210 L0 -150 L-10 -112" fill="none" stroke={SOUL.hollowDark} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      {/* the near leg */}
      <path d="M-6 -126 L-16 -64 L-24 0" fill="none" stroke={SOUL.hollow} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-26} y={-72} width={18} height={14} rx={4} fill={SOUL.rag} transform="rotate(10 -17 -65)" />
      {/* the stooped body and its rags */}
      <path d="M-20 -128 Q-36 -180 -32 -214 Q-12 -234 16 -222 Q22 -176 18 -128 Z" fill={`url(#${id}-skin)`} />
      <path d="M-22 -150 L-2 -146 M-26 -170 L-2 -168 M-28 -190 L-4 -190" stroke={SOUL.hollowDark} strokeWidth={3} />
      <path d="M-24 -140 H24 L30 -86 L16 -98 L6 -80 L-6 -96 L-18 -82 L-26 -96 Z" fill={SOUL.rag} />
      {/* the head, thrust forward, hollow eyed */}
      <circle cx={-36} cy={-240} r={20} fill={`url(#${id}-skin)`} />
      <path d="M-50 -250 Q-40 -264 -20 -256" fill="none" stroke={SOUL.hollowDark} strokeWidth={4} />
      <circle cx={-46} cy={-242} r={4.5} fill={SOUL.ink} />
      <path d="M-54 -228 L-40 -226" stroke={SOUL.ink} strokeWidth={3} strokeLinecap="round" />
      <path d="M-24 -258 Q-10 -262 -4 -248 M-18 -262 Q-8 -272 2 -262" fill="none" stroke={SOUL.hollowDark} strokeWidth={2} />
      {/* the sword arm */}
      <g data-fx={`${id}-arm`}>
        <path d={`M${sx} ${sy} L-30 -162 L-44 -124`} fill="none" stroke={SOUL.hollow} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-44 -124 L-140 -88" stroke={SOUL.steel} strokeWidth={6} strokeLinecap="round" />
        <path d="M-90 -106 L-96 -100 L-104 -104" fill="none" stroke={SOUL.steelDark} strokeWidth={3} />
        <path d="M-50 -136 L-38 -112" stroke={SOUL.steelDark} strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  )
}

/** Where the demon's hammer arm turns. */
export const DEMON_SHOULDER = [-70, -420] as const

/** The great demon of the arena, twice his height: a hunched hide body over a pale belly, horns swept
 *  forward, an ember eye, stub wings on its back and a stone hammer in its near hand. Its hammer arm is
 *  drawn as it lands, the head on the floor 330 ahead of the demon's feet. */
export function Demon({ id }: { id: string }) {
  const [sx, sy] = DEMON_SHOULDER
  return (
    <g data-fx={id}>
      <defs>
        <radialGradient id={`${id}-hide`} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor={SOUL.belly} />
          <stop offset="0.55" stopColor={SOUL.hide} />
          <stop offset="1" stopColor={SOUL.hideDark} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={4} rx={190} ry={16} fill={SOUL.ink} opacity={0.55} />
      {/* wings, the far arm and the far leg, in shadow */}
      <path d="M80 -470 Q170 -640 250 -660 Q220 -560 240 -470 Q190 -500 160 -430 Q130 -470 100 -420 Z" fill={SOUL.hideDark} />
      <path d="M90 -400 Q150 -330 130 -220 L108 -210 Q118 -320 70 -380 Z" fill={SOUL.hideDark} />
      <path d="M50 -200 Q110 -170 100 -90 L120 0 H60 L56 -80 Q20 -140 30 -190 Z" fill={SOUL.hideDark} />
      {/* the body */}
      <path d="M-140 -380 Q-150 -520 -20 -540 Q120 -540 150 -400 Q170 -260 110 -180 Q20 -130 -80 -170 Q-160 -230 -140 -380 Z" fill={`url(#${id}-hide)`} />
      <path d="M-100 -300 Q-60 -200 30 -190 Q-20 -250 -30 -320 Z" fill={SOUL.belly} opacity={0.55} />
      {/* the near leg */}
      <path d="M-90 -200 Q-150 -150 -120 -70 L-130 0 H-50 L-56 -60 Q-30 -130 -40 -180 Z" fill={SOUL.hide} />
      <path d="M-134 0 L-150 -10 M-110 0 L-122 -14" stroke={SOUL.bone} strokeWidth={6} strokeLinecap="round" />
      {/* the head, low and forward of the shoulders */}
      <path d="M-110 -500 Q-120 -540 -170 -530 Q-210 -510 -200 -470 Q-190 -440 -140 -440 Q-110 -450 -110 -500 Z" fill={SOUL.hide} />
      <path d="M-150 -530 Q-170 -600 -230 -610 Q-200 -580 -190 -540 Z M-120 -520 Q-110 -590 -150 -630 Q-140 -580 -146 -530 Z" fill={SOUL.bone} />
      <circle cx={-178} cy={-496} r={7} fill={SOUL.ember} />
      <path d="M-196 -460 L-188 -448 L-180 -460 L-172 -448 L-164 -460" fill="none" stroke={SOUL.bone} strokeWidth={4} />
      {/* the hammer arm, drawn as it lands */}
      <g data-fx={`${id}-arm`}>
        <path d={`M${sx + 20} ${sy - 10} Q${sx - 90} ${sy + 20} -200 -250 L-180 -226 Q${sx - 50} ${sy + 60} ${sx + 30} ${sy + 50} Z`} fill={SOUL.hide} />
        <circle cx={-194} cy={-238} r={22} fill={SOUL.hideDark} />
        <path d="M-194 -238 L-330 -60" stroke={SOUL.leatherDark} strokeWidth={14} strokeLinecap="round" />
        <path d="M-400 -100 L-300 -110 L-276 -10 L-372 0 Z" fill={SOUL.ridge} />
        <path d="M-400 -100 L-300 -110 L-296 -92 L-394 -82 Z" fill={SOUL.ash} />
      </g>
    </g>
  )
}

/** Where the shield knight's shield arm turns. */
export const SHIELD_SHOULDER = [-12, -226] as const

/** A shield knight in dark iron, the tall shield held up before it and a sword low at its far side. */
export function ShieldKnight({ id }: { id: string }) {
  const [sx, sy] = SHIELD_SHOULDER
  return (
    <g data-fx={id}>
      <defs>
        <linearGradient id={`${id}-iron`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={SOUL.ironLight} />
          <stop offset="0.6" stopColor={SOUL.iron} />
          <stop offset="1" stopColor={SOUL.ink} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={2} rx={60} ry={8} fill={SOUL.ink} opacity={0.5} />
      <path d="M8 -130 L16 -66 L22 0" fill="none" stroke={SOUL.iron} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 -150 L52 -60" stroke={SOUL.steelDark} strokeWidth={6} strokeLinecap="round" />
      <path d="M-8 -130 L-14 -66 L-20 0" fill="none" stroke={`url(#${id}-iron)`} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-30 -230 Q0 -244 30 -230 L34 -130 Q0 -118 -32 -130 Z" fill={`url(#${id}-iron)`} />
      <path d="M-34 -140 H34 L40 -96 H-40 Z" fill={SOUL.rag} />
      {/* the closed helm, a slit for the eyes */}
      <path d="M-30 -232 Q-34 -286 0 -290 Q30 -286 26 -232 Z" fill={`url(#${id}-iron)`} />
      <rect x={-32} y={-266} width={22} height={4} fill={SOUL.ink} />
      <path d="M0 -290 Q10 -320 36 -324" fill="none" stroke={SOUL.wraps} strokeWidth={6} strokeLinecap="round" />
      {/* the shield arm and the tall shield */}
      <g data-fx={`${id}-shield`}>
        <path d={`M${sx} ${sy} L-34 -170`} stroke={SOUL.iron} strokeWidth={14} strokeLinecap="round" />
        <path d="M-86 -270 H-36 Q-30 -150 -40 -40 Q-62 -26 -86 -40 Q-94 -150 -86 -270 Z" fill={`url(#${id}-iron)`} />
        <path d="M-80 -262 H-42 Q-38 -150 -46 -48 Q-62 -38 -80 -48 Q-86 -150 -80 -262 Z" fill="none" stroke={SOUL.ironLight} strokeWidth={2} opacity={0.6} />
        <circle cx={-62} cy={-160} r={9} fill={SOUL.ironLight} />
      </g>
    </g>
  )
}

/** A turn about a point, the way a reply writes a foe's part: `deg` degrees about (x, y), then moved. */
export const turnOf = (deg: number, [x, y]: readonly [number, number], dx = 0, dy = 0): string =>
  `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${deg.toFixed(1)} ${x} ${y})`
