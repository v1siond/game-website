import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace, type Frame } from '../case'
import { Hood, hoodOf } from '../hood'
import { DIVE, cuff, look, run } from '../pose'

// Projects: the foot chase, in the back lot behind a block. A man bursts out of a doorway and runs for the
// fence, getting a hand up on it; he goes after him flat out and dives into the tackle, pulling him down off
// the fence; then he kneels on his back and the cuffs go on. Bolt, chase and tackle, cuffed.

const DOOR = 140
const FENCE = 470
// The man reaches the fence here and is laid down here, his feet toward him.
const AT_FENCE = 430
const DOWN_AT = 300
// He runs to here, dives to here and kneels here.
const DIVE_FROM = 230
const DIVE_TO = 330
const KNEEL_AT = 350
// One stride of a run carries this far.
const STRIDE = 70

function Lot() {
  return (
    <>
      {/* the back of the block and its doorway */}
      <rect x={DOOR - 50} y={-300} width={100} height={300} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="5" />
      <g data-fx="door">
        <rect x={DOOR - 46} y={-296} width={92} height={296} fill={NOIR.smoke} />
        <circle cx={DOOR + 30} cy={-150} r={5} fill={NOIR.fog} />
      </g>
      <rect x={DOOR - 70} y={-330} width={140} height={22} fill={NOIR.smoke} />
      <g data-fx="doorway-light" opacity="0">
        <polygon points={`${DOOR - 46},0 ${DOOR + 46},0 ${DOOR + 120},20 ${DOOR - 120},20`} fill={NOIR.paper} opacity="0.2" />
      </g>
      {/* the chain link fence */}
      <path d={`M${FENCE} 0 V-280 M${FENCE + 160} 0 V-280 M${FENCE} -280 H${FENCE + 160}`} stroke={NOIR.fog} strokeWidth="6" />
      <path
        d={Array.from({ length: 9 }, (_, i) => `M${FENCE + i * 20} -280 L${FENCE + i * 20 + 120} -160 M${FENCE + i * 20} -160 L${FENCE + i * 20 + 120} -40`).join(' ')}
        stroke={NOIR.ash}
        strokeWidth="2"
        opacity="0.8"
      />
    </>
  )
}

export const projects = stepPlace({
  light: NOIR.paper,
  script: [1400, 1700, 1500],
  ends: KNEEL_AT,
  back: () => (
    <>
      <Lot />
      <Hood name="runner" />
    </>
  ),
  bind: (stage, { profession }) => {
    const door = fx(stage, 'door')
    const light = fx(stage, 'doorway-light')
    const runner = hoodOf(stage, 'runner')
    return (play): Frame => {
      const bolted = share(play, 0)
      const chased = share(play, 1)
      const cuffed = share(play, 2)
      // the door flies open and the light from inside falls out
      const open = ramp(bolted, 0, 0.15)
      transformTo(door, `translate(${DOOR - 46} 0) scale(${(1 - 0.9 * open).toFixed(3)} 1) translate(${-(DOOR - 46)} 0)`)
      fadeTo(light, open)
      const ran = ramp(bolted, 0.1, 0.85)
      const pulled = ramp(chased, 0.7, 0.95)
      const runnerX = lerp(lerp(DOOR, AT_FENCE, ran), DOWN_AT, pulled)
      const stride = Math.sin((Math.PI * (runnerX - DOOR)) / STRIDE) * 32 * (1 - ramp(bolted, 0.8, 0.9))
      runner({
        x: runnerX,
        lean: 14 * (1 - ramp(bolted, 0.8, 0.9)) * (1 - pulled),
        legF: stride * (1 - pulled),
        legB: -stride * (1 - pulled),
        arm: 160 * ramp(bolted, 0.8, 0.95) * (1 - pulled) + 150 * ramp(cuffed, 0.3, 0.6),
        down: pulled,
      })
      if (cuffed > 0) return { pose: cuff(cuffed), ahead: lerp(DIVE_TO, KNEEL_AT, ramp(cuffed, 0, 0.35)), lift: 0 }
      if (chased > 0) {
        const sprint = ramp(chased, 0, 0.6)
        const dive = ramp(chased, 0.6, 0.85)
        if (dive === 0) return { pose: run((DIVE_FROM * sprint) / STRIDE), ahead: DIVE_FROM * sprint, lift: 0 }
        return { pose: mix(run(DIVE_FROM / STRIDE), DIVE, ramp(dive, 0, 0.3)), ahead: lerp(DIVE_FROM, DIVE_TO, dive), lift: 40 * Math.sin(Math.PI * dive) }
      }
      return still(look(profession, -0.3 * ramp(bolted, 0.1, 0.4)))
    }
  },
})
