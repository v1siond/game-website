import { useId } from 'react'
import { fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { SH } from './palette'

// The pursuer of the genre's 1999 sequel, drawn as it was before the side on staging: about a fifth again his height, the shoulders very wide and the head small on them, a black
// coat to below the knee closed by straps with brass buckles, black gloves, heavy boots, the olive launcher
// slung across its back, and the bald grey head with its stitched scalp, one pale eye and the bared teeth
// where the lip is gone. Drawn side on facing right in an 80 by 160 box, feet on y 158; its joints are
// groups the scenes turn per frame (posePursuer), a positive turn clockwise on screen.
//
// How it moves, from the game: it rushes rather than lumbers, faster than the one it hunts, follows from room
// to room and attacks with blows and grabs. So here it comes on at one steady pace, each footfall a heavy
// stomp that sinks the body, and at the end of its run it lunges, an arm out to grab, or hammers a door.

const BACK_X = 30
const FRONT_X = 52
const BACK_LEG_X = 35
const FRONT_LEG_X = 46
const SHOULDER_Y = 42
const ELBOW_Y = 68
const HIP_Y = 92
const KNEE_Y = 122
const LEAN_AT = [41, 92] as const
const NECK_AT = [44, 34] as const
const FEET: readonly [number, number] = [42, 158]

/** Its size against him: his stage scale times this puts its head a fifth over his. */
export const PURSUER_SCALE = 1.13

type Turn = readonly [number, number]

export interface PursuerPose {
  lean: number
  head: number
  backArm: Turn
  frontArm: Turn
  backLeg: Turn
  frontLeg: Turn
  /** How far the body sinks, in its units: a stomp lands it. */
  drop: number
}

const STAND: PursuerPose = { lean: 2, head: 4, backArm: [4, -6], frontArm: [-4, -8], backLeg: [2, 2], frontLeg: [-2, 2], drop: 0 }

const pose = (row: Partial<PursuerPose>): PursuerPose => ({ ...STAND, ...row })

// The leg turns put each sole on its mark (contact soles on the floor, the passing one lifted), worked out
// once from the hip, the thigh (30) and the shin (36), with the body sunk by the drop.
export const PURSUER_POSES = {
  stand: STAND,
  // the stomping walk: the body sinks on each footfall and rises as the legs pass
  walkA: pose({ lean: 4, backArm: [-16, -10], frontArm: [18, -6], backLeg: [0.2, 33.4], frontLeg: [-36.7, 33.4], drop: 6 }),
  passA: pose({ lean: 4, backArm: [2, -8], frontArm: [-2, -8], backLeg: [-37.3, 64.1], frontLeg: [0, 0], drop: 0 }),
  walkB: pose({ lean: 4, backArm: [18, -6], frontArm: [-16, -10], backLeg: [-36.7, 33.4], frontLeg: [0.2, 33.4], drop: 6 }),
  passB: pose({ lean: 4, backArm: [-2, -8], frontArm: [2, -8], backLeg: [0, 0], frontLeg: [-37.3, 64.1], drop: 0 }),
  // the rush: leaning in, the fists pumping high
  rushA: pose({ lean: 16, frontArm: [40, -70], backArm: [-50, -80], backLeg: [0.1, 56.1], frontLeg: [-36.9, 36.9], drop: 6 }),
  rushPassA: pose({ lean: 16, frontArm: [-5, -75], backArm: [-5, -80], backLeg: [-54.3, 101.4], frontLeg: [-21.1, 40.2], drop: 4 }),
  rushB: pose({ lean: 16, frontArm: [-50, -80], backArm: [40, -70], backLeg: [-36.9, 36.9], frontLeg: [0.1, 56.1], drop: 6 }),
  rushPassB: pose({ lean: 16, frontArm: [-5, -80], backArm: [-5, -75], backLeg: [-21.1, 40.2], frontLeg: [-54.3, 101.4], drop: 4 }),
  // the lunge: a long step in, the near arm thrown out to grab
  lunge: pose({ lean: 14, head: 8, frontArm: [-84, -6], backArm: [-20, -30], backLeg: [-9.7, 47.6], frontLeg: [-39.6, 25.4], drop: 8 }),
  // the blow: the fist raised over the head, then brought down on what stops it
  raise: pose({ lean: -6, head: -6, frontArm: [-160, -20], backArm: [-20, -20] }),
  pound: pose({ lean: 12, head: 8, frontArm: [-70, -10], backArm: [-10, -20], backLeg: [-9.7, 47.6], frontLeg: [-39.6, 25.4], drop: 8 }),
} satisfies Record<string, PursuerPose>

export type PursuerPoseName = keyof typeof PURSUER_POSES

/** A pace: its four keys a cycle (footfall, passing, footfall, passing) and how far a step carries it, in stage units at scale 1. */
interface Pace {
  keys: readonly [PursuerPoseName, PursuerPoseName, PursuerPoseName, PursuerPoseName]
  step: number
}

export const PACES = {
  walk: { keys: ['walkA', 'passA', 'walkB', 'passB'], step: 40 },
  rush: { keys: ['rushA', 'rushPassA', 'rushB', 'rushPassB'], step: 48 },
} as const satisfies Record<string, Pace>

const mixTurn = (a: Turn, b: Turn, t: number): Turn => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]

/** Between two poses. */
export function mixPose(a: PursuerPose, b: PursuerPose, t: number): PursuerPose {
  return {
    lean: lerp(a.lean, b.lean, t),
    head: lerp(a.head, b.head, t),
    backArm: mixTurn(a.backArm, b.backArm, t),
    frontArm: mixTurn(a.frontArm, b.frontArm, t),
    backLeg: mixTurn(a.backLeg, b.backLeg, t),
    frontLeg: mixTurn(a.frontLeg, b.frontLeg, t),
    drop: lerp(a.drop, b.drop, t),
  }
}

// The key of a pace's cycle at step `key`, for a pursuer left of the stage's origin too: a room on the left of
// the cards starts its walk off the left edge, where the distance and so the step count are below 0.
const cycle = (key: number): number => ((key % 4) + 4) % 4

/** The pose `distance` stage units into a pace at stage scale `scale`: the legs keep to the floor it covers. */
export function stride(pace: Pace, distance: number, scale: number): PursuerPose {
  const half = (distance / (pace.step * scale)) * 2
  const key = Math.floor(half)
  const from = PURSUER_POSES[pace.keys[cycle(key)]]
  const to = PURSUER_POSES[pace.keys[cycle(key + 1)]]
  return mixPose(from, to, half - key)
}

const rotate = (angle: number, [x, y]: readonly [number, number]): string => `rotate(${r1(angle)} ${x} ${y})`

/** Its joints in a stage, and a writer that turns them to a pose. */
export function posePursuer(stage: Pick<ParentNode, 'querySelector'>): (row: PursuerPose) => void {
  const node = (name: string) => fx(stage, `pursuer-${name}`)
  const lean = ['lean-back', 'lean-body', 'lean-front'].map(node)
  const parts = {
    drop: node('drop'),
    head: node('head'),
    armB: node('armB'),
    foreB: node('foreB'),
    armF: node('armF'),
    foreF: node('foreF'),
    legB: node('legB'),
    shinB: node('shinB'),
    legF: node('legF'),
    shinF: node('shinF'),
  }
  return (row) => {
    transformTo(parts.drop, `translate(0 ${r1(row.drop)})`)
    lean.forEach((group) => transformTo(group, rotate(row.lean, LEAN_AT)))
    transformTo(parts.head, rotate(row.head, NECK_AT))
    transformTo(parts.armB, rotate(row.backArm[0], [BACK_X, SHOULDER_Y]))
    transformTo(parts.foreB, rotate(row.backArm[1], [BACK_X, ELBOW_Y]))
    transformTo(parts.armF, rotate(row.frontArm[0], [FRONT_X, SHOULDER_Y]))
    transformTo(parts.foreF, rotate(row.frontArm[1], [FRONT_X, ELBOW_Y]))
    transformTo(parts.legB, rotate(row.backLeg[0], [BACK_LEG_X, HIP_Y]))
    transformTo(parts.shinB, rotate(row.backLeg[1], [BACK_LEG_X, KNEE_Y]))
    transformTo(parts.legF, rotate(row.frontLeg[0], [FRONT_LEG_X, HIP_Y]))
    transformTo(parts.shinF, rotate(row.frontLeg[1], [FRONT_LEG_X, KNEE_Y]))
  }
}

/** Where it stands: its feet on (x, floor), drawn at stage scale `scale`. */
export const pursuerAt = (x: number, floor: number, scale: number): string =>
  `translate(${r1(x)} ${r1(floor)}) scale(${(scale * PURSUER_SCALE).toFixed(3)}) translate(${-FEET[0]} ${-FEET[1]})`

function Arm({ name, x, fill, turn }: { name: string; x: number; fill: string; turn: Turn }) {
  return (
    <g data-fx={`pursuer-arm${name}`} transform={rotate(turn[0], [x, SHOULDER_Y])}>
      <rect x={x - 6.5} y={36} width={13} height={36} rx={6} fill={fill} />
      <rect x={x - 6.5} y={56} width={13} height={2.4} fill={SH.strap} />
      <g data-fx={`pursuer-fore${name}`} transform={rotate(turn[1], [x, ELBOW_Y])}>
        <rect x={x - 5.5} y={64} width={11} height={30} rx={5} fill={fill} />
        <rect x={x - 5.8} y={86} width={11.6} height={3} fill={SH.strap} />
        <rect x={x - 1.4} y={86.4} width={2.8} height={2.2} fill={SH.brass} />
        <circle cx={x} cy={98} r={6.6} fill={SH.top} />
        <path d={`M${x - 4} 101 Q${x} 104 ${x + 4} 101`} stroke={SH.coatLit} strokeWidth={0.8} fill="none" />
      </g>
    </g>
  )
}

function Leg({ name, x, fill, turn }: { name: string; x: number; fill: string; turn: Turn }) {
  return (
    <g data-fx={`pursuer-leg${name}`} transform={rotate(turn[0], [x, HIP_Y])}>
      <rect x={x - 6} y={88} width={12} height={36} rx={5} fill={fill} />
      <g data-fx={`pursuer-shin${name}`} transform={rotate(turn[1], [x, KNEE_Y])}>
        <rect x={x - 5.5} y={120} width={11} height={30} rx={4} fill={fill} />
        <path d={`M${x - 6.4} 146 H${x + 5} Q${x + 13} 149 ${x + 12.6} 158 H${x - 6.4} Z`} fill={SH.boot} />
        <rect x={x - 6.4} y={155.6} width={19} height={2.4} fill={SH.void} />
      </g>
    </g>
  )
}

// The coat's straps across the chest, each with its buckle.
const STRAPS = [52, 62, 72, 82]

/** The pursuer standing, its joints named for posePursuer. */
export function Pursuer({ row = STAND }: { row?: PursuerPose }) {
  const id = useId()
  const coat = `url(#${id}-coat)`
  const lean = rotate(row.lean, LEAN_AT)
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SH.coatLit} />
          <stop offset="60%" stopColor={SH.coat} />
          <stop offset="100%" stopColor={SH.void} />
        </linearGradient>
        <radialGradient id={`${id}-head`} cx="0.6" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={SH.fog} />
          <stop offset="70%" stopColor={SH.pursuerSkin} />
          <stop offset="100%" stopColor={SH.ash} />
        </radialGradient>
      </defs>
      <ellipse cx={42} cy={158} rx={26} ry={2.6} fill={SH.void} opacity={0.7} />
      <g data-fx="pursuer-drop" transform={`translate(0 ${row.drop})`}>
        <g data-fx="pursuer-lean-back" transform={lean}>
          {/* the launcher slung across its back */}
          <g transform="rotate(-34 22 70)">
            <rect x={16} y={26} width={11} height={84} rx={3} fill={SH.launcher} />
            <rect x={17.4} y={28} width={2.6} height={80} fill={SH.launcherLit} />
            <rect x={14.6} y={24} width={13.8} height={7} rx={2} fill={SH.launcherLit} />
            <rect x={14.6} y={102} width={13.8} height={7} rx={2} fill={SH.launcher} />
          </g>
          <Arm name="B" x={BACK_X} fill={SH.coat} turn={row.backArm} />
        </g>
        <Leg name="B" x={BACK_LEG_X} fill={SH.coat} turn={row.backLeg} />
        <Leg name="F" x={FRONT_LEG_X} fill={SH.top} turn={row.frontLeg} />
        <g data-fx="pursuer-lean-body" transform={lean}>
          {/* the coat, very wide at the shoulders, to below the knee, split at the front */}
          <path d="M16 46 Q20 34 42 33 Q64 34 68 48 L64 94 L67 136 Q44 142 18 136 L21 94 Z" fill={coat} />
          <path d="M46 94 L48 138" stroke={SH.void} strokeWidth={1.4} />
          <path d="M34 36 Q44 46 56 36 L58 42 Q44 52 32 42 Z" fill={SH.coatLit} />
          {STRAPS.map((y) => (
            <g key={y}>
              <path d={`M19 ${y} Q42 ${y + 4} 66 ${y - 2}`} stroke={SH.strap} strokeWidth={3.2} fill="none" />
              <rect x={45} y={y - 0.6} width={5} height={4.4} fill={SH.brass} />
            </g>
          ))}
          <path d="M22 40 L60 88" stroke={SH.strap} strokeWidth={3.6} />
          {/* the high collar and the bald stitched head on it */}
          <path d="M34 40 Q36 30 44 30 Q53 30 55 38 Q46 44 34 40 Z" fill={SH.coat} />
          <g data-fx="pursuer-head" transform={rotate(row.head, NECK_AT)}>
            <path d="M35 30 Q33 15 44 13 Q56 13 55.6 26 Q55.4 35 47 37 Q38 37.4 35 30 Z" fill={`url(#${id}-head)`} />
            <path d="M37 19 Q44 13.6 53 17.4" stroke={SH.ash} strokeWidth={1.2} fill="none" />
            <path d="M39 16.4 L40 19.2 M43 14.6 L43.6 17.6 M47 14.6 L46.8 17.6 M51 16 L50 18.6" stroke={SH.ash} strokeWidth={0.8} />
            <ellipse cx={51} cy={23} rx={1.6} ry={1.1} fill={SH.ivory} />
            <path d="M48.6 21 Q51 20 53.6 21.4" stroke={SH.ash} strokeWidth={0.9} fill="none" />
            {/* the bared teeth where the lip is gone */}
            <path d="M46 28.4 H55.4 Q55.6 33 52 34 H46.6 Q45.6 31 46 28.4 Z" fill={SH.gums} />
            <rect x={46.8} y={29.2} width={8} height={3.6} fill={SH.ivory} />
            <path d="M48.4 29.2 V32.8 M50 29.2 V32.8 M51.6 29.2 V32.8 M53.2 29.2 V32.8 M46.8 31 H54.8" stroke={SH.ash} strokeWidth={0.4} />
          </g>
        </g>
        <g data-fx="pursuer-lean-front" transform={lean}>
          <Arm name="F" x={FRONT_X} fill={coat} turn={row.frontArm} />
        </g>
      </g>
    </g>
  )
}
