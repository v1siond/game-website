import type { ReactNode } from 'react'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { fadeTo, focusOn, fx, transformTo, translateTo } from '../shared/stageNodes'
import { NOIR } from './palette'
import type { Place, PlaceInput } from './place'
import { noirJoints, ready, setNoirPose, strike, victory } from './pose'
import { Shadow } from './shadow'
import { Canvas, FLOOR, H, Sleuth, W, placeSleuth } from './street'

// The fights, played the way the genre plays them: the night cuts away with a whip of red and black to a
// battle frame, him on the left in his stance and the foes waiting in a line on the right, one per card.
// Each card but the last is a turn: the next foe steps up, he strikes its weak point, it spins and goes
// down, and he settles back into his stance with the red flash of the extra turn behind him. The last card
// is the finisher: the gang rushes across the frame as one flash of ink silhouettes on red, every foe left
// is down, and he holds his victory pose as the frame pushes in on him.

/** Where he stands, and the spot each foe steps up to. */
const BATTLE_X = 780
const FOE_X = 1010
/** The waiting foes stand this far apart in their line. */
const GAP = 150
/** His lunge at a foe's weak point. */
const LUNGE = 110
/** A foe down lies turned this far over. */
const DOWN = 84
/** The gang crosses from wholly left of the frame to wholly right of it. */
const RUSH_FROM = -1900
const RUSH_TO = 3000

/** The battle frame's ground: the red and black slabs cut on the slant across the whole frame. */
function Ground({ backdrop }: { backdrop?: ReactNode }) {
  return (
    <Canvas>
      <rect x={-200} width={W + 400} height={H} fill={NOIR.ink} />
      <polygon points="-200,0 700,0 200,1000 -200,1000" fill={NOIR.redDeep} />
      <polygon points="1100,0 1800,0 1800,1000 700,1000" fill={NOIR.red} />
      <polygon points="1040,0 1100,0 700,1000 640,1000" fill={NOIR.paper} opacity="0.85" />
      {backdrop}
    </Canvas>
  )
}

/** The battle frame's floor: a flat ink band with its red edge. */
function Floor() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={H - FLOOR} fill={NOIR.ink} />
      <path d={`M-200 ${FLOOR} H1800`} stroke={NOIR.paper} strokeWidth="6" />
    </Canvas>
  )
}

// One of the gang in a flying kick to the right, its back foot at (0, 0): limbs as thick ink strokes edged
// in paper, the head a disc.
const KICK = 'M0 -120 L40 -210 M0 -120 L110 -90 L170 -60 M0 -120 L-50 -80 L-30 -20 M40 -210 L80 -180 L120 -200 M40 -210 L-20 -200 L-60 -170'
const HEAD = { x: 62, y: -244, r: 28 }
const GANG = [
  { x: 0, y: FLOOR - 40, size: 1.2 },
  { x: -360, y: FLOOR - 200, size: 1 },
  { x: -700, y: FLOOR - 20, size: 1.3 },
  { x: -1040, y: FLOOR - 160, size: 1.1 },
]

/** The finisher: the gang as one flash of ink silhouettes crossing the frame, with the red flash behind. */
function Rush() {
  return (
    <>
      <rect data-fx="rush-flash" x={-200} width={W + 400} height={H} fill={NOIR.red} opacity="0" />
      <g data-fx="rush" transform={`translate(${RUSH_FROM} 0)`}>
        {GANG.map(({ x, y, size }) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${size})`}>
            <path d="M-260 -140 H-60 M-300 -90 H-80 M-240 -40 H-40" stroke={NOIR.paper} strokeWidth="8" />
            <path d={KICK} fill="none" stroke={NOIR.paper} strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r + 6} fill={NOIR.paper} />
            <path d={KICK} fill="none" stroke={NOIR.ink} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={NOIR.ink} />
          </g>
        ))}
      </g>
    </>
  )
}

// A star of `points` points round (0, 0), its rays out to `r` and its notches in to `r * inner`.
const star = (points: number, r: number, inner: number): string =>
  Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 ? r * inner : r
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    return `${(Math.cos(angle) * radius).toFixed(0)},${(Math.sin(angle) * radius).toFixed(0)}`
  }).join(' ')

/** The cut from the night to the battle frame: a red slab and an ink slab whipped across the frame. */
function Whip() {
  return (
    <g data-fx="whip" transform="translate(-2400 0)">
      <polygon points="0,0 900,0 500,1000 -400,1000" fill={NOIR.red} />
      <polygon points="900,0 1500,0 1100,1000 500,1000" fill={NOIR.ink} />
      <polygon points="1500,0 1560,0 1160,1000 1100,1000" fill={NOIR.paper} />
    </g>
  )
}

function Battle({ input }: { input: PlaceInput }) {
  return (
    <Canvas>
      <g data-fx="camera">
        <polygon data-fx="turn" points={star(12, 260, 0.55)} transform={`translate(${BATTLE_X} ${FLOOR - 160})`} fill={NOIR.red} stroke={NOIR.paper} strokeWidth="6" opacity="0" />
        <polygon data-fx="splat" points={star(9, 150, 0.4)} transform={`translate(${FOE_X + 80} ${FLOOR}) scale(1 0.3)`} fill={NOIR.ink} stroke={NOIR.red} strokeWidth="8" opacity="0" />
        {Array.from({ length: input.count }, (_, i) => (
          <g key={i} data-fx={`spot-${i}`} transform={`translate(${FOE_X + GAP * (i + 1)} ${FLOOR})`}>
            <Shadow name={`foe-${i}`} facing={-1} />
          </g>
        ))}
        <Sleuth x={BATTLE_X} profession={input.profession} />
        <Rush />
      </g>
      <Whip />
    </Canvas>
  )
}

/** The fight: the foes taken one turn per card, then the finisher and the victory on the last. */
function bindBattle(stage: ParentNode, { count, profession }: PlaceInput) {
  const camera = fx(stage, 'camera')
  const whip = fx(stage, 'whip')
  const turn = fx(stage, 'turn')
  const splat = fx(stage, 'splat')
  const rush = fx(stage, 'rush')
  const rushFlash = fx(stage, 'rush-flash')
  const spots = Array.from({ length: count }, (_, i) => fx(stage, `spot-${i}`))
  const foes = Array.from({ length: count }, (_, i) => fx(stage, `foe-${i}`))
  const root = fx(stage, 'detective')
  const joints = root ? noirJoints(root) : null
  placeSleuth(root, BATTLE_X)
  const last = count - 1
  return (progress: number, reached: number) => {
    translateTo(whip, -2400 + 4800 * ramp(progress, 0.08, 0.28), 0)
    const beat = trackAt(reached, count, GAP)
    const finisher = beat.at === last
    // how far each foe is down: the foes before this beat's lie down, this beat's goes down on its blow
    // (on the finisher's sweep), the ones after it wait in the line
    const fell = finisher ? ramp(beat.act, 0.4, 0.55) : ramp(beat.act, 0.3, 0.5)
    spots.forEach((spot, i) => {
      translateTo(spot, FOE_X + GAP * Math.max(0, i + 1 - beat.offset / GAP), FLOOR)
      const down = i < beat.at ? 1 : i === beat.at ? fell : 0
      transformTo(foes[i], `translate(${(-30 * down).toFixed(1)} 0) rotate(${(-DOWN * down).toFixed(1)})`)
      // a foe already down leaves the frame as the next one steps up; on the finisher every one is down
      fadeTo(spot, i < beat.at - 1 ? 0 : i === beat.at - 1 ? 1 - beat.run : 1)
    })
    const blow = finisher ? 0 : ramp(beat.act, 0.15, 0.3) - ramp(beat.act, 0.6, 0.85)
    const sweep = finisher ? ramp(beat.act, 0.05, 0.5) : 0
    translateTo(rush, RUSH_FROM + (RUSH_TO - RUSH_FROM) * sweep, 0)
    fadeTo(rushFlash, 0.9 * Math.sin(Math.PI * sweep))
    fadeTo(splat, finisher ? ramp(beat.act, 0.45, 0.55) : 0)
    // the extra turn's flash: lit as he settles back from a blow, gone as the next foe steps up
    const extra = finisher ? 0 : beat.act > 0 ? ramp(beat.act, 0.7, 0.85) : beat.at > 0 ? 1 - beat.run : 0
    fadeTo(turn, 0.9 * extra)
    const win = finisher ? ramp(beat.act, 0.6, 0.85) : 0
    const push = 0.12 * blow
    const zoom = 1 + push + 0.16 * win
    const focusX = BATTLE_X + (FOE_X - 80 - BATTLE_X) * (push > 0 ? 1 : 0)
    transformTo(camera, focusOn(focusX, FLOOR - 160, zoom))
    placeSleuth(root, BATTLE_X + LUNGE * blow)
    if (!joints) return
    const stance = finisher ? victory(profession, win) : beat.act > 0 ? strike(profession, beat.act) : ready(1)
    setNoirPose(joints, mix(ready(Math.min(1, reached * 4)), stance, Math.min(1, reached * 4)))
  }
}

/** A fight as a scene: its battle frame's ground (with a backdrop of its own), its floor, and the fight. */
export const battlePlace = (light: string, backdrop?: ReactNode): Place => ({
  light,
  mid: () => <Ground backdrop={backdrop} />,
  near: () => <Floor />,
  floor: (input) => <Battle input={input} />,
  bind: bindBattle,
})
