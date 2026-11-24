import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { mix } from '@/lib/motion/rigPose'
import { fightChamber, holdX, share, still } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { BrassGuard } from '../foes'
import { rest, strike } from '../pose'

// Muay Thai: the fight club on the old theatre's stage, its maroon curtains drawn back. A brass guard in its
// diving suit stands in his way; he drives a knee into it and it rocks; then the round kick staggers it back
// and it sinks to one knee, its porthole lamp going dark, the frame pushing in on him over it as he settles
// back into his guard.

const FOE = 260
// The guard's fall pushes the camera in this far.
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

export const muayThai = fightChamber({
  light: C.blood,
  script: [1300, 1600],
  set: () => <Curtains />,
  back: () => (
    <g transform={`translate(${FOE} 0)`}>
      <BrassGuard name="guard" />
    </g>
  ),
  bind: (stage, input) => {
    const { profession } = input
    const guard = fx(stage, 'guard')
    const lamp = fx(stage, 'guard-lamp')
    const camera = fx(stage, 'camera')
    return (play) => {
      const kneed = share(play, 0)
      const kicked = share(play, 1)
      // the knee rocks it, the kick staggers it back and it sinks onto one knee, its suit settling into its legs
      const rocked = 0.4 * Math.sin(Math.PI * ramp(kneed, 0.4, 0.9))
      const stagger = Math.sin(Math.PI * ramp(kicked, 0.3, 0.6))
      const kneel = ramp(kicked, 0.5, 0.8)
      const sway = rocked + stagger
      transformTo(guard, `translate(${(40 * sway + 20 * kneel).toFixed(1)} 0) rotate(${(10 * sway - 8 * kneel).toFixed(1)}) scale(1 ${(1 - 0.3 * kneel).toFixed(3)})`)
      fadeTo(lamp, 1 - 0.85 * kneel)
      transformTo(camera, focusOn(holdX(input) + FOE / 2, FLOOR - 180, 1 + PUSH * ramp(kicked, 0.5, 0.9)))
      const blow = kicked > 0 ? strike(profession, 0.5 + 0.5 * ramp(kicked, 0, 0.4)) : strike(profession, 0.5 * kneed)
      return still(mix(blow, rest(profession), ramp(kicked, 0.65, 1)))
    }
  },
})
