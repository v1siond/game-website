import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Canvas, GROUND, Placed, TileGround } from './kit'
import type { Level } from './level'
import { CaveBrick, Hatch, ItemBox, Ladder, OpenBox, PowerUp } from './pieces'
import { SPACING, StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// The ventures: the underground room, black with teal bricks, which he has come down into by the ladder
// through the hatch in its ceiling. For each venture a wall of bricks hangs from the ceiling with a low gap
// under it and an item box past it; he runs at it, drops into a slide under the gap, comes up at the box
// and it opens on the power-up inside, which floats up out of it.

const SIZE = 24 * BLOCK
const CEILING = 40
// The hanging wall, its foot this high over the floor, and the box past it.
const WALL_X = 20
const GAP = 110
const BOX_X = 270
const UP_X = BOX_X + SIZE / 2
const UP_TOP = -SIZE - 200
// The shares of his move: into the slide, out of it.
const SLIDE = [0.2, 0.55] as const
const OPEN = 0.62

const course: Stops = {
  tiled: true,
  back: (i) => (
    <>
      {i === 0 && (
        <g transform={`translate(${-SPACING - 28} ${CEILING - GROUND})`}>
          <g transform={`scale(${BLOCK})`}>
            <Hatch />
            <Ladder rungs={26} />
          </g>
        </g>
      )}
      {Array.from({ length: Math.ceil((GROUND - CEILING - GAP) / SIZE) }, (_, j) =>
        [0, 1].map((k) => (
          <g key={`${j}-${k}`} transform={`translate(${WALL_X + k * SIZE} ${-GAP - (j + 1) * SIZE}) scale(${BLOCK})`}>
            <CaveBrick />
          </g>
        )),
      )}
      <g data-fx={`up-${i}`} transform={`translate(${UP_X} ${-SIZE})`} opacity={0}>
        <circle r={60} fill={TRAIL.RUNE} opacity={0.2} />
        <g transform={`scale(${BLOCK})`}>
          <PowerUp />
        </g>
      </g>
      <g data-fx={`box-${i}`} transform={`translate(${BOX_X} ${-SIZE})`}>
        <g transform={`scale(${BLOCK})`}>
          <g data-frame="closed" visibility="visible">
            <ItemBox />
          </g>
          <g data-frame="open" visibility="hidden">
            <OpenBox />
          </g>
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: 0.1, pose: 'runA', ahead: 0, lift: 0 },
    { at: SLIDE[0] - 0.05, pose: 'runB', ahead: 30, lift: 0 },
    { at: SLIDE[0], pose: 'kick', ahead: 50, lift: -28, spin: -80 },
    { at: SLIDE[1], pose: 'kick', ahead: BOX_X - 90, lift: -28, spin: -80 },
    { at: SLIDE[1] + 0.05, pose: 'stand', ahead: BOX_X - 70, lift: 0 },
  ]),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({ up: fx(stage, `up-${i}`), box: frames(fx(stage, `box-${i}`), 'closed') }))
    return (played) =>
      stops.forEach(({ up, box }, i) => {
        const t = played(i)
        box(t >= OPEN ? 'open' : 'closed')
        const rise = ramp(t, OPEN, OPEN + 0.25)
        translateTo(up, UP_X, lerp(-SIZE, UP_TOP, rise))
        fadeTo(up, rise > 0 ? 1 : 0)
      })
  },
}

export const ventures: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <rect x={-200} y={0} width={2000} height={1000} fill={TRAIL.CAVE} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          {Array.from({ length: 6 }, (_, row) => (
            <g key={row} opacity={0.35}>
              {Array.from({ length: 20 }, (_, i) => (
                <rect key={i} x={-200 + i * 100 + (row % 2) * 50} y={120 + row * 100} width={96} height={46} fill={TRAIL.CAVE_BRICK_DARK} />
              ))}
            </g>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          {[100, 1300].flatMap((x) =>
            [1, 2, 3, 4].map((i) => (
              <Placed key={`${x}-${i}`} x={x} y={GROUND - i * 24 * BLOCK}>
                <CaveBrick />
              </Placed>
            )),
          )}
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <TileGround>
            <CaveBrick />
          </TileGround>
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
          <rect x={-200} y={0} width={2000} height={40} fill={TRAIL.CAVE_BRICK_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => stopsWriter(stage, input, course),
}
