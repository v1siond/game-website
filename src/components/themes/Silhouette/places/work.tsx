import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo, translateTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { SHOVE, rest, walk } from '../pose'

// Work at a gap in the path: a dead trunk stands at its near edge, kept from falling by a rope pegged into
// the ground, and an open bear trap lies by his feet. He shoves the trap along the ground to the rope; it
// snaps shut on the rope and cuts it, and the trunk falls across the gap; then he walks over on the trunk
// to the far side.

const GAP = { from: 80, to: 340 }
const TRUNK = { x: 55, h: 330, w: 30 }
const PEG = 0
// The trap's foot, from the obstacle's foot, before and after he shoves it to the rope.
const TRAP_FROM = -70
const TRAP_TO = PEG - 6
// The trunk's top as it lies across the gap, the height he walks at.
const ON_TRUNK = TRUNK.w / 2
const ACROSS = AT + TRUNK.x + TRUNK.h - 20
const STEP = 55

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.4) {
    const shoved = ramp(t, 0.08, 0.36)
    return { pose: mix(rest(profession), SHOVE, ramp(t, 0, 0.1) - ramp(t, 0.34, 0.4)), ahead: (TRAP_TO - TRAP_FROM) * shoved, lift: 0, over: 0 }
  }
  const from = TRAP_TO - TRAP_FROM
  const along = ramp(t, 0.66, 1)
  const ahead = from + (ACROSS - from) * along
  const onTrunk = ahead > AT + TRUNK.x - 20 && ahead < ACROSS + 10 ? ON_TRUNK : 0
  return { pose: along > 0 && along < 1 ? walk(profession, ahead / STEP) : rest(profession), ahead, lift: onTrunk * Math.min(1, along * 8), over: 0 }
}

/** The bear trap, open (data-fx trap-open) or sprung shut (trap-shut). */
function Trap() {
  return (
    <g data-fx="trap" transform={`translate(${TRAP_FROM} 0)`}>
      <rect x={-34} y={-8} width={68} height={8} fill={SHADE.black} />
      <g data-fx="trap-open">
        <path d="M-34 -8 Q-50 -40 -20 -46 L-14 -38 Q-34 -34 -26 -8 Z M34 -8 Q50 -40 20 -46 L14 -38 Q34 -34 26 -8 Z" fill={SHADE.black} />
      </g>
      <g data-fx="trap-shut" opacity="0">
        <path d="M-18 -8 Q-20 -46 0 -52 Q20 -46 18 -8 Z" fill={SHADE.black} />
      </g>
    </g>
  )
}

export const work: Place = {
  script: [2000, 1400, 1600],
  ends: [0.4, 0.66, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={GAP.from} y={-2} width={GAP.to - GAP.from} height={700} fill={light.far} />
      <g data-fx="trunk">
        <rect x={TRUNK.x - TRUNK.w / 2} y={-TRUNK.h} width={TRUNK.w} height={TRUNK.h} fill={SHADE.black} />
        <path d={`M${TRUNK.x} ${-TRUNK.h + 60} L${TRUNK.x + 40} ${-TRUNK.h + 20} M${TRUNK.x} ${-TRUNK.h + 140} L${TRUNK.x - 36} ${-TRUNK.h + 100}`} stroke={SHADE.black} strokeWidth={8} />
      </g>
      <line data-fx="rope" x1={PEG} y1={0} x2={TRUNK.x} y2={-TRUNK.h + 30} stroke={SHADE.black} strokeWidth={4} />
      <line data-fx="cut" x1={TRUNK.x} y1={-TRUNK.h + 30} x2={TRUNK.x - 20} y2={-TRUNK.h + 120} stroke={SHADE.black} strokeWidth={4} opacity="0" />
      <rect x={PEG - 4} y={-18} width={8} height={18} fill={SHADE.black} />
      <Trap />
    </>
  ),
  move,
  reply: (stage) => {
    const trap = fx(stage, 'trap')
    const open = fx(stage, 'trap-open')
    const shut = fx(stage, 'trap-shut')
    const trunk = fx(stage, 'trunk')
    const rope = fx(stage, 'rope')
    const cut = fx(stage, 'cut')
    return (t) => {
      const sprung = ramp(t, 0.4, 0.43)
      const fallen = ramp(t, 0.44, 0.62)
      translateTo(trap, TRAP_FROM + (TRAP_TO - TRAP_FROM) * ramp(t, 0.08, 0.36), 0)
      fadeTo(open, 1 - sprung)
      fadeTo(shut, sprung)
      fadeTo(rope, 1 - sprung)
      fadeTo(cut, sprung)
      // falls as a weight does, slow off the top and fast at the end
      transformTo(trunk, `rotate(${(90 * fallen * fallen).toFixed(1)} ${TRUNK.x} 0)`)
    }
  },
}
