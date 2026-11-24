import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CROUCH, HANG, TUCK, rest } from '../pose'

// Services on the factory's conveyor: he stands on a belt that carries him toward its end, where the floor
// drops away into the dark; a hook hangs on its chain past the end. The belt carries him, braced, to the
// edge; then he jumps off its end and catches the hook, which swings with his weight over the drop.

const BELT = { from: -330, to: 140, h: 120 }
const DROP = { from: 140, to: 700 }
const HOOK = { x: 320, chain: 520, at: 390 }
// Where the belt has carried him to, from his place, and the turn of the swing his weight gives the hook.
const CARRIED = AT + BELT.to - 30
const SWING = 10
const rad = (deg: number): number => (deg * Math.PI) / 180

/** The hook's tip, from the obstacle's foot, swung `deg` degrees about its chain's top. */
const hookTip = (deg: number): { x: number; y: number } => ({ x: HOOK.x + HOOK.chain * Math.sin(rad(deg)), y: -HOOK.at - HOOK.chain + HOOK.chain * Math.cos(rad(deg)) })

const swingAt = (t: number): number => -SWING * Math.sin(Math.PI * 1.5 * ramp(t, 0.72, 1)) * (1 - 0.5 * ramp(t, 0.72, 1))

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.55) {
    const carried = ramp(t, 0.05, 0.55)
    return { pose: mix(rest(profession), CROUCH, 0.35 * ramp(t, 0, 0.1)), ahead: CARRIED * carried, lift: BELT.h, over: 0 }
  }
  const tip = hookTip(swingAt(t))
  const caught = { x: AT + tip.x, lift: -tip.y - FIGURE_H * 0.95 }
  const leap = ramp(t, 0.58, 0.72)
  if (t < 0.72) return { pose: mix(mix(rest(profession), CROUCH, 0.35), TUCK, leap), ahead: lerp(CARRIED, caught.x, leap), lift: lerp(BELT.h, caught.lift, leap) + hop(leap, 60), over: 0 }
  return { pose: HANG, ahead: caught.x, lift: caught.lift, over: 0 }
}

function Belt({ light }: { light: Light }) {
  const { from, to, h } = BELT
  return (
    <>
      <rect x={from} y={-h} width={to - from} height={h} fill={SHADE.black} />
      <g data-fx="rollers">
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={from + 30 + i * 52} cy={-h + 16} r={10} fill="none" stroke={light.mid} strokeWidth={3} strokeDasharray="6 6" />
        ))}
      </g>
      <path d={`M${from} ${-h} H${to}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
    </>
  )
}

export const services: Place = {
  script: [2400, 1800],
  ends: [0.55, 1],
  obstacle: ({ light }) => (
    <>
      <rect x={DROP.from} y={-2} width={DROP.to - DROP.from} height={700} fill={light.far} />
      <Belt light={light} />
      <g data-fx="hook">
        <line x1={HOOK.x} y1={-HOOK.at - HOOK.chain} x2={HOOK.x} y2={-HOOK.at} stroke={SHADE.black} strokeWidth={5} strokeDasharray="10 4" />
        <path d={`M${HOOK.x - 3} ${-HOOK.at} V${-HOOK.at + 34} Q${HOOK.x - 3} ${-HOOK.at + 56} ${HOOK.x + 16} ${-HOOK.at + 52} Q${HOOK.x + 28} ${-HOOK.at + 46} ${HOOK.x + 24} ${-HOOK.at + 30}`} fill="none" stroke={SHADE.black} strokeWidth={8} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const hook = fx(stage, 'hook')
    const rollers = fx(stage, 'rollers')
    return (t) => {
      transformTo(hook, `rotate(${swingAt(t).toFixed(1)} ${HOOK.x} ${-HOOK.at - HOOK.chain})`)
      // the rollers turn with the belt that carries him
      rollers?.setAttribute('stroke-dashoffset', (-CARRIED * ramp(t, 0.05, 0.55) * 0.4).toFixed(1))
    }
  },
}
