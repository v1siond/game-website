import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, CRITTER_FRAMES, Canvas, DomeHills, FoeRig, GrassGround, PillHills, Sky, Stars } from './kit'
import type { Level } from './level'
import { Brick, Crate } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// The tech stack: a night stretch. For each category a crate waits on the ground with a critter and a
// stack of bricks past it; he lifts the crate over his head and throws it, and it knocks the critter over
// on its back and bursts the bricks, the pieces flying.

const SIZE = 24 * BLOCK
const CRITTER_X = 200
const BRICKS_X = 300
// The crate's top left: on the ground in front of him, held over his head, then flung.
const CRATE = { ground: [50, -SIZE], held: [-21, -150 - SIZE], critter: [CRITTER_X - SIZE, -54 - SIZE], bricks: [BRICKS_X - SIZE + 20, -2 * SIZE + 20], rest: [BRICKS_X - SIZE - 30, -SIZE] } as const
// The shares of his move: the lift, the throw, the critter hit, the bricks hit, the crate down.
const LIFT = [0.12, 0.28] as const
const THROW = 0.42
const KNOCK = 0.6
const BURST = 0.72
const DOWN = 0.86

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

/** The crate's top left at t of his move. */
function crateAt(t: number): readonly [number, number, number] {
  const along = (from: readonly number[], to: readonly number[], u: number, arc = 0): readonly [number, number, number] => [lerp(from[0], to[0], u), lerp(from[1], to[1], u) - hop(u, arc), 0]
  if (t < LIFT[0]) return [...CRATE.ground, 0]
  if (t < THROW) return along(CRATE.ground, CRATE.held, ramp(t, LIFT[0], LIFT[1]))
  if (t < KNOCK) return along(CRATE.held, CRATE.critter, ramp(t, THROW, KNOCK), 90)
  if (t < BURST) return along(CRATE.critter, CRATE.bricks, ramp(t, KNOCK, BURST), 30)
  const down = ramp(t, BURST, DOWN)
  return [lerp(CRATE.bricks[0], CRATE.rest[0], down), lerp(CRATE.bricks[1], CRATE.rest[1], down * down), 14 * down]
}

const course: Stops = {
  back: (i) => (
    <>
      {[0, 1].map((j) => (
        <g key={j}>
          <g data-fx={`brick-${i}-${j}`} transform={`translate(${BRICKS_X} ${-(j + 1) * SIZE}) scale(${BLOCK})`}>
            <Brick />
          </g>
          {PIECES.map((_, k) => (
            <g key={k} data-fx={`piece-${i}-${j}-${k}`} opacity={0}>
              <g transform={`scale(${BLOCK / 2})`}>
                <Brick />
              </g>
            </g>
          ))}
        </g>
      ))}
      <g data-fx={`critter-at-${i}`} transform={`translate(${CRITTER_X} 0)`}>
        <g transform="scale(-1 1)">
          <FoeRig name={`critter-${i}`} kinds={CRITTER_FRAMES} />
        </g>
      </g>
    </>
  ),
  front: (i) => (
    <g data-fx={`crate-${i}`} transform={`translate(${CRATE.ground[0]} ${CRATE.ground[1]})`}>
      <g transform={`scale(${BLOCK})`}>
        <Crate />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: LIFT[0], pose: 'stand', ahead: 0, lift: 0 },
    { at: THROW, pose: 'carry', ahead: 0, lift: 0 },
    { at: BURST, pose: 'throw', ahead: 20, lift: 0 },
    { at: BURST + 0.02, pose: 'stand', ahead: 20, lift: 0 },
  ]),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({
      crate: fx(stage, `crate-${i}`),
      critter: fx(stage, `critter-at-${i}`),
      critterFace: frames(fx(stage, `critter-${i}`), 'critterA'),
      bricks: [0, 1].map((j) => ({ brick: fx(stage, `brick-${i}-${j}`), pieces: PIECES.map((_, k) => fx(stage, `piece-${i}-${j}-${k}`)) })),
    }))
    return (played) =>
      stops.forEach(({ crate, critter, critterFace, bricks }, i) => {
        const t = played(i)
        const [cx, cy, tilt] = crateAt(t)
        transformTo(crate, `translate(${r1(cx)} ${r1(cy)}) rotate(${r1(tilt)} ${SIZE / 2} ${SIZE / 2})`)
        const knock = ramp(t, KNOCK, KNOCK + 0.14)
        translateTo(critter, CRITTER_X + 60 * knock, -hop(knock, 70))
        critterFace(knock > 0 ? 'critterTipped' : 'critterA')
        const fly = ramp(t, BURST, BURST + 0.26)
        bricks.forEach(({ brick, pieces }, j) => {
          fadeTo(brick, t >= BURST ? 0 : 1)
          pieces.forEach((piece, k) => {
            const [dx, dy, spin] = PIECES[k]
            const px = BRICKS_X + SIZE / 4 + dx * fly
            const py = -(j + 1) * SIZE + dy * fly + 900 * fly * fly
            transformTo(piece, `translate(${r1(px)} ${r1(py)}) rotate(${r1(spin * fly)})`)
            fadeTo(piece, fly > 0 && fly < 1 ? 1 : 0)
          })
        })
      })
  },
}

export const tech: Level = {
  layers: (input) => [
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
          <DomeHills base={880} fill={TRAIL.NIGHT_HILL_NEAR} edge={TRAIL.NIGHT_SKY} />
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
      node: <StopsFigure stops={course} input={input} />,
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
  bind: (stage, input) => stopsWriter(stage, input, course),
}
