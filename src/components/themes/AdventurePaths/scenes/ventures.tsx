import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Canvas, GROUND, HeroRig, Placed, TileGround, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { CaveBrick, Coin, Pipe } from './pieces'

// The ventures: the underground room under the pipe (research images 10, 14, 24), black with teal
// bricks. He drops out of the pipe in the ceiling and lands; as each venture is read he runs on and jumps
// through its coin, which flicks up and is gone.

const START = 560
const PIPE_H = 60
const COIN_Y = GROUND - 250
const COIN_W = 10 * BLOCK

/** Each venture's coin along the course, its left edge. */
const coinsAt = (count: number): number[] => courseAt(count, 860, 300)

function heroOf(xs: readonly number[], p: number, f: number): { x: number; y: number; pose: string } {
  const drop = ramp(p, 0.04, 0.2)
  if (drop < 1) return { x: START, y: lerp(PIPE_H * BLOCK - 40, GROUND, drop * drop), pose: 'jump' }
  const { k, t } = beatOf(f, xs.length)
  const from = k === 0 ? START : xs[k - 1] + COIN_W / 2
  const x = lerp(from, xs[k] + COIN_W / 2, t)
  if (t > 0.5 && t < 0.9) return { x, y: GROUND - arc((t - 0.5) / 0.4, 160), pose: 'jump' }
  return { x, y: GROUND, pose: t > 0 && t < 1 ? runFrame(x) : 'stand' }
}

export const ventures: Level = {
  layers: ({ count, profession }) => [
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
      node: (
        <Canvas>
          <g data-fx="course">
            {coinsAt(count).map((x, i) => (
              <Placed key={x} x={x} y={COIN_Y} name={`coin-${i}`}>
                <Coin />
              </Placed>
            ))}
            <HeroRig profession={profession} />
            <g transform={`translate(${START} 0) scale(${BLOCK} ${-BLOCK}) translate(-20 ${-PIPE_H})`}>
              <Pipe height={PIPE_H} />
            </g>
          </g>
        </Canvas>
      ),
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
  bind: (stage, { count }) => {
    const xs = coinsAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage, true)
    const coins = xs.map((_, i) => fx(stage, `coin-${i}`))
    return (p, f) => {
      coins.forEach((coin, i) => {
        const flick = clamp01((f - i - 0.7) / 0.25)
        translateTo(coin, xs[i], COIN_Y - flick * 160)
        fadeTo(coin, 1 - flick)
      })
      const { x, y, pose } = heroOf(xs, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
