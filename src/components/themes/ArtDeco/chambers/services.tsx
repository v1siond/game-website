import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, still } from '../chamber'
import { Raider, foeOf } from '../foes'
import { fling } from '../pose'

// Services: the levitation hall. A sealed crate of the city stands between him and a raider; he raises the
// charged hand and the crate lifts off the floor in its blue light and hangs; then he flings it at the
// raider, who goes down with the crate fallen beside him.

const CRATE = 150
const FOE = 380
// The crate lifts this high before it is flung, and lands here.
const LIFTED = -170
const LANDS = FOE - 110

function Crate() {
  return (
    <>
      <rect x={-62} y={-120} width={124} height={120} fill={C.bronzePanel} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-62 -120 L62 0 M62 -120 L-62 0" stroke={C.brassDark} strokeWidth="3" />
      <path d="M0 -92 L22 -60 L0 -28 L-22 -60 Z" fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
      <path d="M-62 -60 H62" stroke={C.brassMid} strokeWidth="3" />
    </>
  )
}

export const services = fightChamber({
  light: C.bolt,
  script: [1500, 1400],
  back: () => (
    <>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name="raider" />
      </g>
      <ellipse data-fx="glow" cx={CRATE} cy={LIFTED - 60} rx={110} ry={110} fill={C.bolt} opacity="0" />
      <g data-fx="crate" transform={`translate(${CRATE} 0)`}>
        <Crate />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const crate = fx(stage, 'crate')
    const glow = fx(stage, 'glow')
    const foe = foeOf(stage, 'raider')
    return (play) => {
      const up = share(play, 0)
      const flung = share(play, 1)
      const flown = ramp(flung, 0.15, 0.55)
      const x = CRATE + (LANDS - CRATE) * flown
      const y = LIFTED * up * (1 - flown) - 60 * Math.sin(Math.PI * flown)
      transformTo(crate, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(200 * flown).toFixed(1)} 0 -60)`)
      fadeTo(glow, 0.2 * up * (1 - flown))
      foe(flung, null, [0.5, 0.8])
      // fling plays the lift over its first 0.55 and the throw over the rest
      return still(fling(profession, flung > 0 ? 0.55 + 0.45 * flung : 0.55 * up))
    }
  },
})
