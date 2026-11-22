import { ramp } from '@/lib/scroll/stage'
import { clamp01, fx, lerp, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, GROUND, GrassGround, HeroRig, PillHills, Placed, Sky, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { Pipe, SwitchBase, SwitchCap } from './pieces'

// Projects: the switch palace stretch (research images 04, 12, 20). One switch block per project stands
// along the path in the four palace colours, taken in turn; as each project is read he jumps on its switch
// and stomps it flat. Once the last one is down he hops onto the pipe at the end and sinks down it, out of
// sight, toward the underground room of the next section.

const SWITCH_COLOURS = [TRAIL.GOLD, TRAIL.FOREST, TRAIL.ROUTE, TRAIL.BLUE] as const
const SWITCH_H = 22 * BLOCK
const SWITCH_W = 28 * BLOCK
const BASE_TOP = GROUND - 3 * BLOCK
const START = 520
const PIPE_H = 44
const PIPE_TOP = GROUND - PIPE_H * BLOCK

/** Each project's switch, its left edge along the course. */
const switchesAt = (count: number): number[] => courseAt(count, 860, 300)

const pipeAt = (xs: readonly number[]): number => xs[xs.length - 1] + 340

/** His hop onto the pipe and the sink down it, once every switch is down. */
function pipeOf(xs: readonly number[], p: number): { x: number; y: number; pose: string } | null {
  const hop = ramp(p, 0.8, 0.88)
  if (hop <= 0) return null
  const pipe = pipeAt(xs) + 80
  const sink = ramp(p, 0.88, 0.97)
  if (sink > 0) return { x: pipe, y: PIPE_TOP + sink * 220, pose: 'stand' }
  const last = xs[xs.length - 1] + SWITCH_W / 2
  return { x: lerp(last, pipe, hop), y: lerp(BASE_TOP, PIPE_TOP, hop) - arc(hop, 160), pose: 'jump' }
}

function heroOf(xs: readonly number[], p: number, f: number): { x: number; y: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(START - 520, START, entry)
    return { x, y: GROUND, pose: runFrame(x) }
  }
  // The pipe waits for the last switch: he hops only once every project has been read.
  const exit = f >= xs.length ? pipeOf(xs, p) : null
  if (exit) return exit
  const { k, t } = beatOf(f, xs.length)
  const centre = xs[k] + SWITCH_W / 2
  const from = k === 0 ? START : xs[k - 1] + SWITCH_W / 2
  const takeOff = centre - 200
  if (t < 0.45) {
    const x = lerp(from, takeOff, t / 0.45)
    return { x, y: GROUND, pose: t === 0 && k === 0 ? 'stand' : runFrame(x) }
  }
  if (t >= 0.85) return { x: centre, y: BASE_TOP, pose: 'stand' }
  const u = (t - 0.45) / 0.4
  return { x: lerp(takeOff, centre, u), y: lerp(GROUND, BASE_TOP, u) - arc(u, 240), pose: u > 0.5 ? 'stomp' : 'jump' }
}

export const projects: Level = {
  layers: ({ count, profession }) => {
    const xs = switchesAt(count)
    return [
      {
        name: 'sky',
        node: (
          <Canvas>
            <Sky id="ap-projects-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
            <Cloud x={200} y={100} scale={2.2} />
            <Cloud x={1180} y={160} scale={2} />
          </Canvas>
        ),
      },
      {
        name: 'far',
        node: (
          <Canvas>
            <PillHills base={820} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />
          </Canvas>
        ),
      },
      {
        name: 'mid',
        node: (
          <Canvas>
            {[160, 700, 1260].map((x) => (
              <g key={x} transform={`translate(${x} 640)`}>
                <rect width={180} height={240} rx={18} fill={TRAIL.STONE} stroke={TRAIL.STONE_DARK} strokeWidth={6} />
                <rect x={60} y={150} width={60} height={90} rx={30} fill={TRAIL.STONE_DARK} />
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
            <g data-fx="course">
              {xs.map((x, i) => (
                <Placed key={x} x={x} y={GROUND - SWITCH_H}>
                  <SwitchBase />
                  <g data-fx={`cap-${i}`}>
                    <SwitchCap fill={SWITCH_COLOURS[i % SWITCH_COLOURS.length]} />
                  </g>
                </Placed>
              ))}
              <HeroRig profession={profession} />
              <Placed x={pipeAt(xs)} y={PIPE_TOP}>
                <Pipe height={PIPE_H} />
              </Placed>
            </g>
          </Canvas>
        ),
      },
      {
        name: 'fg',
        node: (
          <Canvas>
            <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
          </Canvas>
        ),
      },
    ]
  },
  bind: (stage, { count }) => {
    const xs = switchesAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const caps = xs.map((_, i) => fx(stage, `cap-${i}`))
    return (p, f) => {
      caps.forEach((cap, i) => {
        // Squashed to a quarter from its base line as he lands on it, 0.75 into its beat.
        const squash = 1 - 0.75 * clamp01((f - i - 0.75) / 0.1)
        transformTo(cap, `translate(0 19) scale(1 ${squash.toFixed(2)}) translate(0 -19)`)
      })
      const { x, y, pose } = heroOf(xs, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
