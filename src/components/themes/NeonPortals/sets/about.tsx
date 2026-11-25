import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, r1, transformTo } from '../../shared/stageNodes'
import { fromBehind, IDLE, mixPose, runPose, spinning, tucked, YAW } from '../motion'
import { Knight } from './cast'
import { along, Crate, Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Planks, throwPlanks, type HeroAt, type SetPiece } from './kit'
import { ROAD, streamVillage, Village } from './village'

// About, the first era (research notes, the medieval village [8], the camera behind him into the screen
// [35]): the one gentle run of the page. 1 run: he runs into the screen down the village road and a firefly
// floating over it comes to his shoulder, the guardian from now on. 2 spin: a knight in the road swings his
// long sword; he spins round in depth (back, side, front, side, back) and sends him turning off the road,
// the knight showing his back as he goes round. 3 bounce: two stacked crates; he jumps onto the
// top one, which breaks, bounces on the lower one, which breaks, and its checkpoint ring lights round him.
// The end frame: him on the road from behind, the ring lit round him, the road ahead.

const X = ROAD.vx
const FEET = ROAD.near
// How far he has run: all through the first action, stopped for the knight, on to the crates, stopped.
const travelAt = (u: number): number => 640 * ramp(u, 0, 1) + 220 * ramp(u, 2, 2.3)
const KNIGHT_Z = 820
const CRATES_Z = 900
const CRATE = 70
const FIREFLY_Z = 520

/** His frame at `u`, the stride at `phase`, the crates at `c` on the road. */
function heroAt(u: number, phase: number, c: { x: number; y: number; s: number }): HeroAt {
  if (u < 1.2) return { x: X, y: FEET, move: fromBehind(mixPose(runPose(phase), IDLE, ramp(u, 0.95, 1.15))) }
  if (u < 2) return { x: X, y: FEET, move: spinning(ramp(u, 1.3, 1.8), 2, YAW.back, 14) }
  if (u < 2.32) return { x: X, y: FEET, move: fromBehind(runPose(phase)) }
  const into = ramp(u, 2.32, 2.5)
  const drop = ramp(u, 2.5, 2.7)
  const off = ramp(u, 2.7, 2.95)
  const topY = c.y - 2 * CRATE * c.s
  const lowY = c.y - CRATE * c.s
  const y = u < 2.5 ? lerp(FEET, topY, into) - 60 * Math.sin(Math.PI * into) : u < 2.7 ? lerp(topY, lowY, drop) - 40 * Math.sin(Math.PI * drop) : lerp(lowY, c.y, off) - 40 * Math.sin(Math.PI * off)
  const air = Math.min(1, 2 * (bell(into, 0, 1) + bell(drop, 0, 1) + bell(off, 0, 1)))
  return { x: X, y, s: lerp(1, c.s, into), move: fromBehind(mixPose(IDLE, tucked(0), air)) }
}

/** Where a thing laid `z` down the road from the start is once he has run `travel`. */
const onRoad = (z: number, travel: number, x = 0) => along(z - travel, x, ROAD)

// The knight's turns round himself as he is flung off the road, how far he tips over into the grass, and how
// far he is thrown, up the road and across into the grass beside it.
const KNIGHT_TURNS = 2
const KNIGHT_FALL = 80
const KNIGHT_THROW = { z: 260, x: 300 }

export const about: SetPiece = {
  script: [1500, 1500, 1500],
  focus: X,
  sky: ['#6cc4f4', '#fff0c4'],
  art: () => (
    <>
      <Village />
      <g data-np="ring" opacity={0}>
        <Glow r={130} color="#ffd34d" y={-80} />
        <ellipse cy={-80} rx={92} ry={118} fill="none" stroke="#ffd34d" strokeWidth={10} />
        <ellipse cy={-80} rx={92} ry={118} fill="none" stroke="#fff" strokeWidth={3} />
      </g>
      <g data-np="crate-low">
        <Crate w={CRATE} />
      </g>
      <g data-np="crate-top">
        <Crate w={CRATE} />
      </g>
      <Planks name="plank-top" w={CRATE} />
      <Planks name="plank-low" w={CRATE} />
      <g data-np="knight">
        <Knight />
      </g>
      <Hero />
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const knight = part(root, 'knight')
    const knightArm = part(root, 'knight-arm')
    const knightBack = part(root, 'knight-back')
    const low = part(root, 'crate-low')
    const top = part(root, 'crate-top')
    const ring = part(root, 'ring')
    return (u) => {
      const travel = travelAt(u)
      streamVillage(root, travel)

      // the knight waits in the road, swings, and is spun off it: flung into the grass turning round himself
      // in depth (as wide as the cosine of his turn, his back showing while it is below 0), tipping over
      const hit = ramp(u, 1.55, 2)
      const k = onRoad(KNIGHT_Z + KNIGHT_THROW.z * hit, travel, 20 + KNIGHT_THROW.x * hit)
      const tumbleY = -150 * Math.sin(Math.PI * Math.min(1, hit * 1.2)) + 30 * hit
      const across = Math.cos(2 * Math.PI * KNIGHT_TURNS * hit)
      transformTo(knight, `translate(${r1(k.x)} ${r1(k.y + tumbleY * k.s)}) rotate(${r1(KNIGHT_FALL * hit ** 2)} 0 -90) scale(${(k.s * across).toFixed(3)} ${k.s.toFixed(3)})`)
      fadeTo(knightBack, across < 0 ? 1 : 0)
      knightArm?.setAttribute('transform', `rotate(${(80 * bell(u, 1.05, 1.6)).toFixed(1)} -43 -112)`)

      // the crates come up the road; the top one breaks under him, then the lower one, and its ring lights
      const c = onRoad(CRATES_Z, travel)
      const topBreak = ramp(u, 2.5, 2.8)
      const lowBreak = ramp(u, 2.7, 3)
      placeTo(low, c.x, c.y, c.s)
      placeTo(top, c.x, c.y - CRATE * c.s, c.s)
      fadeTo(top, u < 2.5 ? 1 : 0)
      fadeTo(low, u < 2.7 ? 1 : 0)
      throwPlanks(root, 'plank-top', c.x, c.y - CRATE * c.s, topBreak, c.s)
      throwPlanks(root, 'plank-low', c.x, c.y, lowBreak, c.s)
      placeTo(ring, c.x, c.y, c.s)
      fadeTo(ring, ramp(u, 2.75, 2.95))

      // him: the run, the spin, the bounce from the top crate to the lower one to the road at their depth
      const phase = travel / 26
      const at = heroAt(u, phase, c)
      pose(at)

      // the firefly floats down the road, then comes to his shoulder and stays there
      const f = onRoad(FIREFLY_Z, travel, 70)
      const join = ramp(u, 0.7, 1)
      const s = at.s ?? 1
      guard(lerp(f.x, at.x - 52 * s, join), lerp(f.y - 190 * f.s, at.y - 176 * s, join), u, 1)
    }
  },
}
