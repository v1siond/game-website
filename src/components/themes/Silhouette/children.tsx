import type { ReactNode } from 'react'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { SHADE } from './palette'

// The other children of the forest, our own silhouettes: the hostile boys who hunt him with spears, blowpipes
// and burning wheels (research notes L51 to L65 and the table of L107 to L112, [1] [2] [9]), and the small
// girl he searches for, seen once out of reach and found at the end under the hut (L69 to L71, L88 to L89,
// [1] [18]). Each is a black child a head shorter than he is, a round head on a thin body, seen from the side
// and facing right; none has his beard, his coat or his lit eyes. The boys wear ragged smocks to the knee and a
// shock of hair swept back to a point; the girl a short flared dress and two bunches of hair, and her one eye
// lights only when she turns to him.
//
// A boy's limbs each turn round their own joint (the hip, the knee, the shoulder, the elbow), so a scene's
// writer runs, aims and throws him with rotations only. Drawn with the soles on y 0, in run units.

/** What a boy carries: a spear in his front hand, or a blowpipe at his mouth. */
export type Weapon = 'spear' | 'pipe'

const JOINT = {
  hip: { x: 0, y: -34 },
  knee: { x: 0, y: -17 },
  shoulder: { x: 1, y: -58 },
  elbow: { x: 1, y: -45 },
} as const

const HEAD = { x: 2, y: -72, r: 12 }

const limb = (x: number, top: number, length: number, width: number) => (
  <rect x={x - width / 2} y={top} width={width} height={length} rx={width / 2} />
)

const HAIR_BOY = `M${HEAD.x - 13} ${HEAD.y + 2} Q${HEAD.x - 16} ${HEAD.y - 14} ${HEAD.x - 2} ${HEAD.y - 15} L${HEAD.x + 10} ${HEAD.y - 18} L${HEAD.x + 6} ${HEAD.y - 12} Q${HEAD.x + 12} ${HEAD.y - 10} ${HEAD.x + 13} ${HEAD.y - 4} L${HEAD.x - 2} ${HEAD.y - 8} L${HEAD.x - 20} ${HEAD.y - 10} L${HEAD.x - 15} ${HEAD.y - 4} L${HEAD.x - 22} ${HEAD.y + 1} Z`
const SMOCK = 'M-7 -60 Q1 -63 9 -60 L12 -30 L8 -26 L4 -31 L0 -25 L-4 -31 L-8 -26 L-11 -30 Z'

const WEAPON: Record<Weapon, ReactNode> = {
  // a long shaft with a leaf blade gripped across the front fist, so it points where the forearm turns it
  spear: <path d="M-34 -1.4 L80 -1.2 L80 1.2 L-34 1.8 Z M98 0 Q87 6 79 1.8 L79 -1.8 Q87 -6 98 0 Z" />,
  pipe: null,
}

function Arm({ name, part, weapon }: { name: string; part: 'F' | 'B'; weapon?: Weapon }) {
  return (
    <g data-fx={`${name}-arm${part}`}>
      {limb(JOINT.shoulder.x, JOINT.shoulder.y, 15, 4.4)}
      <g data-fx={`${name}-fore${part}`}>
        {limb(JOINT.elbow.x, JOINT.elbow.y, 14, 3.8)}
        <circle cx={JOINT.elbow.x} cy={JOINT.elbow.y + 14} r={2.6} />
        {weapon && <g transform={`translate(${JOINT.elbow.x} ${JOINT.elbow.y + 14})`}>{WEAPON[weapon]}</g>}
      </g>
    </g>
  )
}

function Leg({ name, part }: { name: string; part: 'F' | 'B' }) {
  return (
    <g data-fx={`${name}-leg${part}`}>
      {limb(JOINT.hip.x, JOINT.hip.y, 19, 5)}
      <g data-fx={`${name}-shin${part}`}>
        {limb(JOINT.knee.x, JOINT.knee.y, 17, 4.4)}
        <path d={`M${JOINT.knee.x - 2.4} -2.6 H${JOINT.knee.x + 5} Q${JOINT.knee.x + 6.4} 0 ${JOINT.knee.x + 4.4} 0 H${JOINT.knee.x - 2.4} Z`} />
      </g>
    </g>
  )
}

/** A hostile boy, `{name}` placed and posed by bindBoy: his weapon in hand or at his mouth. */
export function Boy({ name, weapon }: { name: string; weapon: Weapon }) {
  return (
    <g data-fx={name} fill={SHADE.black}>
      <Leg name={name} part="B" />
      <Arm name={name} part="B" />
      <path d={SMOCK} />
      <rect x={-1} y={-64} width={5} height={6} />
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
      <path d={HAIR_BOY} />
      <path d={`M${HEAD.x + 11} ${HEAD.y - 2} L${HEAD.x + 15} ${HEAD.y + 3} L${HEAD.x + 11} ${HEAD.y + 4} Z`} />
      {weapon === 'pipe' && (
        // the blowpipe raised from his mouth, long and thin, a dart's tuft at the mouthpiece
        <path d={`M${HEAD.x + 10} ${HEAD.y + 5} L${HEAD.x + 70} ${HEAD.y - 22} L${HEAD.x + 71} ${HEAD.y - 19} L${HEAD.x + 11} ${HEAD.y + 8} Z`} />
      )}
      <Leg name={name} part="F" />
      <Arm name={name} part="F" weapon={weapon === 'spear' ? 'spear' : undefined} />
    </g>
  )
}

/** A boy's pose: where he stands, which way he faces, his lean, and each joint's turn in degrees (an arm or a
 *  leg swung ahead of him is negative). */
export interface BoyFrame {
  x: number
  y: number
  facing: 1 | -1
  lean: number
  armF: number
  foreF: number
  armB: number
  foreB: number
  legF: number
  shinF: number
  legB: number
  shinB: number
  shown: number
}

const PARTS = ['armF', 'foreF', 'armB', 'foreB', 'legF', 'shinF', 'legB', 'shinB'] as const
const PIVOT: Record<(typeof PARTS)[number], { x: number; y: number }> = {
  armF: JOINT.shoulder,
  armB: JOINT.shoulder,
  foreF: JOINT.elbow,
  foreB: JOINT.elbow,
  legF: JOINT.hip,
  legB: JOINT.hip,
  shinF: JOINT.knee,
  shinB: JOINT.knee,
}

/** Binds a drawn boy: the writer places him and turns each joint. */
export function bindBoy(stage: ParentNode, name: string): (frame: BoyFrame) => void {
  const root = fx(stage, name)
  const parts = PARTS.map((part) => [part, fx(stage, `${name}-${part}`)] as const)
  return (frame) => {
    transformTo(root, `translate(${frame.x.toFixed(1)} ${frame.y.toFixed(1)}) scale(${frame.facing} 1) rotate(${frame.lean.toFixed(1)})`)
    fadeTo(root, frame.shown)
    for (const [part, node] of parts) transformTo(node, `rotate(${frame[part].toFixed(1)} ${PIVOT[part].x} ${PIVOT[part].y})`)
  }
}

/** A boy at rest, his weapon held ready: a spear upright, a blowpipe up at his mouth with both hands on it. */
export const BOY_STAND: Omit<BoyFrame, 'x' | 'y' | 'facing' | 'shown'> = {
  lean: 0,
  armF: -30,
  foreF: -40,
  armB: -50,
  foreB: -70,
  legF: -4,
  shinF: 2,
  legB: 6,
  shinB: 2,
}

/** A boy running at `phase`, a stride every unit: legs scissoring, the spear or pipe carried forward. */
export function boyRun(phase: number): Omit<BoyFrame, 'x' | 'y' | 'facing' | 'shown'> {
  const swing = Math.sin(phase * Math.PI * 2)
  const lift = Math.max(0, Math.cos(phase * Math.PI * 2))
  return {
    lean: 10,
    armF: -40 - 10 * swing,
    foreF: -50,
    armB: -60 + 20 * swing,
    foreB: -70,
    legF: -38 * swing,
    shinF: 20 + 50 * lift,
    legB: 38 * swing,
    shinB: 20 + 50 * (1 - lift),
  }
}

const HAIR_GIRL = `M${HEAD.x - 12} ${HEAD.y + 4} Q${HEAD.x - 15} ${HEAD.y - 15} ${HEAD.x + 1} ${HEAD.y - 14} Q${HEAD.x + 13} ${HEAD.y - 13} ${HEAD.x + 12} ${HEAD.y - 3} Q${HEAD.x + 4} ${HEAD.y - 9} ${HEAD.x - 4} ${HEAD.y - 6} Z`
// her two bunches of hair, one behind each ear, tied short
const BUNCHES = `M${HEAD.x - 10} ${HEAD.y - 6} Q${HEAD.x - 26} ${HEAD.y - 10} ${HEAD.x - 24} ${HEAD.y + 6} Q${HEAD.x - 18} ${HEAD.y + 2} ${HEAD.x - 10} ${HEAD.y + 2} Z M${HEAD.x - 4} ${HEAD.y - 13} Q${HEAD.x - 12} ${HEAD.y - 28} ${HEAD.x - 2} ${HEAD.y - 26} Q${HEAD.x} ${HEAD.y - 20} ${HEAD.x} ${HEAD.y - 13} Z`
const DRESS = 'M-6 -60 Q1 -63 8 -60 L16 -24 Q1 -20 -14 -24 Z'

/** The small girl, `{name}`, standing with her hands together in front of her; her eye `{name}-eye`. A scene
 *  turns her with `turnGirl`. */
export function Girl({ name }: { name: string }) {
  return (
    <g data-fx={name} fill={SHADE.black}>
      {limb(-2, -26, 26, 4.2)}
      {limb(4, -26, 26, 4.2)}
      <path d="M-4.4 -2.6 H3 Q4.6 0 2.6 0 H-4.4 Z M1.6 -2.6 H9 Q10.6 0 8.6 0 H1.6 Z" />
      <path d={DRESS} />
      <rect x={-1} y={-64} width={5} height={6} />
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
      <path d={HAIR_GIRL} />
      <path d={BUNCHES} />
      <path d={`M${HEAD.x + 11} ${HEAD.y - 1} L${HEAD.x + 14} ${HEAD.y + 3} L${HEAD.x + 11} ${HEAD.y + 4} Z`} />
      <path d="M3 -58 Q10 -50 9 -40 L6 -40 Q6 -49 1 -55 Z" />
      <ellipse data-fx={`${name}-eye`} cx={HEAD.x + 6} cy={HEAD.y - 2} rx={2.2} ry={3} fill={SHADE.glow} opacity="0" />
    </g>
  )
}

/** Places the girl at `x` facing right turned `turn` of the way round to face left (0 her back to him, 1
 *  facing him), scaled `size` and faded to `shown`; her eye lights as she comes round. */
export function placeGirl(root: Element | null, eye: Element | null, { x, turn, size = 1, shown = 1 }: { x: number; turn: number; size?: number; shown?: number }): void {
  // seen side on, a turn is the outline narrowing to nothing and opening again the other way
  const facing = Math.cos(turn * Math.PI)
  const wide = Math.sign(facing) * Math.max(0.12, Math.abs(facing))
  transformTo(root, `translate(${x.toFixed(1)} 0) scale(${(wide * size).toFixed(3)} ${size})`)
  fadeTo(root, shown)
  fadeTo(eye, Math.max(0, (turn - 0.6) / 0.4))
}
