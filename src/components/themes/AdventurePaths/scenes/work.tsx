import { ramp } from '@/lib/scroll/stage'
import { clamp01, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Canvas, Cloud, HeroRig, Placed, Sky, arc, cameraFor, courseAt, panOf, rigOf, runFrame } from './kit'
import { beatOf, type Level } from './level'
import { Brick } from './pieces'

// Work Experience: a sky level of floating ledges (research images 06, 16, 30), one ledge per job in the
// order the section lists them, climbing in two staggered rows. He runs in along the cloud floor and, as
// each job is read, jumps up onto its ledge; the ledge dips under his landing the way a block bumps.

const BRICK = 3
const LEDGE_W = 2 * 24 * BRICK
const CLOUD_TOP = 860
const START = 540

/** Each ledge's left edge and top along the course. */
const ledgesOf = (count: number): Array<{ x: number; y: number }> =>
  courseAt(count, 720, 300).map((x, i) => ({ x, y: 760 - (i % 2) * 110 - Math.min(i, 3) * 40 }))

function heroOf(ledges: ReadonlyArray<{ x: number; y: number }>, p: number, f: number): { x: number; y: number; pose: string } {
  const entry = ramp(p, 0.02, 0.2)
  if (entry < 1) {
    const x = lerp(START - 520, START, entry)
    return { x, y: CLOUD_TOP, pose: runFrame(x) }
  }
  const { k, t } = beatOf(f, ledges.length)
  const from = k === 0 ? { x: START, y: CLOUD_TOP } : { x: ledges[k - 1].x + LEDGE_W / 2, y: ledges[k - 1].y }
  const to = { x: ledges[k].x + LEDGE_W / 2, y: ledges[k].y }
  if (t < 0.2) return { ...from, pose: 'stand' }
  if (t >= 0.8) return { ...to, pose: 'stand' }
  const u = (t - 0.2) / 0.6
  return { x: lerp(from.x, to.x, u), y: lerp(from.y, to.y, u) - arc(u, 150), pose: 'jump' }
}

export const work: Level = {
  layers: ({ count, profession }) => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-work-sky" top={TRAIL.SKY_HIGH} low={TRAIL.MINT} />
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <g data-fx="far-clouds">
            {[-100, 300, 700, 1100, 1500].map((x, i) => (
              <Cloud key={x} x={x} y={260 + (i % 2) * 120} scale={1.6} eye={TRAIL.CLOUD_SHADE} />
            ))}
          </g>
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <g data-fx="mid-clouds">
            {[0, 520, 1040, 1560].map((x) => (
              <Cloud key={x} x={x} y={600} scale={3.2} />
            ))}
          </g>
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx={-200 + i * 180} cy={CLOUD_TOP + 70} rx={150} ry={80} fill={TRAIL.CLOUD} stroke={TRAIL.CLOUD_SHADE} strokeWidth={6} />
          ))}
          <rect x={-200} y={CLOUD_TOP + 70} width={2000} height={200} fill={TRAIL.CLOUD} />
        </Canvas>
      ),
    },
    {
      name: 'figure',
      node: (
        <Canvas>
          <g data-fx="course">
            {ledgesOf(count).map(({ x, y }, i) => (
              <Placed key={x} x={x} y={y} scale={BRICK} name={`ledge-${i}`}>
                <Brick />
                <g transform="translate(24 0)">
                  <Brick />
                </g>
              </Placed>
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
          <Cloud x={-140} y={860} scale={3} eye={TRAIL.CLOUD_SHADE} />
          <Cloud x={1380} y={900} scale={3} eye={TRAIL.CLOUD_SHADE} />
        </Canvas>
      ),
    },
  ],
  bind: (stage, { count }) => {
    const ledges = ledgesOf(count)
    const hero = rigOf(stage, 'hero', 'stand')
    const pan = panOf(stage)
    const farClouds = fx(stage, 'far-clouds')
    const midClouds = fx(stage, 'mid-clouds')
    const nodes = ledges.map((_, i) => fx(stage, `ledge-${i}`))
    return (p, f) => {
      translateTo(farClouds, -p * 120, 0)
      translateTo(midClouds, -p * 260, 0)
      nodes.forEach((node, i) => {
        // He lands on ledge i at 0.8 of its beat; the ledge dips and comes back by the end of it.
        const landed = clamp01((f - i - 0.8) / 0.2)
        translateTo(node, ledges[i].x, ledges[i].y + arc(landed, 14))
      })
      const { x, y, pose } = heroOf(ledges, p, f)
      pan(cameraFor(x))
      hero(x, y, pose)
    }
  },
}
