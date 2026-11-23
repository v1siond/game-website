import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { fx, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { Commando, FLOOR, placeCommando, type Hour } from './desert'
import { celJoints, rest, run, setCelPose, type CelPose } from './pose'

// What every place of the desert is, and the run and gun that the sections play: he holds his place near
// the middle of the frame and the desert scrolls past him, one stop per card of the section. Each card is
// a beat: a short run in which the sand brings the card's stop to him (a bandit behind a signpost, a
// barricade, a chest, a ledge), then his move at it, whose last frame is the move's own pose, held.

export interface PlaceInput {
  /** The beats, one per card. */
  count: number
  profession: Profession
  /** Each stop's own colour, where its card gives it one (a project's rarity). */
  tones: readonly string[]
}

/** A scene's picture as the theatre runs it: its hour, optional art of its own in the sky behind the mesas
 *  and on the sand, what stands on its sand (him among it) and the binder that finds the nodes the scroll
 *  moves once and returns the per frame writer. The writer takes the scene's progress (0 when its stage
 *  starts to rise, 1 when it has sunk) and how many of the section's cards have crossed the reading line,
 *  fractional. */
export interface Place {
  hour: Hour
  /** Its own art in the sky, behind the mesas. */
  back?: (input: PlaceInput) => ReactNode
  /** Its own art standing on the sand, behind him. */
  set?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** His frame in a move: his pose, how far he has moved ahead of his place and how high above the sand. */
export interface Frame {
  pose: CelPose
  ahead: number
  lift: number
}

export const still = (pose: CelPose): Frame => ({ pose, ahead: 0, lift: 0 })

const blend = (a: Frame, b: Frame, t: number): Frame => ({
  pose: mix(a.pose, b.pose, t),
  ahead: a.ahead + (b.ahead - a.ahead) * t,
  lift: a.lift + (b.lift - a.lift) * t,
})

/** A run and gun section: each card's stop, drawn round the spot where he makes his move (x 0 his place,
 *  y 0 the sand), behind him and in front of him; his move there; the world's reply to it. */
export interface Stops {
  hour: Hour
  back: (i: number, input: PlaceInput) => ReactNode
  front?: (i: number, input: PlaceInput) => ReactNode
  /** His move at stop `at`, `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number, at: number, count: number) => Frame
  /** Binds the world's replies and returns their writer: how far each card's reply has played, 0 to 1. */
  reply: (stage: ParentNode, input: PlaceInput) => (played: (i: number) => number) => void
}

/** Where he holds on the sand, right of the text column and in a phone's view. */
export const HOLD_X = 860
/** The stops stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 440
// One step of his run carries him this far over the sand.
const STEP = 80

const stopX = (i: number): number => HOLD_X + SPACING * (i + 1)

function Track({ input, art, name }: { input: PlaceInput; art: (i: number, input: PlaceInput) => ReactNode; name: string }) {
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
 * The beat writer: the sand scrolled under him, the run between beats, his move at the beat's stop and the
 * world's replies. The run blends out of the last move's held pose while the sand brings the next stop,
 * then the move takes over from the run.
 */
function beatsOf(stage: ParentNode, input: PlaceInput, stops: Stops): (reached: number) => void {
  const tracks = [fx(stage, 'stops-back'), fx(stage, 'stops-front')]
  const root = fx(stage, 'commando')
  const joints = root ? celJoints(root) : null
  const replies = stops.reply(stage, input)
  const waiting = still(rest(input.profession))
  return (reached) => {
    const beat = trackAt(reached, input.count, SPACING)
    tracks.forEach((track) => transformTo(track, `translate(${(-beat.offset).toFixed(1)} 0)`))
    replies((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
    const stride = still(run(input.profession, beat.offset / STEP))
    const before = beat.at > 0 ? stops.move(input.profession, 1, beat.at - 1, input.count) : waiting
    const move = stops.move(input.profession, beat.act, beat.at, input.count)
    const frame = beat.act > 0 ? blend(stride, move, ramp(beat.act, 0, 0.15)) : blend(before, stride, ramp(beat.run, 0, 0.4))
    placeCommando(root, HOLD_X + frame.ahead, frame.lift)
    if (joints) setCelPose(joints, frame.pose)
  }
}

/** A run and gun section as a scene: its stops behind him, him, its stops in front, run by the beat writer,
 *  all in one camera group a reply can push in on. */
export const stopsPlace = (stops: Stops): Place => ({
  hour: stops.hour,
  floor: (input) => (
    <g data-fx="camera">
      <Track input={input} art={stops.back} name="stops-back" />
      <Commando x={HOLD_X} profession={input.profession} />
      {stops.front && <Track input={input} art={stops.front} name="stops-front" />}
    </g>
  ),
  bind: (stage, input) => {
    const beats = beatsOf(stage, input, stops)
    return (_progress, reached) => beats(reached)
  },
})
