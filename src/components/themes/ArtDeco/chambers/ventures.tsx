import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, FLOOR, W } from '../city'
import { Guardian, LittleOne } from '../cast'
import { lead, offer, rest } from '../pose'

// Ventures: the choice, and he chooses to help. The glass greenhouse under a dome of sea, its trees and
// ferns. A little one in her raincoat stands with her lamp, and beside her the tall copper guardian, which
// lowers its lantern at him as he comes near. He kneels at a distance and holds out his open hand; the
// guardian leans down, looks at him, and steps back; the little one takes his hand and they walk out
// toward the exit, the guardian following behind them. Nobody is hurt and the guardian is never fought.

const GIRL = { x: 270 }
const GUARD = { x: 400 }
// He kneels this far in; they walk on to here.
const KNEEL_AT = 40
// She walks at his side this far ahead of his place, her hand in his.
const HAND_IN_HAND = 90
const WALK_TO = 300
// The guardian steps back into the room (smaller, higher) and aside to here, then follows them this far.
const BACK = { scale: 0.8, rise: -40, aside: 60, follow: 150 }

/** The dome: brass ribs arching over the sea's blue through the panes. */
function Dome() {
  return (
    <Canvas>
      {[0.15, 0.32, 0.5, 0.68, 0.85].map((share) => (
        <path key={share} d={`M${W * share} 880 Q${W * share + (share - 0.5) * 300} 140 ${W / 2} 40`} fill="none" stroke={C.brassMid} strokeWidth="8" opacity="0.8" />
      ))}
      {[260, 420, 600].map((y) => (
        <path key={y} d={`M-200 ${y} Q800 ${y - 200} 1800 ${y}`} fill="none" stroke={C.brassDark} strokeWidth="5" opacity="0.7" />
      ))}
      <path d="M-200 880 V700 Q800 600 1800 700 V880" fill="none" stroke={C.brassMid} strokeWidth="6" />
    </Canvas>
  )
}

/** The greenhouse's trees and ferns in their stepped deco planters. */
function Garden() {
  const trees = [
    { x: 180, h: 420 },
    { x: 1500, h: 480 },
    { x: 1260, h: 360 },
  ]
  return (
    <Canvas>
      {trees.map(({ x, h }) => (
        <g key={x}>
          <path d={`M${x - 10} 880 Q${x - 20} ${880 - h / 2} ${x} ${880 - h}`} fill="none" stroke={C.sepia} strokeWidth="18" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={x + Math.cos(i * 1.3) * 90} cy={880 - h + Math.sin(i * 1.3) * 40} rx={110} ry={34} fill={i % 2 ? C.leaf : C.leafDark} transform={`rotate(${-30 + i * 15} ${x} ${880 - h})`} />
          ))}
          <path d={`M${x - 80} 880 V840 H${x - 60} V820 H${x + 60} V840 H${x + 80} V880 Z`} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
        </g>
      ))}
      {[560, 980].map((x) => (
        <g key={x}>
          {[-50, -20, 10, 40].map((dx) => (
            <path key={dx} d={`M${x} 880 Q${x + dx} 790 ${x + dx * 2.2} 760`} fill="none" stroke={C.leaf} strokeWidth="10" strokeLinecap="round" />
          ))}
        </g>
      ))}
    </Canvas>
  )
}

/** The garden path: worn stone with moss in its joints. */
function Path() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={120} fill={C.stoneShade} />
      {Array.from({ length: 22 }, (_, i) => -200 + i * 90).map((x, i) => (
        <path key={x} d={`M${x} ${FLOOR} L${x - 30 + (i % 3) * 10} 1000`} stroke={C.leafDark} strokeWidth="5" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={C.leafDark} strokeWidth="6" />
    </Canvas>
  )
}

/** The way out: a stepped arch with the corridor's light beyond it. */
function Exit() {
  return (
    <g>
      <path d="M-70 0 V-260 L-40 -300 H40 L70 -260 V0 Z" fill={C.lamp} opacity="0.4" />
      <path d="M-90 0 V-270 L-50 -320 H50 L90 -270 V0 H70 V-260 L40 -300 H-40 L-70 -260 V0 Z" fill={C.brassMid} stroke={C.gold} strokeWidth="3" />
    </g>
  )
}

export const ventures = fightChamber({
  light: C.waterGlow,
  script: [1300, 1500, 2100],
  set: () => <Garden />,
  room: { far: null, mid: () => <Dome />, near: () => <Path />, fg: null },
  back: () => (
    <>
      <g transform="translate(560 0)">
        <Exit />
      </g>
      <g data-fx="guard-place" transform={`translate(${GUARD.x} 0)`}>
        <Guardian name="guard" />
      </g>
      <g data-fx="girl-place" transform={`translate(${GIRL.x} 0)`}>
        <LittleOne name="girl" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const guardPlace = fx(stage, 'guard-place')
    const guardBody = fx(stage, 'guard-body')
    const head = fx(stage, 'guard-head')
    const beam = fx(stage, 'guard-beam')
    const girlPlace = fx(stage, 'girl-place')
    const girl = fx(stage, 'girl')
    return (play) => {
      const knelt = share(play, 0)
      const stood = share(play, 1)
      const led = share(play, 2)
      // the lantern lowers on him as he comes near, then lifts off him as the guardian decides
      fadeTo(beam, 0.5 * ramp(knelt, 0.1, 0.5) * (1 - ramp(stood, 0.5, 0.75)))
      const look = ramp(stood, 0, 0.45) * (1 - ramp(stood, 0.5, 0.8))
      transformTo(head, `rotate(${(-18 * ramp(knelt, 0.1, 0.5) - 14 * look).toFixed(1)} 0 -456)`)
      transformTo(guardBody, `rotate(${(-22 * look).toFixed(1)} 0 -300)`)
      // it steps back into the room and out of their way, then walks on after them
      const back = ramp(stood, 0.55, 1)
      const scale = lerp(1, BACK.scale, back)
      const followed = BACK.follow * ramp(led, 0.35, 1)
      const sway = 4 * Math.sin(led * 14) * ramp(led, 0.35, 0.5)
      transformTo(guardPlace, `translate(${(lerp(GUARD.x, BACK.aside, back) + followed).toFixed(1)} ${(BACK.rise * back).toFixed(1)}) scale(${scale.toFixed(3)}) rotate(${sway.toFixed(1)})`)
      // she comes to his hand, then walks out beside him
      const came = ramp(led, 0, 0.3)
      const walked = ramp(led, 0.3, 1)
      const girlX = lerp(GIRL.x, KNEEL_AT + HAND_IN_HAND, came) + (WALK_TO - KNEEL_AT) * walked
      const bob = -4 * Math.abs(Math.sin((came + walked) * 9))
      transformTo(girlPlace, `translate(${girlX.toFixed(1)} ${bob.toFixed(1)})`)
      transformTo(girl, `scale(${came > 0.5 ? -1 : 1} 1)`)
      const ahead = KNEEL_AT * ramp(knelt, 0, 0.4) + (WALK_TO - KNEEL_AT) * walked
      if (led > 0.3) return { pose: lead(profession, walked * 6), ahead, lift: 0 }
      if (knelt > 0.4 || stood > 0 || led > 0) {
        const up = ramp(led, 0.15, 0.3)
        return { pose: mix(offer(profession, ramp(knelt, 0.4, 0.9)), rest(profession), up), ahead, lift: 0 }
      }
      return { pose: lead(profession, ramp(knelt, 0, 0.4) * 1.5), ahead, lift: 0 }
    }
  },
})
