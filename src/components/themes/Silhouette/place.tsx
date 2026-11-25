import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { RigPose } from '@/lib/motion/rigPose'
import { cameraAt } from '@/lib/motion/sideScroll'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { setRigPose } from '../shared/rig'
import { fx, lerp, transformTo, translateTo } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Figure, PAN, figureAt, type Gap, type Region, type Run } from './forest'
import type { Light } from './palette'
import { rest, run, shadeJoints } from './pose'

// What every stretch of the level is, played the way the side scroller plays: he runs right along one
// level, the camera follows him (src/lib/motion/sideScroll.ts), and each stretch puts one obstacle in his
// way that he crosses with one to three of the game's moves (run, jump a gap, climb a ledge, push a crate,
// swing on a rope, time a run under a trap). The shared scene player moves the stretch through its script
// (src/lib/scroll/player.ts); every frame is a function of the playhead alone, so it reads the same played
// backward, and the last action's end is the frame reduced motion shows.
//
// A stretch is drawn in its own run units: x 0 is where he starts it, y 0 the top of the ground, up
// negative. Its obstacle and any gaps in the ground are placed in those units; his move gives how far he has
// gone, how high he is off the ground and how far he has turned over (the gravity room).

export interface PlaceInput {
  profession: Profession
  light: Light
}

/** His frame in a move: his pose, how far along the stretch he is, how high above the ground, and how far
 *  he has turned over (1 upside down on a ceiling). */
export interface Frame {
  pose: RigPose
  ahead: number
  lift: number
  over: number
}

export interface Place {
  /** The part of the level this stretch is in. */
  region: Region
  /** How far he goes over the stretch, in run units. */
  length: number
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** Where the ground is open, in run units. */
  gaps?: readonly Gap[]
  /** The obstacle and whatever else stands on the stretch, in run units. */
  obstacle: (input: PlaceInput) => ReactNode
  /** His move `t` of the way over a stretch `length` long; t 1 is the move's held pose. */
  move: (profession: Profession, t: number, length: number) => Frame
  /** Binds the world's reply and returns its writer over the move's t. */
  reply?: (stage: ParentNode, input: PlaceInput) => (t: number) => void
}

/** Before the section arrives a scene shows its first frame. */
export const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to
 *  its own end on the move's t. */
export const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** His height off the ground over a jump `u` of the way through, peaking at `height`, landing at `land`
 *  above where he left (a ledge he jumps up onto, or below for a drop). */
export const arc = (u: number, height: number, land = 0): number => land * u + 4 * height * u * (1 - u)

/** Run units a stride of his covers: a small figure's quick steps. */
const STRIDE = 30

/** Running from `from` to `to`, `u` of the way: on the ground, striding while he goes, at rest at either end. */
export const runFrame = (profession: Profession, from: number, to: number, u: number): Frame => {
  const ahead = lerp(from, to, u)
  return { pose: u > 0 && u < 1 ? run(profession, ahead / STRIDE) : rest(profession), ahead, lift: 0, over: 0 }
}

const PANNED = Object.entries(PAN) as [keyof typeof PAN, number][]

/** The stretch's figure layer: its obstacle and him, at his start. */
export function Stretch({ place, input, run, marked = false }: { place: Place; input: PlaceInput; run: Run; marked?: boolean }) {
  return (
    <g data-fx="pan-figure">
      <g transform={`translate(${run.start} ${FLOOR})`}>{place.obstacle(input)}</g>
      <Figure x={run.start} profession={input.profession} marked={marked} />
    </g>
  )
}

/** The writer of a stretch: the camera follows him along it, each layer moved by its share of the camera's
 *  travel, the world replies, and he is posed and placed. */
export function bindStretch(place: Place, run: Run, stage: ParentNode, input: PlaceInput): StageWriter {
  const layers = PANNED.map(([name, share]) => [fx(stage, `pan-${name}`), share] as const)
  const root = fx(stage, 'figure')
  const joints = root ? shadeJoints(root) : null
  const reply = place.reply?.(stage, input)
  return (_progress, _reached, play = START) => {
    const t = moveAt(place.ends, play)
    const frame = place.move(input.profession, t, run.length)
    const camera = cameraAt(Math.min(1, Math.max(0, frame.ahead / run.length)), run.length, run)
    for (const [node, share] of layers) translateTo(node, -share * camera, 0)
    reply?.(t)
    transformTo(root, figureAt(run.start + frame.ahead, frame.lift, frame.over))
    if (joints) setRigPose(joints, frame.pose)
  }
}
