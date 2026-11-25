import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fadeTo, fx, lerp } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { Commando, FLOOR, placeCommando, type Dir, type Land, type Side } from './desert'
import { Facing } from './hud'
import { celJoints, setCelPose, type CelPose } from './pose'
import cel from './cel.module.css'

// What every stop of the wasteland is, and how it is played: he stands at it under a fixed camera, what he
// meets laid out ahead of him, and the shared scene player moves his move through the scene's script of one to
// three actions (src/lib/scroll/player.ts). Each action plays its own stretch of the move, so every frame is a
// function of the playhead alone: an action reads the same played backward, and the last action's end is the
// frame reduced motion shows. The stop plays on the half of the screen its section names (Side): beside its
// cards from lg, the half of a phone's band it names.

export interface PlaceInput {
  /** The cards the section counts, for the theatre's reading line. */
  count: number
  profession: Profession
  /** A phone's narrower, taller view. */
  phone: boolean
  /** The half the stop plays on. */
  side: Side
}

/** A scene's picture as the theatre runs it: its land, its script, what stands on its ground (him among it) and
 *  the binder that finds the nodes once and returns the per frame writer, which reads the scene's playhead. */
export interface Place {
  land: Land
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** His frame in a move: his pose, how far he has moved ahead of his place and how high above the ground. */
export interface Frame {
  pose: CelPose
  ahead: number
  lift: number
}

/** Before the section arrives a scene shows its first frame. */
export const START: Playhead = { action: 0, t: 0, done: false }

/** Where he holds and which way the stop runs from him. */
export interface Hold {
  x: number
  dir: Dir
}

// On a wide screen he holds at the inner edge of his half, what he meets ahead of him toward the page's edge:
// right of the cards (they end near x 790), or clear of the left edge's scrap when they sit on the right (from
// x 810), what he meets then within about 500 of him.
const WIDE: Record<Side, number> = { right: 880, left: 280 }

// A phone's view holds about x 520 to 1080 of the canvas, too narrow to move the stop across, so he holds in
// the half its section names: in the left half facing right, the stop on his right; in the right half facing
// left, the stop laid out the other way round on his left (only shapes turn: the words in a stop stay upright).
const PHONE: Record<Side, Hold> = { left: { x: 640, dir: 1 }, right: { x: 960, dir: -1 } }

/** Where he holds for a stop on its side. */
export const holdOf = ({ phone, side }: Pick<PlaceInput, 'phone' | 'side'>): Hold => (phone ? PHONE[side] : { x: WIDE[side], dir: 1 })

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to
 *  its own end on the move's t (0 to 1). */
export const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** A section's stop: its art round the spot where he stands (x 0 his place, y 0 the ground, ahead of him to
 *  the right), behind him and in front of him; his move there; the world's reply to it. */
export interface Stops {
  land: Land
  script: SceneScript
  /** Where he holds when not at holdOf: the hero keeps its own place under its intro card. */
  hold?: (phone: boolean) => Hold
  /** How far below the ground line the stop stands on a phone, so its end frame shows in the band under a
   *  section's card (the contact's card stands over the ground line there); none keeps it on the line. */
  phoneDrop?: number
  /** How much smaller the stop is drawn about his soles on a phone, where its art is wider than the usual
   *  (the vault's monster); none keeps PHONE_ZOOM. */
  phoneZoom?: number
  /** How much of him shows at the stage's scroll `progress`, where a card of the page stands over his place
   *  for part of it (the hero's intro card); none shows him whole. */
  shown?: (progress: number, phone: boolean) => number
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  back: (input: PlaceInput) => ReactNode
  front?: (input: PlaceInput) => ReactNode
  /** His move `t` of the way; t 1 is the move's held pose. */
  move: (profession: Profession, t: number) => Frame
  /** Binds the world's reply and returns its writer over the move's t. */
  reply: (stage: ParentNode, input: PlaceInput) => (t: number) => void
}

// A phone's view holds about 560 of the canvas, too narrow for him and what he meets at the world's size, so
// there the whole stop is drawn smaller about his soles: he keeps his place and the stop comes in whole.
const PHONE_ZOOM = 0.72
const zoomAbout = (x: number, zoom: number): string => `translate(${x} ${FLOOR}) scale(${zoom}) translate(${-x} ${-FLOOR})`

const holdFor = (stops: Stops, input: PlaceInput): Hold => stops.hold?.(input.phone) ?? holdOf(input)

/** A section's stop as a scene: its art behind him, him, its art in front, in one camera group, laid out
 *  from where he holds the way he faces, played by the scene's script. */
export const stopsPlace = (stops: Stops): Place => ({
  land: stops.land,
  script: stops.script,
  floor: (input) => {
    const { x, dir } = holdFor(stops, input)
    const room = `translate(${x} ${FLOOR})${dir === 1 ? '' : ' scale(-1 1)'}`
    return (
      <Facing.Provider value={dir}>
        <g data-fx="camera">
          <g transform={input.phone ? `translate(0 ${stops.phoneDrop ?? 0}) ${zoomAbout(x, stops.phoneZoom ?? PHONE_ZOOM)}` : undefined}>
            <g transform={room} className={cel.heavy}>
              {stops.back(input)}
            </g>
            <Commando x={x} dir={dir} profession={input.profession} />
            {stops.front && (
              <g transform={room} className={cel.heavy}>
                {stops.front(input)}
              </g>
            )}
          </g>
        </g>
      </Facing.Provider>
    )
  },
  bind: (stage, input) => {
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    const reply = stops.reply(stage, input)
    const { x, dir } = holdFor(stops, input)
    return (progress, _reached, play = START) => {
      const t = moveAt(stops.ends, play)
      reply(t)
      const frame = stops.move(input.profession, t)
      placeCommando(root, x + dir * frame.ahead, frame.lift, dir)
      if (stops.shown) fadeTo(root, stops.shown(progress, input.phone))
      if (joints) setCelPose(joints, frame.pose)
    }
  },
})
