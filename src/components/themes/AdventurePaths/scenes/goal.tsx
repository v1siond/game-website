import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Bush, Cloud, GROUND, GrassGround, HERO_TALL, PillHills, Sky, rigOf, runFrame } from './kit'
import { levelLayers } from './frame'
import { MAP_MS, clearOf, phase, reach, startX, type Level, type LevelInput } from './level'
import { mapWriter } from './worldMap'

// The goal at the end of the world: on the map the castle crumbles behind him and he walks on to the last
// flag spot. He runs at the goal gate, two plain posts with a tape moving up and down between them, and
// jumps through the tape at the top of its swing; it breaks and stars rise. Then the map comes back with
// the whole world cleared, him cheering on the goal spot.

// The gate past his start, its posts' height, and the tape's swing between them.
const GATE = 260

/** Where he ends: through the gate, cheering past it. */
const pastGateOf = (input: LevelInput): number => startX(input) + reach(input, GATE) + reach(input, 160)
const POSTS = 460
const TAPE_HIGH = GROUND - 380
const TAPE_LOW = GROUND - 120
// He meets the tape at this share of his run, when it is at the top.
const MEET = 0.6

function Gate({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {[-90, 70].map((px) => (
        <rect key={px} x={px} y={GROUND - POSTS} width={20} height={POSTS} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={4} />
      ))}
      <g data-fx="tape">
        <rect x={-70} y={-8} width={140} height={16} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
      </g>
      <g data-fx="tape-l" opacity={0}>
        <rect x={-70} y={-8} width={70} height={16} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
      </g>
      <g data-fx="tape-r" opacity={0}>
        <rect x={0} y={-8} width={70} height={16} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} data-fx={`star-${i}`} d="M0 -18 L5 -5 L18 -5 L8 4 L12 17 L0 9 L-12 17 L-8 4 L-18 -5 L-5 -5 Z" fill={TRAIL.COIN} stroke={TRAIL.HUD} strokeWidth={3} opacity={0} />
      ))}
    </g>
  )
}

export const goal: Level = {
  script: [MAP_MS + 300, 1700, 1300],
  end: pastGateOf,
  layers: (input) =>
    levelLayers(
      {
        sky: (
          <>
            <Sky id="ap-goal-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
            <Cloud x={180} y={140} scale={2} />
            <Cloud x={1100} y={90} scale={2.4} />
          </>
        ),
        far: <PillHills base={800} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />,
        near: <GrassGround />,
        things: <Gate x={startX(input) + reach(input, GATE)} />,
        fg: <Bush x={1540} fill={TRAIL.HILL_NEAR_DARK} />,
      },
      input,
    ),
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const tape = fx(stage, 'tape')
    const halves = [fx(stage, 'tape-l'), fx(stage, 'tape-r')]
    const stars = [0, 1, 2].map((i) => fx(stage, `star-${i}`))
    const x0 = startX(input)
    const crumbles = input.from === 'ventures'
    return (play) => {
      const walked = phase(play, 0)
      const running = phase(play, 1)
      const clearing = phase(play, 2)
      map({
        crumble: crumbles ? ramp(walked, 0, 0.35) : 0,
        walk: ramp(walked, 0.3, 0.7),
        open: clearing > 0 ? 1 - ramp(clearing, 0, 0.5) : ramp(walked, 0.65, 1),
        cheer: clearing >= 0.5,
      })
      // the tape swings up and down, at the top when he meets it
      const broken = running >= MEET
      const swing = 0.5 - 0.5 * Math.cos(2 * Math.PI * 1.5 * (running - MEET))
      const tapeY = lerp(TAPE_HIGH, TAPE_LOW, swing)
      translateTo(tape, 0, tapeY)
      fadeTo(tape, broken ? 0 : 1)
      const fall = ramp(running, MEET, 1)
      halves.forEach((half, i) => {
        translateTo(half, (i ? 30 : -30) * fall, TAPE_HIGH + drop(fall, GROUND - TAPE_HIGH - 20))
        fadeTo(half, broken ? 1 : 0)
      })
      stars.forEach((star, i) => {
        translateTo(star, (i - 1) * 70, TAPE_HIGH - 40 - 220 * fall - 30 * i)
        fadeTo(star, broken ? 1 - ramp(fall, 0.6, 1) : 0)
      })
      const x = lerp(clearOf(input, x0 - reach(input, 200)), pastGateOf(input), running)
      const jump = ramp(running, MEET - 0.25, MEET + 0.2)
      // his middle reaches the tape at the top of the jump
      const lift = hop(jump, GROUND - TAPE_HIGH - HERO_TALL / 2)
      hero(x, GROUND - lift, running <= 0 ? 'stand' : running >= 1 ? 'cheer' : jump > 0 && jump < 1 ? 'jump' : runFrame(r1(x)))
    }
  },
}
