import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, GROUND, HERO_TALL, Placed, TileGround, rigOf, runFrame } from './kit'
import { Foe, foeOf, levelLayers } from './frame'
import { MAP_MS, phase, startX, type Level, type LevelInput } from './level'
import { CaveBrick } from './pieces'
import { mapWriter } from './worldMap'

// Level 2, the cave: from the map he walks onto the second spot. He picks up a stone block, carries it over
// his head and throws it at a walker, which tumbles off the screen; then he jumps onto a chain fence and
// climbs it up to the exit ledge, the cave mouth bright past it.

const SIZE = 24 * BLOCK
// The fence: how far past his start it stands (nearer on a phone, so he ends on the ledge in view), how
// tall, and the ledge on top; the walker stands between him and the fence.
const fenceAt = ({ phone }: LevelInput): number => (phone ? 160 : 380)
const foeAt = ({ phone }: LevelInput): number => (phone ? 110 : 300)
const FENCE_W = 150
const LEDGE_Y = GROUND - 420

/** A stone block, grey with a bevel. */
function Stone() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} rx={2} fill={TRAIL.STONE} stroke={TRAIL.HUD} strokeWidth={2} />
      <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.STONE_LIGHT} />
      <path d="M21 5 V21 H5" stroke={TRAIL.STONE_DARK} strokeWidth={2} fill="none" />
    </>
  )
}

/** The chain fence from the floor to the ledge, and the ledge with the light past it. */
function Fence({ x }: { x: number }) {
  const rows = Math.floor((GROUND - LEDGE_Y) / 30)
  return (
    <g>
      <rect x={x + FENCE_W - 10} y={LEDGE_Y - 220} width={360} height={220} fill={TRAIL.LANTERN} opacity={0.85} />
      <rect x={x - 20} y={LEDGE_Y} width={FENCE_W + 40} height={GROUND - LEDGE_Y} fill={TRAIL.CAVE} stroke={TRAIL.CAVE_BRICK_DARK} strokeWidth={6} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => (
          <rect key={`${r}-${c}`} x={x + c * 30} y={LEDGE_Y + 10 + r * 30} width={22} height={22} fill="none" stroke={TRAIL.STONE_LIGHT} strokeWidth={4} transform={`rotate(45 ${x + c * 30 + 11} ${LEDGE_Y + 21 + r * 30})`} />
        )),
      )}
      <g transform={`translate(${x + FENCE_W - 10} ${LEDGE_Y})`}>
        <TileRow />
      </g>
    </g>
  )
}

function TileRow() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * SIZE} 0) scale(${BLOCK})`}>
          <CaveBrick />
        </g>
      ))}
    </>
  )
}

export const work: Level = {
  script: [MAP_MS, 1500, 1700],
  layers: (input) => {
    const x = startX(input)
    return levelLayers(
      {
        sky: <rect x={-200} y={-50} width={2000} height={1100} fill={TRAIL.CAVE} />,
        far: (
          <g opacity={0.5}>
            {[120, 380, 640, 1180, 1440].map((cx) => (
              <path key={cx} d={`M${cx - 50} 0 L${cx} 160 L${cx + 50} 0 Z`} fill={TRAIL.CAVE_BRICK_DARK} />
            ))}
          </g>
        ),
        near: (
          <TileGround>
            <CaveBrick />
          </TileGround>
        ),
        things: (
          <>
            <Fence x={x + fenceAt(input)} />
            <Placed name="block" x={x + 40} y={GROUND - SIZE}>
              <Stone />
            </Placed>
            <Foe name="walker" x={x + foeAt(input)} />
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const walker = foeOf(stage, 'walker')
    const block = fx(stage, 'block')
    const x0 = startX(input)
    const fenceX = x0 + fenceAt(input)
    const foeX = x0 + foeAt(input)
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      // lift, carry, throw: the block flies at the walker and knocks it off
      const throwing = phase(play, 1)
      const lift = ramp(throwing, 0, 0.3)
      const fly = ramp(throwing, 0.45, 0.75)
      const held: [number, number] = [x0 - SIZE / 2 + 10, GROUND - HERO_TALL - SIZE + 20]
      const ground: [number, number] = [x0 + 40, GROUND - SIZE]
      const flying = fly > 0
      const bx = flying ? lerp(held[0], foeX - SIZE / 2, fly) : lerp(ground[0], held[0], lift)
      const by = flying ? lerp(held[1], GROUND - SIZE - 40, fly) - hop(fly, 60) : lerp(ground[1], held[1], lift)
      const knocked = ramp(throwing, 0.75, 1)
      translateTo(block, fly >= 1 ? bx + 300 * knocked : bx, fly >= 1 ? by + 200 * knocked ** 2 : by)
      fadeTo(block, 1 - knocked)
      walker(foeX + 400 * knocked, GROUND - hop(knocked, 120), knocked > 0 ? 'critterTipped' : 'critterA', 0, 1 - knocked)
      // to the fence and up it, hand over hand, onto the ledge
      const climbing = phase(play, 2)
      const go = ramp(climbing, 0, 0.25)
      const up = ramp(climbing, 0.25, 0.85)
      const over = ramp(climbing, 0.85, 1)
      if (climbing > 0) {
        const x = go < 1 ? lerp(x0, fenceX + 30, go) : lerp(fenceX + 30, fenceX + FENCE_W - 10, over)
        const y = go < 1 ? GROUND - hop(ramp(go, 0.6, 1), 80) - 80 * ramp(go, 0.8, 1) : lerp(GROUND - 80, LEDGE_Y, up) - hop(over, 40)
        const climbStep = Math.floor(up * 8) % 2 === 1
        hero(x, y, over >= 1 ? 'stand' : go < 0.6 ? runFrame(x) : over > 0 ? 'jump' : 'grab', climbStep)
        return
      }
      hero(x0, GROUND, throwing <= 0 ? 'stand' : throwing < 0.45 ? 'carry' : throwing < 0.8 ? 'throw' : 'stand')
    }
  },
}
