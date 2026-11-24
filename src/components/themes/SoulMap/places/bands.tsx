import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { SOUL } from '../palette'
import { HOLD_X, still, type Frame, type Place } from '../place'
import { GRIP, HAUL, blend, guard } from '../pose'
import { FLOOR, handOnCanvas } from '../ruins'

// Bands at the top of the bell tower: a great bell hangs under its beam, its lever standing beside him. He
// takes the lever and hauls it down with his weight; then the bell swings and rings, its rings of sound
// going out over the ruins. He holds the lever down as the bell swings out.

const LEVER = { x: 70, y: -40, length: 170 }
const BELL = { x: 300, top: -520 }
const RINGS = [0, 1, 2]

function poseAt(profession: Parameters<typeof guard>[0], t: number) {
  if (t < 0.2) return blend(guard(profession), GRIP, ramp(t, 0.02, 0.2))
  return blend(GRIP, HAUL, ramp(t, 0.2, 0.42))
}

const move = (profession: Parameters<typeof guard>[0], t: number): Frame => still(poseAt(profession, t))

/** The bell's swing at t, in degrees: still, then out and back, coming to its far side as the scene ends. */
const swingAt = (t: number): number => {
  const u = ramp(t, 0.42, 1)
  return 24 * Math.sin(Math.PI * 1.5 * u) * (1 - 0.35 * u)
}

function Tower() {
  return (
    <>
      <rect x={BELL.x - 130} y={BELL.top - 30} width={26} height={-BELL.top + 30} fill={SOUL.rock} />
      <rect x={BELL.x + 104} y={BELL.top - 30} width={26} height={-BELL.top + 30} fill={SOUL.rock} />
      <rect x={BELL.x - 150} y={BELL.top - 50} width={300} height={26} fill={SOUL.woodDark} />
      <rect x={LEVER.x - 26} y={LEVER.y} width={52} height={-LEVER.y} fill={SOUL.slab} />
    </>
  )
}

function Bell() {
  return (
    <g data-fx="bell">
      <rect x={BELL.x - 8} y={BELL.top - 24} width={16} height={28} fill={SOUL.iron} />
      <path d={`M${BELL.x - 50} ${BELL.top + 20} Q${BELL.x - 52} ${BELL.top} ${BELL.x} ${BELL.top} Q${BELL.x + 52} ${BELL.top} ${BELL.x + 50} ${BELL.top + 20} L${BELL.x + 66} ${BELL.top + 120} H${BELL.x - 66} Z`} fill={SOUL.glowDeep} />
      <path d={`M${BELL.x - 40} ${BELL.top + 24} Q${BELL.x - 30} ${BELL.top + 10} ${BELL.x - 14} ${BELL.top + 12} L${BELL.x - 20} ${BELL.top + 116} H${BELL.x - 56} Z`} fill={SOUL.glow} opacity={0.5} />
      <rect x={BELL.x - 70} y={BELL.top + 112} width={140} height={12} rx={4} fill={SOUL.glowDeep} />
    </g>
  )
}

export const bands: Place = {
  script: [1800, 2400],
  ends: [0.42, 1],
  ahead: () => (
    <>
      <Tower />
      {RINGS.map((i) => (
        <circle key={i} data-fx={`ring-${i}`} cx={BELL.x} cy={BELL.top + 70} r={100} fill="none" stroke={SOUL.glow} strokeWidth={4} opacity="0" />
      ))}
      <Bell />
      <line data-fx="lever" x1={LEVER.x} y1={LEVER.y} x2={LEVER.x} y2={LEVER.y - LEVER.length} stroke={SOUL.iron} strokeWidth={10} strokeLinecap="round" />
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const bell = fx(stage, 'bell')
    const lever = fx(stage, 'lever')
    const rings = RINGS.map((i) => fx(stage, `ring-${i}`))
    return (t) => {
      const [hx, hy] = handOnCanvas('near', poseAt(profession, t), HOLD_X)
      // the lever's handle stands upright until he takes it, then goes where his hand takes it
      const held = ramp(t, 0.15, 0.2)
      lever?.setAttribute('x2', (LEVER.x + (hx - HOLD_X - LEVER.x) * held).toFixed(1))
      lever?.setAttribute('y2', (LEVER.y - LEVER.length + (hy - FLOOR - LEVER.y + LEVER.length) * held).toFixed(1))
      transformTo(bell, `rotate(${swingAt(t).toFixed(1)} ${BELL.x} ${BELL.top - 24})`)
      rings.forEach((ring, i) => {
        const out = ramp(t, 0.5 + i * 0.14, 0.78 + i * 0.1)
        transformTo(ring, `translate(${BELL.x} ${BELL.top + 70}) scale(${(0.6 + 1.6 * out).toFixed(3)}) translate(${-BELL.x} ${-BELL.top - 70})`)
        fadeTo(ring, out > 0 ? 0.7 * (1 - 0.6 * out) : 0)
      })
    }
  },
}
