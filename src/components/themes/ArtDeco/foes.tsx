import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { HAND } from './city'
import { DECO_COLORS as C } from './palette'

// The city's other side, drawn in its own gilt and shadow: the raider, a crazed citizen of the drowned city
// in a torn evening suit behind a pale party mask, with a pipe in hand; and the brass guard, a hulking diving
// suit with a round porthole helmet and its lamp. Each is drawn round its feet facing him (to the left) and
// is one group the scene's writer moves as a whole: stiffened by a bolt, knocked down, kneeling. The jagged
// bolt from his charged hand to a foe is drawn here too.

/** A raider at its feet, its body in `data-fx="{name}"`. */
export function Raider({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-30 0 L-24 -116 L-4 -116 L-8 0 Z M8 0 L4 -116 L24 -116 L30 0 Z" fill={C.slacks} stroke={C.sepia} strokeWidth="3" />
      <path d="M-40 -110 L-34 -214 Q0 -228 34 -214 L40 -110 Z" fill={C.bloodDark} stroke={C.sepia} strokeWidth="3" />
      <path d="M-12 -220 L0 -170 L12 -220 Z" fill={C.cream} />
      <path d="M-34 -210 L-70 -150 L-58 -140 L-28 -184 Z" fill={C.bloodDark} stroke={C.sepia} strokeWidth="3" />
      <path d="M-66 -144 L-104 -196" stroke={C.steel} strokeWidth="9" strokeLinecap="round" />
      <path d="M34 -210 L48 -140 L36 -136 L26 -180 Z" fill={C.bloodDark} stroke={C.sepia} strokeWidth="3" />
      <circle cx={0} cy={-248} r={28} fill={C.knitShade} stroke={C.sepia} strokeWidth="3" />
      <path d="M-26 -262 Q0 -276 24 -262 L20 -240 Q0 -232 -24 -240 Z" fill={C.ivory} stroke={C.gold} strokeWidth="3" />
      <path d="M-16 -254 L-6 -250 M10 -254 L18 -250" stroke={C.abyss} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

/** The brass guard at its feet, its body in `data-fx="{name}"` and its lamp in `data-fx="{name}-lamp"`. */
export function BrassGuard({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-56 0 L-50 -130 L-14 -130 L-18 0 Z M18 0 L14 -130 L50 -130 L56 0 Z" fill={C.brassDark} stroke={C.sepia} strokeWidth="4" />
      <path d="M-80 -120 Q-90 -260 0 -280 Q90 -260 80 -120 Z" fill={C.bronze} stroke={C.sepia} strokeWidth="4" />
      <path d="M-80 -240 L-118 -110 L-90 -100 L-60 -190 Z M80 -240 L110 -110 L82 -100 L60 -190 Z" fill={C.brassDark} stroke={C.sepia} strokeWidth="4" />
      <circle cx={0} cy={-320} r={60} fill={C.brassMid} stroke={C.sepia} strokeWidth="4" />
      <circle cx={-14} cy={-320} r={34} fill={C.abyss} stroke={C.gold} strokeWidth="6" />
      <circle data-fx={`${name}-lamp`} cx={-14} cy={-320} r={24} fill={C.goldBright} />
    </g>
  )
}

// Where a bolt or a shot hits a foe standing at `x` from his place: its chest.
const chest = (x: number) => ({ x, y: -170 })

/** The jagged bolt from his charged hand to the foe at `x` from his place, hidden until thrown. */
export function Arc({ name, x }: { name: string; x: number }) {
  const to = chest(x)
  const steps = 6
  const points = Array.from({ length: steps + 1 }, (_, k) => {
    const t = k / steps
    const kink = k === 0 || k === steps ? 0 : k % 2 ? -16 : 16
    return `${(HAND.x + (to.x - HAND.x) * t).toFixed(0)},${(HAND.y + (to.y - HAND.y) * t + kink).toFixed(0)}`
  }).join(' ')
  return (
    <g data-fx={`${name}-arc`} opacity="0" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points} stroke={C.bolt} strokeWidth="10" />
      <polyline points={points} stroke={C.boltCore} strokeWidth="4" />
    </g>
  )
}

/** A foe's writer: stiffened by a shock over `[from, to]` of the move's `t` (shaking, then rigid and leaning
 *  back), and knocked over backwards over `fall` when there is one. */
export function foeOf(stage: ParentNode, name: string) {
  const body = fx(stage, name)
  const arc = fx(stage, `${name}-arc`)
  return (t: number, shock: [number, number] | null, fall: [number, number] | null) => {
    const shocked = shock ? ramp(t, shock[0], shock[1]) : 0
    const shake = shocked > 0 && shocked < 1 ? 4 * Math.sin(t * 120) : 0
    const down = fall ? ramp(t, fall[0], fall[1]) : 0
    fadeTo(arc, shocked > 0 && shocked < 1 ? 1 : 0)
    transformTo(body, `translate(${shake.toFixed(1)} 0) rotate(${(8 * shocked + 76 * down).toFixed(1)})`)
  }
}
