import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, DomeHills, GROUND, GrassGround, PillHills, Sky, critterStep, rigOf, runFrame } from './kit'
import { Foe, foeOf, levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level, type LevelInput } from './level'
import { mapWriter } from './worldMap'

// The Martial Artist's level, a field of charging foes: from the map he walks onto its spot. A charger in
// a helmet runs at him and his flying knee sends it into a brick wall, off which it drops on its back;
// then he runs up to the wall and breaks it with a kick, each brick flying apart in four pieces.

const SIZE = 24 * BLOCK
// The wall: how far past his start, three bricks tall; each brick breaks into its four quarters.
const WALL = 330

/** Where he ends: the kick at the wall's foot. */
const kickOf = (input: LevelInput): number => startX(input) + reach(input, WALL) - 60
const BRICKS = 3
const QUARTER = SIZE / 2

function Helmet() {
  return (
    <g transform="translate(0 -56)">
      <path d="M-30 6 Q0 -30 30 6 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={3} />
      <rect x={-6} y={-22} width={12} height={8} fill={TRAIL.PAGE} />
    </g>
  )
}

/** The wall, every brick drawn as its four quarters so the kick can scatter them. */
function Wall({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${GROUND - BRICKS * SIZE})`}>
      {Array.from({ length: BRICKS }, (_, b) =>
        [0, 1, 2, 3].map((q) => (
          <g key={`${b}-${q}`} data-fx={`piece-${b}-${q}`}>
            <rect x={(q % 2) * QUARTER} y={b * SIZE + Math.floor(q / 2) * QUARTER} width={QUARTER} height={QUARTER} fill={TRAIL.BRICK} stroke={TRAIL.HUD} strokeWidth={4} />
            <rect x={(q % 2) * QUARTER + 8} y={b * SIZE + Math.floor(q / 2) * QUARTER + 8} width={QUARTER - 24} height={6} fill={TRAIL.BRICK_DARK} />
          </g>
        )),
      )}
    </g>
  )
}

export const muayThai: Level = {
  script: [MAP_MS, 1500, 1600],
  end: kickOf,
  layers: (input) => {
    const x = startX(input)
    return levelLayers(
      {
        sky: <Sky id="ap-muay-sky" top={TRAIL.SUNSET_HIGH} low={TRAIL.SUNSET_LOW} />,
        far: <PillHills base={820} fill={TRAIL.ROCK} edge={TRAIL.ROCK_DARK} />,
        mid: <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} />,
        near: <GrassGround />,
        things: (
          <>
            <Wall x={x + reach(input, WALL)} />
            <Foe name="charger" x={x + reach(input, 300)}>
              <Helmet />
            </Foe>
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const charger = foeOf(stage, 'charger')
    const pieces = Array.from({ length: BRICKS }, (_, b) => [0, 1, 2, 3].map((q) => fx(stage, `piece-${b}-${q}`)))
    const x0 = startX(input)
    const wall = x0 + reach(input, WALL)
    const meet = x0 + reach(input, 90)
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      const kneeing = phase(play, 1)
      const kicking = phase(play, 2)
      // the charge, the knee that meets it, the charger thrown into the wall and down on its back
      const charge = ramp(kneeing, 0, 0.45)
      const thrown = ramp(kneeing, 0.45, 0.75)
      const down = ramp(kneeing, 0.75, 1)
      const cx = thrown > 0 ? lerp(meet + 40, wall - 40, thrown) : lerp(x0 + reach(input, 300), meet + 40, charge)
      const cy = GROUND - hop(thrown, 120)
      charger(down > 0 ? wall - 70 - 40 * down : cx, cy, down > 0 || thrown >= 1 ? 'critterTipped' : critterStep(cx), thrown > 0 && thrown < 1 ? thrown * 360 : 0)
      // the kick breaks the wall: each quarter flies off, spinning, and falls
      const burst = ramp(kicking, 0.45, 1)
      pieces.forEach((quarters, b) =>
        quarters.forEach((piece, q) => {
          const dx = (q % 2 ? 1 : 0.4) * (160 + 60 * b) * burst
          const dy = -hop(burst, 140 + 40 * (BRICKS - b)) + drop(burst, 220)
          transformTo(piece, `translate(${r1(dx)} ${r1(dy)}) rotate(${r1((q % 2 ? 1 : -1) * 300 * burst)} ${(q % 2) * QUARTER + QUARTER / 2} ${b * SIZE + Math.floor(q / 2) * QUARTER + QUARTER / 2})`)
          fadeTo(piece, 1 - ramp(burst, 0.7, 1))
        }),
      )
      if (kicking > 0) {
        const run = ramp(kicking, 0, 0.35)
        const x = lerp(meet, kickOf(input), run)
        hero(x, GROUND, run < 1 ? runFrame(x) : 'kick')
        return
      }
      const knee = ramp(kneeing, 0.3, 0.6)
      hero(lerp(x0, meet, knee), GROUND - hop(knee, 140), knee > 0 && knee < 1 ? 'jump' : 'stand')
    }
  },
}
