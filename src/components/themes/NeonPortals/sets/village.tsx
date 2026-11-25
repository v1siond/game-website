import type { ReactNode } from 'react'
import { fadeTo } from '../../shared/stageNodes'
import { Cottage, Goat, Toad } from './cast'
import { along, placeTo } from './kit'

// The village of the run's first era (Crash 3 notes, the medieval village [8] [13]), shared by About and the
// time trial that replays it (Ventures): a sunny road of stone into the distance between thatched cottages,
// goats and toads at its edges, seen from behind him as he runs into the screen. The cottages, the fence
// and the road's stones stream toward the camera as he goes; `travel` is how far he has run.

/** The road's vanishing point and its near end, where his feet are. */
export const ROAD = { vx: 320, vy: 214, near: 440 }

// The roadside, laid out along the road, `z` ahead and `x` across (the road is about 300 wide near him).
type Side = { z: number; x: number; kind: 'cottage' | 'goat' | 'toad' | 'post' }
const SIDES: Side[] = [
  { z: 60, x: -560, kind: 'cottage' },
  { z: 90, x: 560, kind: 'cottage' },
  { z: 380, x: -520, kind: 'cottage' },
  { z: 420, x: 540, kind: 'cottage' },
  { z: 760, x: -560, kind: 'cottage' },
  { z: 820, x: 520, kind: 'cottage' },
  { z: 250, x: -250, kind: 'goat' },
  { z: 640, x: 240, kind: 'toad' },
  { z: 140, x: 250, kind: 'post' },
  { z: 300, x: -230, kind: 'post' },
  { z: 520, x: 230, kind: 'post' },
  { z: 700, x: -230, kind: 'post' },
]
// The road repeats every SPAN ahead, so a long run never runs out of village.
const SPAN = 1000
const STONES = 10

const SIDE_ART: Record<Side['kind'], (flip: boolean) => ReactNode> = {
  cottage: (flip) => <Cottage w={300} flip={flip} />,
  goat: () => <Goat />,
  toad: () => <Toad />,
  post: () => <path d="M0 0 V-46 M-60 -34 H60 M-60 -16 H60" stroke="#7a5230" strokeWidth={9} strokeLinecap="round" />,
}

/** Distance ahead once he has run `travel`, wrapped into the road's span. */
const ahead = (z: number, travel: number): number => ((((z - travel) % SPAN) + SPAN) % SPAN) - 40

/** The village behind his set: hills, road, roadside and the road's stones, each streamed by streamVillage. */
export function Village() {
  return (
    <>
      <circle cx={520} cy={-60} r={46} fill="#fff6c8" opacity={0.9} />
      <path d="M-1500 230 Q-200 120 320 200 T2100 190 V400 H-1500 Z" fill="#9ccf72" />
      <path d="M-1500 240 Q0 170 600 230 T2100 220 V400 H-1500 Z" fill="#7fb85a" />
      <path d="M-1500 214 H2100 V2000 H-1500 Z" fill="#6aa648" />
      <path d={`M${ROAD.vx - 14} ${ROAD.vy} L${ROAD.vx + 14} ${ROAD.vy} L1200 2000 L-560 2000 Z`} fill="#b9ab92" />
      <path d={`M${ROAD.vx - 14} ${ROAD.vy} L-560 2000 M${ROAD.vx + 14} ${ROAD.vy} L1200 2000`} stroke="#8a7a62" strokeWidth={6} />
      {Array.from({ length: STONES }, (_, i) => (
        <ellipse key={i} data-np={`stone-${i}`} rx={36} ry={9} fill="#9c8e76" />
      ))}
      {SIDES.map((side, i) => (
        <g key={i} data-np={`side-${i}`}>
          {SIDE_ART[side.kind](side.x > 0)}
        </g>
      ))}
    </>
  )
}

/** Streams the village toward the camera: every stone and roadside piece where it is once he has run `travel`. */
export function streamVillage(root: Element, travel: number): void {
  for (let i = 0; i < STONES; i++) {
    const z = ahead((i * SPAN) / STONES, travel * 1.0)
    const at = along(z, (i % 2 ? -1 : 1) * 60, ROAD)
    placeTo(root.querySelector(`[data-np="stone-${i}"]`), at.x, at.y, at.s)
  }
  SIDES.forEach((side, i) => {
    const z = ahead(side.z, travel)
    const at = along(z, side.x, ROAD)
    const node = root.querySelector(`[data-np="side-${i}"]`)
    placeTo(node, at.x, at.y, at.s)
    // fade in out of the haze far off, and out as it passes the camera
    fadeTo(node, Math.max(0, Math.min(1, (SPAN - 40 - z) / 160, (z + 40) / 60)))
  })
}
