import { drop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { Canvas, FIGURE_H, FLOOR, W } from '../forest'
import { SHADE, type Light } from '../palette'
import { type Frame, type Place } from '../place'
import { CROUCH, STRIKE, rest } from '../pose'

// Muay Thai in the gravity room: a machine room with a ceiling, a gravity switch on the wall at his hand,
// and a saw blade running along a rail on the floor toward him. He strikes the switch and falls up to the
// ceiling, landing on it upside down, as the saw runs by under him; then gravity flips back, he drops to
// the floor and lands in his guard, the saw gone past.

// Low enough that a phone's view, its top at y 134 under the page's bar, shows the ceiling and him on it.
const CEILING = 330
// Standing on the ceiling upside down, his soles are on it: the lift that puts the top of his box there.
const UP = FLOOR - CEILING - FIGURE_H
const SWITCH = { x: -20, y: -170 }
const SAW = { r: 64, from: 700, to: -900 }

/** The ceiling and its girder over the room. */
function Ceiling({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect width={W} height={CEILING} fill={SHADE.black} />
      <path d={`M0 ${CEILING} H${W}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
    </Canvas>
  )
}

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.36) {
    const struck = ramp(t, 0, 0.1)
    const fall = ramp(t, 0.12, 0.33)
    return { pose: fall > 0 ? mix(STRIKE, CROUCH, ramp(t, 0.12, 0.2)) : mix(rest(profession), STRIKE, struck), ahead: 0, lift: drop(fall, UP), over: ramp(t, 0.12, 0.3) }
  }
  if (t < 0.68) return { pose: CROUCH, ahead: 0, lift: UP, over: 1 }
  const fall = ramp(t, 0.68, 0.9)
  return { pose: mix(CROUCH, rest(profession), ramp(t, 0.88, 1)), ahead: 0, lift: UP - drop(fall, UP), over: 1 - ramp(t, 0.68, 0.82) }
}

export const muayThai: Place = {
  script: [1600, 1600, 1400],
  ends: [0.36, 0.68, 1],
  mid: ({ light }) => <Ceiling light={light} />,
  obstacle: ({ light }) => (
    <>
      <rect x={-1200} y={-14} width={2400} height={14} fill={SHADE.black} />
      <path d="M-1200 -14 H1200" stroke={light.rim} strokeOpacity={0.3} strokeWidth={2} />
      <rect x={SWITCH.x - 16} y={SWITCH.y - 30} width={32} height={60} fill={light.mid} />
      <g data-fx="lever" transform={`rotate(-30 ${SWITCH.x} ${SWITCH.y + 10})`}>
        <rect x={SWITCH.x - 4} y={SWITCH.y - 24} width={8} height={34} fill={SHADE.black} />
      </g>
      <g data-fx="saw" transform={`translate(${SAW.from} ${-SAW.r - 14})`}>
        <circle r={SAW.r} fill={SHADE.black} />
        <g data-fx="teeth">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${-8} ${-SAW.r + 2} L0 ${-SAW.r - 14} L8 ${-SAW.r + 2} Z`} transform={`rotate(${i * 22.5})`} fill={SHADE.black} />
          ))}
        </g>
        <circle r={10} fill={light.mid} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const lever = fx(stage, 'lever')
    const saw = fx(stage, 'saw')
    return (t) => {
      const thrown = ramp(t, 0.06, 0.1) - ramp(t, 0.7, 0.74)
      transformTo(lever, `rotate(${(-30 + 60 * thrown).toFixed(1)} ${SWITCH.x} ${SWITCH.y + 10})`)
      const run = ramp(t, 0.3, 0.7)
      const x = lerp(SAW.from, SAW.to, run)
      transformTo(saw, `translate(${x.toFixed(1)} ${-SAW.r - 14}) rotate(${(-x * 1.2).toFixed(1)})`)
      fadeTo(saw, 1 - ramp(run, 0.9, 1))
    }
  },
}
