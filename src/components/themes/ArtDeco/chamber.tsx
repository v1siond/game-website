import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fx } from '../shared/stageNodes'
import { FLOOR, Survivor, placeSurvivor } from './city'
import { decoJoints, setDecoPose, type DecoPose } from './pose'

// What every chamber of the city is, and the fight a section plays in it: one room, its foe and its machines
// at fixed places round the spot he holds, and a short script of one to three different actions that plays
// on time once the section arrives (src/lib/scroll/player.ts), at the same speed however the page is
// scrolled, then holds its end frame. Nothing steps per card and the floor never slides under him.

export interface ChamberInput {
  profession: Profession
  /** A phone sees the canvas's middle only (x 570 to 1030). */
  phone: boolean
}

/** A scene's picture as the theatre runs it: its light, its script, an optional set of its own between the
 *  hall and the floor, what stands on its floor (him among it), and the binder that finds the nodes it moves
 *  once and returns the writer for a playhead. */
export interface Chamber {
  light: string
  script: SceneScript
  set?: (input: ChamberInput) => ReactNode
  floor: (input: ChamberInput) => ReactNode
  bind: (stage: ParentNode, input: ChamberInput) => (play: Playhead) => void
}

/** His frame: his pose, how far he has moved ahead of his place and how high above the floor. */
export interface Frame {
  pose: DecoPose
  ahead: number
  lift: number
}

export const still = (pose: DecoPose): Frame => ({ pose, ahead: 0, lift: 0 })

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
export const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** Where he holds on the floor: right of the text column on a wider screen, at the left of a phone's view
 *  so his foe and its machines fit right of him. */
export const holdX = ({ phone }: Pick<ChamberInput, 'phone'>): number => (phone ? 620 : 760)

// A phone's view is too narrow for a fight at full size, so there the whole fight, him with it, is drawn
// smaller round his feet, his foe and its machines nearer him in the same proportion.
const PHONE_SCALE = 0.72
const fightScale = (input: ChamberInput): string | undefined => {
  if (!input.phone) return undefined
  const x = holdX(input)
  return `translate(${x} ${FLOOR}) scale(${PHONE_SCALE}) translate(${-x} ${-FLOOR})`
}

/** A section's fight: its room drawn round the spot he holds (x 0 his place, y 0 the floor), behind him and
 *  in front of him, and the binder whose writer moves the room and returns his frame at a playhead. */
export interface Fight {
  light: string
  script: SceneScript
  set?: (input: ChamberInput) => ReactNode
  back: (input: ChamberInput) => ReactNode
  front?: (input: ChamberInput) => ReactNode
  bind: (stage: ParentNode, input: ChamberInput) => (play: Playhead) => Frame
}

/** A section's fight as a chamber: its room behind him, him, its room in front, all in one camera group an
 *  action can push in on. */
export const fightChamber = (fight: Fight): Chamber => ({
  light: fight.light,
  script: fight.script,
  set: fight.set,
  floor: (input) => (
    <g transform={fightScale(input)}>
      <g data-fx="camera">
        <g transform={`translate(${holdX(input)} ${FLOOR})`}>{fight.back(input)}</g>
        <Survivor x={holdX(input)} profession={input.profession} />
        {fight.front && <g transform={`translate(${holdX(input)} ${FLOOR})`}>{fight.front(input)}</g>}
      </g>
    </g>
  ),
  bind: (stage, input) => {
    const root = fx(stage, 'survivor')
    const joints = root ? decoJoints(root) : null
    const write = fight.bind(stage, input)
    return (play) => {
      const frame = write(play)
      placeSurvivor(root, holdX(input) + frame.ahead, frame.lift)
      if (joints) setDecoPose(joints, frame.pose)
    }
  },
})
