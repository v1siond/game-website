import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, DomeHills, GrassGround, HERO_TALL, PillHills, Sky, Stars } from './kit'
import type { Level } from './level'
import { DrumPad, Note } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Move, type Stops } from './stops'

// The bands: a night stretch, one band a stop in the order the section lists them. At each a pit cuts the
// path with a rope hanging over it and a drum past it; he leaps for the rope, swings out across the pit,
// lets go and comes down on the drum's head, which booms, the notes flying up off it.

const PIT = { x: 30, width: 220 }
const ANCHOR = { x: 140, y: -560 }
const ROPE = 300
const SWING = 35
// His hands hold the rope a little ahead of his middle.
const HANDS = 18
const DRUM_X = 280
const DRUM_TALL = 18 * BLOCK - 8
const ON_DRUM = DRUM_X + (24 * BLOCK) / 2
const NOTES = 3
// The shares of his move: the grab, the let go, the landing, the boom's bounce done.
const GRAB = 0.25
const LET_GO = 0.6
const LAND = 0.75
const BOOMED = 0.95

const STARS: ReadonlyArray<readonly [number, number]> = [
  [140, 120],
  [420, 60],
  [700, 200],
  [960, 90],
  [1240, 170],
  [1480, 70],
]

/** The rope's swing, in degrees off straight down, at t of his move: still until he grabs it, out with him,
 *  then easing back once he lets go. */
const swingAt = (t: number): number => (t < LET_GO ? SWING * ramp(t, GRAB, LET_GO) : SWING * (1 - ramp(t, LET_GO, 1)) ** 2)

/** Where he hangs from the rope at swing `a` degrees. */
function hangAt(a: number): Move {
  const rad = (a * Math.PI) / 180
  return { pose: 'grab', ahead: ANCHOR.x + ROPE * Math.sin(rad) - HANDS, lift: -ANCHOR.y - ROPE * Math.cos(rad) - HERO_TALL }
}

const GRABBED = hangAt(0)
const LET_GO_AT = hangAt(SWING)

const leap = keyed([
  { at: 0, pose: 'stand', ahead: 0, lift: 0 },
  { at: 0.12, pose: 'runA', ahead: 30, lift: 0 },
  { at: GRAB, pose: 'jump', ahead: GRABBED.ahead ?? 0, lift: GRABBED.lift ?? 0, arc: 40 },
])

const land = keyed([
  { at: LET_GO, pose: 'jump', ahead: LET_GO_AT.ahead ?? 0, lift: LET_GO_AT.lift ?? 0 },
  { at: LAND, pose: 'jump', ahead: ON_DRUM, lift: DRUM_TALL, arc: 60 },
  { at: LAND + 0.05, pose: 'stomp', ahead: ON_DRUM, lift: DRUM_TALL - 8 },
  { at: BOOMED, pose: 'jump', ahead: ON_DRUM, lift: DRUM_TALL, arc: 80 },
  { at: BOOMED + 0.01, pose: 'stand', ahead: ON_DRUM, lift: DRUM_TALL },
])

const course: Stops = {
  back: (i) => (
    <>
      <rect x={PIT.x} y={0} width={PIT.width} height={140} fill={TRAIL.HUD} />
      <rect x={ANCHOR.x - 30} y={ANCHOR.y - 12} width={60} height={12} rx={4} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={3} />
      <g data-fx={`rope-${i}`} transform={`translate(${ANCHOR.x} ${ANCHOR.y})`}>
        <path d={`M0 0 V${ROPE}`} stroke={TRAIL.WOOD_LIGHT} strokeWidth={6} />
      </g>
      <g transform={`translate(${DRUM_X} ${-18 * BLOCK})`}>
        <g data-fx={`drum-${i}`}>
          <g transform={`scale(${BLOCK})`}>
            <DrumPad />
          </g>
        </g>
      </g>
      <g data-fx={`boom-${i}`} opacity={0}>
        {[0, 1].map((k) => (
          <ellipse key={k} data-fx={`ring-${i}-${k}`} cx={ON_DRUM} cy={-DRUM_TALL} rx={60} ry={18} fill="none" stroke={TRAIL.LANTERN} strokeWidth={5} />
        ))}
      </g>
      {Array.from({ length: NOTES }, (_, j) => (
        <g key={j} data-fx={`note-${i}-${j}`} opacity={0}>
          <g transform={`scale(${BLOCK})`}>
            <Note />
          </g>
        </g>
      ))}
    </>
  ),
  move: (t) => (t < GRAB ? leap(t) : t < LET_GO ? hangAt(swingAt(t)) : land(t)),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({
      rope: fx(stage, `rope-${i}`),
      drum: fx(stage, `drum-${i}`),
      boom: fx(stage, `boom-${i}`),
      rings: [0, 1].map((k) => fx(stage, `ring-${i}-${k}`)),
      notes: Array.from({ length: NOTES }, (_, j) => fx(stage, `note-${i}-${j}`)),
    }))
    return (played) =>
      stops.forEach(({ rope, drum, boom, rings, notes }, i) => {
        const t = played(i)
        transformTo(rope, `translate(${ANCHOR.x} ${ANCHOR.y}) rotate(${r1(-swingAt(t))})`)
        // The drum's head gives under him and the boom goes out in two rings.
        const give = hop(ramp(t, LAND, LAND + 0.1), 1)
        transformTo(drum, `translate(0 ${r1(give * 10)}) scale(1 ${(1 - give * 0.14).toFixed(3)})`)
        const boomed = ramp(t, LAND, LAND + 0.25)
        fadeTo(boom, boomed > 0 && boomed < 1 ? 1 : 0)
        rings.forEach((ring, k) => {
          const grow = 1 + 2.4 * ramp(boomed, k * 0.3, 1)
          transformTo(ring, `translate(${r1(ON_DRUM * (1 - grow))} ${r1(-DRUM_TALL * (1 - grow))}) scale(${grow.toFixed(3)})`)
        })
        notes.forEach((note, j) => {
          const rise = ramp(t, LAND + j * 0.05, LAND + 0.2 + j * 0.05)
          translateTo(note, ON_DRUM - 70 + j * 60, lerp(-DRUM_TALL - 40, -DRUM_TALL - 240 - (j % 2) * 60, rise))
          fadeTo(note, rise > 0 ? 1 : 0)
        })
      })
  },
}

export const bands: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-bands-sky" top={TRAIL.NIGHT_SKY} low={TRAIL.NIGHT_SKY_LOW} />
          <Stars at={STARS} />
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
          <Bush x={1520} fill={TRAIL.NIGHT_HILL_NEAR} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => stopsWriter(stage, input, course),
}
