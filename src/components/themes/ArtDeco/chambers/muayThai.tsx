import { fadeTo, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, Walker, litOf, propNodes, walkerOf, type Chamber } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { strike } from '../pose'

// Muay Thai: the fight club on the old theatre's stage, its maroon curtains drawn back. A heavy bag hangs
// on its chain for each line of the record; as each line is read he walks up to its bag, knees it and
// throws the round kick, the bag swings on its chain and the bulb over it lights.

// The chain hangs from here; a kicked bag swings out this far and settles back.
const HOOK = -760
const SWING_DEG = 14

/** The stage's maroon curtains drawn back to both sides, and its gold valance. */
function Curtains() {
  return (
    <Canvas>
      <path d={`M60 150 H520 Q360 420 420 ${FLOOR} H60 Z`} fill={C.blood} />
      <path d={`M1540 150 H1080 Q1240 420 1180 ${FLOOR} H1540 Z`} fill={C.blood} />
      <path d="M120 150 Q240 500 200 880 M260 150 Q340 460 320 880 M1480 150 Q1360 500 1400 880 M1340 150 Q1260 460 1280 880" fill="none" stroke={C.bloodDark} strokeWidth="10" />
      <path d="M60 150 H1540 V200 Q800 240 60 200 Z" fill={C.bloodDeep} stroke={C.gold} strokeWidth="4" />
    </Canvas>
  )
}

function Bag() {
  return (
    <>
      <path d={`M0 ${HOOK} V-400`} stroke={C.steelShade} strokeWidth="4" strokeDasharray="10 4" />
      <rect x={-38} y={-400} width={76} height={250} rx={30} fill={C.blood} stroke={C.bloodDark} strokeWidth="4" />
      <path d="M-38 -350 H38 M-38 -200 H38" stroke={C.gold} strokeWidth="5" />
    </>
  )
}

function Bulb() {
  return (
    <>
      <circle cx={0} cy={HOOK + 40} r={130} fill={C.goldBright} opacity="0.16" />
      <circle cx={0} cy={HOOK + 40} r={16} fill={C.goldBright} />
    </>
  )
}

export const muayThai: Chamber = {
  light: C.blood,
  set: () => <Curtains />,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        art={() => (
          <>
            <circle cx={0} cy={HOOK + 40} r={14} fill={C.brassShadow} />
            <g data-bag="">
              <Bag />
            </g>
          </>
        )}
        light={() => <Bulb />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, strike)
    const props = propNodes(stage, input.xs.length)
    const bags = props.map(({ move }) => move?.querySelector('[data-bag]') ?? null)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const hit = litOf(reached, i)
        fadeTo(lit, hit)
        transformTo(bags[i], `rotate(${(SWING_DEG * Math.sin(Math.PI * hit)).toFixed(1)} 0 ${HOOK})`)
      })
    }
  },
}
