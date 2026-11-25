import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, r1, transformTo } from '../../shared/stageNodes'
import { fromBehind, fromFront, GUARD, IDLE, mixPose, runPose, sideOn, spinning, tucked, YAW, type Move } from '../motion'
import { run as sideRun } from '../sidePose'
import { FurnaceBrute, INK, Shard } from './cast'
import { along, Glow, Guardian, guardOf, Hero, heroOf, Hourglass, part, placeTo, Puffs, puffsTo, shoulder, type SetPiece } from './kit'

// Projects, the second room's boss (research notes: the flamethrower hybrid stands in a ring of crystals with
// his flame and a bombardment, smashing the crystals round him; the hero circles to dodge, dashes through a
// gap to spin him and gets out before the blast; three hits win the double jump [4]), seen from behind him
// as the game frames that fight (footage f27, f28): a cave of ice, and in it the furnace brute of our own in
// his ring of blue glass shards. 1 the brute sweeps his flame across the floor; he runs aside, his side to
// us, and the brute's bomb shatters the shards on that side. 2 he runs up through the gap, his back to us,
// spins the brute round in depth, then runs back out at us, his face to us, as the ring blows behind him.
// 3 the brute sits down dazed, a core rises out of the smoke and goes into him, and he double jumps with it,
// twice up into the air. The end frame: him landed facing us, the brute sat dazed in his broken ring.

const FLOOR = { vx: 320, vy: 190, near: 450 }
const RING = { z: 300, rx: 190, rz: 110 }
// The brute drawn this much over the floor's scale at his depth, so he looms.
const BRUTE_SIZE = 1.9
const SHARD_SIZE = 1.6
// The shards round the ring, from the front one round to the right; the two the bomb takes are on his left.
const SHARDS = Array.from({ length: 10 }, (_, i) => -90 + 36 * i)
const GAP = [8, 9]
const BOMB_FROM = { z: RING.z, x: 30 }
// Where he stands, dodges to, comes through the gap, spins the brute, and lands, as [z into the floor, x across].
const START = [0, 60] as const
const ASIDE = [0, -170] as const
const THROUGH = [236, -150] as const
const CLOSE = [286, -78] as const
const OUT = [16, -160] as const

/** Where a shard of the ring stands on the floor, z and x. */
const shardAt = (angle: number): readonly [number, number] => {
  const a = (angle * Math.PI) / 180
  return [RING.z + RING.rz * Math.sin(a), RING.rx * Math.cos(a)]
}

/** A point along a path of floor points, `t` 0 to 1, each leg as long as its share. */
const via = (points: readonly (readonly [number, number])[], t: number): readonly [number, number] => {
  const legs = points.length - 1
  const leg = Math.min(legs - 1, Math.floor(t * legs))
  const local = t * legs - leg
  return [lerp(points[leg][0], points[leg + 1][0], local), lerp(points[leg][1], points[leg + 1][1], local)]
}

/** His place on the floor at `u`. */
function floorAt(u: number): readonly [number, number] {
  if (u < 1) return via([START, ASIDE], ramp(u, 0.3, 0.6))
  if (u < 1.35) return via([ASIDE, THROUGH, CLOSE], ramp(u, 1, 1.35))
  if (u < 2) return via([CLOSE, THROUGH, OUT], ramp(u, 1.6, 2))
  return OUT
}

/** His height over the floor: the double jump. */
const hopAt = (u: number): number => 90 * bell(u, 2.5, 2.75) + 150 * bell(u, 2.75, 2.96)

/** His move at `u`: his back watching the brute, his side running aside, his back running in, the spin,
 *  his front running out, the double jump and the landing, facing us. */
function moveAt(u: number, phase: number): Move {
  if (u < 0.3) return fromBehind(GUARD)
  if (u < 0.6) return sideOn(sideRun(phase / Math.PI), YAW.left)
  if (u < 1) return fromBehind(GUARD)
  if (u < 1.35) return fromBehind(runPose(phase))
  if (u < 1.6) return spinning(ramp(u, 1.35, 1.6), 1, YAW.back, 10)
  if (u < 2) return { ...fromFront(runPose(phase)), yaw: lerp(YAW.back, YAW.front, ramp(u, 1.6, 1.7)) }
  if (u < 2.5) return fromFront(mixPose(GUARD, IDLE, ramp(u, 2.3, 2.45)))
  if (u < 2.96) return fromFront(tucked(0))
  return fromFront(mixPose(tucked(0), GUARD, ramp(u, 2.96, 3)))
}

/** The flame's sweep at `u`, degrees: from his right across toward his left, then off. */
const sweepAt = (u: number): number => lerp(-50, 58, ramp(u, 0.12, 0.9))

/** The ice cave: a dark blue vault, icicles, the floor of packed snow into the screen. */
function Cave() {
  return (
    <>
      <path d="M-1500 -400 H2100 V190 H-1500 Z" fill="#14244a" />
      <path d="M-1500 190 Q-200 60 320 40 Q840 60 2100 190 Z" fill="#1d3a6a" />
      {[-120, 0, 90, 200, 300, 420, 520, 640, 760].map((x, i) => (
        <path key={x} d={`M${x - 26} 40 L${x} ${110 + (i % 3) * 30} L${x + 26} 40 Z`} fill="#a8d0ff" opacity={0.55} />
      ))}
      <path d="M-1500 190 H2100 V2000 H-1500 Z" fill="#cfe2f4" />
      <path d="M-1500 190 H2100" stroke="#8ab0d8" strokeWidth={4} />
      <ellipse cx={FLOOR.vx} cy={along(RING.z, 0, FLOOR).y} rx={RING.rx * 0.62} ry={RING.rz * 0.26} fill="#a8c4e0" />
    </>
  )
}

/** The ring's shards behind the brute or in front of him, each a stub that stays and the shard over it that
 *  flies ([data-np="shard-{i}"]). */
function Shards({ behind }: { behind: boolean }) {
  return (
    <>
      {SHARDS.map((angle, i) => {
        const [z, x] = shardAt(angle)
        if (z > RING.z !== behind) return null
        const p = along(z, x, FLOOR)
        return (
          <g key={angle} transform={`translate(${r1(p.x)} ${r1(p.y)}) scale(${(p.s * SHARD_SIZE).toFixed(3)})`}>
            <Shard tall={26} />
            <g data-np={`shard-${i}`}>
              <Shard tall={70 + (i % 3) * 20} />
            </g>
          </g>
        )
      })}
    </>
  )
}

export const projects: SetPiece = {
  script: [1600, 1800, 1600],
  sky: ['#0a1430', '#1d3a6a'],
  focus: 300,
  art: () => (
    <>
      <Cave />
      <Shards behind />
      <g data-np="brute">
        <FurnaceBrute />
      </g>
      <Shards behind={false} />
      <g data-np="flame" opacity={0}>
        <path d="M0 0 L-46 230 Q0 280 46 230 Z" fill="#ff6a2a" opacity={0.85} />
        <path d="M0 0 L-24 180 Q0 210 24 180 Z" fill="#ffd34d" />
      </g>
      <g data-np="bomb" opacity={0}>
        <circle r={16} fill="#2a2a34" stroke={INK} strokeWidth={4} />
        <path d="M8 -12 Q14 -24 22 -22" fill="none" stroke="#c9a04a" strokeWidth={4} />
      </g>
      <g data-np="boom" opacity={0}>
        <Glow r={110} color="#ffb03a" />
      </g>
      <g data-np="blast" opacity={0}>
        <Glow r={260} color="#bfe0ff" />
      </g>
      <Puffs name="smoke" color="#8a96b0" n={5} />
      <g data-np="core" opacity={0}>
        <Hourglass size={0.8} />
      </g>
      <Hero />
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const brute = part(root, 'brute')
    const top = part(root, 'furnace-top')
    const gun = part(root, 'furnace-gun')
    const stars = part(root, 'furnace-stars')
    const flame = part(root, 'flame')
    const bomb = part(root, 'bomb')
    const boom = part(root, 'boom')
    const blast = part(root, 'blast')
    const core = part(root, 'core')
    const shards = SHARDS.map((_, i) => part(root, `shard-${i}`))
    const b = along(RING.z, 0, FLOOR)
    const size = b.s * BRUTE_SIZE
    // the gun's muzzle on the screen, its fists at (0, -110) of him
    const fists = { x: b.x, y: b.y - 110 * size }
    return (u) => {
      // the brute: reeling from the spin, sitting down once the ring has blown, the stars round his head
      const reel = bell(u, 1.45, 1.75)
      const sit = ramp(u, 2, 2.3)
      transformTo(brute, `translate(${r1(b.x)} ${r1(b.y)}) scale(${size.toFixed(3)}) rotate(${r1(10 * reel)} 0 -80)`)
      transformTo(top, `translate(0 ${r1(46 * sit)})`)
      fadeTo(stars, ramp(u, 2.2, 2.35))
      transformTo(stars, `rotate(${r1(u * 160)} 0 -290)`)

      // 1 the flame sweeps the floor from his right across to where he stood, the gun turning with it
      const sweep = sweepAt(u)
      transformTo(gun, `rotate(${r1(sweep * 0.4)} 0 -110)`)
      fadeTo(flame, u > 0.12 && u < 0.9 ? 1 : 0)
      transformTo(flame, `translate(${r1(fists.x)} ${r1(fists.y + 70 * size)}) rotate(${r1(sweep)}) scale(${(size * 0.9 * (0.9 + 0.1 * Math.sin(u * 60))).toFixed(3)})`)

      // the bomb, lobbed onto the two shards on his left, and their burst
      const lob = ramp(u, 0.55, 0.8)
      const [gz, gx] = shardAt((SHARDS[GAP[0]] + SHARDS[GAP[1]]) / 2)
      const from = along(BOMB_FROM.z, BOMB_FROM.x, FLOOR)
      const to = along(gz, gx, FLOOR)
      fadeTo(bomb, lob > 0 && lob < 1 ? 1 : 0)
      placeTo(bomb, lerp(from.x, to.x, lob), lerp(from.y - 200 * size, to.y, lob) - 120 * Math.sin(Math.PI * lob), lerp(from.s, to.s, lob) * 1.4)
      fadeTo(boom, bell(u, 0.78, 1.05))
      placeTo(boom, to.x, to.y - 30)

      // the shards: the two on his left fly off at the bomb, the rest when the ring blows
      const blown = ramp(u, 1.8, 2)
      fadeTo(blast, bell(u, 1.78, 2.1))
      placeTo(blast, b.x, b.y - 40)
      shards.forEach((shard, i) => {
        const angle = (SHARDS[i] * Math.PI) / 180
        const fly = GAP.includes(i) ? ramp(u, 0.8, 1) : blown
        transformTo(shard, `translate(${r1(Math.cos(angle) * 120 * fly)} ${r1(-140 * Math.sin(Math.PI * fly) + 30 * fly)}) rotate(${r1(Math.cos(angle) * 120 * fly)})`)
        fadeTo(shard, 1 - ramp(fly, 0.6, 1))
      })
      puffsTo(root, 'smoke', b.x, b.y - 30, ramp(u, 1.85, 2.6), 160)

      // 3 the core rises out of the smoke and flies into him
      const rise = ramp(u, 2.1, 2.3)
      const take = ramp(u, 2.3, 2.48)
      const [hz, hx] = floorAt(u)
      const h = along(hz, hx, FLOOR)
      fadeTo(core, rise > 0 && take < 1 ? 1 : 0)
      placeTo(core, lerp(b.x, h.x, take), lerp(b.y - 120 * rise, h.y - 120 * h.s, take), lerp(0.6, 1, take))

      // him
      const phase = u * 16
      const at = { x: h.x, y: h.y - hopAt(u) * h.s, s: h.s, move: moveAt(u, phase) }
      pose(at)
      const [sx, sy] = shoulder(at.x, at.y, at.s, u >= 0.3 && u < 0.6 ? -1 : 1)
      guard(sx, sy, u)
    }
  },
}
