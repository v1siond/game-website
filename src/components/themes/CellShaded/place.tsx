import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fx, lerp } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { Commando, FLOOR, placeCommando, type Hour } from './desert'
import { celJoints, setCelPose, type CelPose } from './pose'

// What every place of the desert is, and the one stop each section plays at: he stands at it under a
// fixed camera (a signpost with a raider behind it, sandbags, a chest, a ledge), and the shared scene
// player moves his move through the scene's script of one to three actions (src/lib/scroll/player.ts).
// Each action plays its own stretch of the move, so every frame is a function of the playhead alone: an
// action reads the same played backward, and the last action's end is the frame reduced motion shows.

export interface PlaceInput {
  /** The cards the section counts, for the theatre's reading line. */
  count: number
  profession: Profession
  /** The stop's own colours, where the section's cards give them (the projects' rarities). */
  tones: readonly string[]
  /** A phone's narrower, taller view. */
  phone: boolean
}

/** A scene's picture as the theatre runs it: its hour, its script, optional art of its own in the sky
 *  behind the mesas and on the sand, what stands on its sand (him among it) and the binder that finds the
 *  nodes once and returns the per frame writer, which reads the scene's playhead. */
export interface Place {
  hour: Hour
  /** The scene's actions, each its length in ms. */
  script: SceneScript
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

/** Before the section arrives a scene shows its first frame. */
export const START: Playhead = { action: 0, t: 0, done: false }

/** Where he stands on the sand: right of the text column on a wide screen, the left of a phone's view (about
 *  x 520 to 1080) so the stop before him shows whole. */
export const holdX = (phone: boolean): number => (phone ? 600 : 860)

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to
 *  its own end on the move's t (0 to 1). */
export const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** A section's stop: its art round the spot where he stands (x 0 his place, y 0 the sand), behind him and in
 *  front of him; his move there; the world's reply to it. */
export interface Stops {
  hour: Hour
  script: SceneScript
  /** Where he stands on the sand when not at holdX: a stop whose art stands wide of him (the hero's bus, the
   *  contact's door and pad) sets its own place, on a phone and on a wide screen. */
  at?: (phone: boolean) => number
  /** How far below the sand line the stop stands on a phone, so its end frame shows in the band under a
   *  section's card (the contact's card stands over the sand line there); none keeps it on the line. */
  phoneDrop?: number
  /** How much smaller the stop is drawn about his soles on a phone, where its art is wider than the usual
   *  (the vault thing); none keeps PHONE_ZOOM. */
  phoneZoom?: number
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  back: (input: PlaceInput) => ReactNode
  front?: (input: PlaceInput) => ReactNode
  /** His move `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number) => Frame
  /** Binds the world's reply and returns its writer over the move's t. */
  reply: (stage: ParentNode, input: PlaceInput) => (t: number) => void
}

// A phone's view holds about 560 of the canvas round him, too narrow for him and what he meets at the world's
// size, so there the whole stop is drawn smaller about his soles: he keeps his place and the stop comes in whole.
const PHONE_ZOOM = 0.72
const zoomAbout = (x: number, zoom: number): string => `translate(${x} ${FLOOR}) scale(${zoom}) translate(${-x} ${-FLOOR})`

const placeOf = (stops: Stops, phone: boolean): number => stops.at?.(phone) ?? holdX(phone)

/** A section's stop as a scene: its art behind him, him, its art in front, in one camera group a reply can
 *  push in on, played by the scene's script. */
export const stopsPlace = (stops: Stops): Place => ({
  hour: stops.hour,
  script: stops.script,
  floor: (input) => {
    const x = placeOf(stops, input.phone)
    const at = `translate(${x} ${FLOOR})`
    return (
      <g data-fx="camera">
        <g transform={input.phone ? `translate(0 ${stops.phoneDrop ?? 0}) ${zoomAbout(x, stops.phoneZoom ?? PHONE_ZOOM)}` : undefined}>
          <g transform={at}>{stops.back(input)}</g>
          <Commando x={x} profession={input.profession} />
          {stops.front && <g transform={at}>{stops.front(input)}</g>}
        </g>
      </g>
    )
  },
  bind: (stage, input) => {
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    const reply = stops.reply(stage, input)
    const x = placeOf(stops, input.phone)
    return (_progress, _reached, play = START) => {
      const t = moveAt(stops.ends, play)
      reply(t)
      const frame = stops.move(input.profession, t)
      placeCommando(root, x + frame.ahead, frame.lift)
      if (joints) setCelPose(joints, frame.pose)
    }
  },
})
