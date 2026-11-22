import { fadeTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, Walker, litOf, propNodes, walkerOf, type Chamber } from '../chamber'
import { drum } from '../pose'

// Bands: theatre row. A dark marquee stands on its brass legs for each band; as each band is read he walks
// up to it and plays a roll on the snare at his waist, the charged stick sparking, and the marquee's bulbs
// and its neon frame come on and stay lit.

const BULBS = Array.from({ length: 9 }, (_, i) => -96 + i * 24)

function Marquee() {
  return (
    <>
      <path d="M-70 0 V-200 M70 0 V-200" stroke={C.brassDark} strokeWidth="8" />
      <path d="M-110 -200 H110 V-340 L80 -380 H-80 L-110 -340 Z" fill={C.theatreBox} stroke={C.brassMid} strokeWidth="4" />
      <rect x={-84} y={-330} width={168} height={100} fill={C.abyss} stroke={C.brassDark} strokeWidth="2" />
      {BULBS.map((x) => (
        <circle key={x} cx={x} cy={-212} r={5} fill={C.brassShadow} />
      ))}
    </>
  )
}

function Lit() {
  return (
    <>
      <circle cx={0} cy={-280} r={170} fill={C.neonPink} opacity="0.14" />
      <rect x={-84} y={-330} width={168} height={100} fill="none" stroke={C.neonPink} strokeWidth="6" />
      {BULBS.map((x) => (
        <circle key={x} cx={x} cy={-212} r={6} fill={C.goldBright} />
      ))}
      <path d="M-56 -296 H56 M-40 -266 H40" stroke={C.goldBrightText} strokeWidth="9" />
    </>
  )
}

export const bands: Chamber = {
  light: C.neonPink,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} art={() => <Marquee />} light={() => <Lit />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, (_profession, t) => drum(t, t * 4))
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
