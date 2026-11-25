import { fadeTo, fx, r1, transformTo } from '../shared/stageNodes'
import type { StageNodes } from '../shared/figureScene'
import { COLORS as C } from './palette'
import { Shadow } from './props'

// His partner, our own: a small quick lemur in a red scarf, grey fur, a pale face with big round eyes and a
// long ringed tail curled up behind, drawn as the props are, rendered volumes lit from the upper right. The
// pair is the game's own idea (research notes, the buddy system [19]): one leads, the other
// follows; when the leader is hit the other springs ahead. He is drawn once per scene, from About on (on the
// drummer and fighter pages he joins in the hero scene), side on, facing right, his feet at 0 0, about 110
// tall with his tail. His legs, arms and tail turn at their joints; the scene's partner frame sets them.

const EDGE = C.shadow
const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }
const FUR = { dark: '#3a322c', mid: '#8a7e72', light: '#c9bfb2', pale: '#f2ece2' }

/** The partner's frame: how far ahead of his spot and how high, which way he faces, his stride's phase, how
 *  tucked his legs are in the air (0 to 1), how high his arms are raised (0 to 1), how far he is laid along
 *  the water (0 to 1), a tumble in degrees and how much of him shows. */
export interface PartnerFrame {
  ahead: number
  lift?: number
  face?: 1 | -1
  phase?: number
  air?: number
  arms?: number
  swim?: number
  spin?: number
  opacity?: number
}

// His joints in his own drawing.
const HIP = { x: 2, y: -34 }
const SHOULDER = { x: 10, y: -62 }
const TAIL = { x: -14, y: -40 }
const MIDDLE = { x: 0, y: -50 }

function Leg({ name, shade }: { name: string; shade: boolean }) {
  return (
    <g data-fx={name}>
      <path d={`M${HIP.x - 5} ${HIP.y} L${HIP.x - 7} -4 L${HIP.x + 9} -4 L${HIP.x + 5} ${HIP.y} Z`} fill={shade ? FUR.dark : FUR.mid} {...LINE} />
      <ellipse cx={HIP.x + 3} cy={-3} rx={9} ry={4} fill={FUR.dark} />
    </g>
  )
}

function Arm({ name, shade }: { name: string; shade: boolean }) {
  return (
    <g data-fx={name}>
      <path d={`M${SHOULDER.x - 4} ${SHOULDER.y} L${SHOULDER.x - 2} ${SHOULDER.y + 26} L${SHOULDER.x + 6} ${SHOULDER.y + 26} L${SHOULDER.x + 4} ${SHOULDER.y} Z`} fill={shade ? FUR.dark : FUR.mid} {...LINE} />
    </g>
  )
}

/** The lemur at his first frame's place; partnerOf poses and places him from then on. */
export function Partner({ transform, opacity }: { transform: string; opacity: number }) {
  return (
    <g data-fx="partner" transform={transform} opacity={opacity}>
      <Shadow width={70} />
      <g data-fx="partner-body">
        <g data-fx="partner-tail">
          <path d={`M${TAIL.x} ${TAIL.y} C-60 -40 -70 -100 -40 -120 C-20 -132 -6 -118 -16 -108`} fill="none" stroke={EDGE} strokeWidth={14} strokeLinecap="round" />
          <path d={`M${TAIL.x} ${TAIL.y} C-60 -40 -70 -100 -40 -120 C-20 -132 -6 -118 -16 -108`} fill="none" stroke={FUR.pale} strokeWidth={9} strokeLinecap="round" />
          <path d={`M${TAIL.x} ${TAIL.y} C-60 -40 -70 -100 -40 -120 C-20 -132 -6 -118 -16 -108`} fill="none" stroke={FUR.dark} strokeWidth={9} strokeDasharray="10 10" strokeLinecap="butt" />
        </g>
        <Leg name="partner-leg-far" shade />
        <Arm name="partner-arm-far" shade />
        <ellipse cx={2} cy={-50} rx={18} ry={22} fill={FUR.mid} {...LINE} />
        <ellipse cx={8} cy={-46} rx={9} ry={14} fill={FUR.light} />
        <Leg name="partner-leg-near" shade={false} />
        <path d="M-12 -70 Q4 -62 20 -70 L18 -60 Q4 -54 -10 -60 Z" fill={C.sunsetRed} {...LINE} />
        <path d="M-10 -62 L-22 -46 L-14 -44 Z" fill={C.sunsetRed} {...LINE} />
        <g transform="translate(6 -86)">
          <path d="M-14 -14 L-18 -30 L-6 -20 Z M6 -18 L10 -32 L14 -16 Z" fill={FUR.dark} {...LINE} />
          <ellipse rx={18} ry={16} fill={FUR.mid} {...LINE} />
          <path d="M4 -4 Q24 -2 26 6 Q20 12 6 10 Z" fill={FUR.pale} {...LINE} />
          <circle cx={26} cy={5} r={3} fill={EDGE} />
          <circle cx={6} cy={-4} r={7} fill="#ffcf4a" {...LINE} strokeWidth={2} />
          <circle cx={8} cy={-4} r={3.4} fill={EDGE} />
          <circle cx={9} cy={-6} r={1.2} fill="#fff" />
        </g>
        <Arm name="partner-arm-near" shade={false} />
      </g>
    </g>
  )
}

const turnAt = (x: number, y: number, deg: number): string => `rotate(${r1(deg)} ${x} ${y})`

/** Where the partner stands in a frame, as his group's transform: `ahead` and `lift` from his spot, in place
 *  units at the place's `size`, turned the way he faces. The one string the first paint and every frame write. */
export const partnerTransform = ({ ahead, lift = 0, face = 1 }: PartnerFrame, spot: number, ground: number, size: number): string =>
  `translate(${r1(spot + ahead * size)} ${r1(ground - lift * size)}) scale(${(face * size).toFixed(3)} ${size.toFixed(3)})`

/** The partner's writer in a stage: places him from his spot and poses him. */
export function partnerOf(stage: StageNodes): (frame: PartnerFrame, spot: number, ground: number, size: number) => void {
  const root = fx(stage, 'partner')
  const body = fx(stage, 'partner-body')
  const legNear = fx(stage, 'partner-leg-near')
  const legFar = fx(stage, 'partner-leg-far')
  const armNear = fx(stage, 'partner-arm-near')
  const armFar = fx(stage, 'partner-arm-far')
  const tail = fx(stage, 'partner-tail')
  return (frame, spot, ground, size) => {
    const { phase = 0, air = 0, arms = 0, swim = 0, spin = 0, opacity = 1 } = frame
    fadeTo(root, opacity)
    transformTo(root, partnerTransform(frame, spot, ground, size))
    transformTo(body, turnAt(MIDDLE.x, MIDDLE.y, spin + 80 * swim))
    const step = Math.sin(Math.PI * phase) * 34 * (1 - air)
    transformTo(legNear, turnAt(HIP.x, HIP.y, -step - 60 * air))
    transformTo(legFar, turnAt(HIP.x, HIP.y, step - 40 * air))
    transformTo(armNear, turnAt(SHOULDER.x, SHOULDER.y, step * 0.8 - 160 * arms))
    transformTo(armFar, turnAt(SHOULDER.x, SHOULDER.y, -step * 0.8 - 140 * arms))
    transformTo(tail, turnAt(TAIL.x, TAIL.y, 8 * Math.sin(Math.PI * phase * 0.5) - 30 * swim))
  }
}
