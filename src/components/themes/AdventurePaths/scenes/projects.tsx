import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, r1, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, GrassGround, PillHills, Sky } from './kit'
import type { Level } from './level'
import { FilledBlock, OutlineBlock, SpringPad, SwitchFrame, SwitchPlate } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// Projects: the stretch of stone arches. For each project a spring pad waits on the path, a switch plate
// past it and a row of dotted outline blocks overhead; he bounds onto the spring, is launched high, flips
// at the top and ground pounds straight down onto the plate, the view pushing in on the landing, and the
// outline blocks fill with colour one after another.

const SWITCH_COLOURS = [TRAIL.GOLD, TRAIL.FOREST, TRAIL.ROUTE, TRAIL.BLUE] as const
const SIZE = 24 * BLOCK
const SPRING_X = 40
const SPRING_TALL = 12 * BLOCK
const PLATE_X = 220
const PLATE_TALL = 4 * BLOCK
const BLOCKS = 3
const BLOCKS_X = 110
const BLOCKS_Y = -640
// Where he lands on the spring, where he comes down on the plate, how high the spring throws him.
const ON_SPRING = SPRING_X + SIZE / 2
const ON_PLATE = PLATE_X + (28 * BLOCK) / 2
const PEAK = 380
// The shares of his move: on the spring, at the top, the pound's landing.
const BOUND = 0.12
const TOP = 0.5
const POUND = 0.68

const course: Stops = {
  back: (i) => (
    <>
      {Array.from({ length: BLOCKS }, (_, j) => (
        <g key={j} transform={`translate(${BLOCKS_X + j * SIZE} ${BLOCKS_Y}) scale(${BLOCK})`}>
          <OutlineBlock />
          <g data-fx={`fill-${i}-${j}`} opacity={0}>
            <FilledBlock fill={SWITCH_COLOURS[(i + j) % SWITCH_COLOURS.length]} />
          </g>
        </g>
      ))}
      <g transform={`translate(${SPRING_X} ${-SPRING_TALL})`}>
        <g data-fx={`spring-${i}`}>
          <g transform={`scale(${BLOCK})`}>
            <SpringPad />
          </g>
        </g>
      </g>
      <g transform={`translate(${PLATE_X} ${-PLATE_TALL}) scale(${BLOCK})`}>
        <SwitchFrame />
        <g data-fx={`plate-${i}`}>
          <SwitchPlate />
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: BOUND, pose: 'jump', ahead: ON_SPRING, lift: SPRING_TALL, arc: 40 },
    { at: BOUND + 0.06, pose: 'stomp', ahead: ON_SPRING, lift: SPRING_TALL / 2 },
    { at: TOP, pose: 'jump', ahead: ON_PLATE - 60, lift: PEAK },
    { at: TOP + 0.08, pose: 'stomp', ahead: ON_PLATE, lift: PEAK + 20, spin: 360 },
    { at: POUND, pose: 'stomp', ahead: ON_PLATE, lift: PLATE_TALL, spin: 360 },
    { at: POUND + 0.04, pose: 'stomp', ahead: ON_PLATE, lift: PLATE_TALL / 2, spin: 360 },
    { at: POUND + 0.08, pose: 'stand', ahead: ON_PLATE, lift: PLATE_TALL / 2, spin: 360 },
  ]),
  push: (t) => clamp01(1 - Math.abs(t - POUND - 0.02) / 0.1),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({
      spring: fx(stage, `spring-${i}`),
      plate: fx(stage, `plate-${i}`),
      fills: Array.from({ length: BLOCKS }, (_, j) => fx(stage, `fill-${i}-${j}`)),
    }))
    return (played) =>
      stops.forEach(({ spring, plate, fills }, i) => {
        const t = played(i)
        // The coil squashes to half under his landing and springs back as it throws him.
        const squash = 1 - 0.5 * (ramp(t, BOUND, BOUND + 0.06) - ramp(t, BOUND + 0.06, BOUND + 0.12))
        transformTo(spring, `translate(0 ${r1((1 - squash) * SPRING_TALL)}) scale(1 ${squash.toFixed(2)})`)
        transformTo(plate, `translate(0 ${(2 * ramp(t, POUND, POUND + 0.04)).toFixed(2)})`)
        fills.forEach((fill, j) => fadeTo(fill, ramp(t, POUND + 0.06 + j * 0.08, POUND + 0.12 + j * 0.08)))
      })
  },
}

export const projects: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-projects-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
          <Cloud x={200} y={100} scale={2.2} />
          <Cloud x={1180} y={160} scale={2} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={820} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          {[160, 700, 1260].map((x) => (
            <g key={x} transform={`translate(${x} 640)`}>
              <rect width={180} height={240} rx={18} fill={TRAIL.STONE} stroke={TRAIL.STONE_DARK} strokeWidth={6} />
              <rect x={60} y={150} width={60} height={90} rx={30} fill={TRAIL.STONE_DARK} />
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
      node: <StopsFigure stops={course} input={input} />,
    },
    {
      name: 'fg',
      node: (
        <Canvas>
          <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => stopsWriter(stage, input, course),
}
