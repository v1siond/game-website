import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, lerp, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, DomeHills, GROUND, GrassGround, HeroRig, PillHills, Sky, Stars, arc, cameraFor, courseAt, panOf, rigOf } from './kit'
import { beatOf, type Level } from './level'
import { Note, NoteBlock } from './pieces'

// The bands: a night stretch of note blocks (research images 11, 23), one per band in the order the
// section lists them. He drops onto the first block and bounces on it to a beat the scroll keeps, the
// block squashing under him and the notes flying up; as each band is read he bounces over to its block.

const SIZE = 24 * BLOCK
const TOP = GROUND - 240
const BOUNCE = 90
// How many bounces he makes over the whole scene.
const BEATS = 26
const NOTES = 3

const STARS: ReadonlyArray<readonly [number, number]> = [
  [140, 120],
  [420, 60],
  [700, 200],
  [960, 90],
  [1240, 170],
  [1480, 70],
]

/** Each band's note block along the course, its left edge. */
const blocksAt = (count: number): number[] => courseAt(count, 700, 320)

/** Which block he is over: the one he left until half way across, then the one he heads for. */
function overOf(xs: readonly number[], f: number): { x: number; on: number } {
  const { k, t } = beatOf(f, xs.length)
  if (k === 0) return { x: xs[0], on: 0 }
  const across = clamp01(t / 0.5)
  return { x: lerp(xs[k - 1], xs[k], across), on: across < 0.5 ? k - 1 : k }
}

export const bands: Level = {
  layers: ({ count, profession }) => [
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
            {blocksAt(count).map((x, i) => (
              <g key={x} transform={`translate(${x} ${TOP})`}>
                <g data-fx={`block-${i}`} transform={`scale(${BLOCK})`}>
                  <NoteBlock />
                </g>
              </g>
            ))}
            {Array.from({ length: NOTES }, (_, j) => (
              <g key={j} data-fx={`note-${j}`} opacity={0}>
                <g transform={`scale(${BLOCK})`}>
                  <Note />
                </g>
              </g>
            ))}
            <HeroRig profession={profession} />
          </g>
        </Canvas>
      ),
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
  bind: (stage, { count }) => {
    const xs = blocksAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const blocks = xs.map((_, i) => fx(stage, `block-${i}`))
    const notes = Array.from({ length: NOTES }, (_, j) => fx(stage, `note-${j}`))
    return (p, f) => {
      const drop = ramp(p, 0.04, 0.2)
      const over = overOf(xs, f)
      const x = over.x + SIZE / 2
      const lift = drop < 1 ? lerp(700, 0, drop * drop) : arc((p * BEATS) % 1, BOUNCE)
      // The block he is on squashes as his feet come down on it.
      const squash = drop < 1 ? 0 : 0.18 * clamp01(1 - lift / 24)
      blocks.forEach((block, i) => {
        const s = i === over.on ? 1 - squash : 1
        transformTo(block, `translate(0 ${((1 - s) * SIZE).toFixed(1)}) scale(${BLOCK} ${(BLOCK * s).toFixed(2)})`)
      })
      notes.forEach((note, j) => {
        const rise = ((p * BEATS) / 2 + j / NOTES) % 1
        translateTo(note, x + 40 + j * 30, TOP - 160 - rise * 260)
        fadeTo(note, drop < 1 ? 0 : Math.sin(Math.PI * rise))
      })
      pan(cameraFor(x))
      hero(x, TOP - lift, lift > 4 ? 'jump' : 'stand')
    }
  },
}
