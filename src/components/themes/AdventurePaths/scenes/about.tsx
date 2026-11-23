import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, frames, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, CRITTER_FRAMES, Canvas, Cloud, DomeHills, FoeRig, GrassGround, HERO_TALL, PillHills, Sky, critterStep } from './kit'
import type { Level } from './level'
import { Coin, ItemBox, OpenBox } from './pieces'
import { StopsFigure, stopsWriter, type Stops } from './stops'

// About: the first stretch of the plains. For each highlight a critter walks up under an item box; he
// jumps and stomps it flat, bounces off it up into the box, and the box opens with a coin popping out
// over it, the view pushing in on the stomp.

const SIZE = 24 * BLOCK
// Where the critter walks in from and where he lands on it, and where he lands after the bounce.
const CRITTER_FROM = 330
const LAND = 170
const END = 230
const JUMP = 200
const BOUNCE = 210
// The flattened critter he bounces off is this tall.
const FLAT = 24
// The box hangs where his head reaches at the top of the bounce, centred over it.
const BOX_X = (LAND + END) / 2 - SIZE / 2
const BOX_Y = -(HERO_TALL + FLAT / 2 + BOUNCE) - SIZE
// The share of his move when his feet meet the critter, and when his head meets the box.
const STOMP = 0.4
const HIT = STOMP + 0.35 / 2

const course: Stops = {
  back: (i) => (
    <>
      <g data-fx={`coin-${i}`} transform={`translate(${BOX_X + SIZE / 2 - 20} ${BOX_Y})`} opacity={0}>
        <g transform={`scale(${BLOCK})`}>
          <Coin />
        </g>
      </g>
      <g data-fx={`box-${i}`} transform={`translate(${BOX_X} ${BOX_Y})`}>
        <g transform={`scale(${BLOCK})`}>
          <g data-frame="closed" visibility="visible">
            <ItemBox />
          </g>
          <g data-frame="open" visibility="hidden">
            <OpenBox />
          </g>
        </g>
      </g>
      <g data-fx={`critter-at-${i}`} transform={`translate(${CRITTER_FROM} 0)`}>
        <g transform="scale(-1 1)">
          <FoeRig name={`critter-${i}`} kinds={CRITTER_FRAMES} />
        </g>
      </g>
    </>
  ),
  move: (t) => {
    if (t < STOMP) {
      const u = t / STOMP
      return { pose: u < 0.5 ? 'jump' : 'stomp', ahead: lerp(0, LAND, u), lift: FLAT * u + hop(u, JUMP) }
    }
    if (t < 0.75) {
      const v = ramp(t, STOMP, 0.75)
      return { pose: 'jump', ahead: lerp(LAND, END, v), lift: lerp(FLAT, 0, v) + hop(v, BOUNCE) }
    }
    return { pose: 'stand', ahead: END }
  },
  push: (t) => clamp01(1 - Math.abs(t - STOMP) / 0.12),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({
      critter: fx(stage, `critter-at-${i}`),
      critterFace: frames(fx(stage, `critter-${i}`), 'critterA'),
      box: fx(stage, `box-${i}`),
      boxFace: frames(fx(stage, `box-${i}`), 'closed'),
      coin: fx(stage, `coin-${i}`),
    }))
    return (played) =>
      stops.forEach(({ critter, critterFace, box, boxFace, coin }, i) => {
        const t = played(i)
        const x = lerp(CRITTER_FROM, LAND, ramp(t, 0, STOMP - 0.04))
        translateTo(critter, x, 0)
        critterFace(t >= STOMP - 0.03 ? 'critterFlat' : critterStep(x))
        translateTo(box, BOX_X, BOX_Y - hop(ramp(t, HIT, HIT + 0.08), 22))
        boxFace(t >= HIT ? 'open' : 'closed')
        const rise = ramp(t, HIT, HIT + 0.2)
        translateTo(coin, BOX_X + SIZE / 2 - 20, BOX_Y - rise * 150)
        fadeTo(coin, rise > 0 ? 1 : 0)
      })
  },
}

export const about: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-about-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
          <g data-fx="clouds">
            <Cloud x={160} y={120} scale={2.4} />
            <Cloud x={820} y={70} scale={1.8} />
            <Cloud x={1260} y={180} scale={2.2} />
          </g>
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={800} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <GrassGround />
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
          <Bush x={1520} fill={TRAIL.HILL_NEAR_DARK} />
          <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => {
    const beats = stopsWriter(stage, input, course)
    const clouds = fx(stage, 'clouds')
    return (p, f) => {
      translateTo(clouds, -p * 260, 0)
      beats(p, f)
    }
  },
}
