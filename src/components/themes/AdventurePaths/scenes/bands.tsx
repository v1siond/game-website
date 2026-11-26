import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Cloud, GROUND, Sky, Stars, rigOf } from './kit'
import { levelLayers } from './frame'
import { MAP_MS, clearOf, phase, reach, startX, type Level, type LevelInput } from './level'
import { DrumPad, FilledBlock, Note } from './pieces'
import { mapWriter } from './worldMap'

// The Musician's bonus level, at night: from the map he walks onto its spot. He bounces along a row of note
// blocks, each dipping under him and sending a note up; on the big one at the end he spin jumps and it
// launches him up to a cloud stage, where he lands at a drum and plays a fill, the notes flying.

const SIZE = 24 * BLOCK
// The note blocks: how many, how far past his start the row starts; the big one at its end.
const BLOCKS = 3
const ROW = -60
const BIG = 3
// The cloud stage high over the row, and the drum on it.
const STAGE_Y = GROUND - 470

const STARS: ReadonlyArray<readonly [number, number]> = [
  [90, 80],
  [300, 160],
  [520, 60],
  [760, 130],
  [980, 50],
  [1180, 170],
  [1400, 90],
  [1520, 220],
]

function NoteBlock({ i, x, big = false }: { i: number; x: number; big?: boolean }) {
  const k = big ? 1.4 : 1
  return (
    <g data-fx={`note-block-${i}`} transform={`translate(${x} ${GROUND - SIZE * k})`}>
      <g transform={`scale(${BLOCK * k})`}>
        <FilledBlock fill={big ? TRAIL.ROUTE_LIGHT : TRAIL.PAGE} />
        <g transform="translate(6 5)">
          <Note />
        </g>
      </g>
    </g>
  )
}

/** The drum on the stage, past the row of note blocks, and where he lands to play it. */
const drumAt = (input: LevelInput): number => startX(input) + reach(input, 260) + 40
const drumOf = (input: LevelInput): number => drumAt(input) - 60

export const bands: Level = {
  script: [MAP_MS, 1600, 1900],
  end: drumOf,
  layers: (input) => {
    const x = startX(input)
    const step = reach(input, 130)
    return levelLayers(
      {
        sky: (
          <>
            <Sky id="ap-bands-sky" top={TRAIL.NIGHT_SKY} low={TRAIL.NIGHT_SKY_LOW} />
            <Stars at={STARS} />
          </>
        ),
        near: <rect x={-200} y={GROUND} width={2000} height={200} fill={TRAIL.NIGHT_HILL_NEAR} />,
        things: (
          <>
            {Array.from({ length: BLOCKS }, (_, i) => (
              <NoteBlock key={i} i={i} x={x + ROW + i * step} />
            ))}
            <NoteBlock i={BIG} x={x + ROW + BLOCKS * step + 20} big />
            <g transform={`translate(${x + reach(input, 260)} ${STAGE_Y})`}>
              <Cloud x={-160} y={-10} scale={3.4} fill={TRAIL.NIGHT_CLOUD} />
              <g transform={`translate(70 ${-18 * BLOCK * 1.4}) scale(${BLOCK * 1.4})`}>
                <DrumPad />
              </g>
            </g>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} data-fx={`note-${i}`} opacity={0}>
                <g transform={`scale(${BLOCK})`}>
                  <Note />
                </g>
              </g>
            ))}
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const x0 = startX(input)
    const step = reach(input, 130)
    const blocks = Array.from({ length: BLOCKS + 1 }, (_, i) => fx(stage, `note-block-${i}`))
    const notes = [0, 1, 2, 3].map((i) => fx(stage, `note-${i}`))
    const blockX = (i: number) => x0 + ROW + i * step + (i === BIG ? 20 : 0)
    const topOf = (i: number) => GROUND - SIZE * (i === BIG ? 1.4 : 1)
    const middle = (i: number) => blockX(i) + (SIZE * (i === BIG ? 1.4 : 1)) / 2
    const drumX = drumAt(input)
    const start = clearOf(input, x0 - reach(input, 120))
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      const bouncing = phase(play, 1)
      const launching = phase(play, 2)
      // he lands on block i at bouncing (i + 1) / (BLOCKS + 1); each dips and sends its note up
      const on = Math.min(BLOCKS, Math.floor(bouncing * (BLOCKS + 1)))
      const u = bouncing * (BLOCKS + 1) - on
      blocks.forEach((block, i) => {
        const struck = i < BLOCKS ? ramp(bouncing, (i + 1) / (BLOCKS + 1), (i + 1.4) / (BLOCKS + 1)) : ramp(launching, 0, 0.2)
        translateTo(block, blockX(i), topOf(i) + 16 * Math.sin(Math.PI * struck))
      })
      notes.forEach((note, i) => {
        const rise = i < BLOCKS ? ramp(bouncing, (i + 1) / (BLOCKS + 1), (i + 2) / (BLOCKS + 1)) : ramp(launching, 0.6, 1)
        const nx = i < BLOCKS ? middle(i) : drumX + 40
        translateTo(note, nx - 20, (i < BLOCKS ? topOf(i) : STAGE_Y - 220) - 40 - 160 * rise)
        fadeTo(note, rise > 0 && rise < 1 ? 1 : 0)
      })
      if (launching > 0) {
        const fly = ramp(launching, 0, 0.5)
        const x = lerp(middle(BIG), drumOf(input), fly)
        const y = lerp(topOf(BIG), STAGE_Y - 20, fly) - hop(fly, 260)
        const beat = Math.floor(ramp(launching, 0.55, 1) * 8) % 2 === 0
        hero(x, y, fly < 1 ? 'jump' : launching >= 1 ? 'cheer' : beat ? 'stomp' : 'stand', false, fly < 1 ? fly * 720 : 0)
        return
      }
      // from his start onto the first block, then block to block
      const from = on === 0 ? start : middle(on - 1)
      const fromY = on === 0 ? GROUND : topOf(on - 1)
      const x = lerp(from, middle(on), u)
      const y = lerp(fromY, topOf(on), u) - hop(u, 150)
      hero(bouncing <= 0 ? start : x, bouncing <= 0 ? GROUND : y, bouncing <= 0 ? 'stand' : 'jump')
    }
  },
}
