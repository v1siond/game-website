import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { fx, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Sleuth, placeSleuth } from './street'
import { dash, noirJoints, rest, setNoirPose, type NoirPose } from './pose'

// What every place of the heist night is, and the infiltration that most of them play: he holds his place
// near the middle of the frame and the palace slides past him, one room's cover per card of the section.
// Each card is a beat: a low dash in which the floor brings the card's cover to him, then his move at it (a
// wall hug, a lock picked, a leap onto a guard), whose last frame is the move's own pose, held. The fights
// are played in a battle frame of their own (battle.tsx).

export interface PlaceInput {
  /** The beats, one per card. */
  count: number
  profession: Profession
}

/** A scene's picture as the theatre runs it: its light, an optional set of its own between the towers and
 *  the wall, its own wall and pavement when it is not the street's, what stands on its floor (him among
 *  it) and the binder that finds the nodes the scroll moves once and returns the per frame writer. The
 *  writer takes the scene's progress (0 when its stage starts to rise, 1 when it has sunk) and how many of
 *  the section's cards have crossed the reading line, fractional. */
export interface Place {
  light: string
  set?: (input: PlaceInput) => ReactNode
  mid?: (input: PlaceInput) => ReactNode
  near?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** His frame in a move: his pose, how far he has moved ahead of his place and how high above the floor. */
export interface Frame {
  pose: NoirPose
  ahead: number
  lift: number
}

export const still = (pose: NoirPose): Frame => ({ pose, ahead: 0, lift: 0 })

const blend = (a: Frame, b: Frame, t: number): Frame => ({
  pose: mix(a.pose, b.pose, t),
  ahead: a.ahead + (b.ahead - a.ahead) * t,
  lift: a.lift + (b.lift - a.lift) * t,
})

/** An infiltration room: the cover of each card, drawn round the spot where he makes his move (x 0 his
 *  place, y 0 the floor), behind him and in front of him; his move there; the room's reply to it. */
export interface Room {
  light: string
  back: (i: number, input: PlaceInput) => ReactNode
  front?: (i: number, input: PlaceInput) => ReactNode
  /** His move at cover `at`, `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number, at: number) => Frame
  /** Binds the room's replies and returns their writer: how far each card's reply has played, 0 to 1. */
  reply: (stage: ParentNode, input: PlaceInput) => (played: (i: number) => number) => void
}

/** Where he holds on the floor, right of the text column and in a phone's view. */
export const HOLD_X = 900
/** The covers stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 420
// One step of his dash carries him this far over the floor.
const STEP = 80

const coverX = (i: number): number => HOLD_X + SPACING * (i + 1)

function Covers({ input, art, name }: { input: PlaceInput; art: (i: number, input: PlaceInput) => ReactNode; name: string }) {
  return (
    <g data-fx={name}>
      {Array.from({ length: input.count }, (_, i) => (
        <g key={i} transform={`translate(${coverX(i)} ${FLOOR})`}>
          {art(i, input)}
        </g>
      ))}
    </g>
  )
}

/**
 * The beat writer of a room: the floor slid under him, the dash between beats, his move at the beat's cover
 * and the room's replies. The dash blends out of the last move's held pose while the floor brings the next
 * cover, then the move takes over from the dash.
 */
function beatsOf(stage: ParentNode, input: PlaceInput, room: Room): (reached: number) => void {
  const tracks = [fx(stage, 'covers-back'), fx(stage, 'covers-front')]
  const root = fx(stage, 'detective')
  const joints = root ? noirJoints(root) : null
  const replies = room.reply(stage, input)
  const waiting = still(rest(input.profession))
  return (reached) => {
    const beat = trackAt(reached, input.count, SPACING)
    tracks.forEach((track) => transformTo(track, `translate(${(-beat.offset).toFixed(1)} 0)`))
    replies((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
    const run = still(dash(beat.offset / STEP))
    const before = beat.at > 0 ? room.move(input.profession, 1, beat.at - 1) : waiting
    const frame = beat.act > 0 ? blend(run, room.move(input.profession, beat.act, beat.at), ramp(beat.act, 0, 0.15)) : blend(before, run, ramp(beat.run, 0, 0.4))
    placeSleuth(root, HOLD_X + frame.ahead, frame.lift)
    if (joints) setNoirPose(joints, frame.pose)
  }
}

/** A room as a scene: its covers behind him, him, its covers in front, run by the beat writer. */
export const roomPlace = (room: Room): Place => ({
  light: room.light,
  floor: (input) => (
    <>
      <Covers input={input} art={room.back} name="covers-back" />
      <Sleuth x={HOLD_X} profession={input.profession} />
      {room.front && <Covers input={input} art={room.front} name="covers-front" />}
    </>
  ),
  bind: (stage, input) => {
    const beats = beatsOf(stage, input, room)
    return (_progress, reached) => beats(reached)
  },
})
