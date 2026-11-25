import type { ReactNode } from 'react'
import { COLORS as C } from './palette'

// The barrel platformer's things on the stages, drawn the way its rendered sprites look: round volumes in
// soft gradients lit from the upper right, a dark edge, a bright rim. Each is drawn round its own origin (its
// foot on the ground at 0 0 unless said) and placed by its place (places/). The gradients are drawn once
// for the page (PropShading, inside the world's SceneryDefs) and read by id.

const EDGE = C.shadow

// Each material's rendered shading: the specular glint at its lit top, its lit side, its own colour, its shade.
const GRADIENTS: ReadonlyArray<readonly [id: string, glint: string, light: string, mid: string, dark: string]> = [
  ['tp-wood', '#ffd59a', '#e8a35c', '#a8642a', '#3a1a06'],
  ['tp-hoop', '#ffffff', '#d6dde4', '#7d8690', '#262b30'],
  ['tp-beetle', '#e6f4ff', '#7fbfff', '#2f6fbf', '#0a1c40'],
  ['tp-boar', '#d6b8a0', '#a7826a', '#6b4a36', '#1e120a'],
  ['tp-iron', '#ffffff', '#b9c0c8', '#5b636c', '#181c20'],
]

/** Every prop's gradient, lit from the top and front down to its shaded underside, and the soft contact
 *  shadow, once for the page. */
export function PropShading() {
  return (
    <>
      {GRADIENTS.map(([id, glint, light, mid, dark]) => (
        <linearGradient key={id} id={id} x1="0.3" y1="0" x2="0.45" y2="1">
          <stop offset="0" stopColor={glint} />
          <stop offset="0.18" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      ))}
      <radialGradient id="tp-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={EDGE} stopOpacity="0.55" />
        <stop offset="1" stopColor={EDGE} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="tp-burst" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={C.sunCore} stopOpacity="1" />
        <stop offset="0.6" stopColor={C.sunGold} stopOpacity="0.6" />
        <stop offset="1" stopColor={C.sunGold} stopOpacity="0" />
      </radialGradient>
    </>
  )
}

const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

/** The soft shadow where a thing meets the ground at 0 0, `width` across. */
export const Shadow = ({ width, x = 0 }: { width: number; x?: number }) => <ellipse cx={x} cy={2} rx={width / 2} ry={width / 14} fill="url(#tp-shadow)" />

/** A barrel lying on its side, its mouth to the right, round its middle: the staves, two iron hoops, the
 *  dark mouth; a blast barrel carries the burst on its side. Its length is 120, its height 96. */
export function Barrel({ blast = false, mouth = true }: { blast?: boolean; mouth?: boolean }) {
  return (
    <g>
      <path d="M-60 -40 Q-66 0 -60 40 L56 40 Q64 0 56 -40 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M-62 -14 H60 M-63 14 H61" stroke="#6b3a14" strokeWidth={2} opacity={0.6} />
      <path d="M-40 -42 Q-45 0 -40 42" fill="none" stroke="url(#tp-hoop)" strokeWidth={9} />
      <path d="M36 -42 Q41 0 36 42" fill="none" stroke="url(#tp-hoop)" strokeWidth={9} />
      {mouth && <ellipse cx={58} cy={0} rx={11} ry={40} fill={C.woodDark} {...LINE} />}
      {mouth && <ellipse cx={60} cy={0} rx={6} ry={30} fill={EDGE} />}
      {blast && <path d="M-6 -22 L2 -8 L18 -14 L8 0 L20 12 L2 8 L-4 24 L-10 8 L-26 14 L-16 0 L-28 -12 L-12 -8 Z" fill={C.sunGold} stroke={EDGE} strokeWidth={2} />}
      <path d="M-54 -36 Q-20 -46 50 -36" fill="none" stroke={C.sunCore} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

/** A barrel standing on its end, its head up, the drum he plays: 72 wide, 96 tall, its foot at 0 0. */
export function StandingBarrel() {
  return (
    <g>
      <Shadow width={110} />
      <path d="M-34 0 Q-42 -48 -34 -96 L34 -96 Q42 -48 34 0 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M-38 -24 Q0 -18 38 -24 M-38 -72 Q0 -66 38 -72" fill="none" stroke="url(#tp-hoop)" strokeWidth={8} />
      <ellipse cx={0} cy={-96} rx={34} ry={9} fill="#d9a35f" {...LINE} />
    </g>
  )
}

/** A beetle of the captain's crew: a round blue shell on six legs, its horn forward (left, at him), 70 long. */
export function Beetle() {
  return (
    <g>
      <Shadow width={90} />
      {[-18, 0, 18].map((x) => (
        <path key={x} d={`M${x} -10 L${x - 8} 0`} stroke={EDGE} strokeWidth={4} strokeLinecap="round" />
      ))}
      <path d="M-34 -12 Q-30 -46 2 -46 Q34 -44 36 -12 Z" fill="url(#tp-beetle)" {...LINE} />
      <path d="M2 -46 V-12" stroke={EDGE} strokeWidth={2} />
      <circle cx={-34} cy={-20} r={11} fill="#183060" {...LINE} />
      <path d="M-42 -26 Q-56 -34 -54 -48" fill="none" stroke={EDGE} strokeWidth={5} strokeLinecap="round" />
      <circle cx={-38} cy={-22} r={3} fill={C.parchment} />
      <path d="M-20 -40 Q0 -48 22 -38" fill="none" stroke="#e6f4ff" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    </g>
  )
}

/** The buddy boar side on facing right, its back 96 up, its saddle where he sits (0, -100). */
export function Boar() {
  return (
    <g>
      <Shadow width={190} x={14} />
      {[-44, -24, 32, 50].map((x) => (
        <path key={x} d={`M${x} -30 L${x} 0`} stroke={EDGE} strokeWidth={13} strokeLinecap="round" />
      ))}
      <path d="M-66 -40 Q-70 -96 -6 -100 Q56 -102 74 -66 Q80 -40 60 -28 L-56 -28 Q-68 -30 -66 -40 Z" fill="url(#tp-boar)" {...LINE} />
      <path d="M-52 -96 L-46 -110 L-36 -98 L-28 -112 L-20 -100 L-10 -114 L-2 -100" fill="#3a2418" stroke={EDGE} strokeWidth={2} strokeLinejoin="round" />
      <path d="M60 -74 Q96 -70 100 -48 Q96 -34 74 -36 Z" fill="url(#tp-boar)" {...LINE} />
      <ellipse cx={99} cy={-46} rx={6} ry={8} fill="#c98a7a" {...LINE} />
      <path d="M86 -40 Q94 -30 88 -22" fill="none" stroke={C.parchment} strokeWidth={4} strokeLinecap="round" />
      <circle cx={80} cy={-62} r={3.4} fill={EDGE} />
      <path d="M62 -78 L70 -94 L76 -76 Z" fill="#3a2418" {...LINE} />
      <path d="M-22 -100 Q0 -108 22 -100 L20 -92 L-20 -92 Z" fill={C.sunsetRed} {...LINE} />
      <path d="M-40 -92 Q10 -104 56 -84" fill="none" stroke={C.sunCore} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    </g>
  )
}

// The crate's four boards, each 50 square: [x, y] of its top left corner.
const BOARDS: ReadonlyArray<readonly [number, number]> = [
  [-50, -100],
  [-50, -50],
  [0, -100],
  [0, -50],
]

/** A crate board's transform as the crate bursts (`burst` 0 to 1): flung out to its side and turned. */
export const boardAt = (i: number, burst: number): string => {
  const [x, y] = BOARDS[i]
  const side = x < 0 ? -1 : 1
  const out = 60 * burst
  const up = y === -100 ? 1.4 : 0.6
  return `translate(${(side * out).toFixed(1)} ${(-out * 0.8 * up).toFixed(1)}) rotate(${(side * 50 * burst).toFixed(1)} ${x + 25} ${y + 25})`
}

/** The buddy crate the boar waits in: planks and a cross brace, 100 square, its foot at 0 0; each board a
 *  `crate-board-<i>` its scene bursts apart (boardAt). */
export function Crate() {
  return (
    <g>
      <Shadow width={130} />
      {BOARDS.map(([x, y], i) => (
        <g key={i} data-fx={`crate-board-${i}`} transform={boardAt(i, 0)}>
          <rect x={x} y={y} width={50} height={50} fill="url(#tp-wood)" {...LINE} />
          <path d={`M${x + 4} ${y + 4} L${x + 46} ${y + 46}`} stroke={C.woodDark} strokeWidth={6} />
        </g>
      ))}
    </g>
  )
}

/** The plank wall's five planks. */
export const PLANKS = 5

/** A wall plank's transform as the charge smashes the wall (`smash` 0 to 1): thrown up and away, turning. */
export const plankAt = (i: number, smash: number): string => {
  const fly = smash * (1 + i * 0.25)
  const y = -36 * (i + 1)
  return `translate(${(70 * fly).toFixed(1)} ${(-90 * fly + 60 * fly * fly).toFixed(1)}) rotate(${((i % 2 ? 1 : -1) * 70 * fly).toFixed(1)} 0 ${y + 18})`
}

/** A plank wall across the path, 180 tall; each plank a `plank-<i>` its scene throws (plankAt). */
export function PlankWall() {
  return (
    <g>
      {Array.from({ length: PLANKS }, (_, i) => (
        <g key={i} data-fx={`plank-${i}`} transform={plankAt(i, 0)}>
          <rect x={-14} y={-36 * (i + 1)} width={28} height={36} rx={3} fill="url(#tp-wood)" {...LINE} />
        </g>
      ))}
    </g>
  )
}

/** A mine cart on the rails, its floor at 0 -22, 120 long and 60 tall. */
export function Cart() {
  return (
    <g>
      <Shadow width={140} />
      {[-36, 36].map((x) => (
        <g key={x} transform={`translate(${x} -10)`}>
          <circle r={12} fill="url(#tp-iron)" {...LINE} />
          <path d="M-12 0 H12 M0 -12 V12" stroke={EDGE} strokeWidth={2} />
        </g>
      ))}
      <path d="M-62 -76 L62 -76 L52 -18 L-52 -18 Z" fill="url(#tp-iron)" {...LINE} />
      <path d="M-64 -78 H64 M-58 -46 H58" stroke={EDGE} strokeWidth={4} />
      <path d="M-56 -72 Q0 -80 56 -72" fill="none" stroke="#e6ebf0" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

/** The rails from x `from` to `to` on the ground, ties under them. */
export function Rails({ from, to }: { from: number; to: number }) {
  const ties = Array.from({ length: Math.floor((to - from) / 40) + 1 }, (_, i) => from + i * 40)
  return (
    <g>
      {ties.map((x) => (
        <rect key={x} x={x - 6} y={-2} width={12} height={10} fill={C.barkDark} />
      ))}
      <path d={`M${from} 0 H${to}`} stroke="url(#tp-iron)" strokeWidth={6} />
    </g>
  )
}

/** A raised plank deck on two posts, its top at 0 0, `width` wide, `height` up from the ground. */
export function Deck({ width, height }: { width: number; height: number }) {
  return (
    <g>
      <rect x={14} y={0} width={14} height={height} fill="url(#tp-wood)" {...LINE} />
      <rect x={width - 28} y={0} width={14} height={height} fill="url(#tp-wood)" {...LINE} />
      <rect x={0} y={-6} width={width} height={22} rx={4} fill="url(#tp-wood)" {...LINE} />
      <path d={`M6 -2 H${width - 6}`} stroke={C.sunCore} strokeWidth={2.4} opacity={0.5} />
    </g>
  )
}

/** A pit in the ground from x `from` to `to`, dark all the way down. */
export function Pit({ from, to }: { from: number; to: number }) {
  return <rect x={from} y={-4} width={to - from} height={600} fill={C.jungleDeep} />
}

/** A burst of light round 0 0 at `size`, where a thing bursts, lands or fires. */
export function Burst({ size }: { size: number }): ReactNode {
  return <circle r={size} fill="url(#tp-burst)" />
}
