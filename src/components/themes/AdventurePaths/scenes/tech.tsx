import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, DomeHills, FoeRig, GROUND, GrassGround, HeroRig, PillHills, Placed, Sky, Stars, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import type { Level } from './level'
import { Brick } from './pieces'

// The tech stack: a night stretch with a turtle shell on the ground (research images 13, 22, 25). He runs
// up and kicks the shell, and as each category is read the shell slides on along the ground and breaks
// its brick, the pieces flying, the way a kicked shell clears a row of bricks; he runs on after it.

const SIZE = 24 * BLOCK
const KICK_X = 600
const SHELL_X = KICK_X + 90
// The share of the first card's beat he spends running up and kicking before the shell slides.
const KICK = 0.3

/** The left edge of each category's brick along the course. */
const bricksAt = (count: number): number[] => courseAt(count, 1000, 320)

// The four pieces a brick breaks into: how far each flies across and up, and how far it spins.
const PIECES: ReadonlyArray<readonly [number, number, number]> = [
  [-90, -220, -200],
  [90, -240, 220],
  [-60, -120, -140],
  [70, -100, 160],
]

const STARS: ReadonlyArray<readonly [number, number]> = [
  [120, 90],
  [340, 210],
  [520, 60],
  [760, 160],
  [980, 80],
  [1180, 220],
  [1390, 110],
  [1520, 260],
  [640, 300],
  [260, 340],
]

/** How far the shell has slid: 0 at his kick, i + 1 once it has broken brick i. */
const slideOf = (f: number, count: number): number => clamp01((f - KICK) / (count - KICK)) * count

/** The shell's x for its slide: from his kick to each brick's left edge in turn. */
function shellAt(xs: readonly number[], slide: number): number {
  const k = Math.min(xs.length - 1, Math.floor(slide))
  const from = k === 0 ? SHELL_X : xs[k - 1]
  return lerp(from, xs[k] - 60, Math.min(1, slide - k))
}

/** Where he is: running in, kicking the shell, then running after it, a little behind. */
function heroOf(p: number, f: number, shellX: number, sliding: boolean): { x: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(KICK_X - 600, KICK_X - 120, entry)
    return { x, pose: runFrame(x) }
  }
  const run = clamp01(f / (KICK * 0.6))
  if (run < 1) {
    const x = lerp(KICK_X - 120, KICK_X, run)
    return { x, pose: f === 0 ? 'stand' : runFrame(x) }
  }
  if (f < KICK) return { x: KICK_X, pose: 'kick' }
  const x = Math.max(KICK_X, shellX - 300)
  return { x, pose: sliding && x > KICK_X ? runFrame(x) : 'stand' }
}

export const tech: Level = {
  layers: ({ count, profession }) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-tech-sky" top={TRAIL.NIGHT_SKY} low={TRAIL.NIGHT_SKY_LOW} />
          <Stars at={STARS} />
          <circle cx={1280} cy={170} r={70} fill={TRAIL.LANTERN} />
          <circle cx={1306} cy={150} r={62} fill={TRAIL.NIGHT_SKY} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={800} fill={TRAIL.NIGHT_HILL} edge={TRAIL.NIGHT_HILL_NEAR} />
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <DomeHills base={880} fill={TRAIL.NIGHT_HILL_NEAR} edge={TRAIL.NIGHT_SKY} eye={TRAIL.NIGHT_SKY} />
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <GrassGround shade={TRAIL.NIGHT_SKY} />
        </Canvas>
      ),
    },
    {
      name: 'figure',
      node: (
        <Canvas>
          <g data-fx="course">
            {bricksAt(count).map((x, i) => (
              <g key={x}>
                <Placed x={x} y={GROUND - SIZE} name={`brick-${i}`}>
                  <Brick />
                </Placed>
                {PIECES.map((_, j) => (
                  <g key={j} data-fx={`piece-${i}-${j}`} opacity={0}>
                    <g transform={`scale(${BLOCK / 2})`}>
                      <Brick />
                    </g>
                  </g>
                ))}
              </g>
            ))}
            <g data-fx="shell" transform={`translate(${SHELL_X} ${GROUND})`}>
              <FoeRig name="shell-face" kinds={['shell']} />
            </g>
            <HeroRig profession={profession} />
          </g>
        </Canvas>
      ),
    },
    {
      name: 'fg',
      node: (
        <Canvas>
          <Bush x={20} fill={TRAIL.NIGHT_HILL_NEAR} />
          <Bush x={1540} fill={TRAIL.NIGHT_HILL_NEAR} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, { count }) => {
    const xs = bricksAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const shell = fx(stage, 'shell')
    const bricks = xs.map((x, i) => ({ x, brick: fx(stage, `brick-${i}`), pieces: PIECES.map((_, j) => fx(stage, `piece-${i}-${j}`)) }))
    return (p, f) => {
      const slide = slideOf(f, count)
      const shellX = shellAt(xs, slide)
      translateTo(shell, shellX, GROUND)
      bricks.forEach(({ x, brick, pieces }, i) => {
        fadeTo(brick, slide - i - 1 >= -0.02 ? 0 : 1)
        const fly = clamp01((slide - i - 0.98) / 0.6)
        pieces.forEach((piece, j) => {
          const [dx, dy, spin] = PIECES[j]
          const px = x + SIZE / 4 + dx * fly
          const py = GROUND - SIZE + dy * fly + 900 * fly * fly
          transformTo(piece, `translate(${r1(px)} ${r1(py)}) rotate(${r1(spin * fly)})`)
          fadeTo(piece, fly > 0 && fly < 1 ? 1 : 0)
        })
      })
      const { x, pose } = heroOf(p, f, shellX, slide % 1 > 0)
      pan(cameraFor(x + 150))
      hero(x, GROUND, pose)
    }
  },
}
