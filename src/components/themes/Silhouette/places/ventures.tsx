import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CROUCH, STRIKE, rest, run } from '../pose'

// Ventures in the yard under the wall gun: a gun on its bracket high on the wall watches the yard, a crate
// stands in it for cover, and the gun's switch is set in the wall under it. A burst rakes the floor and he
// drops behind the crate; between bursts he runs for the wall and strikes the switch, and the gun's light
// goes out.

const CRATE = { x: 0, w: 100, h: 110 }
const WALL = 380
const GUN = { x: WALL - 20, y: -460 }
const SWITCH = { x: WALL - 8, y: -150 }
const AT_SWITCH = AT + WALL - 90
const STEP = 70
// The burst's rounds strike the floor here, from the obstacle's foot.
const HITS = [-160, -90, -30, 140, 210]

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.5) return { pose: mix(rest(profession), CROUCH, ramp(t, 0.04, 0.14)), ahead: 0, lift: 0, over: 0 }
  const along = ramp(t, 0.52, 0.78)
  if (t < 0.8) return { pose: along > 0 && along < 1 ? run(profession, (AT_SWITCH * along) / STEP) : CROUCH, ahead: AT_SWITCH * along, lift: 0, over: 0 }
  return { pose: mix(rest(profession), STRIKE, ramp(t, 0.8, 0.88)), ahead: AT_SWITCH, lift: 0, over: 0 }
}

function Gun({ light }: { light: Light }) {
  return (
    <>
      <rect x={WALL} y={-1000} width={600} height={1002} fill={SHADE.black} />
      <path d={`M${WALL} ${GUN.y + 30} H${GUN.x - 30} V${GUN.y + 50} H${WALL} Z`} fill={SHADE.black} />
      <path d={`M${GUN.x - 30} ${GUN.y} H${GUN.x + 10} V${GUN.y + 40} H${GUN.x - 30} Z M${GUN.x - 30} ${GUN.y + 14} L${GUN.x - 120} ${GUN.y + 40} L${GUN.x - 118} ${GUN.y + 50} L${GUN.x - 30} ${GUN.y + 30} Z`} fill={SHADE.black} />
      <circle data-fx="eye" cx={GUN.x - 14} cy={GUN.y + 10} r={6} fill={light.rim} />
      <rect x={SWITCH.x - 14} y={SWITCH.y - 24} width={28} height={48} fill={light.mid} />
      <rect data-fx="switch" x={SWITCH.x - 6} y={SWITCH.y - 18} width={12} height={20} fill={light.rim} />
    </>
  )
}

export const ventures: Place = {
  script: [2000, 2200],
  ends: [0.5, 1],
  obstacle: ({ light }) => (
    <>
      <Gun light={light} />
      <rect x={CRATE.x} y={-CRATE.h} width={CRATE.w} height={CRATE.h} fill={SHADE.black} />
      <path d={`M${CRATE.x} ${-CRATE.h} L${CRATE.x + CRATE.w} 0 M${CRATE.x + CRATE.w} ${-CRATE.h} L${CRATE.x} 0`} stroke={SHADE.fog} strokeWidth={4} />
      <g data-fx="burst" opacity="0">
        <circle cx={GUN.x - 124} cy={GUN.y + 46} r={26} fill={SHADE.glow} />
        {HITS.map((x) => (
          <g key={x}>
            <line x1={GUN.x - 124} y1={GUN.y + 46} x2={x} y2={-4} stroke={SHADE.black} strokeWidth={3} strokeDasharray="18 22" />
            <path d={`M${x - 14} -2 L${x - 4} -26 L${x + 2} -8 L${x + 12} -30 L${x + 16} -2 Z`} fill={SHADE.glow} />
          </g>
        ))}
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const burst = fx(stage, 'burst')
    const eye = fx(stage, 'eye')
    const lit = fx(stage, 'switch')
    return (t) => {
      // a burst in the first action: on and off in short beats while it fires
      const firing = ramp(t, 0.06, 0.08) - ramp(t, 0.44, 0.46)
      fadeTo(burst, firing * (Math.sin(t * 160) > -0.3 ? 1 : 0.4))
      const off = ramp(t, 0.86, 0.9)
      fadeTo(eye, 1 - off)
      fadeTo(lit, 1 - off)
    }
  },
}
