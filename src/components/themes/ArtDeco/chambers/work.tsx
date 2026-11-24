import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { fadeTo, fx } from '../../shared/stageNodes'
import { HAND } from '../city'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, still } from '../chamber'
import { Raider } from '../foes'
import { rest, study, type DecoPose } from '../pose'

// Work: the diary archive. A raider prowls behind a brass pedestal with its owner's audio diary; he brings
// his camera up to his eye and takes the raider's picture, the flash goes off and the raider is outlined in
// gold, studied; then he lowers the camera and bends his head to the diary, which glows gold with the voice
// rising off it.

const PEDESTAL = 160
const FOE = 320

/** Listening: his kit at rest, the head bent toward the pedestal. */
const listen = (profession: Profession): DecoPose => ({ ...rest(profession), head: 12 })

function Pedestal() {
  return (
    <>
      <path d="M-56 0 V-24 H-44 V-44 H-32 V-150 H32 V-44 H44 V-24 H56 V0 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
      <path d="M-24 -136 V-60 M0 -136 V-60 M24 -136 V-60" stroke={C.brassDark} strokeWidth="2" />
      <rect x={-50} y={-206} width={100} height={56} rx={6} fill={C.recorderCase} stroke={C.brassMid} strokeWidth="3" />
      {[-24, 24].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-180} r={17} fill={C.sepia} stroke={C.gold} strokeWidth="2" />
          <circle cx={x} cy={-180} r={5} fill={C.gold} />
        </g>
      ))}
      <path d="M-24 -163 L0 -156 L24 -163" fill="none" stroke={C.sepia} strokeWidth="2" />
    </>
  )
}

function Voice() {
  return (
    <>
      <circle cx={0} cy={-180} r={120} fill={C.gold} opacity="0.16" />
      {[-24, 24].map((x) => (
        <circle key={x} cx={x} cy={-180} r={17} fill="none" stroke={C.goldBright} strokeWidth="3" />
      ))}
      {[40, 64, 88].map((r) => (
        <path key={r} d={`M${-r * 0.7} ${-210 - r * 0.6} Q0 ${-226 - r} ${r * 0.7} ${-210 - r * 0.6}`} fill="none" stroke={C.goldBright} strokeWidth="3" opacity={1 - r / 130} />
      ))}
    </>
  )
}

// The raider's outline in gold, drawn over it once it is studied.
function Studied() {
  return <path d="M-30 0 L-24 -116 L-40 -110 L-34 -214 Q0 -228 34 -214 L40 -110 L30 0 Z M0 -276 A28 28 0 1 1 0 -220 A28 28 0 1 1 0 -276" fill="none" stroke={C.goldBright} strokeWidth="6" />
}

export const work = fightChamber({
  light: C.gold,
  script: [1700, 1500],
  back: () => (
    <>
      <g transform={`translate(${PEDESTAL} 0)`}>
        <Pedestal />
        <g data-fx="voice" opacity="0">
          <Voice />
        </g>
      </g>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name="raider" />
        <g data-fx="studied" opacity="0">
          <Studied />
        </g>
      </g>
      <circle data-fx="flash" cx={HAND.x - 20} cy={HAND.y - 20} r={90} fill={C.cream} opacity="0" />
    </>
  ),
  bind: (stage, { profession }) => {
    const flash = fx(stage, 'flash')
    const outline = fx(stage, 'studied')
    const voice = fx(stage, 'voice')
    return (play) => {
      const shot = share(play, 0)
      const heard = share(play, 1)
      fadeTo(flash, 0.9 * Math.max(0, 1 - Math.abs(shot - 0.55) / 0.1))
      fadeTo(outline, ramp(shot, 0.6, 0.72))
      fadeTo(voice, ramp(heard, 0.3, 0.7))
      return still(mix(study(profession, shot), listen(profession), ramp(heard, 0, 0.45)))
    }
  },
})
