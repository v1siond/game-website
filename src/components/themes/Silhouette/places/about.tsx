import { drop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CROUCH, rest, run } from '../pose'

// About on the slope under the trees: a boulder sits up the bank behind him, held by a root. The root
// snaps and the boulder comes rolling down at him; he runs for the hollow in the path and drops into it,
// and the boulder rolls over the hollow and on into the lake, which closes over it. He stays crouched in
// the hollow, the ripples going out.

const R = 70
// The bank behind him, from its top to its foot, and the boulder's path down it and on over the hollow.
const BANK = { top: { x: -760, y: -330 }, foot: { x: -300, y: 0 } }
const HOLLOW = { from: -20, to: 150, depth: 270 }
const LAKE = 470
const STEP = 70
// His run to the hollow, from his place.
const IN_HOLLOW = AT + (HOLLOW.from + HOLLOW.to) / 2

/** The boulder's centre at s, 0 on the bank's top, 1 sunk in the lake. */
function boulderAt(s: number): { x: number; y: number } {
  const x = lerp(BANK.top.x + R, LAKE + 200, s)
  if (x < BANK.foot.x) return { x, y: lerp(BANK.top.y, BANK.foot.y, (x - BANK.top.x) / (BANK.foot.x - BANK.top.x)) - R }
  if (x < LAKE + R) return { x, y: -R }
  return { x, y: -R + drop(ramp(x, LAKE + R, LAKE + 200), 2 * R + 40) }
}

// It breaks loose late in the first action and is past him by the second's middle.
const rolledAt = (t: number): number => ramp(t, 0.2, 0.92)

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  const along = ramp(t, 0.22, 0.5)
  if (t < 0.5) return { pose: along > 0 ? run(profession, (IN_HOLLOW * along) / STEP) : rest(profession), ahead: IN_HOLLOW * along, lift: 0, over: 0 }
  const down = ramp(t, 0.5, 0.56)
  return { pose: mix(run(profession, IN_HOLLOW / STEP), CROUCH, down), ahead: IN_HOLLOW, lift: -drop(down, HOLLOW.depth - 20), over: 0 }
}

function Bank({ light }: { light: Light }) {
  const { top, foot } = BANK
  return (
    <>
      <path d={`M-1200 0 V${top.y} H${top.x} L${foot.x} ${foot.y} Z`} fill={SHADE.black} />
      <path data-fx="root" d={`M${top.x + 2 * R} ${top.y - 4} Q${top.x + 2 * R + 30} ${top.y - 60} ${top.x + 2 * R + 70} ${top.y - 20}`} stroke={SHADE.black} strokeWidth={8} fill="none" />
      <rect x={HOLLOW.from} y={-2} width={HOLLOW.to - HOLLOW.from} height={HOLLOW.depth} fill={light.far} />
      <rect x={LAKE} y={10} width={900} height={600} fill={light.far} />
      <g data-fx="ripples" opacity="0">
        <ellipse cx={LAKE + 200} cy={12} rx={90} ry={8} fill="none" stroke={light.rim} strokeWidth={3} />
        <ellipse cx={LAKE + 200} cy={12} rx={170} ry={14} fill="none" stroke={light.rim} strokeWidth={2} opacity={0.6} />
      </g>
    </>
  )
}

export const about: Place = {
  script: [2200, 1800],
  ends: [0.5, 1],
  obstacle: ({ light }) => (
    <>
      <Bank light={light} />
      <g data-fx="boulder">
        <circle cx={0} cy={0} r={R} fill={SHADE.black} />
        <path d={`M${-R * 0.5} ${-R * 0.3} L${R * 0.2} ${R * 0.4}`} stroke={light.mid} strokeWidth={4} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const boulder = fx(stage, 'boulder')
    const root = fx(stage, 'root')
    const ripples = fx(stage, 'ripples')
    return (t) => {
      const s = rolledAt(t)
      const { x, y } = boulderAt(s)
      const turned = ((x - BANK.top.x) / R) * (180 / Math.PI)
      transformTo(boulder, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turned.toFixed(1)})`)
      fadeTo(boulder, 1 - ramp(s, 0.92, 1))
      fadeTo(root, 1 - ramp(t, 0.16, 0.2))
      fadeTo(ripples, ramp(s, 0.9, 1))
    }
  },
}
