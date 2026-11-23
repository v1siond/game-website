import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, CRITTER_FRAMES, Canvas, Cloud, DomeHills, FoeRig, GROUND, GrassGround, Placed, Sky, critterStep } from './kit'
import type { Level } from './level'
import { Coin, Tree } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// The services: the stretch between levels, trees off along the path. For each service a
// critter walks up the path at him; he tucks into a roll and bowls into it, the critter tumbles away onto
// its back, and a coin springs up where it stood with a ring round it.

const CRITTER_FROM = 380
const HIT_X = 230
const ROLL_END = 170
const ROLL = [0.12, 0.5] as const
const COIN_TOP = -280
const COIN_W = 10 * BLOCK

const course: Stops = {
  back: (i) => (
    <>
      <g data-fx={`coin-${i}`} transform={`translate(${HIT_X - COIN_W / 2} -60)`} opacity={0}>
        <circle data-fx={`ring-${i}`} cx={COIN_W / 2} cy={28} r={10} fill="none" stroke={TRAIL.COIN} strokeWidth={6} />
        <g transform={`scale(${BLOCK})`}>
          <Coin />
        </g>
      </g>
      <g data-fx={`critter-at-${i}`} transform={`translate(${CRITTER_FROM} 0)`}>
        <g transform="scale(-1 1)">
          <FoeRig name={`critter-${i}`} kinds={CRITTER_FRAMES} />
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: ROLL[0], pose: 'stomp', ahead: 0, lift: 0 },
    { at: ROLL[1], pose: 'stomp', ahead: ROLL_END, lift: 0, spin: 720 },
    { at: ROLL[1] + 0.08, pose: 'stomp', ahead: ROLL_END, lift: 0, spin: 720 },
    { at: ROLL[1] + 0.1, pose: 'stand', ahead: ROLL_END, lift: 0, spin: 720 },
  ]),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({
      critter: fx(stage, `critter-at-${i}`),
      critterFace: frames(fx(stage, `critter-${i}`), 'critterA'),
      coin: fx(stage, `coin-${i}`),
      ring: fx(stage, `ring-${i}`),
    }))
    return (played) =>
      stops.forEach(({ critter, critterFace, coin, ring }, i) => {
        const t = played(i)
        const walk = lerp(CRITTER_FROM, HIT_X, ramp(t, 0, ROLL[1]))
        const tumble = ramp(t, ROLL[1], ROLL[1] + 0.25)
        const x = walk + 170 * tumble
        transformTo(critter, `translate(${r1(x)} ${r1(-hop(tumble, 160))}) rotate(${r1(-540 * tumble)} 0 -27)`)
        critterFace(tumble >= 1 ? 'critterTipped' : critterStep(walk))
        const rise = ramp(t, ROLL[1], ROLL[1] + 0.2)
        translateTo(coin, HIT_X - COIN_W / 2, lerp(-60, COIN_TOP, rise))
        fadeTo(coin, rise > 0 ? 1 : 0)
        const rings = ramp(t, ROLL[1] + 0.15, ROLL[1] + 0.4)
        ring?.setAttribute('r', r1(10 + 70 * rings).toString())
        fadeTo(ring, 1 - rings)
      })
  },
}

export const services: Level = {
  layers: (input) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-services-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
          <Cloud x={300} y={140} scale={2} />
          <Cloud x={1100} y={90} scale={2.6} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          {[80, 420, 980, 1380].map((x, i) => (
            <Placed key={x} x={x} y={GROUND - 60 - (4 + (i % 2)) * 56} scale={4 + (i % 2)}>
              <Tree />
            </Placed>
          ))}
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
          <Bush x={1540} fill={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, input) => stopsWriter(stage, input, course),
}
