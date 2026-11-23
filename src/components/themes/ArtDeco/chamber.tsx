import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { fx, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Survivor, placeSurvivor } from './city'
import { decoJoints, rest, setDecoPose, walk, type DecoPose } from './pose'

// What every chamber of the city is, and the fight through it that the sections play: he holds his place
// near the middle of the frame and the city slides past him, one foe or machine per card of the section.
// Each card is a beat: a short run in which the floor brings the card's stop to him, then his move at it (a
// bolt, a hack, a ride on the rail), whose last frame is the move's own pose, held.

export interface ChamberInput {
  /** The beats, one per card. */
  count: number
  profession: Profession
}

/** A scene's picture as the theatre runs it: its light, an optional set of its own between the hall and
 *  the floor, what stands on its floor (him among it) and the binder that finds the nodes the scroll moves
 *  once and returns the per frame writer. The writer takes the scene's progress (0 when its stage starts to
 *  rise, 1 when it has sunk) and how many of the section's cards have crossed the reading line, fractional. */
export interface Chamber {
  light: string
  set?: (input: ChamberInput) => ReactNode
  floor: (input: ChamberInput) => ReactNode
  bind: (stage: ParentNode, input: ChamberInput) => StageWriter
}

/** His frame in a move: his pose, how far he has moved ahead of his place and how high above the floor. */
export interface Frame {
  pose: DecoPose
  ahead: number
  lift: number
}

export const still = (pose: DecoPose): Frame => ({ pose, ahead: 0, lift: 0 })

const blend = (a: Frame, b: Frame, t: number): Frame => ({
  pose: mix(a.pose, b.pose, t),
  ahead: a.ahead + (b.ahead - a.ahead) * t,
  lift: a.lift + (b.lift - a.lift) * t,
})

/** A section's fight: each card's stop, drawn round the spot where he makes his move (x 0 his place, y 0
 *  the floor), behind him and in front of him; his move there; the city's reply to it. */
export interface Stops {
  light: string
  set?: (input: ChamberInput) => ReactNode
  back: (i: number, input: ChamberInput) => ReactNode
  front?: (i: number, input: ChamberInput) => ReactNode
  /** His move at stop `at`, `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number, at: number) => Frame
  /** Binds the replies and returns their writer: how far each card's reply has played, 0 to 1. */
  reply: (stage: ParentNode, input: ChamberInput) => (played: (i: number) => number) => void
}

/** Where he holds on the floor, right of the text column and in a phone's view. */
export const HOLD_X = 760
/** The stops stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 520
// One step of his stride carries him this far over the floor.
const STEP = 70

const stopX = (i: number): number => HOLD_X + SPACING * (i + 1)

function Track({ input, art, name }: { input: ChamberInput; art: (i: number, input: ChamberInput) => ReactNode; name: string }) {
  return (
    <g data-fx={name}>
      {Array.from({ length: input.count }, (_, i) => (
        <g key={i} transform={`translate(${stopX(i)} ${FLOOR})`}>
          {art(i, input)}
        </g>
      ))}
    </g>
  )
}

/**
 * The beat writer: the floor slid under him, the run between beats, his move at the beat's stop and the
 * city's replies. The run blends out of the last move's held pose while the floor brings the next stop,
 * then the move takes over from the run.
 */
function beatsOf(stage: ParentNode, input: ChamberInput, stops: Stops): (reached: number) => void {
  const tracks = [fx(stage, 'stops-back'), fx(stage, 'stops-front')]
  const root = fx(stage, 'survivor')
  const joints = root ? decoJoints(root) : null
  const replies = stops.reply(stage, input)
  const waiting = still(rest(input.profession))
  return (reached) => {
    const beat = trackAt(reached, input.count, SPACING)
    tracks.forEach((track) => transformTo(track, `translate(${(-beat.offset).toFixed(1)} 0)`))
    replies((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
    const stride = still(walk(input.profession, beat.offset / STEP))
    const before = beat.at > 0 ? stops.move(input.profession, 1, beat.at - 1) : waiting
    const frame = beat.act > 0 ? blend(stride, stops.move(input.profession, beat.act, beat.at), ramp(beat.act, 0, 0.15)) : blend(before, stride, ramp(beat.run, 0, 0.4))
    placeSurvivor(root, HOLD_X + frame.ahead, frame.lift)
    if (joints) setDecoPose(joints, frame.pose)
  }
}

/** A section's fight as a chamber: its stops behind him, him, its stops in front, run by the beat writer,
 *  all in one camera group a reply can push in on. */
export const stopsChamber = (stops: Stops): Chamber => ({
  light: stops.light,
  set: stops.set,
  floor: (input) => (
    <g data-fx="camera">
      <Track input={input} art={stops.back} name="stops-back" />
      <Survivor x={HOLD_X} profession={input.profession} />
      {stops.front && <Track input={input} art={stops.front} name="stops-front" />}
    </g>
  ),
  bind: (stage, input) => {
    const beats = beatsOf(stage, input, stops)
    return (_progress, reached) => beats(reached)
  },
})
