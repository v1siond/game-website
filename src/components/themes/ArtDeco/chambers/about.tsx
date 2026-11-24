import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Arc, Raider, foeOf } from '../foes'
import { swing, zap } from '../pose'

// About: the power station, dark when he arrives. A raider rushes him out of the dark past a fuse box; he
// throws the charged hand's bolt into it, the raider shakes and goes rigid in the arc and the overcharge
// lights the box's dials and the lamp over it; then he steps in and brings the wrench down, and the raider
// drops. The game's one-two: the power in one hand, the wrench in the other.

const BOX = 150
const FOE = 300
// The raider rushes in from this far; he steps this far in to bring the wrench down on it.
const FROM = 520
const REACH = FOE - 150

function FuseBox() {
  return (
    <>
      <rect x={-7} y={-250} width={14} height={250} fill={C.brassDark} />
      <rect x={-48} y={-210} width={96} height={104} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-48 -186 H48" stroke={C.brassDark} strokeWidth="3" />
      {[-22, 22].map((x) => (
        <circle key={x} cx={x} cy={-148} r={14} fill={C.cabinetMid} stroke={C.gold} strokeWidth="2" />
      ))}
      <circle cx={0} cy={-292} r={28} fill={C.cabinetMid} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-30 -262 H30" stroke={C.brassMid} strokeWidth="5" />
    </>
  )
}

function Power() {
  return (
    <>
      <circle cx={0} cy={-292} r={110} fill={C.goldBright} opacity="0.18" />
      <circle cx={0} cy={-292} r={24} fill={C.goldBright} />
      {[-22, 22].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-148} r={11} fill={C.cream} />
          <path d={`M${x} -148 L${x + 7} -155`} stroke={C.blood} strokeWidth="2.5" />
        </g>
      ))}
      <path d="M-30 -112 L-18 -90 L-26 -86 L-10 -60" fill="none" stroke={C.bolt} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </>
  )
}

export const about = fightChamber({
  light: C.goldBright,
  script: [1400, 1600, 1600],
  back: () => (
    <>
      <g transform={`translate(${BOX} 0)`}>
        <FuseBox />
        <g data-fx="power" opacity="0">
          <Power />
        </g>
      </g>
      <g data-fx="rush" transform={`translate(${FROM} 0)`}>
        <Raider name="raider" />
      </g>
      <Arc name="raider" x={FOE} />
    </>
  ),
  bind: (stage, { profession }) => {
    const rush = fx(stage, 'rush')
    const foe = foeOf(stage, 'raider')
    const power = fx(stage, 'power')
    return (play) => {
      const rushed = share(play, 0)
      const shocked = share(play, 1)
      const struck = share(play, 2)
      translateTo(rush, lerp(FROM, FOE, rushed), 0)
      // the bolt holds it stiff over the first half, the wrench knocks it down at the end of the second
      foe((shocked + struck) / 2, [0.08, 0.45], [0.86, 1])
      fadeTo(power, ramp(shocked, 0.6, 0.9))
      const bolt = zap(profession, ramp(shocked, 0, 0.5))
      const pose = struck > 0 ? mix(bolt, swing(profession, struck), ramp(struck, 0, 0.2)) : bolt
      return { pose, ahead: REACH * ramp(struck, 0, 0.35), lift: 0 }
    }
  },
})
