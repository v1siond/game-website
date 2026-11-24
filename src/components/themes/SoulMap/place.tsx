import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { rotateTo, setRigPose } from '../shared/rig'
import { fx, lerp, transformTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { knightJoints, type KnightJoints, type KnightPose } from './pose'
import { FLOOR, Figure, figureAt } from './ruins'

// What every place of the ruins is, played the way the game it comes from plays: one place under a fixed
// camera, him right of the text column and one foe or fixture before him, and the shared scene player
// moving his move through the scene's script of one to three actions (src/lib/scroll/player.ts). Each
// action plays its own stretch of the move, so every frame is a function of the playhead alone: it reads
// the same played backward, and the last action's end is the frame reduced motion shows. A place gives its
// far and mid shapes, what stands before him (drawn from his place on the floor, x 0 under his centre),
// what stands over him (the fog he walks into), his move and the world's reply.

export interface PlaceInput {
  profession: Profession
}

/** His frame in a move: his pose, how far he has moved ahead of his place, how high above the floor, and
 *  how far he has turned in a roll (360 a full turn). */
export interface Frame {
  pose: KnightPose
  ahead: number
  lift: number
  roll: number
}

export interface Place {
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** Its own far shapes, pale in the haze. */
  far?: (input: PlaceInput) => ReactNode
  /** Its own mid shapes, nearer and darker. */
  mid?: (input: PlaceInput) => ReactNode
  /** What stands before him, drawn from his place on the floor. */
  ahead: (input: PlaceInput) => ReactNode
  /** What stands over him, drawn from his place on the floor after him. */
  over?: (input: PlaceInput) => ReactNode
  /** His move `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number) => Frame
  /** Binds the world's reply and returns its writer over the move's t. */
  reply: (stage: ParentNode, input: PlaceInput) => (t: number) => void
}

/** Where he holds on the floor, right of the text column and in a phone's view. */
export const HOLD_X = 900

export const still = (pose: KnightPose): Frame => ({ pose, ahead: 0, lift: 0, roll: 0 })

/** Before the section arrives a scene shows its first frame. */
export const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to
 *  its own end on the move's t. */
export const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** Writes his pose on his joints: the rig's limbs and the grip. */
export function poseKnight(joints: KnightJoints | null, pose: KnightPose): void {
  if (!joints) return
  setRigPose(joints.rig, pose)
  rotateTo(joints.grip, pose.grip)
}

/** Finds his group and joints in `stage` once. */
export function knightIn(stage: ParentNode): { root: Element | null; joints: KnightJoints | null } {
  const root = fx(stage, 'figure')
  return { root, joints: root ? knightJoints(root) : null }
}

/** A scene's picture as the theatre runs it: its script, its far and mid shapes, what stands on its floor,
 *  and its binder. The hero is a scene of its own; every section's place becomes one (scenePlace). */
export interface Scene {
  script: SceneScript
  far?: (input: PlaceInput) => ReactNode
  mid?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** A section's place as a scene: what stands before him, him, what stands over him, played by the
 *  scene's script. */
export const scenePlace = (place: Place): Scene => ({
  script: place.script,
  far: place.far,
  mid: place.mid,
  floor: (input) => (
    <>
      <g transform={`translate(${HOLD_X} ${FLOOR})`}>{place.ahead(input)}</g>
      <Figure x={HOLD_X} profession={input.profession} />
      {place.over && <g transform={`translate(${HOLD_X} ${FLOOR})`}>{place.over(input)}</g>}
    </>
  ),
  bind: (stage, input) => {
    const { root, joints } = knightIn(stage)
    const reply = place.reply(stage, input)
    return (_progress, _reached, play = START) => {
      const t = moveAt(place.ends, play)
      reply(t)
      const frame = place.move(input.profession, t)
      transformTo(root, figureAt(HOLD_X + frame.ahead, frame.lift, frame.roll))
      poseKnight(joints, frame.pose)
    }
  },
})
