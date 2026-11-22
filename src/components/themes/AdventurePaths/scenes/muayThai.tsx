import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, frames, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Canvas, FoeRig, GROUND, HeroRig, PX, TileGround, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { GoldBlock } from './pieces'

// The Muay Thai record: the fortress (research images 15, 26, 27), gold blocks on the dark, and one
// mushroom foe in his way for each line of the record. He runs in and, as each line is read, bounces
// from foe to foe in one chain without touching the ground, each one flattened under his feet with its
// score popping up, doubling as the chain goes on (100, 200, 400).

const START = 540
// He stands on a flattened foe: its squashed body is a few pixels tall.
const FOE_TOP = GROUND - 5 * PX
const FOE_FRAMES = ['walkerA', 'walkerB', 'walkerFlat'] as const
const STEP_EVERY = 0.04

/** A walking foe's step frame as the scroll goes. */
const stepFrame = (p: number): string => (Math.floor(p / STEP_EVERY) % 2 === 0 ? 'walkerA' : 'walkerB')

/** Each foe along the course. */
const foesAt = (count: number): number[] => courseAt(count, 820, 260)

function heroOf(xs: readonly number[], p: number, f: number): { x: number; y: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(START - 520, START, entry)
    return { x, y: GROUND, pose: runFrame(x) }
  }
  const { k, t } = beatOf(f, xs.length)
  const from = k === 0 ? { x: START, y: GROUND } : { x: xs[k - 1], y: FOE_TOP }
  if (t === 0) return { ...from, pose: 'stand' }
  if (t >= 0.85) return { x: xs[k], y: FOE_TOP, pose: 'stand' }
  const u = t / 0.85
  return { x: lerp(from.x, xs[k], u), y: lerp(from.y, FOE_TOP, u) - arc(u, 220), pose: u > 0.6 ? 'stomp' : 'jump' }
}

export const muayThai: Level = {
  layers: ({ count, profession }) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <rect x={-200} y={0} width={2000} height={1000} fill={TRAIL.FORT} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${-160 + i * 220} 300)`}>
              <rect width={140} height={520} fill={TRAIL.FORT_GOLD_DARK} opacity={0.35} />
              <rect x={50} y={80} width={40} height={70} rx={20} fill={TRAIL.CAVE} />
            </g>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          {[180, 1420].map((x) => (
            <g key={x} transform={`translate(${x} 520)`}>
              <rect x={-10} y={0} width={20} height={120} fill={TRAIL.BARK} />
              <path d="M-26 0 Q0 -90 26 0 Z" fill={TRAIL.GOLD} />
              <path d="M-12 0 Q0 -50 12 0 Z" fill={TRAIL.LANTERN} />
            </g>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <TileGround>
            <GoldBlock />
          </TileGround>
        </Canvas>
      ),
    },
    {
      name: 'figure',
      node: (
        <Canvas>
          <g data-fx="course">
            {foesAt(count).map((x, i) => (
              <g key={x}>
                <g data-fx={`foe-at-${i}`} transform={`translate(${x} ${GROUND})`}>
                  <FoeRig name={`foe-${i}`} kinds={FOE_FRAMES} />
                </g>
                <g data-fx={`score-${i}`} opacity={0} transform={`translate(${x} ${GROUND - 140})`}>
                  <rect x={-58} y={-34} width={116} height={44} rx={6} fill={TRAIL.HUD} />
                  <text x={0} y={0} textAnchor="middle" fontSize={34} fontWeight={700} fill={TRAIL.PAGE}>
                    {100 * 2 ** i}
                  </text>
                </g>
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
          <rect x={-200} y={0} width={2000} height={60} fill={TRAIL.FORT_GOLD_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, { count }) => {
    const xs = foesAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage, true)
    const foes = xs.map((x, i) => ({ x, face: frames(fx(stage, `foe-${i}`), 'walkerA'), score: fx(stage, `score-${i}`) }))
    return (p, f) => {
      foes.forEach(({ x, face, score }, i) => {
        const flat = f - i - 0.85
        face(flat >= 0 ? 'walkerFlat' : stepFrame(p))
        const pop = clamp01(flat / 0.15)
        translateTo(score, x, GROUND - 140 - pop * 60)
        fadeTo(score, pop)
      })
      const { x, y, pose } = heroOf(xs, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
