import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, propNodes } from '../../shared/propRow'
import { Walker, walkerOf, type Chamber } from '../chamber'
import { FLOOR } from '../city'
import { pull } from '../pose'

// Ventures: propaganda square. A rolled banner hangs from the hall's crown for each venture, its cord
// down by the floor; as each venture is read he walks up, reaches for the cord and yanks it, and the
// maroon banner drops open under its gold rod, its sunburst lit.

// The rod hangs this high over the floor; the banner drops this far below it; the cord ends at his reach.
const ROD = -720
const DROP = 430
const CORD_END = -300

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

function Rod() {
  return (
    <>
      <rect x={-104} y={ROD - 14} width={208} height={16} rx={8} fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
      <path d={`M-70 ${ROD + 2} V${CORD_END}`} stroke={C.goldBright} strokeWidth="3" />
      <circle cx={-70} cy={CORD_END} r={9} fill={C.blood} stroke={C.gold} strokeWidth="2" />
    </>
  )
}

function Lit() {
  return <circle cx={0} cy={ROD + 230} r={140} fill={C.neonPink} opacity="0.16" />
}

export const ventures: Chamber = {
  light: C.neonPink,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={() => (
          <>
            <g data-banner="" transform={unrolled(0)}>
              <Banner />
            </g>
            <Rod />
          </>
        )}
        light={() => <Lit />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, pull)
    const props = propNodes(stage, input.xs.length)
    const banners = props.map(({ move }) => move?.querySelector('[data-banner]') ?? null)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const open = litOf(reached, i)
        fadeTo(lit, open)
        transformTo(banners[i], unrolled(open))
      })
    }
  },
}
