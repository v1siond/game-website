import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { ramp } from '@/lib/scroll/stage'
import { Bandit, Shot, muzzleFromStop, shotOf } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { shoot } from '../pose'

// About at noon: a signpost before him, a raider behind the rock beyond it. First the raider pops up and he
// brings the rifle off his back and aims; then the burst, the crit starburst pops on the hood, the raider
// goes over and a sun starburst sticker slaps onto the sign.

// The bandit stands this far right of him behind its rock, and pops up from this far down.
const BANDIT = 330
const HIDDEN = 120

function Signpost() {
  return (
    <g transform="translate(150 0)">
      <rect x={-8} y={-200} width={16} height={200} fill={CEL.plank} />
      <path d="M-70 -250 L60 -250 L80 -215 L60 -180 L-70 -180 Z" fill={CEL.notice} />
      <path d="M-50 -228 H40 M-50 -205 H20" stroke={CEL.ink} strokeWidth="5" />
    </g>
  )
}

function Rock() {
  return <path d={`M${BANDIT - 110} 0 L${BANDIT - 90} -90 L${BANDIT - 20} -120 L${BANDIT + 70} -100 L${BANDIT + 110} 0 Z`} fill={CEL.mesa} />
}

const HIT = { x: BANDIT, y: -230 }

export const about = stopsPlace({
  hour: HOURS.noon,
  script: [1600, 2000],
  ends: [0.38, 1],
  back: () => (
    <>
      <Signpost />
      <g data-fx="sticker" opacity="0">
        <Burst x={200} y={-245} r={34} fill={CEL.sun} />
      </g>
      <g data-fx="pop" transform={`translate(${BANDIT} ${HIDDEN})`}>
        <Bandit name="bandit" />
      </g>
    </>
  ),
  front: () => (
    <>
      <Rock />
      <Shot name="shot" from={muzzleFromStop()} to={HIT} />
    </>
  ),
  move: (_profession, t) => still(shoot(t)),
  reply: (stage) => {
    const pop = fx(stage, 'pop')
    const shot = shotOf(stage, 'shot', 'bandit')
    const sticker = fx(stage, 'sticker')
    return (t) => {
      translateTo(pop, BANDIT, HIDDEN * (1 - ramp(t, 0.05, 0.25)))
      shot(t)
      fadeTo(sticker, ramp(t, 0.8, 0.9))
    }
  },
})
