import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROC } from '../crocs'
import { CROUCH, FISTS, REACH, SLAM, STAND, blend, ease, flight, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { Shadow } from '../props'
import { Flash } from './kit'

// Tech Stack: the toy factory's boss (research/2026-11-25-deep-dk64 §3: the giant jack in the box hopping over
// a board of lit tiles in the dark, beaten by slamming the switch of the colour of the tile it stands on, until
// its tile falls). The jack box, our own, a riveted steel box on a coil with a grinning toy crocodile's head in
// a paper crown, springs from tile to tile over the board, the tiles lit teal and orange by turns; he jumps on
// the teal switch as it lands on a teal tile and slams it, the shock runs along the floor and up through the
// box; its tile drops away, it falls into the dark, and the key rises out of the hole. He stands on the switch,
// the key over the empty hole.

const TILE = { width: 84, from: 116 }
const TILES = [0, 1, 2, 3, 4].map((i) => TILE.from + TILE.width * (i + 0.5))
const TEAL = '#2ad0c0'
const ORANGE = '#ff8a2a'
// Its hops, each [from tile, to tile, start, end] of the move; it lands on tile 2, a teal one.
const HOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [4, 3, 0.04, 0.16],
  [3, 2, 0.2, 0.32],
]
const LANDED = 2
const SWITCH = { teal: 46, orange: -40 }
const START = -60
// The slam on the switch, the shock along the floor, the tile's fall.
const SLAM_AT = 0.5
const SHOCK = { from: 0.5, to: 0.64 }
const FALL = { from: 0.7, to: 0.86 }

const tileOf = (t: number): number => HOPS.reduce((at, [, to, , b]) => (b <= t ? to : at), HOPS[0][0])

/** Where the box stands at t, [x, lift]: hopping tile to tile, then falling with its tile. */
const boxAt = (t: number): [number, number] => {
  for (const [from, to, a, b] of HOPS) {
    if (t >= a && t < b) return flight(ramp(t, a, b), [TILES[from], 0], [TILES[to], 0], 170)
  }
  return [TILES[tileOf(t)], -700 * ramp(t, FALL.from, FALL.to) ** 2]
}

const move = (t: number): Frame => {
  if (t < 0.36) return still(blend(STAND, CROUCH, t, 0.04, 0.12), START)
  if (t < 0.48) {
    const [ahead, lift] = flight(ramp(t, 0.36, 0.48), [START, 0], [SWITCH.teal, 30], 120)
    return { pose: blend(CROUCH, REACH, t, 0.36, 0.42), ahead, lift }
  }
  if (t < 0.5) return still(blend(REACH, SLAM, t, 0.48, 0.5), SWITCH.teal, 30)
  if (t < 0.68) return still(SLAM, SWITCH.teal, 18)
  return still(blend(SLAM, FISTS, t, 0.68, 0.78), SWITCH.teal, 18)
}

/** The jack box, its foot on 0 0: the riveted box, the coil, the grinning toy crocodile's head in its paper
 *  crown; `jack-spring` stretches the coil and the head on it. */
function JackBox() {
  return (
    <g>
      <Shadow width={200} />
      <g data-fx="jack-spring">
        <path d="M-10 -160 q30 -12 0 -24 q-30 -12 0 -24 q30 -12 0 -24 q-30 -12 0 -24 q30 -12 0 -24" fill="none" stroke="url(#tp-iron)" strokeWidth={10} />
        <g transform="translate(0 -280)">
          <path d="M-40 10 Q-50 -60 10 -66 Q60 -62 56 -10 Q52 14 24 18 L-120 14 Q-140 6 -128 -12 Q-80 -20 -40 -16 Z" fill={CROC.mid} stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
          <path d="M-120 12 Q-60 30 24 18" fill="#b8221a" stroke={C.shadow} strokeWidth={3} />
          <path d="M-114 14 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10" fill="#fffbe8" stroke={C.shadow} strokeWidth={1.4} />
          <circle cx={-4} cy={-40} r={14} fill="#ffffff" stroke={C.shadow} strokeWidth={2} />
          <circle cx={-8} cy={-40} r={6} fill="#e8463a" />
          <circle cx={30} cy={-44} r={12} fill="#ffffff" stroke={C.shadow} strokeWidth={2} />
          <circle cx={26} cy={-44} r={5} fill="#e8463a" />
          <circle cx={-60} cy={-4} r={9} fill="#e8463a" stroke={C.shadow} strokeWidth={2} />
          <path d="M-20 -60 L-24 -100 L-4 -78 L10 -108 L22 -78 L44 -98 L38 -58 Z" fill="#ffe14d" stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
        </g>
      </g>
      <rect x={-90} y={-170} width={180} height={170} rx={8} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={4} />
      <path d="M-90 -130 H90 M-90 -40 H90" stroke={C.shadow} strokeWidth={3} opacity={0.5} />
      {[-74, 74].flatMap((x) => [-150, -20].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill="#2a2e34" />))}
      <rect x={90} y={-100} width={30} height={14} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={2} />
      <circle cx={130} cy={-93} r={14} fill="#e8463a" stroke={C.shadow} strokeWidth={3} />
      <path d="M-100 -176 H100 L94 -166 H-94 Z" fill="#e8463a" stroke={C.shadow} strokeWidth={3} />
    </g>
  )
}

/** A floor switch in its colour on a low plinth, its top on 0 -18. */
const Switch = ({ colour }: { colour: string }) => (
  <g>
    <rect x={-42} y={-18} width={84} height={18} rx={4} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={3} />
    <ellipse cx={0} cy={-20} rx={30} ry={8} fill={colour} stroke={C.shadow} strokeWidth={3} />
  </g>
)

/** The key the boss gives up, gold, its ring up. */
const Key = () => (
  <g>
    <circle cx={0} cy={-34} r={20} fill="none" stroke="url(#tp-gold)" strokeWidth={10} />
    <circle cx={0} cy={-34} r={20} fill="none" stroke={C.shadow} strokeWidth={2} />
    <rect x={-5} y={-16} width={10} height={60} fill="url(#tp-gold)" stroke={C.shadow} strokeWidth={2} />
    <path d="M5 26 H20 M5 38 H16" stroke="#d89a1a" strokeWidth={7} />
  </g>
)

export const tech: SceneDef = {
  zone: 'factory',
  kit: 'engineer',
  script: [1700, 1500, 1600],
  ends: [0.34, 0.68, 1],
  span: [-100, 540],
  back: () => (
    <g>
      {/* the board of tiles, lit teal and orange by turns; the one it lands on drops away under it */}
      <rect x={TILE.from} y={0} width={TILE.width * 5} height={600} fill="#06070a" />
      {TILES.map((x, i) => (
        <g key={x} data-fx={`tile-${i}`} transform={`translate(${x} 0)`}>
          <rect x={-TILE.width / 2 + 2} y={-6} width={TILE.width - 4} height={20} fill={i % 2 ? ORANGE : TEAL} stroke={C.shadow} strokeWidth={3} />
          <rect data-fx={`tile-lit-${i}`} x={-TILE.width / 2 + 8} y={-4} width={TILE.width - 16} height={8} fill="#ffffff" opacity="0.2" />
        </g>
      ))}
      <g transform={`translate(${SWITCH.orange} 0)`}>
        <Switch colour={ORANGE} />
      </g>
      <g transform={`translate(${SWITCH.teal} 0)`}>
        <Switch colour={TEAL} />
      </g>
      <g data-fx="key" opacity="0" transform={`translate(${TILES[LANDED]} -40)`}>
        <Key />
      </g>
      <Flash name="key-glow" x={TILES[LANDED]} y={-150} size={90} />
      <g data-fx="jack" transform={`translate(${TILES[HOPS[0][0]]} 0)`}>
        <JackBox />
      </g>
    </g>
  ),
  // The shock along the floor and up through the box.
  front: () => (
    <g data-fx="shock" opacity="0">
      <path
        d={`M${SWITCH.teal} -20 L${SWITCH.teal + 60} -2 L${SWITCH.teal + 120} -16 L${TILES[LANDED] - 60} 0 L${TILES[LANDED] - 20} -60 L${TILES[LANDED] + 10} -90 L${TILES[LANDED] - 10} -150 L${TILES[LANDED] + 20} -220`}
        fill="none"
        stroke="#bff8ff"
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <Flash name="shock-flash" x={TILES[LANDED]} y={-120} size={150} />
    </g>
  ),
  move: (_kit, t) => move(t),
  reply: (stage) => {
    const jack = fx(stage, 'jack')
    const spring = fx(stage, 'jack-spring')
    const shock = fx(stage, 'shock')
    const flash = fx(stage, 'shock-flash')
    const tile = fx(stage, `tile-${LANDED}`)
    const lit = TILES.map((_, i) => fx(stage, `tile-lit-${i}`))
    const key = fx(stage, 'key')
    const glow = fx(stage, 'key-glow')
    return (t) => {
      // the box springs over the board, its coil stretching as it leaves a tile and squashing as it lands
      const [x, lift] = boxAt(t)
      const shaken = 6 * Math.sin(t * 400) * bell(t, SHOCK.from, SHOCK.to)
      transformTo(jack, `translate(${r1(x + shaken)} ${r1(-lift)})`)
      const stretch = HOPS.reduce((s, [, , a, b]) => s + 0.4 * bell(t, a - 0.02, b), 0) - 0.3 * bell(t, SHOCK.from, SHOCK.to)
      transformTo(spring, `translate(0 ${r1(-60 * stretch)})`)
      fadeTo(jack, 1 - ramp(t, FALL.to - 0.04, FALL.to))
      // the tiles flash by turns; its own tile drops away and lets it fall
      lit.forEach((node, i) => fadeTo(node, 0.2 + 0.6 * Math.max(0, Math.sin(t * 30 + i * Math.PI))))
      const drop = ease(ramp(t, FALL.from, FALL.from + 0.08))
      transformTo(tile, `translate(${TILES[LANDED]} ${r1(260 * drop)}) rotate(${r1(30 * drop)})`)
      fadeTo(tile, 1 - drop)
      // the slam sends the shock along the floor and up through it
      fadeTo(shock, bell(t, SLAM_AT, SHOCK.to) * (0.6 + 0.4 * Math.abs(Math.sin(t * 160))))
      fadeTo(flash, bell(t, SHOCK.from + 0.04, SHOCK.to))
      // the key rises out of the hole and hangs there, turning
      const rise = ease(ramp(t, 0.86, 0.97))
      transformTo(key, `translate(${TILES[LANDED]} ${r1(lerp(40, -150, rise) + 6 * Math.sin(t * 20) * rise)}) rotate(${r1(-12 * rise)})`)
      fadeTo(key, rise)
      fadeTo(glow, 0.7 * rise)
    }
  },
}
