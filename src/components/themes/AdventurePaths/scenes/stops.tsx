import type { ReactNode } from 'react'
import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { focusOn, fx, lerp, transformTo } from '../../shared/stageNodes'
import type { StageWriter } from '../../shared/theatre/useTheatre'
import type { HeroPose } from '../side'
import { Canvas, GROUND, HeroRig, panOf, rigOf, runFrame } from './kit'
import type { LevelInput } from './level'

// A level's course as stops, one per card: he holds his place and, as each card is read, the course runs
// one spacing under him to bring its stop (the run), then he makes his move there and the stop answers it
// (the beat), the way the side scroller's camera keeps him in view. Each move holds its end once done;
// scroll up plays it back. The settled frame is the last move done with every stop answered.

/** His frame at a moment of a move: the pose, how far ahead of his place and above the floor he is, how far
 *  he is turned round his middle, and whether he faces left. */
export interface Move {
  pose: HeroPose
  ahead?: number
  lift?: number
  spin?: number
  left?: boolean
}

/** A level's stops: each card's things, drawn round the spot where he makes his move (x 0 his place, y 0 the
 *  floor) behind him and in front of him; his move there; the stops' answer to it. */
export interface Stops {
  /** The floor's y on the canvas; the ground by default. */
  floor?: number
  /** Whether the ground is tiles (the cave, the fortress) rather than grass. */
  tiled?: boolean
  back: (i: number, input: LevelInput) => ReactNode
  front?: (i: number, input: LevelInput) => ReactNode
  /** His move at stop `at`, `t` of the way; t 1 is the move's held end. */
  move: (t: number, at: number) => Move
  /** How far the view pushes in on him over his move (0 none, 1 full), for the landings that hit hardest. */
  push?: (t: number) => number
  /** Binds the stops' answers and returns their writer: how far each card's answer has played, 0 to 1. */
  reply: (stage: ParentNode, input: LevelInput) => (played: (i: number) => number) => void
}

/** Where he holds on the canvas, right of the text column and in a phone's view (x 570 to 1030). */
export const HOLD_X = 680
/** The stops stand this far apart; the next one waits one spacing ahead of him. */
export const SPACING = 640
// How far the view pushes in at a full push.
const PUSH = 0.1

const STAND: Move = { pose: 'stand' }

/** A key of a move: by `at` (0 to 1 of the move) he is at (ahead, lift), turned `spin`, having got there in
 *  `pose` over an arc `arc` high; the first key is where the move starts. */
export interface Key {
  at: number
  pose: HeroPose
  ahead: number
  lift: number
  arc?: number
  spin?: number
  left?: boolean
}

/** A move from its keys, in order of `at`: between two keys he travels in the later key's pose; after the
 *  last he holds it. */
export function keyed(keys: readonly Key[]): (t: number) => Move {
  return (t) => {
    const next = keys.findIndex((key) => key.at > t)
    if (next === -1) {
      const { pose, ahead, lift, spin, left } = keys[keys.length - 1]
      return { pose, ahead, lift, spin, left }
    }
    const from = keys[Math.max(0, next - 1)]
    const to = keys[next]
    const u = next === 0 ? 0 : ramp(t, from.at, to.at)
    return {
      pose: to.pose,
      ahead: lerp(from.ahead, to.ahead, u),
      lift: lerp(from.lift, to.lift, u) + hop(u, to.arc ?? 0),
      spin: lerp(from.spin ?? 0, to.spin ?? 0, u),
      left: to.left,
    }
  }
}

function Course({ input, art, name, floor }: { input: LevelInput; art: (i: number, input: LevelInput) => ReactNode; name: string; floor: number }) {
  return (
    <g data-fx={name}>
      {Array.from({ length: input.count }, (_, i) => (
        <g key={i} transform={`translate(${HOLD_X + SPACING * (i + 1)} ${floor})`}>
          {art(i, input)}
        </g>
      ))}
    </g>
  )
}

/** The figure layer of a level run by stops: the stops behind him, him at his place, the stops in front,
 *  all in one camera group the view pushes in with. */
export function StopsFigure({ stops, input }: { stops: Stops; input: LevelInput }) {
  const floor = stops.floor ?? GROUND
  return (
    <Canvas>
      <g data-fx="camera">
        <Course input={input} art={stops.back} name="course" floor={floor} />
        <HeroRig profession={input.profession} />
        {stops.front && <Course input={input} art={stops.front} name="course-front" floor={floor} />}
      </g>
    </Canvas>
  )
}

/**
 * The beat writer: the course slid under him, his run between beats out of the last move's held end, his
 * move at the beat's stop and the stops' answers.
 */
export function stopsWriter(stage: ParentNode, input: LevelInput, stops: Stops): StageWriter {
  const floor = stops.floor ?? GROUND
  const hero = rigOf(stage, 'hero', 'stand')
  const pan = panOf(stage, stops.tiled)
  const camera = fx(stage, 'camera')
  const answers = stops.reply(stage, input)
  return (_p, reached) => {
    const beat = trackAt(reached, input.count, SPACING)
    pan(beat.offset)
    answers((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
    const frame = beat.act > 0 ? stops.move(beat.act, beat.at) : runOf(beat.at > 0 ? stops.move(1, beat.at - 1) : STAND, beat.run, beat.offset)
    const x = HOLD_X + (frame.ahead ?? 0)
    const y = floor - (frame.lift ?? 0)
    hero(x, y, frame.pose, frame.left, frame.spin)
    const push = beat.act > 0 && stops.push ? stops.push(beat.act) : 0
    transformTo(camera, push > 0 ? focusOn(x, y - 80, 1 + PUSH * push) : '')
  }
}

/** The run between beats: out of the last move's held end, back to his place and down to the floor, in his
 *  run frames as the course slides. */
function runOf(before: Move, run: number, offset: number): Move {
  if (run <= 0) return before
  const back = ramp(run, 0, 0.4)
  const lift = lerp(before.lift ?? 0, 0, back * back)
  return { pose: lift > 4 ? 'jump' : runFrame(offset), ahead: lerp(before.ahead ?? 0, 0, back), lift }
}
