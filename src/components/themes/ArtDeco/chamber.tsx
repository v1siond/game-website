import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fx } from '../shared/stageNodes'
import { FLOOR, Survivor, placeSurvivor } from './city'
import { decoJoints, setDecoPose, type DecoPose } from './pose'

// What every room of the descent is, and the beat a section plays in it: one place, who he meets there and
// what stands in it, at fixed places round the spot he holds, and a short script of one to three different
// actions played by the shared scene player (src/lib/scroll/player.ts) at its own pace, then its end frame
// held. Nothing steps per card and the floor never slides under him. A room keeps the city's default layers
// (the water, the far towers, the hall's brass frame, the marble floor and the kelp) or draws its own.

/** The half of the screen a scene plays on: right of its section's cards, or left of them. */
export type Side = 'right' | 'left'

export interface ChamberInput {
  profession: Profession
  /** A phone sees the canvas's middle only (x 570 to 1030). */
  phone: boolean
  /** The side the scene plays on: beside the cards from lg, the half of a phone's band it names. */
  side: Side
}

/** The theatre's layers a room can draw for itself; null leaves the layer out. */
export type RoomLayer = 'sky' | 'far' | 'mid' | 'near' | 'fg'
export type Room = Partial<Record<RoomLayer, ((input: ChamberInput) => ReactNode) | null>>

/** A scene's picture as the theatre runs it: its light, its script, the layers of its own room, an optional
 *  set between the far layer and the frame, what stands on its floor (him among it), and the binder that
 *  finds the nodes it moves once and returns the writer for a playhead. */
export interface Chamber {
  light: string
  script: SceneScript
  /** The room's own places on a wider screen, which its set moves with. */
  places?: Places
  room?: Room
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

/** Where he holds on the floor and which way the room runs from him: `dir` 1 when what waits ahead of him
 *  lies on his right, -1 when the room is laid out the other way round and he faces left. */
interface Hold {
  x: number
  dir: 1 | -1
}

// On a wider screen he holds right of the cards, or as far left of them when they sit on the right, the room
// running on to his right either way, clear of the cards. A room can name its own places (Fight.places): one
// he crosses far enough to reach the cards on the right starts him further left, and the hero keeps the place
// it was drawn at.
const WIDE: Record<Side, number> = { right: 840, left: 250 }

// Where the rooms' sets were drawn round: he held here before the rooms took sides.
const SET_ORIGIN = 760

// A phone's view is too narrow for a fight at full size, so there the whole fight, him with it, is drawn
// smaller round his feet, his foe and its machines nearer him in the same proportion.
const PHONE_SCALE = 0.72

// A phone's view is too narrow to move the room, so he holds near one edge of it with the room running from
// him across the view: from the left it lies on his right, from the right it is laid out the other way round
// on his left. Nothing in a room is lettered, so nothing reads backwards, and he faces the way he goes. A room
// he stays in holds him at the edge of the half its section names; in a room he crosses (`travel` this far or
// more) he starts from the other side, placed so his walk ends in that half (PHONE_WALK_END).
const PHONE_STAY: Record<Side, Hold> = { right: { x: 980, dir: -1 }, left: { x: 620, dir: 1 } }
const PHONE_WALK_END: Record<Side, number> = { right: 908, left: 690 }
const CROSSES = 250

const phoneHold = (side: Side, travel: number): Hold => {
  if (travel < CROSSES) return PHONE_STAY[side]
  const dir = side === 'right' ? 1 : -1
  return { x: PHONE_WALK_END[side] - dir * PHONE_SCALE * travel, dir }
}

/** A room's own places on a wider screen, where they differ from WIDE. */
export type Places = Partial<Record<Side, number>>

/** Where he holds for a scene on its side, `travel` how far ahead of his place its walk ends. */
export const holdOf = ({ phone, side }: Pick<ChamberInput, 'phone' | 'side'>, travel = 0, places: Places = {}): Hold => {
  if (phone) return phoneHold(side, travel)
  return { x: places[side] ?? WIDE[side], dir: 1 }
}

/** How far a room's set, drawn on the canvas, moves with him on a wider screen from where it was drawn. */
export const setShift = (input: Pick<ChamberInput, 'phone' | 'side'>, places?: Places): number => (input.phone ? 0 : holdOf(input, 0, places).x - SET_ORIGIN)

const fightScale = (input: ChamberInput, x: number): string | undefined => {
  if (!input.phone) return undefined
  return `translate(${x} ${FLOOR}) scale(${PHONE_SCALE}) translate(${-x} ${-FLOOR})`
}

/** A section's beat: its room drawn round the spot he holds (x 0 his place, y 0 the floor), behind him and
 *  in front of him, and the binder whose writer moves the room and returns his frame at a playhead. */
export interface Fight {
  light: string
  /** How far ahead of his place his walk ends, for a room he crosses; none for one he stays in. */
  travel?: number
  /** Its own places on a wider screen: left of the cards for a room he crosses so far that from the usual
   *  place he would reach them, the hero's right where it was drawn. */
  places?: Places
  script: SceneScript
  room?: Room
  set?: (input: ChamberInput) => ReactNode
  back: (input: ChamberInput) => ReactNode
  front?: (input: ChamberInput) => ReactNode
  bind: (stage: ParentNode, input: ChamberInput) => (play: Playhead) => Frame
}

/** A section's beat as a chamber: its room behind him, him, its room in front, all in one camera group an
 *  action can push in on. */
export const fightChamber = (fight: Fight): Chamber => ({
  light: fight.light,
  script: fight.script,
  places: fight.places,
  room: fight.room,
  set: fight.set,
  floor: (input) => {
    const { x, dir } = holdOf(input, fight.travel, fight.places)
    const room = `translate(${x} ${FLOOR})${dir === 1 ? '' : ' scale(-1 1)'}`
    return (
      <g transform={fightScale(input, x)}>
        <g data-fx="camera">
          <g transform={room}>{fight.back(input)}</g>
          <Survivor x={x} profession={input.profession} dir={dir} />
          {fight.front && <g transform={room}>{fight.front(input)}</g>}
        </g>
      </g>
    )
  },
  bind: (stage, input) => {
    const root = fx(stage, 'survivor')
    const joints = root ? decoJoints(root) : null
    const write = fight.bind(stage, input)
    const { x, dir } = holdOf(input, fight.travel, fight.places)
    return (play) => {
      const frame = write(play)
      placeSurvivor(root, x + dir * frame.ahead, frame.lift)
      if (joints) setDecoPose(joints, frame.pose)
    }
  },
})
