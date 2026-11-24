import type { ReactNode } from 'react'
import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, GROUND, HERO_TALL, Sky, TileGround, rigOf } from './kit'
import { levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level, type LevelInput } from './level'
import { Coin, Rock } from './pieces'
import { mapWriter } from './worldMap'

// Level 4, the water, after the lake levels of the 16 bit game (research 2026-11-24-c58-underwater): from the
// map he drops into a lake and swims right in strokes, each a quick lift and a slow sink, taking a line of
// coins and passing over a sleeping fish, which wakes and chases him. He strokes up to the surface as a spiky
// fish leaps behind him and jumps out onto the dry shore ledge by the exit door; the sleeper turns back to its
// bed. A slow gold fish swims back and forth through it all. Our own fish, seaweed and coins.

// The water's surface, the shore ledge's top (dry, just above it) and where the ledge starts past him.
const SURFACE = 300
const SHORE_Y = SURFACE - 10
const SHORE = 330

// Where his feet go under water: the depth he dives to, the deepest point of his swim (over the sleeper) and
// where he ends it; how far a stroke lifts him and how many he takes.
const DIVE_Y = 560
const DEEP_Y = 720
const SWIM_END_Y = 640
const LIFT = 70
const STROKES = 4

// The part of the swim spent dropping in, and the point of it where he passes over the sleeper and it wakes.
const DIVE_IN = 0.12
const WAKE = 0.5

// Where along the swim he takes each coin.
const COIN_AT = [0.3, 0.42, 0.54, 0.66, 0.78]
const COIN_SCALE = 4

// Where his feet are once he has stroked up to the surface, ready to jump out.
const OUT_Y = SURFACE + HERO_TALL * 0.4

// The sleeper's bed on the lake floor, and the slow swimmer's depth.
const BED_Y = GROUND - 46
const SWIMMER_Y = 440

/** The quick lift then the slow sink of one stroke over its own time u: 0 to `LIFT` up in the first quarter, back down over the rest. */
const strokeLift = (u: number): number => LIFT * (u < 0.25 ? u / 0.25 : 1 - (u - 0.25) / 0.75)

interface Swimmer {
  x: number
  y: number
  /** How far through the stroke he is in, 0 to 1. */
  stroke: number
}

/** Where his feet are at point s (0 to 1) of the swim, and how far through a stroke he is. */
function swimAt(input: LevelInput, s: number): Swimmer {
  const x0 = startX(input)
  const x = lerp(x0 - reach(input, 100), x0 + reach(input, 150), s)
  if (s < DIVE_IN) return { x, y: SURFACE - 40 + drop(s / DIVE_IN, DIVE_Y - SURFACE + 40), stroke: 0 }
  const v = ramp(s, DIVE_IN, 1)
  const base = v < 0.5 ? lerp(DIVE_Y, DEEP_Y, v * 2) : lerp(DEEP_Y, SWIM_END_Y, (v - 0.5) * 2)
  const stroke = (v * STROKES) % 1
  return { x, y: base - strokeLift(stroke), stroke }
}

/** A coin's top left: on his path at the point he takes it, level with his middle. */
const coinAt = (input: LevelInput, s: number) => {
  const { x, y } = swimAt(input, s)
  return { x: x + 20 - 5 * COIN_SCALE, y: y - HERO_TALL / 2 - 7 * COIN_SCALE }
}

/** Where the sleeper lies: on the floor just past where he is at his deepest. */
const bedOf = (input: LevelInput) => ({ x: swimAt(input, WAKE).x + reach(input, 40), y: BED_Y })

interface FishLook {
  body: string
  fin: string
  rx: number
  ry: number
  /** Spikes along its back. */
  spiky?: boolean
}

const SLEEPER: FishLook = { body: TRAIL.PLUM, fin: TRAIL.PLUM_DARK, rx: 70, ry: 44 }
const GOLDFISH: FishLook = { body: TRAIL.COIN, fin: TRAIL.BLOCK_DARK, rx: 36, ry: 24 }
const JUMPER: FishLook = { body: TRAIL.BRICK, fin: TRAIL.BRICK_DARK, rx: 40, ry: 30, spiky: true }

/** A fish facing left, drawn round its middle: a tail, a round body, a fin on top, a mouth and an eye shown open or shut. */
function Fish({ name, look, x, y, eye = 'open' }: { name: string; look: FishLook; x: number; y: number; eye?: 'open' | 'shut' }) {
  const { body, fin, rx, ry, spiky } = look
  const edge = { stroke: TRAIL.HUD, strokeWidth: 4, strokeLinejoin: 'round' as const }
  const eyeX = -rx * 0.5
  const eyeY = -ry * 0.25
  return (
    <g data-fx={name} transform={`translate(${x} ${y})`}>
      <g data-fx={`${name}-face`}>
        <path d={`M${rx * 0.8} 0 L${rx * 1.45} ${-ry * 0.8} L${rx * 1.3} 0 L${rx * 1.45} ${ry * 0.8} Z`} fill={fin} {...edge} />
        {spiky && (
          <path
            d={`M${-rx * 0.5} ${-ry * 0.8} L${-rx * 0.35} ${-ry * 1.5} L${-rx * 0.1} ${-ry * 0.95} L${rx * 0.1} ${-ry * 1.6} L${rx * 0.35} ${-ry * 0.9} L${rx * 0.55} ${-ry * 1.4} L${rx * 0.7} ${-ry * 0.6}`}
            fill={TRAIL.PAGE}
            {...edge}
          />
        )}
        <path d={`M${-rx * 0.1} ${-ry * 0.85} Q${rx * 0.3} ${-ry * 1.6} ${rx * 0.6} ${-ry * 0.7}`} fill={fin} {...edge} />
        <ellipse rx={rx} ry={ry} fill={body} {...edge} />
        <ellipse cx={-rx * 0.1} cy={ry * 0.45} rx={rx * 0.55} ry={ry * 0.3} fill={TRAIL.PAGE} opacity={0.35} />
        <path d={`M${-rx} ${ry * 0.15} H${-rx * 0.7}`} stroke={TRAIL.HUD} strokeWidth={4} />
        <path d={`M${rx * 0.05} ${-ry * 0.5} Q${rx * 0.25} 0 ${rx * 0.05} ${ry * 0.5}`} fill="none" stroke={fin} strokeWidth={4} />
        <g data-frame="open" visibility={eye === 'open' ? 'visible' : 'hidden'}>
          <circle cx={eyeX} cy={eyeY} r={ry * 0.3} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
          <rect x={eyeX - ry * 0.2} y={eyeY - ry * 0.1} width={ry * 0.2} height={ry * 0.2} fill={TRAIL.HUD} />
        </g>
        <path data-frame="shut" visibility={eye === 'shut' ? 'visible' : 'hidden'} d={`M${eyeX - ry * 0.25} ${eyeY} H${eyeX + ry * 0.25}`} stroke={TRAIL.HUD} strokeWidth={4} />
      </g>
    </g>
  )
}

/** A fish's writer: its middle, whether it faces right, its eye, and how far it is tilted. */
type FishWriter = (x: number, y: number, right: boolean, eye: 'open' | 'shut', tilt?: number) => void

function fishOf(stage: ParentNode, name: string, eye: 'open' | 'shut'): FishWriter {
  const node = fx(stage, name)
  const face = fx(stage, `${name}-face`)
  const show = frames(face, eye)
  return (x, y, right, look, tilt = 0) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)})${tilt ? ` rotate(${r1(tilt)})` : ''}`)
    transformTo(face, right ? 'scale(-1 1)' : '')
    show(look)
  }
}

/** A clump of seaweed rooted on the floor at x: three wavy blades, swayed round their root by the writer. */
function Seaweed({ name, x, tall }: { name: string; x: number; tall: number }) {
  const blade = (dx: number, h: number) => `M${dx} 0 q-18 ${-h / 4} 0 ${-h / 2} q18 ${-h / 4} 0 ${-h / 2}`
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <g data-fx={name}>
        {[-14, 0, 14].map((dx, i) => (
          <path key={dx} d={blade(dx, tall * (i === 1 ? 1 : 0.7))} fill="none" stroke={i === 1 ? TRAIL.LEAF : TRAIL.LEAF_DARK} strokeWidth={12} strokeLinecap="round" />
        ))}
      </g>
    </g>
  )
}

const WEEDS: ReadonlyArray<readonly [number, number]> = [
  [-250, 170],
  [-60, 120],
  [200, 200],
]

/** A bubble: a small ring with a glint. */
const Bubble = ({ r }: { r: number }) => (
  <>
    <circle r={r} fill={TRAIL.SEA} fillOpacity={0.4} stroke={TRAIL.PAGE} strokeWidth={3} />
    <rect x={-r * 0.5} y={-r * 0.5} width={r * 0.4} height={r * 0.4} fill={TRAIL.PAGE} />
  </>
)

/** The surface seen side on: a wavy white line with a lighter band under it. */
function Surface({ to }: { to: number }) {
  const waves = 'q20 -12 40 0 q20 12 40 0 '.repeat(Math.ceil((to + 200) / 80))
  return (
    <>
      <rect x={-200} y={SURFACE} width={to + 200} height={28} fill={TRAIL.PAGE} opacity={0.25} />
      <path d={`M-200 ${SURFACE} ${waves}`} fill="none" stroke={TRAIL.PAGE} strokeWidth={6} />
    </>
  )
}

function Shore({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${SHORE_Y})`}>
      <rect x={0} y={0} width={900} height={GROUND} fill={TRAIL.SAND} stroke={TRAIL.HUD} strokeWidth={6} />
      <rect x={0} y={0} width={900} height={18} fill={TRAIL.GRASS} />
      {/* the exit door */}
      <g transform="translate(150 0)">
        <rect x={-40} y={-150} width={80} height={150} rx={30} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={5} />
        <rect x={-30} y={-138} width={60} height={124} rx={24} fill={TRAIL.BARK} />
        <rect x={14} y={-80} width={10} height={10} fill={TRAIL.GOLD} />
      </g>
    </g>
  )
}

/** The lake: a gradient from the bright band under the surface to the dark floor, and three slanted light shafts. */
function Lake({ to }: { to: number }): ReactNode {
  return (
    <>
      <defs>
        <linearGradient id="ap-projects-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TRAIL.LAKE_TOP} />
          <stop offset="1" stopColor={TRAIL.LAKE_FLOOR} />
        </linearGradient>
      </defs>
      <rect x={-200} y={SURFACE} width={to + 200} height={GROUND - SURFACE + 200} fill="url(#ap-projects-lake)" />
      {[300, 760, 1180].map((sx) => (
        <path key={sx} d={`M${sx} ${SURFACE} h90 l160 ${GROUND - SURFACE} h-200 Z`} fill={TRAIL.PAGE} opacity={0.1} />
      ))}
    </>
  )
}

export const projects: Level = {
  script: [MAP_MS, 2200, 1600],
  layers: (input) => {
    const x0 = startX(input)
    const shore = x0 + reach(input, SHORE)
    const bed = bedOf(input)
    return levelLayers(
      {
        sky: <Sky id="ap-projects-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />,
        far: (
          <>
            <Lake to={2000} />
            {[100, 420, 1450].map((rx, i) => (
              <g key={rx} transform={`translate(${rx} ${GROUND - 18 * BLOCK * (1 + (i % 2))}) scale(${BLOCK * (1 + (i % 2))})`}>
                <Rock />
              </g>
            ))}
          </>
        ),
        near: (
          <TileGround>
            <rect x={1} y={1} width={22} height={22} fill={TRAIL.SAND} stroke={TRAIL.CLIFF_DARK} strokeWidth={2} />
          </TileGround>
        ),
        things: (
          <>
            {WEEDS.map(([dx, tall], i) => (
              <Seaweed key={dx} name={`weed-${i}`} x={x0 + reach(input, dx)} tall={tall} />
            ))}
            <g data-fx="snooze">
              {[0, 1, 2].map((i) => (
                <g key={i} data-fx={`snooze-${i}`}>
                  <Bubble r={6 + i * 3} />
                </g>
              ))}
            </g>
            <Fish name="sleeper" look={SLEEPER} x={bed.x} y={bed.y} eye="shut" />
            <Fish name="goldfish" look={GOLDFISH} x={x0 + reach(input, 80)} y={SWIMMER_Y} />
            <Fish name="jumper" look={JUMPER} x={x0} y={SURFACE + 40} />
            {COIN_AT.map((s, i) => {
              const { x, y } = coinAt(input, s)
              return (
                <g key={s} data-fx={`coin-${i}`} transform={`translate(${r1(x)} ${r1(y)}) scale(${COIN_SCALE})`}>
                  <Coin />
                </g>
              )
            })}
            <g data-fx="bubble" opacity={0}>
              <Bubble r={10} />
            </g>
            <Shore x={shore} />
          </>
        ),
        front: (
          <>
            {/* the water over him, up to the shore, which stands dry above it */}
            <rect x={-200} y={SURFACE} width={shore + 200} height={GROUND - SURFACE} fill={TRAIL.SEA} opacity={0.25} />
            <Surface to={shore} />
            <g data-fx="spray" opacity={0}>
              {[-40, -10, 20, 50].map((dx, i) => (
                <rect key={dx} x={dx} y={-30 - (i % 2) * 24} width={12} height={12} fill={TRAIL.PAGE} stroke={TRAIL.SEA_DEEP} strokeWidth={2} />
              ))}
            </g>
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const sleeper = fishOf(stage, 'sleeper', 'shut')
    const goldfish = fishOf(stage, 'goldfish', 'open')
    const jumper = fishOf(stage, 'jumper', 'open')
    const coins = COIN_AT.map((_, i) => fx(stage, `coin-${i}`))
    const weeds = WEEDS.map((_, i) => fx(stage, `weed-${i}`))
    const snooze = fx(stage, 'snooze')
    const zs = [0, 1, 2].map((i) => fx(stage, `snooze-${i}`))
    const bubble = fx(stage, 'bubble')
    const spray = fx(stage, 'spray')
    const x0 = startX(input)
    const shore = x0 + reach(input, SHORE)
    const exitX = x0 + reach(input, 230)
    const bed = bedOf(input)
    const end = swimAt(input, 1)
    const goldX = x0 + reach(input, 80)
    const goldSwing = reach(input, 150)
    const wait = { x: exitX - reach(input, 60), y: SURFACE + 70 }
    // the sleeper on his tail: from its bed, once he has passed over it, to just behind him
    const sleeperIn = (s: number) => {
      const follow = ramp(s, WAKE + 0.05, 1)
      const him = swimAt(input, s)
      const eased = follow * follow * (3 - 2 * follow)
      return { x: lerp(bed.x, him.x - reach(input, 170), eased), y: lerp(bed.y, him.y - HERO_TALL / 2 + 20, eased), right: s >= WAKE }
    }
    // then up under the surface where he leaves the water, and back down to its bed
    const sleeperOut = (l: number) => {
      const climb = ramp(l, 0, 0.35)
      const home = ramp(l, 0.55, 1)
      const chase = { x: lerp(end.x - reach(input, 170), wait.x, climb), y: lerp(end.y - HERO_TALL / 2 + 20, wait.y, climb) }
      return { x: lerp(chase.x, bed.x, home), y: lerp(chase.y, bed.y, home), right: home === 0 }
    }
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      const s = phase(play, 1)
      const l = phase(play, 2)
      const time = s + l

      // the seaweed sways and the slow gold fish swims back and forth, turning at each end
      weeds.forEach((node, i) => transformTo(node, `skewX(${r1(10 * Math.sin(time * Math.PI * 3 + i * 2))})`))
      const swing = time * Math.PI
      goldfish(goldX + goldSwing * Math.sin(swing), SWIMMER_Y + 20 * Math.sin(swing * 2), Math.cos(swing) > 0, 'open')
      coins.forEach((node, i) => fadeTo(node, 1 - ramp(s, COIN_AT[i], COIN_AT[i] + 0.04)))

      // the jumper rests at the surface until it leaps behind him as he climbs out, and lands where he was
      const leap = ramp(l, 0.15, 0.6)
      jumper(lerp(x0, x0 + reach(input, 200), leap), SURFACE + 40 - hop(leap, 240), leap > 0, 'open', leap > 0 && leap < 1 ? lerp(-40, 40, leap) : 0)

      // the sleeper: its eye opens as he passes over it, it chases him, waits under the surface where he
      // leaves the water, then turns back to its bed and shuts its eye
      const awake = s >= WAKE && l < 0.92
      fadeTo(snooze, awake ? 0 : 1)
      zs.forEach((node, i) => {
        const rise = (time * 1.5 + i / 3) % 1
        translateTo(node, bed.x - reach(input, 40) + 12 * Math.sin(rise * 6), bed.y - 50 - rise * 140)
        fadeTo(node, 1 - rise)
      })
      const where = l > 0 ? sleeperOut(l) : sleeperIn(s)
      sleeper(where.x, where.y, where.right, awake ? 'open' : 'shut')

      if (l > 0) {
        fadeTo(bubble, 0)
        const climb = ramp(l, 0, 0.35)
        const out = ramp(l, 0.35, 0.85)
        translateTo(spray, exitX, SURFACE)
        fadeTo(spray, ramp(l, 0.33, 0.4) * (1 - ramp(l, 0.5, 0.85)))
        if (out === 0) {
          const stroke = (climb * 2) % 1
          hero(lerp(end.x, exitX, climb), lerp(end.y, OUT_Y, climb) - strokeLift(stroke) * (1 - climb), stroke < 0.25 ? 'strokeA' : 'strokeB', false, stroke < 0.25 ? -10 : 0)
          return
        }
        hero(lerp(exitX, shore + 60, out), lerp(OUT_Y, SHORE_Y, out) - hop(out, 220), out < 1 ? 'jump' : 'stand')
        return
      }

      // the swim: he drops in with a splash, then strokes right, a bubble rising from each stroke
      const him = swimAt(input, s)
      translateTo(spray, him.x, SURFACE)
      fadeTo(spray, s > 0 ? 1 - ramp(s, DIVE_IN * 0.6, DIVE_IN * 1.6) : 0)
      translateTo(bubble, him.x + 30, him.y - HERO_TALL - 10 - him.stroke * 120)
      fadeTo(bubble, s > DIVE_IN ? 1 - him.stroke : 0)
      if (s <= 0) {
        hero(him.x, him.y, 'jump')
        return
      }
      if (s < DIVE_IN) {
        hero(him.x, him.y, 'stomp')
        return
      }
      const pull = him.stroke < 0.25
      hero(him.x, him.y, pull ? 'strokeA' : 'strokeB', false, pull ? -10 : 25)
    }
  },
}
