import { ramp } from '@/lib/scroll/stage'
import { clamp01, frames, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, DomeHills, FoeRig, GROUND, GrassGround, HeroRig, Placed, Sky, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { Pipe } from './pieces'

// The services: the stretch between levels, where a mushroom walks the path for each service (the source
// game's first move). Each mushroom walks up while the card before it is read; as its own service is read
// he runs at it, jumps and stomps it flat.

const START = 520
const STEP_EVERY = 30
const WALK = 120

/** Each service's mushroom along the course, where it stands once he reaches it. */
const foesAt = (count: number): number[] => courseAt(count, 860, 280)

const FOE_FRAMES = ['walkerA', 'walkerB', 'walkerFlat'] as const

/** A walking mushroom's step frame at x. */
const stepFrame = (x: number): string => (Math.floor(x / STEP_EVERY) % 2 === 0 ? 'walkerA' : 'walkerB')

function heroOf(xs: readonly number[], p: number, f: number): { x: number; y: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(START - 520, START, entry)
    return { x, y: GROUND, pose: runFrame(x) }
  }
  const { k, t } = beatOf(f, xs.length)
  const from = k === 0 ? START : xs[k - 1]
  const takeOff = xs[k] - 180
  if (t < 0.45) {
    const x = lerp(from, takeOff, t / 0.45)
    return { x, y: GROUND, pose: t === 0 ? 'stand' : runFrame(x) }
  }
  if (t >= 0.85) return { x: xs[k], y: GROUND, pose: 'stand' }
  const u = (t - 0.45) / 0.4
  return { x: lerp(takeOff, xs[k], u), y: GROUND - arc(u, 200), pose: u > 0.5 ? 'stomp' : 'jump' }
}

export const services: Level = {
  layers: ({ count, profession }) => [
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
            <Placed key={x} x={x} y={GROUND - 120 - (i % 2) * 90}>
              <Pipe height={70 + (i % 2) * 24} />
            </Placed>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} eye={TRAIL.HUD} />
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
            {foesAt(count).map((x, i) => (
              <g key={x} data-fx={`foe-at-${i}`} transform={`translate(${x + WALK} ${GROUND})`}>
                <FoeRig name={`foe-${i}`} kinds={FOE_FRAMES} />
              </g>
            ))}
            <HeroRig profession={profession} />
          </g>
        </Canvas>
      ),
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
  bind: (stage, { count }) => {
    const xs = foesAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const foes = xs.map((x, i) => ({ x, node: fx(stage, `foe-at-${i}`), face: frames(fx(stage, `foe-${i}`), 'walkerA') }))
    return (p, f) => {
      foes.forEach(({ x, node, face }, i) => {
        const flat = f - i - 0.85 >= 0
        // It walks up toward him while the card before it is read, and stops where he will stomp it.
        const walk = WALK * clamp01(i - f)
        translateTo(node, x + walk, GROUND)
        face(flat ? 'walkerFlat' : stepFrame(x + walk + p * BLOCK * 60))
      })
      const { x, y, pose } = heroOf(xs, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
