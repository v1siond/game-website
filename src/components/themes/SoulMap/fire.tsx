import { SOUL } from './palette'

// The fire, the world's one warm light, drawn round its foot (x 0, y 0) at `size`: its glow, the outer
// flame, the middle and the white core.
export function Flame({ size = 1 }: { size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <circle cx={0} cy={-50} r={120} fill={SOUL.ember} opacity={0.22} />
      <path d="M-40 0 Q-50 -60 -14 -110 Q-10 -70 8 -60 Q6 -110 30 -140 Q56 -80 40 0 Z" fill={SOUL.ember} />
      <path d="M-24 0 Q-30 -46 -4 -84 Q2 -50 16 -46 Q20 -76 30 -94 Q40 -46 26 0 Z" fill={SOUL.flame} />
      <path d="M-10 0 Q-12 -26 2 -46 Q14 -26 12 0 Z" fill={SOUL.flameCore} />
    </g>
  )
}

/** The scale the fire is drawn at for `t` of its catching: from a low ember to its full height. */
export const fireAt = (t: number): string => `translate(0 -30) scale(${(0.15 + 0.85 * t).toFixed(3)})`

/** The rest point, drawn round its foot: a heap of ash and old bones with a sword standing in it, point
 *  down, and the fire (data-fx `name`) burning up round the blade. `lit` draws it at its full height. */
export function Bonfire({ name, lit = false }: { name: string; lit?: boolean }) {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={110} ry={12} fill={SOUL.ink} opacity={0.6} />
      <path d="M-92 0 Q-80 -30 -40 -40 Q0 -52 44 -40 Q82 -30 94 0 Z" fill={SOUL.ash} />
      <path d="M-70 -10 Q-40 -30 0 -34 Q36 -32 66 -12" fill="none" stroke={SOUL.ridge} strokeWidth={3} />
      <path d="M-58 -14 L-18 -30 M20 -22 L60 -10 M-30 -6 L4 -18" stroke={SOUL.bone} strokeWidth={6} strokeLinecap="round" />
      <circle cx={52} cy={-22} r={11} fill={SOUL.bone} />
      <circle cx={48} cy={-24} r={2.6} fill={SOUL.ink} />
      <circle cx={-22} cy={-26} r={4} fill={SOUL.ember} />
      <circle cx={14} cy={-30} r={3} fill={SOUL.emberDeep} />
      <g data-fx={name} transform={fireAt(lit ? 1 : 0)} opacity={lit ? 1 : 0.35}>
        <Flame size={0.9} />
      </g>
      {/* the sword stood in the ash, a little off true */}
      <g transform="rotate(6 0 -36)">
        <path d="M-4 -30 H4 V-118 L0 -124 L-4 -118 Z" transform="rotate(180 0 -77)" fill={SOUL.steelDark} />
        <rect x={-16} y={-128} width={32} height={6} rx={2} fill={SOUL.steelDark} />
        <rect x={-3} y={-152} width={6} height={24} fill={SOUL.leatherDark} />
        <circle cx={0} cy={-156} r={5} fill={SOUL.steelDark} />
      </g>
    </g>
  )
}

/** Writes the fire `t` of the way to its full height, from the ember it starts as. */
export function lightFire(node: Element | null, t: number): void {
  node?.setAttribute('transform', fireAt(t))
  node?.setAttribute('opacity', (0.35 + 0.65 * Math.min(1, t * 3)).toFixed(3))
}
