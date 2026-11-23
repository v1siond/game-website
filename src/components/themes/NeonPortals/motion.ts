import { hop } from '@/lib/motion/arc'
import { clamp01 } from '@/lib/scroll/progress'
import type { Action } from './plan'
import { DF, smooth, STEP, type ItemSpot, type RoomGeometry } from './world'

// What the scroll makes the props and the runner do. Every value is a pure function of the camera's depth,
// so stopping the scroll stops everything and scrolling up plays it backwards. Nothing here keeps time.

/** How far along an item the camera is: 0 when its prop is level with the runner, 1 one step past it. */
export const progressOf = (item: ItemSpot, camZ: number): number => (camZ - (item.z - DF)) / STEP

/** An item counts as found once the runner has reached its prop. */
const isFound = (item: ItemSpot, camZ: number): boolean => progressOf(item, camZ) >= 0.02

const nearestItem = (room: RoomGeometry, camZ: number): ItemSpot =>
  room.items.reduce((best, item) => (Math.abs(progressOf(item, camZ)) < Math.abs(progressOf(best, camZ)) ? item : best), room.items[0])

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

const actionOf = (u: number): { phase: number; amount: number } => {
  if (Math.abs(u) >= ACTION_REACH) return { phase: 0, amount: 0 }
  const phase = clamp01((u + ACTION_REACH) / (2 * ACTION_REACH))
  return { phase, amount: Math.sin(Math.PI * phase) }
}

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

export function propStateAt(item: ItemSpot, camZ: number): PropState {
  const u = progressOf(item, camZ)
  return { open: smooth(-0.28, 0.02, u), amount: actionOf(u).amount, beat: beatAt(camZ).left, swing: swingOf(u) }
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

export type Pose = Record<(typeof POSE_KEYS)[number], number>

// `look` is how far he has turned his head to the camera: 0 seen from behind, 1 his face. `board` shows the
// hover board under his feet, `boulder` how close the rolling boulder behind him has come (0 to 1).
const IDLE: Pose = { jump: 0, lean: 0, spin: 1, liftL: 0, bendL: 1, rotL: 3, liftR: 0, bendR: 1, rotR: -3, aL: 10, sL: 1, fL: 0, aR: -10, sR: 1, fR: 0, sticks: 0, wave: 0, look: 1, board: 0, boulder: 0 }

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

const mix = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(POSE_KEYS.map((key) => [key, lerp(a[key], b[key], t)])) as Pose

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

type ActionPose = (phase: number, side: 1 | -1, beat: Beat) => Pose

// Low on the board, knees bent, arms out for balance, leaning into the turn the scroll gives.
const ridePose = (turn: number): Pose => ({ ...IDLE, jump: 18, lean: 12 * turn, liftL: 8, bendL: 0.72, liftR: 8, bendR: 0.72, aL: 64, fL: -20, aR: -64, fR: 20, look: 0, board: 1 })

// Arms out, one knee up: the spin that smashes a crate, turning twice as the move plays.
const smashPose = (phase: number): Pose => ({ ...IDLE, jump: -14, spin: Math.cos(phase * Math.PI * 4), aL: 92, aR: -92, liftL: 14, bendL: 0.8 })

// The kick of the boss round: chambered on the side of the bag.
const kickPose = (side: 1 | -1): Pose => {
  if (side > 0) return { ...IDLE, lean: -14, rotR: -84, aL: 34, fL: -125, aR: -46, fR: 115 }
  return { ...IDLE, lean: 14, rotL: 84, aL: 46, fL: -115, aR: -34, fR: 125 }
}

const tucked = (height: number): Pose => ({ ...IDLE, jump: -height, liftL: 40, bendL: 0.5, liftR: 40, bendR: 0.5, aL: 150, fL: 30, aR: -150, fR: -30 })

// Each action from its phase (0 to 1), the prop's side and the scroll beat. Most peak at phase 0.5; the two
// that come in two parts (a double bounce, a dodge then a kick) peak on their second part (PEAK).
const ACTIONS: Record<Action, ActionPose> = {
  smash: (phase) => smashPose(phase),
  ride: (phase, side) => ({ ...ridePose(side), jump: 18 - hop(phase, 70) }),
  // Up, a beat in the air spread flat, then down on the iron crate.
  flop: (phase) => ({ ...IDLE, jump: -hop(phase, 190), liftL: 26, bendL: 0.9, rotL: 34, liftR: 26, bendR: 0.9, rotR: -34, aL: 118, fL: 10, aR: -118, fR: -10 }),
  // A low skid on one hip under the beam, the lead leg out ahead.
  slide: (phase, side) => ({ ...IDLE, jump: 70, lean: side * 28, liftL: 46, bendL: 0.42, rotL: 18, liftR: 8, bendR: 0.6, aL: 40, fL: -30, aR: -126, fR: -20, look: 0 }),
  chase: (phase) => ({ ...smashPose(phase), boulder: 1 }),
  bounce: (phase) => {
    if (phase < 0.5) return tucked(hop(phase * 2, 90))
    return tucked(hop(phase * 2 - 1, 210))
  },
  drum: (phase, side, beat) => ({ ...IDLE, rotL: 10, rotR: -10, aL: 28 + 22 * beat.left, sL: 0.8, fL: -75 + 45 * beat.left, aR: -28 - 22 * beat.right, sR: 0.8, fR: 75 - 45 * beat.right, sticks: 1 }),
  // The bag swings at him: he jumps it, then kicks back.
  boss: (phase, side) => {
    if (phase < 0.5) return tucked(hop(phase * 2, 120))
    return kickPose(side)
  },
  dance: (phase, side, beat) => ({ ...IDLE, jump: -12 * Math.abs(beat.wave), lean: 10 * beat.wave, liftL: 20 * beat.left, bendL: 1 - 0.3 * beat.left, liftR: 20 * beat.right, bendR: 1 - 0.3 * beat.right, aL: 120 + 30 * beat.left, fL: 40, aR: -120 - 30 * beat.right, fR: -40 }),
}

/** The phase at which an action shows its move whole: the frame reduced motion holds. */
const PEAK: Record<Action, number> = { smash: 0.5, ride: 0.5, flop: 0.5, slide: 0.5, chase: 0.5, bounce: 0.75, drum: 0.5, boss: 0.75, dance: 0.5 }

// How far toward its prop the runner steps for each action (1 is on top of it, a platform he lands on).
const REACH: Record<Action, number> = { smash: 0.55, ride: 0.3, flop: 1, slide: 0.4, chase: 0.5, bounce: 1, drum: 0.5, boss: 0.62, dance: 0 }

// How far through the room's items the camera is, fractional: the boulder closes in a step per item.
const itemsReached = (room: RoomGeometry, camZ: number): number => room.items.reduce((sum, item) => sum + clamp01(progressOf(item, camZ) + 1), 0) / room.items.length

// Between props: the run into the screen, the board in the ride room, the front run with the boulder in the chase.
const baseOf = (room: RoomGeometry, camZ: number): Pose => {
  const run = runPose(camZ / 46)
  if (room.action === 'ride') return ridePose(Math.sin(camZ / 90))
  if (room.action === 'chase') return { ...run, look: 1, boulder: itemsReached(room, camZ) }
  return run
}

/** The runner at a camera depth: his pose and how far across the floor he has stepped toward the prop. */
export interface RunnerState {
  pose: Pose
  x: number
}

/** In the hub he stands, then breaks into a run as the camera dives through the ring. */
export function hubRunner(camZ: number): RunnerState {
  return { pose: mix(IDLE, runPose(camZ / 46), smooth(120, 520, camZ)), x: 0 }
}

/** In a room he runs between props and acts at the nearest one, turning to grin at the camera as he does. */
export function roomRunner(room: RoomGeometry, camZ: number): RunnerState {
  const item = nearestItem(room, camZ)
  const { phase, amount } = actionOf(progressOf(item, camZ))
  const base = baseOf(room, camZ)
  if (amount <= 0) return { pose: base, x: 0 }
  const pose = mix(base, ACTIONS[room.action](phase, item.side, beatAt(camZ)), amount)
  return { pose: { ...pose, boulder: base.boulder }, x: item.x * REACH[room.action] * amount }
}

/** Reduced motion: he holds the room's action at its peak, facing the camera; the hub's idle above. */
export function settledRunner(room: RoomGeometry | null): RunnerState {
  if (!room) return { pose: IDLE, x: 0 }
  return { pose: ACTIONS[room.action](PEAK[room.action], 1, beatAt(0)), x: 0 }
}
