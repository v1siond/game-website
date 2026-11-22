import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, frames, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, DomeHills, GROUND, GrassGround, HeroRig, PillHills, Placed, Sky, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { Coin, QuestionBlock, UsedBlock } from './pieces'

// About: the first stretch of the plains (research images 04, 09, 21). A row of ? blocks hangs over the
// ground, one per highlight; he runs in, and as each highlight is read he runs under its block, jumps and
// hits it from below: the block bumps, a coin spins up out of it and the block turns to a used block.

const BLOCK_TOP = 560
const SIZE = 24 * BLOCK
const JUMP = 110
const START = 560

/** The left edge of each ? block along the course. */
const blocksAt = (count: number): number[] => courseAt(count, 760, 300)

/** Where he is: running in over the head of the section, then under each block in turn, jumping at it. */
function heroOf(xs: readonly number[], p: number, f: number): { x: number; y: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(START - 520, START, entry)
    return { x, y: GROUND, pose: runFrame(x) }
  }
  const { k, t } = beatOf(f, xs.length)
  const from = k === 0 ? START : xs[k - 1] + SIZE / 2
  const centre = xs[k] + SIZE / 2
  if (t < 0.5) {
    const x = lerp(from, centre, t / 0.5)
    return { x, y: GROUND, pose: t === 0 ? 'stand' : runFrame(x) }
  }
  if (t >= 1) return { x: centre, y: GROUND, pose: 'stand' }
  return { x: centre, y: GROUND - arc((t - 0.5) / 0.5, JUMP), pose: 'jump' }
}

export const about: Level = {
  layers: ({ count, profession }) => [
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
            {blocksAt(count).map((x, i) => (
              <g key={x}>
                <Placed x={x + SIZE / 2 - 20} y={BLOCK_TOP} name={`coin-${i}`}>
                  <g opacity={0} data-fx={`coin-face-${i}`}>
                    <Coin />
                  </g>
                </Placed>
                <Placed x={x} y={BLOCK_TOP} name={`block-${i}`}>
                  <g data-frame="q" visibility="visible">
                    <QuestionBlock />
                  </g>
                  <g data-frame="used" visibility="hidden">
                    <UsedBlock />
                  </g>
                </Placed>
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
          <Bush x={1520} fill={TRAIL.HILL_NEAR_DARK} />
          <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, { count }) => {
    const xs = blocksAt(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const clouds = fx(stage, 'clouds')
    const blocks = xs.map((x, i) => ({ x, node: fx(stage, `block-${i}`), face: frames(fx(stage, `block-${i}`), 'q'), coin: fx(stage, `coin-${i}`), coinFace: fx(stage, `coin-face-${i}`) }))
    return (p, f) => {
      translateTo(clouds, -p * 260, 0)
      blocks.forEach(({ x, node, face, coin, coinFace }, i) => {
        // He hits block i at the top of his jump under it, three quarters into its beat.
        const hit = f - i - 0.75
        translateTo(node, x, BLOCK_TOP - arc(clamp01(hit / 0.12), 22))
        face(hit >= 0 ? 'used' : 'q')
        const rise = clamp01(hit / 0.25)
        translateTo(coin, x + SIZE / 2 - 20, BLOCK_TOP - rise * 170)
        fadeTo(coinFace, rise > 0 && rise < 1 ? 1 : 0)
      })
      const { x, y, pose } = heroOf(xs, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
