import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, pull, walk } from '../pose'

// About at the black lake: the path ends at the water and a boat lies out in the reeds, its rope trailing to
// the bank. He takes the rope and hauls the boat in to the bank, walking back with it; then he steps up into
// it and it drifts out onto the water with him crouched in it.

// The water starts this far past the obstacle's foot; the boat lies out at `from`, is hauled to `bank`.
const SHORE = 30
const BOAT = { from: 330, bank: 130, drift: 150, deck: 34 }
// Where his hand takes the rope, and how far back he walks hauling it.
const GRAB = 40
const HAULED = -50
const STEP = 70

const boatX = (t: number): number => lerp(BOAT.from, BOAT.bank, ramp(t, 0.15, 0.5)) + BOAT.drift * ramp(t, 0.72, 1)

function Water({ light }: { light: Light }) {
  return (
    <>
      <rect x={SHORE} y={-4} width={1400} height={700} fill={light.mid} />
      <path d={`M${SHORE} -4 H${SHORE + 1400}`} stroke={light.rim} strokeOpacity={0.35} strokeWidth={3} />
    </>
  )
}

/** The boat side on, its bow to the left with the rope's ring, the rope trailing from it to `rope` ahead of
 *  the bow (or slack on the deck once he is aboard). */
function Boat() {
  return (
    <>
      <path d="M-130 -40 H130 L104 6 Q0 22 -104 6 Z" fill={SHADE.black} />
      <rect x={-6} y={-150} width={8} height={112} fill={SHADE.black} />
      <circle cx={-124} cy={-34} r={7} fill="none" stroke={SHADE.black} strokeWidth={4} />
    </>
  )
}

function Reeds() {
  return <path d="M260 0 L270 -90 L278 0 M300 0 L316 -120 L322 0 M470 0 L478 -100 L488 0 M520 0 L540 -80 L546 0" stroke={SHADE.black} strokeWidth={6} fill="none" />
}

export const about: Place = {
  script: [1800, 1800],
  ends: [0.5, 1],
  obstacle: ({ light }) => (
    <>
      <Water light={light} />
      <g data-fx="boat" transform={`translate(${BOAT.from} 0)`}>
        <Boat />
      </g>
      <line data-fx="rope" x1={BOAT.from - 124} y1={-34} x2={GRAB - AT} y2={-6} stroke={SHADE.black} strokeWidth={4} />
      <Reeds />
    </>
  ),
  // to the rope's end and the haul back, then the step up into the boat and the crouch as it drifts
  move: (profession, t) => {
    if (t < 0.15) return { pose: walk(profession, (GRAB * ramp(t, 0, 0.15)) / STEP), ahead: GRAB * ramp(t, 0, 0.15), lift: 0, over: 0 }
    if (t < 0.5) {
      const back = ramp(t, 0.15, 0.5)
      const hauling = mix(walk(profession, GRAB / STEP), pull(profession, Math.min(1, 0.4 + back)), ramp(back, 0, 0.15))
      return { pose: { ...hauling, thighRight: hauling.thighRight + 14 * Math.sin(back * Math.PI * 4), thighLeft: hauling.thighLeft - 14 * Math.sin(back * Math.PI * 4) }, ahead: lerp(GRAB, HAULED, back), lift: 0, over: 0 }
    }
    const step = ramp(t, 0.52, 0.7)
    const aboard = AT + boatX(t)
    return {
      pose: mix(pull(profession, 1), CROUCH, ramp(t, 0.5, 0.6)),
      ahead: t < 0.7 ? lerp(HAULED, AT + BOAT.bank, step) : aboard,
      lift: t < 0.7 ? BOAT.deck * step + hop(step, 70) : BOAT.deck,
      over: 0,
    }
  },
  reply: (stage) => {
    const boat = fx(stage, 'boat')
    const rope = fx(stage, 'rope')
    return (t) => {
      const x = boatX(t)
      transformTo(boat, `translate(${x.toFixed(1)} ${(2 * Math.sin(t * 12)).toFixed(1)})`)
      // the rope runs from the bow to his hand while he hauls, then lies on the bank behind the boat
      const hand = t < 0.15 ? GRAB - AT : t < 0.5 ? lerp(GRAB, HAULED, ramp(t, 0.15, 0.5)) - AT + 30 : x - 170
      rope?.setAttribute('x1', (x - 124).toFixed(1))
      rope?.setAttribute('x2', hand.toFixed(1))
    }
  },
}
