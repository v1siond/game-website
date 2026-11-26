import { ramp } from '@/lib/scroll/stage'
import { elapsedOf } from '@/lib/scroll/player'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { shownX, share, still, stepPlace } from '../case'
import { Canvas, FLOOR } from '../street'
import { RoomFloor, RoomWall } from '../room'
import { crash, drum } from '../pose'

// Bands: a jazz club of the 1940s, the score the game plays its city to. On the bandstand, the piano and the
// upright bass standing behind him, he plays brushes on the snare under a wide spot, at the steady pace of a
// roll however the page is scrolled; then both sticks come down on the cymbal for the last hit, the
// spot closes in onto him alone and the room's lights dim, the way the game's investigation music ends once
// every clue is found.

const SCRIPT = [2000, 1500]
const BEAT_MS = 110
const SNARE = 70
const CYMBAL = 150

function Bandstand() {
  return (
    <>
      <rect x={-520} y={-30} width={1000} height={30} fill={NOIR.coal} stroke={NOIR.smoke} strokeWidth="4" />
      {/* the upright piano and the bass behind him */}
      <rect x={-460} y={-250} width={200} height={220} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="4" />
      <path d="M-450 -130 H-270" stroke={NOIR.paperDim} strokeWidth="10" />
      <path d="M-450 -130 H-270" stroke={NOIR.ink} strokeWidth="10" strokeDasharray="4 8" />
      <path d="M-180 -30 Q-230 -110 -196 -160 Q-220 -210 -190 -240 L-176 -360 L-166 -360 L-160 -240 Q-130 -210 -154 -160 Q-120 -110 -170 -30 Z" fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
    </>
  )
}

function Kit() {
  return (
    <>
      <path d={`M${SNARE} -30 V-110`} stroke={NOIR.fog} strokeWidth="5" />
      <rect x={SNARE - 36} y={-142} width={72} height={30} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="4" />
      <ellipse cx={SNARE} cy={-142} rx={36} ry={7} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
      <path d={`M${CYMBAL} -30 V-240`} stroke={NOIR.fog} strokeWidth="5" />
      <g data-fx="cymbal">
        <ellipse cx={CYMBAL} cy={-244} rx={56} ry={9} fill={NOIR.fog} stroke={NOIR.ink} strokeWidth="3" />
      </g>
    </>
  )
}

export const bands = stepPlace({
  light: NOIR.paper,
  script: SCRIPT,
  mid: () => <RoomWall />,
  near: () => <RoomFloor />,
  set: (input) => (
    <Canvas>
      {/* the club's lamps along the back wall, the spot from above */}
        <g data-fx="bulbs">
          {Array.from({ length: 9 }, (_, i) => -40 + i * 210).map((x) => (
            <g key={x}>
              <circle cx={x} cy={420} r={50} fill={NOIR.paper} opacity="0.08" />
              <circle cx={x} cy={420} r={10} fill={NOIR.paperDim} />
            </g>
          ))}
        </g>
        <g data-fx="spot" transform={`translate(${shownX(input)} 0)`}>
          <polygon points={`-60,0 60,0 360,${FLOOR} -360,${FLOOR}`} fill={NOIR.paper} opacity="0.16" />
        </g>
    </Canvas>
  ),
  back: () => <Bandstand />,
  front: () => <Kit />,
  bind: (stage, input) => {
    const bulbs = fx(stage, 'bulbs')
    const spot = fx(stage, 'spot')
    const cymbal = fx(stage, 'cymbal')
    const x = shownX(input)
    return (play) => {
      const hit = share(play, 1)
      const close = ramp(hit, 0.5, 0.9)
      transformTo(spot, `translate(${x} 0) scale(${(1 - 0.6 * close).toFixed(3)} 1)`)
      fadeTo(bulbs, 1 - 0.85 * close)
      const ring = hit > 0.55 ? 6 * Math.sin(Math.PI * 6 * ramp(hit, 0.55, 1)) * (1 - ramp(hit, 0.55, 1)) : 0
      transformTo(cymbal, `rotate(${ring.toFixed(1)} ${CYMBAL} -244)`)
      if (hit > 0) return still(crash(hit))
      return still(drum(ramp(share(play, 0), 0, 0.15), elapsedOf(SCRIPT, play) / BEAT_MS))
    }
  },
})
