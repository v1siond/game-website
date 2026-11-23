import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, GROUND, GrassGround, HeroRig, PillHills, Placed, Sky, rigOf, runFrame } from './kit'
import type { Level } from './level'
import { FinishGate, Firework, Ribbon } from './pieces'

// Contact: the end of the course at sunset. As the contact rises he runs at the finish gate and through
// it, the ribbon across it breaking and its two halves dropping to the posts, and he stops past it with a
// fist up as the fireworks go off over the gate. The whole run is done by the time the contact has risen
// and holds there.

const GATE_X = 700
const GATE_SCALE = BLOCK
const GATE_W = 64 * GATE_SCALE
const POST = 6 * GATE_SCALE
const RIBBON_Y = GROUND - 100
const RIBBON_HALF = (GATE_W - POST) / 2
// He breaks the ribbon at its middle.
const BREAK_X = GATE_X + POST + RIBBON_HALF
const STOP_X = 980
const BURSTS: ReadonlyArray<readonly [number, number, number]> = [
  [GATE_X + 20, 420, 0.4],
  [GATE_X + 230, 360, 0.44],
  [GATE_X + 120, 290, 0.48],
]

// His run through the gate on the scene's progress: in from the left, through the ribbon, slowing to a stop.
const RUN = { from: 200, to: STOP_X, by: 0.44 }

function runnerAt(p: number): { x: number; pose: string } {
  const u = ramp(p, 0, RUN.by)
  // Full speed to the gate, easing to a stop past it.
  const x = lerp(RUN.from, RUN.to, 1 - (1 - u) ** 2)
  if (u >= 1) return { x, pose: 'cheer' }
  return { x, pose: runFrame(x) }
}

export const goal: Level = {
  layers: ({ profession }) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-goal-sky" top={TRAIL.SUNSET_HIGH} low={TRAIL.SUNSET_LOW} />
          <Cloud x={180} y={140} scale={2} fill={TRAIL.SUNSET_LOW} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={820} fill={TRAIL.ROCK} edge={TRAIL.ROCK_DARK} />
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          {BURSTS.map(([x, y], i) => (
            <g key={x} data-fx={`burst-${i}`} opacity={0} transform={`translate(${x} ${y})`}>
              <g transform="scale(4)">
                <Firework />
              </g>
            </g>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <GrassGround />
        </Canvas>
      ),
    },
    {
      name: 'figure',
      node: (
        <Canvas>
          <Placed x={GATE_X} y={GROUND - 64 * GATE_SCALE} scale={GATE_SCALE}>
            <FinishGate />
          </Placed>
          <g data-fx="ribbon-left" transform={`translate(${GATE_X + POST} ${RIBBON_Y})`}>
            <g transform={`scale(${GATE_SCALE})`}>
              <Ribbon length={RIBBON_HALF / GATE_SCALE} />
            </g>
          </g>
          <g data-fx="ribbon-right" transform={`translate(${GATE_X + GATE_W} ${RIBBON_Y})`}>
            <g transform={`scale(${-GATE_SCALE} ${GATE_SCALE})`}>
              <Ribbon length={RIBBON_HALF / GATE_SCALE} />
            </g>
          </g>
          <HeroRig profession={profession} />
        </Canvas>
      ),
    },
    {
      name: 'fg',
      node: (
        <Canvas>
          <Bush x={20} fill={TRAIL.ROCK_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage) => {
    const hero = rigOf(stage, 'hero', 'stand')
    const ribbons = [fx(stage, 'ribbon-left'), fx(stage, 'ribbon-right')]
    const bursts = BURSTS.map(([x, y, at], i) => ({ x, y, at, node: fx(stage, `burst-${i}`) }))
    const broken = RUN.by * (1 - Math.sqrt(1 - (BREAK_X - RUN.from) / (RUN.to - RUN.from)))
    return (p) => {
      const { x, pose } = runnerAt(p)
      hero(x, GROUND, pose)
      // Each half of the ribbon swings down to hang from its post once he runs through.
      const drop = ramp(p, broken, broken + 0.06)
      transformTo(ribbons[0], `translate(${GATE_X + POST} ${RIBBON_Y}) rotate(${r1(80 * drop)})`)
      transformTo(ribbons[1], `translate(${GATE_X + GATE_W} ${RIBBON_Y}) rotate(${r1(-80 * drop)})`)
      bursts.forEach(({ x: bx, y: by, at, node }) => {
        const bloom = ramp(p, at, at + 0.06)
        transformTo(node, `translate(${bx} ${by}) scale(${r1(0.3 + bloom * 0.7)})`)
        fadeTo(node, bloom > 0 ? 1 - bloom * 0.3 : 0)
      })
    }
  },
}
