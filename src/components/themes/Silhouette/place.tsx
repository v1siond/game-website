import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { STAND, mix, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { setRigPose } from '../shared/rig'
import { fx, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Figure, figureAt } from './forest'
import type { Light } from './palette'
import { run, shadeJoints } from './pose'

// What every place of the forest is, played the way the genre plays: he holds his place near the middle of
// the frame and the world scrolls under him, one obstacle per card of the section. Each card is a beat: a
// short run in which the floor brings the card's obstacle to him, then his move on it (a duck, a swing, a
// jump), whose last frame is the move's own pose, held. A place gives its far and mid shapes, its obstacle
// art (drawn round the obstacle's foot), the move per obstacle and the world's reply to it. The writer takes
// the scene's progress and how many of the section's cards have crossed the reading line, fractional.

export interface PlaceInput {
  /** The obstacles, one per card. */
  count: number
  profession: Profession
  light: Light
}

/** His frame in a move: his pose, how far he has moved ahead of his place, how high above the floor, and how
 *  far he has turned over (1 upside down, the gravity room). */
export interface Frame {
  pose: RigPose
  ahead: number
  lift: number
  over: number
}

export interface Place {
  /** Its own far shapes, pale with fog. */
  far?: (input: PlaceInput) => ReactNode
  /** Its own mid shapes, a shade darker. */
  mid?: (input: PlaceInput) => ReactNode
  /** Obstacle i, drawn round its foot. */
  obstacle: (i: number, input: PlaceInput) => ReactNode
  /** His move on obstacle `at`, `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number, at: number) => Frame
  /** Binds the world's replies and returns their writer: how far each obstacle's reply has played, 0 to 1. */
  reply: (stage: ParentNode, input: PlaceInput) => (played: (i: number) => number) => void
}

/** Where he holds on the floor, right of the text column and in a phone's view. */
export const HOLD_X = 900
/** The obstacles stand this far apart on the floor; the next one waits one spacing ahead of him. */
export const SPACING = 380
/** Obstacle i's foot on the floor before it has scrolled: the move happens at HOLD_X + AT. */
export const AT = 90
export const obstacleX = (i: number): number => HOLD_X + AT + SPACING * (i + 1)

// One step of his run carries him this far over the floor.
const STEP = 70

export const still = (pose: RigPose): Frame => ({ pose, ahead: 0, lift: 0, over: 0 })

const blend = (a: Frame, b: Frame, t: number): Frame => ({
  pose: mix(a.pose, b.pose, t),
  ahead: a.ahead + (b.ahead - a.ahead) * t,
  lift: a.lift + (b.lift - a.lift) * t,
  over: a.over + (b.over - a.over) * t,
})

/** The floor and its obstacles, in the group the writer scrolls. */
export function Track({ input, place }: { input: PlaceInput; place: Place }) {
  return (
    <g data-fx="track">
      {Array.from({ length: input.count }, (_, i) => (
        <g key={i} transform={`translate(${obstacleX(i)} ${FLOOR})`}>
          {place.obstacle(i, input)}
        </g>
      ))}
    </g>
  )
}

/** Him at his place on the floor, before the first card nears the line. */
export function Holder({ profession }: { profession: Profession }) {
  return <Figure x={HOLD_X} profession={profession} />
}

/**
 * The beat writer: the floor scrolled under him, the run between beats, his move on the beat's obstacle and
 * the world's replies. The run blends out of the last move's held pose into his stride while the floor
 * brings the next obstacle, then the move takes over from his stride.
 */
export function beatsOf(stage: ParentNode, input: PlaceInput, place: Place): (reached: number) => void {
  const track = fx(stage, 'track')
  const root = fx(stage, 'figure')
  const joints = root ? shadeJoints(root) : null
  const replies = place.reply(stage, input)
  const rest = still(STAND)
  return (reached) => {
    const beat = trackAt(reached, input.count, SPACING)
    transformTo(track, `translate(${(-beat.offset).toFixed(1)} 0)`)
    replies((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
    const stride = still(run(input.profession, beat.offset / STEP))
    const before = beat.at > 0 ? place.move(input.profession, 1, beat.at - 1) : rest
    const frame = beat.act > 0 ? blend(stride, place.move(input.profession, beat.act, beat.at), ramp(beat.act, 0, 0.15)) : blend(before, stride, ramp(beat.run, 0, 0.4))
    transformTo(root, figureAt(HOLD_X + frame.ahead, frame.lift, frame.over))
    if (joints) setRigPose(joints, frame.pose)
  }
}

/** A scene's picture as the theatre runs it: its far and mid shapes, what stands on its floor, and its
 *  binder. The hero and the contact are scenes of their own; every section's place becomes one (scenePlace). */
export interface Scene {
  far?: (input: PlaceInput) => ReactNode
  mid?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** A section's place as a scene: the scrolling floor with its obstacles and him, run by the beat writer. */
export const scenePlace = (place: Place): Scene => ({
  far: place.far,
  mid: place.mid,
  floor: (input) => (
    <>
      <Track input={input} place={place} />
      <Holder profession={input.profession} />
    </>
  ),
  bind: (stage, input) => {
    const beats = beatsOf(stage, input, place)
    return (_progress, reached) => beats(reached)
  },
})
