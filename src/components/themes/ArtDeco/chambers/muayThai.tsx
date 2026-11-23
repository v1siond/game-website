import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { HOLD_X, still, stopsChamber } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { BrassGuard } from '../foes'
import { strike } from '../pose'

// Muay Thai: the fight club on the old theatre's stage, its maroon curtains drawn back. For each line of the
// record a brass guard in its diving suit stands in his way; he knees it and throws the round kick, it
// staggers back, and on the blow it sinks to one knee, its porthole lamp going dark. On the last line the
// frame pushes in on him over the kneeling guard.

const FOE = 260
// The last guard's fall pushes the camera in this far.
const PUSH = 0.2

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

export const muayThai = stopsChamber({
  light: C.blood,
  set: () => <Curtains />,
  back: (i) => (
    <g transform={`translate(${FOE} 0)`}>
      <BrassGuard name={`guard-${i}`} />
    </g>
  ),
  move: (profession, t) => still(strike(profession, t)),
  reply: (stage, { count }) => {
    const guards = Array.from({ length: count }, (_, i) => fx(stage, `guard-${i}`))
    const lamps = Array.from({ length: count }, (_, i) => fx(stage, `guard-${i}-lamp`))
    const camera = fx(stage, 'camera')
    return (played) => {
      guards.forEach((guard, i) => {
        const t = played(i)
        const stagger = Math.sin(Math.PI * ramp(t, 0.55, 0.75))
        const kneel = ramp(t, 0.72, 0.9)
        // down on its knee: the suit sinks into its legs from its feet up, leaning forward over them
        transformTo(guard, `translate(${(40 * stagger + 20 * kneel).toFixed(1)} 0) rotate(${(10 * stagger - 8 * kneel).toFixed(1)}) scale(1 ${(1 - 0.3 * kneel).toFixed(3)})`)
        fadeTo(lamps[i], 1 - 0.85 * kneel)
      })
      const last = count > 0 ? ramp(played(count - 1), 0.72, 0.95) : 0
      transformTo(camera, focusOn(HOLD_X + FOE / 2, FLOOR - 180, 1 + PUSH * last))
    }
  },
})
