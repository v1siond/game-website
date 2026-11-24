import { hop } from '@/lib/motion/arc'
import { mix as mixRig } from '@/lib/motion/rigPose'
import { clamp01 } from '@/lib/scroll/progress'
import { ramp } from '@/lib/scroll/stage'
import type { Action } from './plan'
import { AIR, BOUNCE, dance, KICK, READY, REST, run as sideRun, SLAM, spin, spinTurns, type SidePose } from './sidePose'
import { DF, smooth, STEP, type ItemSpot, type RoomGeometry } from './world'
import { bell, lerp } from '../shared/stageNodes'

// What the scroll makes the props and the runner do. Every value is a pure function of the camera's depth
// and, for the move at a prop, of that move's phase: the scroll sets where the move should be (actionTarget)
// and the corridor plays it there at the shared scene player's pace (src/lib/scroll/player.ts), so a fast
// scroll never races a move. Stopping the scroll lets the move ease to its stop; scrolling up plays it back.
// Nothing here keeps time.

/** How far along an item the camera is: 0 when its prop is level with the runner, 1 one step past it. */
export const progressOf = (item: ItemSpot, camZ: number): number => (camZ - (item.z - DF)) / STEP

/** An item counts as found once the runner has reached its prop. */
const isFound = (item: ItemSpot, camZ: number): boolean => progressOf(item, camZ) >= 0.02

/** Scroll rhythms for drumming, pumping cones and waving: a function of the distance travelled. */
export interface Beat {
  left: number
  right: number
  wave: number
}

export const beatAt = (camZ: number): Beat => ({
  left: (Math.sin(camZ / 16) + 1) / 2,
  right: (Math.sin(camZ / 16 + Math.PI) + 1) / 2,
  wave: Math.sin(camZ / 14),
})

const ACTION_REACH = 0.6

/** Where the scroll puts the move at an item: 0 before the runner comes within reach of its prop, 1 once he
 *  is past it, and how far through the move in between. */
export const actionTarget = (item: ItemSpot, camZ: number): number => clamp01((progressOf(item, camZ) + ACTION_REACH) / (2 * ACTION_REACH))

/** How much of a move shows at its phase: none at either end, all of it at the middle. */
const amountOf = (phase: number): number => (phase <= 0 || phase >= 1 ? 0 : Math.sin(Math.PI * phase))

/** Within a step of its prop: the move at an item plays at the player's pace only here; further off it is
 *  where the scroll puts it. */
export const inReach = (item: ItemSpot, camZ: number): boolean => Math.abs(progressOf(item, camZ)) < 1

// A struck bag swings and settles as the scroll goes on: a damped wave of the item's own progress.
const swingOf = (u: number): number => {
  if (u < -0.05) return 0
  const t = clamp01((u + 0.05) / 0.9)
  return Math.sin(t * Math.PI * 3) * (1 - t)
}

/** A prop's state: open (0 to 1, the item reached), amount (the runner's action at it), beat, swing. */
export interface PropState {
  open: number
  amount: number
  beat: number
  swing: number
}

export const SETTLED_PROP: PropState = { open: 1, amount: 0, beat: 0.5, swing: 0 }

/** A prop's state at the camera depth, its move at `phase` (the scroll's own when left out). */
export function propStateAt(item: ItemSpot, camZ: number, phase = actionTarget(item, camZ)): PropState {
  const u = progressOf(item, camZ)
  return { open: smooth(-0.28, 0.02, u), amount: amountOf(phase), beat: beatAt(camZ).left, swing: swingOf(u) }
}

/** The keystone door: a lamp per venture found, and the halves slide apart after the last. */
export interface DoorState {
  slide: number
  lamps: number
}

export const SETTLED_DOOR: DoorState = { slide: 0, lamps: 5 }

export const doorStateAt = (room: RoomGeometry, door: number, camZ: number): DoorState => ({
  slide: smooth(door - 820, door - 430, camZ),
  lamps: room.items.filter((item) => isFound(item, camZ)).length,
})

// ---- the runner ----

export const POSE_KEYS = ['jump', 'lean', 'spin', 'liftL', 'bendL', 'rotL', 'liftR', 'bendR', 'rotR', 'aL', 'sL', 'fL', 'aR', 'sR', 'fR', 'sticks', 'wave', 'look', 'board', 'boulder'] as const

/** The back view's numbers. `look` is how far he has turned from the back view to show himself side on
 *  (0 from behind, 1 side on, runner.tsx turns him); `board` shows the hover board under his feet,
 *  `boulder` how close the rolling boulder behind him has come (0 to 1). */
export type Pose = Record<(typeof POSE_KEYS)[number], number>

const IDLE: Pose = { jump: 0, lean: 0, spin: 1, liftL: 0, bendL: 1, rotL: 3, liftR: 0, bendR: 1, rotR: -3, aL: 10, sL: 1, fL: 0, aR: -10, sR: 1, fR: 0, sticks: 0, wave: 0, look: 1, board: 0, boulder: 0 }

const mix = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(POSE_KEYS.map((key) => [key, lerp(a[key], b[key], t)])) as Pose

/** The runner whole: the back view's pose, his side on pose (sidePose.ts) and which way the side view faces,
 *  its sign the way (1 right, -1 left) and its size how square to the screen he stands (1 profile, under 1 a
 *  three quarter turn toward the camera). */
export interface Move {
  pose: Pose
  side: SidePose
  facing: number
}

// Turned three quarters toward the camera, as he stands in the hub and runs from the boulder.
const THREE_QUARTER = 0.8

const fromBehind = (pose: Pose): Move => ({ pose: { ...pose, look: 0 }, side: REST, facing: 1 })

const sideOn = (pose: Pose, side: SidePose, facing: number): Move => ({ pose: { ...pose, look: 1 }, side, facing })

// The back view run: the lifted leg shortens toward the camera, the opposite arm swings forward.
function runPose(phase: number): Pose {
  const left = Math.max(0, Math.sin(phase))
  const right = Math.max(0, Math.sin(phase + Math.PI))
  return {
    ...IDLE,
    jump: -10 * Math.abs(Math.sin(phase)),
    lean: 2 * Math.sin(phase),
    liftL: 36 * left,
    bendL: 1 - 0.5 * left,
    liftR: 36 * right,
    bendR: 1 - 0.5 * right,
    aL: 14,
    sL: 1 - 0.3 * right,
    fL: -55 * right,
    aR: -14,
    sR: 1 - 0.3 * left,
    fR: 55 * left,
    wave: phase,
    look: 0,
  }
}

// The back view's stride is a whole cycle per 2π of phase; the side view's legs trade once per unit.
const SIDE_STRIDE = 1 / Math.PI

type ActionMove = (phase: number, side: 1 | -1, beat: Beat) => Move

// Low on the board, knees bent, arms out for balance, leaning into the turn the scroll gives.
const ridePose = (turn: number): Pose => ({ ...IDLE, jump: 18, lean: 12 * turn, liftL: 8, bendL: 0.72, liftR: 8, bendR: 0.72, aL: 64, fL: -20, aR: -64, fR: 20, look: 0, board: 1 })

// The spin that smashes a crate: a hop, the arms flung out side on, turning twice round as the move plays.
const smashMove = (phase: number, side: 1 | -1): Move => sideOn({ ...IDLE, jump: -14 * bell(phase, 0, 1) }, spin(phase), side * Math.cos(2 * Math.PI * spinTurns(phase)))

const tucked = (height: number): Pose => ({ ...IDLE, jump: -height, liftL: 40, bendL: 0.5, liftR: 40, bendR: 0.5, aL: 150, fL: 30, aR: -150, fR: -30 })

// One hop off a crate's top: squashed on it, stretched up through the air, squashed again as he lands.
const hopSide = (t: number): SidePose => mixRig(BOUNCE, AIR, bell(t, 0, 1))

// Each move from its phase (0 to 1), the prop's side and the scroll beat. Most peak at phase 0.5; the two
// that come in two parts (a double bounce, a dodge then a kick) peak on their second part (PEAK). The spin,
// the slam, the bounce, the boss round and the dance show him side on; the ride, the slide and the drums
// are seen from behind, facing what he meets.
const ACTIONS: Record<Action, ActionMove> = {
  smash: (phase, side) => smashMove(phase, side),
  ride: (phase, side) => fromBehind({ ...ridePose(side), jump: 18 - hop(phase, 70) }),
  // Up, laid flat out in the air, then down on his belly on the iron crate.
  flop: (phase, side) => sideOn({ ...IDLE, jump: -hop(phase, 190) }, mixRig(AIR, SLAM, ramp(phase, 0.12, 0.5)), side),
  // A low skid on one hip under the beam, the lead leg out ahead.
  slide: (phase, side) => fromBehind({ ...IDLE, jump: 70, lean: side * 28, liftL: 46, bendL: 0.42, rotL: 18, liftR: 8, bendR: 0.6, aL: 40, fL: -30, aR: -126, fR: -20 }),
  chase: (phase, side) => {
    const move = smashMove(phase, side)
    return { ...move, pose: { ...move.pose, boulder: 1 } }
  },
  bounce: (phase, side) => {
    if (phase < 0.5) return sideOn(tucked(hop(phase * 2, 90)), hopSide(phase * 2), side)
    return sideOn(tucked(hop(phase * 2 - 1, 210)), hopSide(phase * 2 - 1), side)
  },
  drum: (phase, side, beat) => fromBehind({ ...IDLE, rotL: 10, rotR: -10, aL: 28 + 22 * beat.left, sL: 0.8, fL: -75 + 45 * beat.left, aR: -28 - 22 * beat.right, sR: 0.8, fR: 75 - 45 * beat.right, sticks: 1 }),
  // The bag swings at him: he jumps it, then kicks back at it.
  boss: (phase, side) => {
    if (phase < 0.5) return sideOn(tucked(hop(phase * 2, 120)), mixRig(READY, AIR, bell(phase, 0, 0.5)), side)
    return sideOn(IDLE, mixRig(READY, KICK, bell(phase, 0.5, 1)), side)
  },
  // Two swings of the victory dance, turned three quarters to the camera.
  dance: (phase) => sideOn({ ...IDLE, jump: -12 * bell(phase, 0, 1) }, dance(4 * phase), -THREE_QUARTER),
}

/** The phase at which an action shows its move whole: the frame reduced motion holds. */
const PEAK: Record<Action, number> = { smash: 0.5, ride: 0.5, flop: 0.5, slide: 0.5, chase: 0.5, bounce: 0.75, drum: 0.5, boss: 0.75, dance: 0.125 }

// How far toward its prop the runner steps for each action (1 is on top of it, a platform he lands on).
const REACH: Record<Action, number> = { smash: 0.55, ride: 0.3, flop: 1, slide: 0.4, chase: 0.5, bounce: 1, drum: 0.5, boss: 0.62, dance: 0 }

// How far through the room's items the camera is, fractional: the boulder closes in a step per item.
const itemsReached = (room: RoomGeometry, camZ: number): number => room.items.reduce((sum, item) => sum + clamp01(progressOf(item, camZ) + 1), 0) / room.items.length

// Between props: the run into the screen, the board in the ride room, and in the chase the run from the
// boulder, side on and turned three quarters to the camera with the boulder rolling behind him.
const baseOf = (room: RoomGeometry, camZ: number): Move => {
  const phase = camZ / 46
  if (room.action === 'ride') return fromBehind(ridePose(Math.sin(camZ / 90)))
  if (room.action === 'chase') return sideOn({ ...runPose(phase), boulder: itemsReached(room, camZ) }, sideRun(phase * SIDE_STRIDE), -THREE_QUARTER)
  return fromBehind(runPose(phase))
}

/** The runner at a camera depth: his move and how far across the floor he has stepped toward the prop. */
export interface RunnerState extends Move {
  x: number
}

/** In the hub he stands turned three quarters to the camera, then turns and breaks into a run into the
 *  screen as the camera dives through the ring. */
export function hubRunner(camZ: number): RunnerState {
  return { pose: mix(IDLE, runPose(camZ / 46), smooth(120, 520, camZ)), side: READY, facing: -THREE_QUARTER, x: 0 }
}

/** The item he is acting at: the one whose move, at `phases` (one per item of the room), shows most. */
const actingItem = (room: RoomGeometry, camZ: number, phases: readonly number[]): number =>
  room.items.reduce((best, item, i) => {
    if (!inReach(item, camZ)) return best
    if (best < 0 || amountOf(phases[i]) > amountOf(phases[best])) return i
    return best
  }, -1)

/** In a room he runs between props and makes his move at the one he has reached, each item's move at its
 *  phase in `phases`. */
export function roomRunner(room: RoomGeometry, camZ: number, phases: readonly number[]): RunnerState {
  const base = baseOf(room, camZ)
  const index = actingItem(room, camZ, phases)
  const amount = index < 0 ? 0 : amountOf(phases[index])
  if (amount <= 0) return { ...base, x: 0 }
  const item = room.items[index]
  const move = ACTIONS[room.action](phases[index], item.side, beatAt(camZ))
  const pose = mix(base.pose, move.pose, amount)
  // From behind he turns to the move's own facing; already side on, he turns from his run's.
  const fromFacing = base.pose.look > 0 ? base.facing : move.facing
  return {
    pose: { ...pose, boulder: base.pose.boulder },
    side: mixRig(base.side, move.side, amount),
    facing: lerp(fromFacing, move.facing, amount),
    x: item.x * REACH[room.action] * amount,
  }
}

/** Reduced motion: he holds the room's move at its peak; in the hub he stands as he does at the top. */
export function settledRunner(room: RoomGeometry | null): RunnerState {
  if (!room) return { ...hubRunner(0), x: 0 }
  return { ...ACTIONS[room.action](PEAK[room.action], 1, beatAt(0)), x: 0 }
}
