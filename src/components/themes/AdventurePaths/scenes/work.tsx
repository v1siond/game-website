import { ramp } from '@/lib/scroll/stage'
import { fx, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Canvas, Cloud, Sky } from './kit'
import type { Level } from './level'
import { Brick, LedgeFlag, Pennant } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// Work Experience: a sky level of brick shafts on the cloud floor, one per job in the order the section
// lists them. As each job is read he wall jumps up its shaft, kicking off one wall and then the other, and
// pulls up onto the ledge on top, where the ledge's flag goes up.

const BRICK = 3
const SIZE = 24 * BRICK
const CLOUD_TOP = 860
// The shaft: its back wall behind him and its front wall ahead, both bricks tall; the ledge tops the front.
const BACK_WALL = -50 - SIZE
const FRONT_WALL = 150
const TALL = 6
const LEDGE = TALL * SIZE
const LEDGE_BRICKS = 3
const FLAG_X = FRONT_WALL + LEDGE_BRICKS * SIZE - 36
// He clings to a wall with his side against it: half his width off its face.
const HALF = 48

function Column({ x, bricks }: { x: number; bricks: number }) {
  return (
    <>
      {Array.from({ length: bricks }, (_, j) => (
        <g key={j} transform={`translate(${x} ${-(j + 1) * SIZE}) scale(${BRICK})`}>
          <Brick />
        </g>
      ))}
    </>
  )
}

const course: Stops = {
  floor: CLOUD_TOP,
  back: (i) => (
    <>
      <Column x={BACK_WALL} bricks={TALL - 1} />
      <Column x={FRONT_WALL} bricks={TALL} />
      {Array.from({ length: LEDGE_BRICKS - 1 }, (_, j) => (
        <g key={j} transform={`translate(${FRONT_WALL + (j + 1) * SIZE} ${-LEDGE}) scale(${BRICK})`}>
          <Brick />
        </g>
      ))}
      <g transform={`translate(${FLAG_X} ${-LEDGE}) scale(${BRICK})`}>
        <LedgeFlag />
        <g data-fx={`pennant-${i}`} transform="translate(0 -8)">
          <Pennant />
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: 0.2, pose: 'jump', ahead: FRONT_WALL - HALF, lift: 140, arc: 40 },
    { at: 0.26, pose: 'grab', ahead: FRONT_WALL - HALF, lift: 130 },
    { at: 0.44, pose: 'jump', ahead: BACK_WALL + SIZE + HALF, lift: 280, arc: 40, left: true },
    { at: 0.5, pose: 'grab', ahead: BACK_WALL + SIZE + HALF, lift: 270, left: true },
    { at: 0.68, pose: 'jump', ahead: FRONT_WALL - HALF, lift: LEDGE - 30, arc: 40 },
    { at: 0.74, pose: 'grab', ahead: FRONT_WALL - HALF, lift: LEDGE - 40 },
    { at: 0.9, pose: 'jump', ahead: FRONT_WALL + SIZE, lift: LEDGE, arc: 50 },
    { at: 0.92, pose: 'stand', ahead: FRONT_WALL + SIZE, lift: LEDGE },
  ]),
  reply: (stage, { count }) => {
    const pennants = Array.from({ length: count }, (_, i) => fx(stage, `pennant-${i}`))
    // The flag runs up its pole once he stands on the ledge.
    return (played) => pennants.forEach((pennant, i) => translateTo(pennant, 0, -8 - 20 * ramp(played(i), 0.9, 1)))
  },
}

export const work: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-work-sky" top={TRAIL.SKY_HIGH} low={TRAIL.MINT} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <g data-fx="far-clouds">
            {[-100, 300, 700, 1100, 1500].map((x, i) => (
              <Cloud key={x} x={x} y={260 + (i % 2) * 120} scale={1.6} />
            ))}
          </g>
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <g data-fx="mid-clouds">
            {[0, 520, 1040, 1560].map((x) => (
              <Cloud key={x} x={x} y={600} scale={3.2} />
            ))}
          </g>
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx={-200 + i * 180} cy={CLOUD_TOP + 70} rx={150} ry={80} fill={TRAIL.CLOUD} stroke={TRAIL.CLOUD_SHADE} strokeWidth={6} />
          ))}
          <rect x={-200} y={CLOUD_TOP + 70} width={2000} height={200} fill={TRAIL.CLOUD} />
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
          <Cloud x={-140} y={860} scale={3} />
          <Cloud x={1380} y={900} scale={3} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => {
    const beats = stopsWriter(stage, input, course)
    const farClouds = fx(stage, 'far-clouds')
    const midClouds = fx(stage, 'mid-clouds')
    return (p, f) => {
      translateTo(farClouds, -p * 120, 0)
      translateTo(midClouds, -p * 260, 0)
      beats(p, f)
    }
  },
}
