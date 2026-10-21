import { useId } from 'react'
import { SOUL } from './palette'
import souls from './souls.module.css'

// The bonfire, the one warm thing in a grey world: a coiled sword driven into a mound of ash and bones,
// inside a ring of stones, and the fire round its blade. Three states:
// - out: cold ash, the sword dark, a last ember faint at its foot (the last fire before Contact is kindled);
// - ember: the ash catches, a low glow and a small flame (the first beat of the hero's lighting);
// - lit: the full fire, three tongues of flame that flicker apart and sparks that rise.
// The sword's coil is the blade twisted round itself, drawn as the two strands of a spiral. viewBox 100 by
// 110, the mound's foot on y 102. Decorative: the scene that holds it owns the button and its name.

export type FireState = 'out' | 'ember' | 'lit'

const STATE_CLASS: Record<FireState, string> = {
  out: souls.fireOut,
  ember: souls.fireEmber,
  lit: souls.fireLit,
}

// The coil: two strands crossing the blade from the ash up to below the guard.
const COIL_FRONT = 'M46 90 Q54 86 46 82 Q54 78 46 74 Q54 70 46 66 Q54 62 46 58 Q53 54 47 50'
const COIL_BACK = 'M54 88 Q46 84 54 80 Q46 76 54 72 Q46 68 54 64 Q46 60 54 56 Q47 52 53 48'

export function Bonfire({ state, className = '' }: { state: FireState; className?: string }) {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 100 110" className={`${souls.fire} ${STATE_CLASS[state]} ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.75" r="0.6">
          <stop offset="0" stopColor={SOUL.flame} stopOpacity={0.75} />
          <stop offset="0.45" stopColor={SOUL.ember} stopOpacity={0.3} />
          <stop offset="1" stopColor={SOUL.ember} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-ash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SOUL.ash} />
          <stop offset="1" stopColor={SOUL.rock} />
        </linearGradient>
        <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SOUL.steelDark} />
          <stop offset="0.5" stopColor={SOUL.mail} />
          <stop offset="1" stopColor={SOUL.ink} />
        </linearGradient>
      </defs>

      <ellipse className={souls.fireGlow} cx={50} cy={80} rx={50} ry={34} fill={`url(#${id}-glow)`} />

      {/* the mound of ash, the bones and a skull half buried in it */}
      <path d="M12 102 Q20 88 50 86 Q80 88 88 102 Z" fill={`url(#${id}-ash)`} />
      <path d="M22 98 L34 94 M64 95 L77 99 M40 99 L46 96" stroke={SOUL.bone} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
      <circle cx={70} cy={93} r={3.2} fill={SOUL.bone} opacity={0.75} />
      <circle cx={69} cy={92.6} r={0.8} fill={SOUL.ink} />
      <circle cx={71.6} cy={92.6} r={0.8} fill={SOUL.ink} />

      {/* the ring of stones */}
      {[14, 26, 40, 60, 74, 86].map((x) => (
        <ellipse key={x} cx={x} cy={102 + (x === 40 || x === 60 ? 2 : 0)} rx={6} ry={3.4} fill={SOUL.ridge} />
      ))}

      {/* the coiled sword, a little off upright */}
      <g transform="rotate(4 50 92)">
        <path d={COIL_BACK} fill="none" stroke={SOUL.emberDeep} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M48 94 L48.6 40 H51.4 L52 94 Z" fill={`url(#${id}-blade)`} />
        <path d={COIL_FRONT} fill="none" stroke={SOUL.steelDark} strokeWidth={2.6} strokeLinecap="round" />
        <path d={COIL_FRONT} fill="none" stroke={SOUL.ash} strokeWidth={0.8} strokeLinecap="round" />
        <rect x={41} y={37} width={18} height={3} rx={1} fill={SOUL.steelDark} />
        <rect x={48.6} y={28} width={2.8} height={9} fill={SOUL.leatherDark} />
        <circle cx={50} cy={27} r={2.4} fill={SOUL.steelDark} />
      </g>

      {/* the fire */}
      <g className={souls.flames}>
        <path
          className={souls.flameOuter}
          d="M30 98 C26 84 34 76 33 64 C40 72 41 62 44 50 C48 60 52 54 53 42 C58 56 64 60 62 68 C68 64 70 76 70 82 C72 90 68 98 62 98 Z"
          fill={SOUL.ember}
        />
        <path
          className={souls.flameMid}
          d="M36 98 C33 88 38 82 39 72 C43 78 45 70 48 60 C52 70 56 68 57 76 C61 74 63 84 62 90 C62 96 58 98 56 98 Z"
          fill={SOUL.flame}
        />
        <path
          className={souls.flameCore}
          d="M42 98 C40 92 43 88 45 82 C47 86 49 82 51 76 C53 84 56 86 56 92 C56 96 54 98 52 98 Z"
          fill={SOUL.flameCore}
        />
      </g>
      <g>
        <circle className={souls.spark} cx={44} cy={70} r={1} fill={SOUL.flameCore} />
        <circle className={souls.spark} cx={56} cy={66} r={0.8} fill={SOUL.flame} />
        <circle className={souls.spark} cx={50} cy={74} r={0.9} fill={SOUL.flameCore} />
      </g>
      <circle className={souls.lastEmber} cx={51} cy={94} r={1.6} fill={SOUL.ember} />
    </svg>
  )
}
