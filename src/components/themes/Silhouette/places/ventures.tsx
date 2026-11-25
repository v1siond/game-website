import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, STRIKE, TUCK, rest } from '../pose'

// Beat 7, the machine yard: a gun on the far wall rakes the floor in bursts, a crate stands in the open, and
// a switch on a post stands under the gun. He runs in and ducks behind the crate as a burst rakes the floor
// past it; between bursts he vaults the crate and runs for the post; he pulls the switch and the gun's eye
// goes dark.

const CRATE = { from: 260, size: 50 }
const DUCK = CRATE.from - 26
const POST = 540
const GUN = { x: 620, y: -330 }
// The floor a burst rakes, from the gun's side back toward the crate.
const RAKE = [CRATE.from + CRATE.size + 10, POST - 30] as const

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.35) {
    const run = ramp(t, 0, 0.16)
    if (run < 1) return runFrame(profession, 0, DUCK, run)
    return { pose: mix(rest(profession), CROUCH, ramp(t, 0.16, 0.2)), ahead: DUCK, lift: 0, over: 0 }
  }
  if (t < 0.7) {
    const vault = ramp(t, 0.38, 0.5)
    if (vault < 1) return { pose: TUCK, ahead: lerp(DUCK, CRATE.from + CRATE.size + 30, vault), lift: arc(vault, CRATE.size + 26), over: 0 }
    return runFrame(profession, CRATE.from + CRATE.size + 30, length, ramp(t, 0.5, 0.68))
  }
  const reach = ramp(t, 0.7, 0.8)
  return { pose: mix(rest(profession), STRIKE, reach), ahead: length, lift: 0, over: 0 }
}

/** The burst's glare at t: two bursts while he is behind the crate, none once he runs. */
const burstAt = (t: number): number => Math.max(bell(t, 0.18, 0.26), bell(t, 0.27, 0.35))

export const ventures: Place = {
  region: 'machine',
  // he ends at the post, his hand on the switch
  length: POST - 26,
  script: [1500, 1500, 1200],
  ends: [0.35, 0.7, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={CRATE.from} y={-CRATE.size} width={CRATE.size} height={CRATE.size} fill={SHADE.black} />
      {/* the gun on its bracket off the wall, its eye lit */}
      <rect x={GUN.x + 30} y={GUN.y - 200} width={300} height={200 - GUN.y} fill={SHADE.black} />
      <path d={`M${GUN.x + 30} ${GUN.y - 10} H${GUN.x - 10} V${GUN.y + 26} H${GUN.x + 30} Z M${GUN.x - 10} ${GUN.y + 6} L${GUN.x - 80} ${GUN.y + 40} L${GUN.x - 76} ${GUN.y + 50} L${GUN.x - 6} ${GUN.y + 20} Z`} fill={SHADE.black} />
      <circle data-fx="gun-eye" cx={GUN.x + 8} cy={GUN.y + 8} r={6} fill={light.rim} />
      {/* the burst: its line from the muzzle to the floor, and the sparks along the floor it rakes */}
      <g data-fx="burst" opacity="0">
        <path d={`M${GUN.x - 78} ${GUN.y + 46} L${RAKE[0] + 40} -2`} stroke={SHADE.glow} strokeWidth={2} strokeDasharray="10 8" />
        <path d={`M${RAKE[0]} -2 H${RAKE[1]}`} stroke={SHADE.glow} strokeWidth={3} strokeDasharray="4 14" />
      </g>
      {/* the switch on its post */}
      <rect x={POST - 4} y={-70} width={8} height={70} fill={SHADE.black} />
      <rect x={POST - 12} y={-86} width={24} height={18} fill={SHADE.black} />
      <line data-fx="lever" x1={POST} y1={-77} x2={POST - 16} y2={-100} stroke={SHADE.black} strokeWidth={5} strokeLinecap="round" />
    </>
  ),
  move,
  reply: (stage) => {
    const eye = fx(stage, 'gun-eye')
    const burst = fx(stage, 'burst')
    const lever = fx(stage, 'lever')
    return (t) => {
      const thrown = ramp(t, 0.78, 0.86)
      fadeTo(burst, burstAt(t))
      fadeTo(eye, 1 - ramp(t, 0.86, 0.95))
      transformTo(lever, `rotate(${(70 * thrown).toFixed(1)} ${POST} -77)`)
    }
  },
}
