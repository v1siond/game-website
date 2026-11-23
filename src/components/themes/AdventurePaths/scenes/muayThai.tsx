import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { frames, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { CRITTER_FRAMES, Canvas, FoeRig, TileGround } from './kit'
import type { Level } from './level'
import { GoldBlock } from './pieces'
import { StopsFigure, keyed, stopsWriter, type Stops } from './stops'

// The Muay Thai record: the fortress, gold blocks on the dark, and one critter in his way for each line of
// the record. As each line is read he dashes at it, drives a flying knee into it that knocks it back, lands
// and kicks it, and it flies off onto its back.

const CRITTER_X = 250
const KNOCKED_X = 290
const DOWN_X = 380
// The shares of his move: the dash, the knee's hit, the kick's hit.
const DASH = 0.25
const KNEE = 0.34
const KICK = 0.62

const course: Stops = {
  tiled: true,
  back: (i) => (
    <g data-fx={`critter-at-${i}`} transform={`translate(${CRITTER_X} 0)`}>
      <g transform="scale(-1 1)">
        <FoeRig name={`critter-${i}`} kinds={CRITTER_FRAMES} />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, pose: 'stand', ahead: 0, lift: 0 },
    { at: DASH / 2, pose: 'runA', ahead: 50, lift: 0 },
    { at: DASH, pose: 'runB', ahead: 110, lift: 0 },
    { at: 0.43, pose: 'jump', ahead: 170, lift: 0, arc: 120 },
    { at: 0.5, pose: 'stand', ahead: 170, lift: 0 },
    { at: 0.56, pose: 'runA', ahead: 175, lift: 0 },
    { at: 0.75, pose: 'kick', ahead: 185, lift: 0 },
    { at: 0.77, pose: 'stand', ahead: 185, lift: 0 },
  ]),
  reply: (stage, { count }) => {
    const stops = Array.from({ length: count }, (_, i) => ({ critter: fx(stage, `critter-at-${i}`), face: frames(fx(stage, `critter-${i}`), 'critterA') }))
    return (played) =>
      stops.forEach(({ critter, face }, i) => {
        const t = played(i)
        const back = ramp(t, KNEE, KNEE + 0.08)
        const fly = ramp(t, KICK, KICK + 0.2)
        const x = lerp(lerp(CRITTER_X, KNOCKED_X, back), DOWN_X, fly)
        transformTo(critter, `translate(${r1(x)} ${r1(-hop(back, 30) - hop(fly, 140))}) rotate(${r1(-360 * fly)} 0 -27)`)
        face(fly >= 1 ? 'critterTipped' : 'critterA')
      })
  },
}

export const muayThai: Level = {
  layers: (input) => [
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
      node: <StopsFigure stops={course} input={input} />,
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
  bind: (stage, input) => stopsWriter(stage, input, course),
}
