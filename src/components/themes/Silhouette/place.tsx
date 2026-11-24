import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { RigPose } from '@/lib/motion/rigPose'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { setRigPose } from '../shared/rig'
import { fx, lerp, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Figure, figureAt } from './forest'
import type { Light } from './palette'
import { shadeJoints } from './pose'

// What every place of the forest is, played the way the game it comes from plays: one place under a fixed
// camera, him near the middle of the frame and one obstacle before him, and the shared scene player moving
// his move through the scene's script of one to three actions (src/lib/scroll/player.ts). Each action plays
// its own stretch of the move, so every frame is a function of the playhead alone: it reads the same
// played backward, and the last action's end is the frame reduced motion shows. A place gives its far and
// mid shapes, its obstacle (drawn round its foot), his move on it and the world's reply.

export interface PlaceInput {
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
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** Its own far shapes, pale with fog. */
  far?: (input: PlaceInput) => ReactNode
  /** Its own mid shapes, a shade darker. */
  mid?: (input: PlaceInput) => ReactNode
  /** The obstacle, drawn round its foot. */
  obstacle: (input: PlaceInput) => ReactNode
  /** His move `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number) => Frame
  /** Binds the world's reply and returns its writer over the move's t. */
  reply: (stage: ParentNode, input: PlaceInput) => (t: number) => void
}

/** Where he holds on the floor, right of the text column and in a phone's view. */
export const HOLD_X = 900
/** The obstacle's foot stands this far ahead of him. */
export const AT = 90

export const still = (pose: RigPose): Frame => ({ pose, ahead: 0, lift: 0, over: 0 })

/** Before the section arrives a scene shows its first frame. */
export const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to
 *  its own end on the move's t. */
export const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** A scene's picture as the theatre runs it: its script, its far and mid shapes, what stands on its floor,
 *  and its binder. The hero and the contact are scenes of their own; every section's place becomes one
 *  (scenePlace). */
export interface Scene {
  script: SceneScript
  far?: (input: PlaceInput) => ReactNode
  mid?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** A section's place as a scene: its obstacle and him, played by the scene's script. */
export const scenePlace = (place: Place): Scene => ({
  script: place.script,
  far: place.far,
  mid: place.mid,
  floor: (input) => (
    <>
      <g transform={`translate(${HOLD_X + AT} ${FLOOR})`}>{place.obstacle(input)}</g>
      <Figure x={HOLD_X} profession={input.profession} />
    </>
  ),
  bind: (stage, input) => {
    const root = fx(stage, 'figure')
    const joints = root ? shadeJoints(root) : null
    const reply = place.reply(stage, input)
    return (_progress, _reached, play = START) => {
      const t = moveAt(place.ends, play)
      reply(t)
      const frame = place.move(input.profession, t)
      transformTo(root, figureAt(HOLD_X + frame.ahead, frame.lift, frame.over))
      if (joints) setRigPose(joints, frame.pose)
    }
  },
})
