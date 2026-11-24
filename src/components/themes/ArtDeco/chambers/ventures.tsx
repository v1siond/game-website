import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, still } from '../chamber'
import { Raider, foeOf } from '../foes'
import { lay } from '../pose'

// Ventures: propaganda square. He crouches and lays a glowing ring on the floor with the charged hand, a trap
// as the game's powers can be laid; then a raider walks into it, the ring sparks and the raider falls, and
// the maroon banner over the square drops open under its gold rod, its sunburst lit.

const RING = 220
const FOE_FROM = 560
const BANNER = 420

// The rod hangs this high over the floor; the banner drops this far below it.
const ROD = -720
const DROP = 430

const unrolled = (open: number): string => `translate(0 ${ROD}) scale(1 ${Math.max(0.02, open).toFixed(3)}) translate(0 ${-ROD})`

const RAYS = [-50, -25, 0, 25, 50]

function Banner() {
  return (
    <>
      <path d={`M-90 ${ROD} H90 V${ROD + DROP - 50} L0 ${ROD + DROP} L-90 ${ROD + DROP - 50} Z`} fill={C.bloodDark} stroke={C.gold} strokeWidth="4" />
      {RAYS.map((angle) => (
        <path key={angle} d={`M0 ${ROD + 230} L0 ${ROD + 120}`} stroke={C.goldBright} strokeWidth="5" transform={`rotate(${angle} 0 ${ROD + 230})`} />
      ))}
      <circle cx={0} cy={ROD + 230} r={30} fill={C.gold} />
      <path d={`M-60 ${ROD + 300} H60 M-46 ${ROD + 330} H46`} stroke={C.goldPaleText} strokeWidth="8" />
    </>
  )
}

function Lit() {
  return <circle cx={0} cy={ROD + 230} r={140} fill={C.neonPink} opacity="0.16" />
}

// The rod the banner hangs from.
function Rod() {
  return <rect x={-104} y={ROD - 14} width={208} height={16} rx={8} fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
}

export const ventures = fightChamber({
  light: C.neonPink,
  script: [1400, 1800],
  back: () => (
    <>
      <g transform={`translate(${BANNER} 0)`}>
        <g data-fx="banner" transform={unrolled(0)}>
          <Banner />
        </g>
        <Rod />
        <g data-fx="lit" opacity="0">
          <Lit />
        </g>
      </g>
      <ellipse data-fx="ring" cx={RING} cy={0} rx={70} ry={14} fill="none" stroke={C.bolt} strokeWidth="8" opacity="0" />
      <g data-fx="walk" transform={`translate(${FOE_FROM} 0)`}>
        <Raider name="raider" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const ring = fx(stage, 'ring')
    const walk = fx(stage, 'walk')
    const foe = foeOf(stage, 'raider')
    const banner = fx(stage, 'banner')
    const lit = fx(stage, 'lit')
    return (play) => {
      const laid = share(play, 0)
      const caught = share(play, 1)
      fadeTo(ring, ramp(laid, 0.5, 0.8) * (1 - 0.5 * ramp(caught, 0.7, 1)))
      translateTo(walk, FOE_FROM + (RING - FOE_FROM) * ramp(caught, 0, 0.4), 0)
      foe(caught, [0.4, 0.55], [0.5, 0.7])
      const open = ramp(caught, 0.7, 1)
      transformTo(banner, unrolled(open))
      fadeTo(lit, open)
      return still(lay(profession, laid))
    }
  },
})
