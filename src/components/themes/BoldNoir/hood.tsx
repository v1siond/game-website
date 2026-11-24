import { fx, r1, transformTo } from '../shared/stageNodes'
import { NOIR } from './palette'

// The other people of the case, our own: a 1947 hood in a flat cap and a long coat, cut as flat ink and smoke
// with a pale face, about as tall as him, drawn round its feet (x 0, y 0) facing right. Its legs and its
// front arm are groups that turn at the hip and the shoulder, its head turns at the neck, and the whole
// figure moves, leans and falls as one, so a scene can run it, swing it and lay it down.

const HIP = -120
const SHOULDER = -205
const NECK = -224

/** A hood at its feet; its groups are `data-fx="{name}"`, `{name}-legB`, `{name}-legF`, `{name}-arm` and
 *  `{name}-head`. `facing` -1 draws it facing left. */
export function Hood({ name, facing = 1 }: { name: string; facing?: 1 | -1 }) {
  return (
    <g data-fx={name}>
      <g transform={`scale(${facing} 1)`}>
        <g data-fx={`${name}-legB`}>
          <path d={`M-14 ${HIP} L-20 -10 L-4 -10 L2 ${HIP} Z`} fill={NOIR.coal} stroke={NOIR.ink} strokeWidth="3" />
          <path d="M-22 -12 L0 -12 Q14 -8 14 0 L-22 0 Z" fill={NOIR.ink} />
        </g>
        <path d={`M-30 ${SHOULDER + 6} Q-2 ${SHOULDER - 6} 30 ${SHOULDER + 6} L36 ${HIP + 26} L-34 ${HIP + 26} Z`} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="3" />
        <path d={`M8 ${SHOULDER} L22 ${SHOULDER + 40} L4 ${HIP + 20}`} fill="none" stroke={NOIR.ink} strokeWidth="3" />
        <g data-fx={`${name}-legF`}>
          <path d={`M-2 ${HIP} L4 -10 L20 -10 L16 ${HIP} Z`} fill={NOIR.coal} stroke={NOIR.ink} strokeWidth="3" />
          <path d="M2 -12 L24 -12 Q38 -8 38 0 L2 0 Z" fill={NOIR.ink} />
        </g>
        <g data-fx={`${name}-head`}>
          <path d={`M-16 ${NECK} Q-18 ${NECK - 40} 2 ${NECK - 44} Q20 ${NECK - 42} 20 ${NECK - 20} L18 ${NECK - 4} Q4 ${NECK + 4} -10 ${NECK} Z`} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
          <path d={`M-22 ${NECK - 34} Q0 ${NECK - 56} 22 ${NECK - 38} L34 ${NECK - 32} L-20 ${NECK - 28} Z`} fill={NOIR.ink} />
          <g data-fx={`${name}-eye`}>
            <ellipse cx={10} cy={NECK - 22} rx={3} ry={3.6} fill={NOIR.ink} />
          </g>
          <path d={`M6 ${NECK - 8} L16 ${NECK - 9}`} stroke={NOIR.ink} strokeWidth="3" />
        </g>
        <g data-fx={`${name}-arm`}>
          <path d={`M10 ${SHOULDER} L28 ${SHOULDER + 6} L26 ${HIP + 10} L12 ${HIP + 10} Z`} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="3" />
          <circle cx={19} cy={HIP + 16} r={9} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
        </g>
      </g>
    </g>
  )
}

/** A hood's frame: where its feet are, its lean (positive forward), its legs' and arm's turns, its head's. */
export interface HoodFrame {
  x: number
  y?: number
  lean?: number
  legF?: number
  legB?: number
  arm?: number
  head?: number
  /** Laid down: 0 standing, 1 flat on the ground face down, ahead of its feet. */
  down?: number
  facing?: 1 | -1
}

/** The writer of hood `name`: finds its groups once and moves them to a frame. */
export function hoodOf(stage: ParentNode, name: string): (frame: HoodFrame) => void {
  const root = fx(stage, name)
  const legF = fx(stage, `${name}-legF`)
  const legB = fx(stage, `${name}-legB`)
  const arm = fx(stage, `${name}-arm`)
  const head = fx(stage, `${name}-head`)
  return ({ x, y = 0, lean = 0, legF: f = 0, legB: b = 0, arm: a = 0, head: h = 0, down = 0, facing = 1 }) => {
    // facing right, a forward lean turns it clockwise about its feet; laid down it turns a quarter round
    const turn = facing * (lean + 90 * down)
    transformTo(root, `translate(${r1(x)} ${r1(y)}) rotate(${r1(turn)})`)
    transformTo(legF, `rotate(${r1(-f)} 0 ${HIP})`)
    transformTo(legB, `rotate(${r1(-b)} 0 ${HIP})`)
    transformTo(arm, `rotate(${r1(-a)} 19 ${SHOULDER})`)
    transformTo(head, `rotate(${r1(h)} 0 ${NECK})`)
  }
}
