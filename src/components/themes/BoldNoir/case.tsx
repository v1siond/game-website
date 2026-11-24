import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fx } from '../shared/stageNodes'
import { FLOOR, Sleuth, placeSleuth } from './street'
import { noirJoints, setNoirPose, type NoirPose } from './pose'

// What every place of the case is, and the step of the case a section plays in it: one place, its people and
// its props at fixed places round the spot he holds, and a short script of one to three different actions
// (src/lib/scroll/player.ts) that the scroll plays at the scene's own pace, back on the way up, holding its
// end frame. Nothing steps per card and the floor never slides under him.

export interface CaseInput {
  profession: Profession
  /** A phone sees the canvas's middle only (x 570 to 1030). */
  phone: boolean
}

/** A scene's picture as the theatre runs it: its light, its script, an optional set of its own between the
 *  skyline and the wall, its own wall and pavement when it is not the street's, what stands on its floor (him
 *  among it), and the binder that finds the nodes it moves once and returns the writer for a playhead. */
export interface Place {
  light: string
  script: SceneScript
  set?: (input: CaseInput) => ReactNode
  mid?: (input: CaseInput) => ReactNode
  near?: (input: CaseInput) => ReactNode
  floor: (input: CaseInput) => ReactNode
  bind: (stage: ParentNode, input: CaseInput) => (play: Playhead) => void
}

/** His frame: his pose, how far he has moved ahead of his place and how high above the floor. */
export interface Frame {
  pose: NoirPose
  ahead: number
  lift: number
}

export const still = (pose: NoirPose): Frame => ({ pose, ahead: 0, lift: 0 })

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
export const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** Where he holds on the floor: right of the text column on a wider screen, at the left of a phone's view
 *  so what he works at fits right of him. */
export const holdX = ({ phone }: Pick<CaseInput, 'phone'>): number => (phone ? 620 : 760)

// A phone's view is too narrow for a step at full size, so there the whole step, him with it, is drawn
// smaller round his feet, what he works at nearer him in the same proportion.
const PHONE_SCALE = 0.72
const stepScale = (input: CaseInput): string | undefined => {
  if (!input.phone) return undefined
  const x = holdX(input)
  return `translate(${x} ${FLOOR}) scale(${PHONE_SCALE}) translate(${-x} ${-FLOOR})`
}

/** A section's step of the case: what it plays round the spot he holds (x 0 his place, y 0 the floor), behind
 *  him and in front of him, and the binder whose writer moves it and returns his frame at a playhead. */
export interface Step {
  light: string
  script: SceneScript
  set?: (input: CaseInput) => ReactNode
  mid?: (input: CaseInput) => ReactNode
  near?: (input: CaseInput) => ReactNode
  back: (input: CaseInput) => ReactNode
  front?: (input: CaseInput) => ReactNode
  bind: (stage: ParentNode, input: CaseInput) => (play: Playhead) => Frame
}

/** A step as a place: what is behind him, him, what is in front, all in one camera group a step can push in
 *  on. */
export const stepPlace = (step: Step): Place => ({
  light: step.light,
  script: step.script,
  set: step.set,
  mid: step.mid,
  near: step.near,
  floor: (input) => (
    <g transform={stepScale(input)}>
      <g data-fx="camera">
        <g transform={`translate(${holdX(input)} ${FLOOR})`}>{step.back(input)}</g>
        <Sleuth x={holdX(input)} profession={input.profession} />
        {step.front && <g transform={`translate(${holdX(input)} ${FLOOR})`}>{step.front(input)}</g>}
      </g>
    </g>
  ),
  bind: (stage, input) => {
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    const write = step.bind(stage, input)
    return (play) => {
      const frame = write(play)
      placeSleuth(root, holdX(input) + frame.ahead, frame.lift)
      if (joints) setNoirPose(joints, frame.pose)
    }
  },
})
