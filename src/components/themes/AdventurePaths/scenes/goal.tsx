import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Bush, Canvas, Cloud, GROUND, GrassGround, HeroRig, PillHills, Placed, Sky, arc, rigOf, runFrame } from './kit'
import type { Level } from './level'
import { Castle, Firework } from './pieces'

// Contact: the end of the course at sunset (research images 05, 08, 31). As the page reaches its end he
// runs at the goal pole, leaps and grabs it high up, slides down it with the flag coming down beside him,
// hops off and walks into the castle, and fireworks go off over it. The last scene never sinks, so the
// whole run plays over the last screens of the page.

const POLE_X = 820
const POLE_TOP = 330
const GRAB_Y = 470
const CASTLE_X = 1000
const CASTLE_SCALE = 4
const DOOR_X = CASTLE_X + 32 * CASTLE_SCALE
const FLAG_TOP = POLE_TOP + 20
const BURSTS: ReadonlyArray<readonly [number, number, number]> = [
  [CASTLE_X + 40, 420, 0.82],
  [CASTLE_X + 230, 360, 0.88],
  [CASTLE_X + 130, 300, 0.94],
]

type Beat = { x: number; y: number; pose: string; left?: boolean; seen?: number }

// His run through the goal, beat by beat on the scene's progress: each entry starts at its progress.
const BEATS: ReadonlyArray<{ from: number; to: number; at: (u: number) => Beat }> = [
  { from: 0, to: 0.3, at: (u) => ({ x: lerp(200, POLE_X - 260, u), y: GROUND, pose: runFrame(lerp(200, POLE_X - 260, u)) }) },
  { from: 0.3, to: 0.38, at: (u) => ({ x: lerp(POLE_X - 260, POLE_X - 30, u), y: lerp(GROUND, GRAB_Y, u) - arc(u, 120), pose: 'jump' }) },
  { from: 0.38, to: 0.6, at: (u) => ({ x: POLE_X - 30, y: lerp(GRAB_Y, GROUND, u), pose: 'grab' }) },
  { from: 0.6, to: 0.66, at: (u) => ({ x: lerp(POLE_X - 30, POLE_X + 60, u), y: GROUND - arc(u, 60), pose: 'jump' }) },
  { from: 0.66, to: 0.8, at: (u) => ({ x: lerp(POLE_X + 60, DOOR_X, u), y: GROUND, pose: runFrame(lerp(POLE_X + 60, DOOR_X, u)), seen: 1 - ramp(u, 0.8, 1) }) },
  { from: 0.8, to: 1, at: () => ({ x: DOOR_X, y: GROUND, pose: 'stand', seen: 0 }) },
]

const beatAt = (p: number): Beat => {
  const beat = BEATS.find(({ to }) => p < to) ?? BEATS[BEATS.length - 1]
  return beat.at(ramp(p, beat.from, beat.to))
}

export const goal: Level = {
  layers: ({ profession }) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-goal-sky" top={TRAIL.SUNSET_HIGH} low={TRAIL.SUNSET_LOW} />
          <Cloud x={180} y={140} scale={2} fill={TRAIL.SUNSET_LOW} eye={TRAIL.ROCK_DARK} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={820} fill={TRAIL.ROCK} edge={TRAIL.ROCK_DARK} />
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          {BURSTS.map(([x, y], i) => (
            <g key={x} data-fx={`burst-${i}`} opacity={0} transform={`translate(${x} ${y})`}>
              <g transform="scale(4)">
                <Firework />
              </g>
            </g>
          ))}
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
      node: (
        <Canvas>
          <rect x={POLE_X - 6} y={POLE_TOP} width={12} height={GROUND - POLE_TOP} fill={TRAIL.PIPE} stroke={TRAIL.PIPE_DARK} strokeWidth={3} />
          <circle cx={POLE_X} cy={POLE_TOP} r={18} fill={TRAIL.PIPE_LIGHT} stroke={TRAIL.PIPE_DARK} strokeWidth={4} />
          <g data-fx="flag" transform={`translate(${POLE_X} ${FLAG_TOP})`}>
            <path d="M-6 0 L-120 40 L-6 80 Z" fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={4} />
            <circle cx={-46} cy={40} r={14} fill={TRAIL.ROUTE} />
          </g>
          <Placed x={CASTLE_X} y={GROUND - 64 * CASTLE_SCALE} scale={CASTLE_SCALE}>
            <Castle />
          </Placed>
          <g data-fx="seen">
            <HeroRig profession={profession} />
          </g>
        </Canvas>
      ),
    },
    {
      name: 'fg',
      node: (
        <Canvas>
          <Bush x={20} fill={TRAIL.ROCK_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage) => {
    const hero = rigOf(stage, 'hero', 'stand')
    const flag = fx(stage, 'flag')
    const seen = fx(stage, 'seen')
    const bursts = BURSTS.map(([x, y, at], i) => ({ x, y, at, node: fx(stage, `burst-${i}`) }))
    return (p) => {
      const { x, y, pose, seen: shown = 1 } = beatAt(p)
      hero(x, y, pose)
      fadeTo(seen, shown)
      translateTo(flag, POLE_X, lerp(FLAG_TOP, GROUND - 100, ramp(p, 0.38, 0.6)))
      bursts.forEach(({ x: bx, y: by, at, node }) => {
        const bloom = ramp(p, at, at + 0.06)
        transformTo(node, `translate(${bx} ${by}) scale(${r1(0.3 + bloom * 0.7)})`)
        fadeTo(node, bloom > 0 ? 1 - bloom * 0.3 : 0)
      })
    }
  },
}
