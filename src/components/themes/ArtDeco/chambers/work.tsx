import { fadeTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, Walker, litOf, propNodes, walkerOf, type Chamber } from '../chamber'
import { listen } from '../pose'

// Work: the diary archive. An audio diary waits on a brass pedestal for each job, the recorder its owner
// left behind; as each job is read he walks up to its pedestal and holds his own diary up by his face to
// listen, and the recorder on the pedestal glows gold, its reels lit and the voice rising off it in rings.

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

export const work: Chamber = {
  light: C.gold,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} art={() => <Pedestal />} light={() => <Voice />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, listen)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
