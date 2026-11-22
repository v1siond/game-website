import { legFrom, restSpot, type LegsFrom, type Spot } from '@/lib/motion/course'

// Every set piece of the world as data: where he starts, the beats he plays one after another, and the
// pose he holds once they are over. A beat ends on the animationend of his own rig (stage.tsx), which
// usePoseSequence turns into the next beat, so the timings here are the only clock. No React here, so
// the rules are tested alone (choreography.test.ts): a section's scene ends within 5 s, a one shot move
// under 1 s, the hero's entrance within 3 s, and every scene rests on a held last frame (BD29).

/** His poses, one CSS class each in character.module.css. */
export const POSES = [
  'idle',
  'scratch',
  'run',
  'pull',
  'spin',
  'hit',
  'point',
  'drum',
  'guard',
  'knee',
  'press',
  'dance',
  'hop',
] as const

export type Pose = (typeof POSES)[number]

export interface Beat {
  name: string
  pose: Pose
  ms: number
  /** Where he is when the beat ends (lift in % of the stage's height); the beat moves him there from where the last one ended. */
  to: Spot
}

/** A scene: its beats are the legs of the shared course (src/lib/motion/course.ts), one after another. */
export interface Scene extends LegsFrom<Beat> {
  /** The pose he holds once the beats are over. */
  rest: Pose
}

/** What his rig shows for one step of a scene: a beat moving him, or the rest standing still. */
export interface Motion {
  pose: Pose
  from: Spot
  to: Spot
  ms: number
}

export const sceneMs = (scene: Scene): number => scene.legs.reduce((total, beat) => total + beat.ms, 0)

/** When a beat starts, counted from the start of the scene. */
export function beatStart(scene: Scene, name: string): number {
  const index = scene.legs.findIndex((beat) => beat.name === name)
  return scene.legs.slice(0, Math.max(0, index)).reduce((total, beat) => total + beat.ms, 0)
}

/** The motion of step `index`: the beat playing, or the held rest once every beat has played. */
export function motionAt(scene: Scene, index: number): Motion {
  const beat = scene.legs[index]
  const rest = restSpot(scene)
  if (!beat) return { pose: scene.rest, from: rest, to: rest, ms: 0 }
  return { pose: beat.pose, from: legFrom(scene, index), to: beat.to, ms: beat.ms }
}

// The hero: the platform rises, the three pads light in turn, he beams onto the picked pad and the clock
// ring behind his name glows, all once per page load. A switch replays only his hop and the sphere's swap.
export const HERO_TIMING = {
  platform: { at: 0, ms: 700 },
  pads: { at: 500, step: 220, ms: 420 },
  beam: { at: 1250, ms: 700 },
  ring: { at: 1950, ms: 700 },
  hopMs: 700,
  swapMs: 600,
  // He scratches his head when the pointer rests on the scene 1.5 s, at most once every 8 s.
  scratch: { restMs: 1500, everyMs: 8000, ms: 1200 },
} as const

export const PAD_COUNT = 3

/** When the hero's entrance has played out: the latest of its parts to end. */
export function heroEntranceMs(): number {
  const { platform, pads, beam, ring } = HERO_TIMING
  const padsEnd = pads.at + (PAD_COUNT - 1) * pads.step + pads.ms
  return Math.max(platform.at + platform.ms, padsEnd, beam.at + beam.ms, ring.at + ring.ms)
}

// About: he walks up to the count box, pulls the plunger on its side, the three light pips on its lid
// blink in three beats and its front panel swings open; the box stays whole (research part 2 [13]).
/** Where he stops to pull; the count box is placed from it (countBox.tsx), so his hand meets the plunger. */
export const AT_PLUNGER: Spot = { x: 38, lift: 0 }

export const COUNT_BOX: Scene = {
  start: { x: 8, lift: 0 },
  legs: [
    { name: 'walk', pose: 'run', ms: 600, to: AT_PLUNGER },
    { name: 'pull', pose: 'pull', ms: 500, to: AT_PLUNGER },
    { name: 'count', pose: 'idle', ms: 900, to: AT_PLUNGER },
    { name: 'open', pose: 'hop', ms: 400, to: AT_PLUNGER },
  ],
  rest: 'idle',
}

export const PIPS = 3

const PIP_MS = 300

/** When pip `index` lights, counted from the start of the scene. */
export const pipAt = (index: number): number => beatStart(COUNT_BOX, 'count') + index * PIP_MS

// Work Experience: he runs the path left to right past one checkpoint post per job, current job first.
// Scroll scrubs his place along it (useScrollScene); post i lights halfway through its share of the path,
// the moment he passes it. "Run" plays the whole path in RUN_MS, then scroll takes over again.
export const PATH = { from: 4, to: 94 } as const

export const RUN_MS = 3000

/** The scroll progress (0 to 1) at which post `index` of `count` lights. */
export const postAt = (index: number, count: number): number => (index + 0.5) / count

/** Where post `index` stands along the strip, in %: where he is when it lights. */
export const postX = (index: number, count: number): number => PATH.from + postAt(index, count) * (PATH.to - PATH.from)

// Tech Stack: he spins across the row above the boxes and each X braced box breaks into planks in turn,
// a step apart: 0.3 s, closer when there are many, so the last box breaks within 3.5 s of the start.
const BREAK_LEAD_MS = 300
const BREAK_MS = 700
const STAGGER_SPAN_MS = 3500
const STAGGER_MAX_MS = 300

export const techStep = (count: number): number => Math.min(STAGGER_MAX_MS, Math.floor(STAGGER_SPAN_MS / count))

/** When box `index` of `count` breaks, counted from the start of the spin. */
export const breakAt = (index: number, count: number): number => BREAK_LEAD_MS + index * techStep(count)

export const BOX_BREAK = { leadMs: BREAK_LEAD_MS, ms: BREAK_MS } as const

/** The spin: across the row, lasting until the last box has broken. */
export const techScene = (count: number): Scene => ({
  start: { x: 6, lift: 0 },
  legs: [{ name: 'spin', pose: 'spin', ms: breakAt(Math.max(0, count - 1), count) + BREAK_MS, to: { x: 94, lift: 0 } }],
  rest: 'idle',
})

// Services: he runs under the riveted ! iron box, jumps head first into it from below and lands; the box
// rings and every service card's outline frame turns solid, one a moment after the other (research part 2
// [21]: the ! box makes outline boxes real).
const UNDER_BOX: Spot = { x: 50, lift: 0 }

export const IRON_BOX: Scene = {
  start: { x: 6, lift: 0 },
  legs: [
    { name: 'run', pose: 'run', ms: 400, to: UNDER_BOX },
    { name: 'hit', pose: 'hit', ms: 500, to: { x: UNDER_BOX.x, lift: 55 } },
    { name: 'land', pose: 'idle', ms: 300, to: UNDER_BOX },
  ],
  rest: 'idle',
}

const FRAME_STEP_MS = 60

/** When service card `index` turns solid, counted from the start of the scene. */
export const frameAt = (index: number): number => beatStart(IRON_BOX, 'land') + index * FRAME_STEP_MS

// Projects: he stands in the row above the spheres and points his front arm at the card the visitor
// points at or focuses: `share` is how far across the grid the card's centre sits (0 left, 1 right), and
// the turn is his arm's, 0 hanging down, positive across his body to the left.
const AIM_SPAN_DEG = 150
const AIM_OUT_DEG = 20

export const aimAt = (share: number): number => (0.5 - Math.min(1, Math.max(0, share))) * AIM_SPAN_DEG - AIM_OUT_DEG

// Ventures: he runs into the row above the cards when the section shows; pressing a venture's "Collect"
// runs him to its gem, and once he is there the gem flies up into the tally.
export const GEMS_IN: Scene = {
  start: { x: -6, lift: 0 },
  legs: [{ name: 'enter', pose: 'run', ms: 800, to: { x: 10, lift: 0 } }],
  rest: 'idle',
}

export const COLLECT = { glideMs: 500, flightMs: 700 } as const

const onRow = (x: number): Spot => ({ x, lift: 0 })

/** His motion along the row: running from `from` to `to` while he collects, else standing at `to`. */
export function collectMotion(from: number, to: number, moving: boolean): Motion {
  if (!moving) return { pose: 'idle', from: onRow(to), to: onRow(to), ms: 0 }
  return { pose: 'run', from: onRow(from), to: onRow(to), ms: COLLECT.glideMs }
}

// Bands: he runs to each band's box in turn and drums a roll of five beats on its lid with his sticks; on
// the fifth the lid springs open (research part 2 [7], the box bounced five times). The travel is 0.3 s
// and a beat 0.16 s, both shorter when there are many bands, so the whole set ends within 4.6 s.
const BAND_SPAN_MS = 4600
const TRAVEL_MAX_MS = 300
const TRAVEL_SHARE = 0.5
const BEAT_MAX_MS = 160
const HITS = 5

export function bandTiming(count: number): { travelMs: number; beatMs: number } {
  const perBox = BAND_SPAN_MS / count
  const travelMs = Math.min(TRAVEL_MAX_MS, Math.floor(perBox * TRAVEL_SHARE))
  return { travelMs, beatMs: Math.min(BEAT_MAX_MS, Math.floor((perBox - travelMs) / HITS)) }
}

/** Where box `index` of `count` stands along the strip, in %. */
export const boxX = (index: number, count: number): number => (count === 1 ? 50 : 16 + (index * 70) / (count - 1))

// He drums standing just left of the box.
const BESIDE_BOX = 7

export function bandScene(count: number): Scene {
  const { travelMs, beatMs } = bandTiming(count)
  const beats = Array.from({ length: count }, (_, index): Beat[] => {
    const at: Spot = { x: boxX(index, count) - BESIDE_BOX, lift: 0 }
    return [
      { name: `travel-${index}`, pose: 'run', ms: travelMs, to: at },
      { name: `roll-${index}`, pose: 'drum', ms: HITS * beatMs, to: at },
    ]
  }).flat()
  return { start: { x: 0, lift: 0 }, legs: beats, rest: 'idle' }
}

/** When lid `index` of `count` springs open: the fifth beat of its roll, counted from the scene's start. */
export function lidAt(index: number, count: number): number {
  const { travelMs, beatMs } = bandTiming(count)
  return (index + 1) * (travelMs + HITS * beatMs)
}

// Muay Thai: the carved mask comes one step toward him per achievement; the game stacks three mask boxes,
// so a fourth achievement adds no step.
const MASK_STEP_MAX = 3

export const maskSteps = (achievements: number): number => Math.min(MASK_STEP_MAX, achievements)

/** Where his guard stands on the strip, and the mask's place over his face at its last step. */
export const MASK_GUARD = { x: 30, lift: 17, scale: 1 }
const MASK_START = { x: 84, lift: 9, scale: 0.7 }

/** The mask's place at a step: x and lift in % of the strip, scale of its full size; the last step is on his face. */
export const maskSpot = (step: number, steps: number): typeof MASK_GUARD => {
  if (steps === 0) return MASK_START
  const share = step / steps
  const toward = (from: number, to: number) => from + (to - from) * share
  return {
    x: toward(MASK_START.x, MASK_GUARD.x),
    lift: toward(MASK_START.lift, MASK_GUARD.lift),
    scale: toward(MASK_START.scale, MASK_GUARD.scale),
  }
}

/** Each mask step takes 1 s: his rig's beat and the mask's own move (masks.module.css reads --step-ms). */
export const MASK_STEP_MS = 1000

const AT_GUARD: Spot = { x: MASK_GUARD.x, lift: 0 }

/** The mask's steps as beats: his guard braced on each, the victory knee on the last. */
export const maskScene = (steps: number): Scene => ({
  start: AT_GUARD,
  legs: Array.from({ length: steps }, (_, index) => ({
    name: `step-${index + 1}`,
    pose: index === steps - 1 ? 'knee' : 'guard',
    ms: MASK_STEP_MS,
    to: AT_GUARD,
  })),
  rest: steps > 0 ? 'knee' : 'guard',
})

/** His rig at a mask step: the step's beat while the mask moves, then that beat's pose held still. */
export const maskMotion = (scene: Scene, step: number, moving: boolean): Motion => {
  if (moving) return motionAt(scene, step - 1)
  const pose = scene.legs[step - 1]?.pose ?? 'guard'
  return { pose, from: AT_GUARD, to: AT_GUARD, ms: 0 }
}

// Contact: he walks to the save monitor and presses it. A full tally ends on the hologram turning into the
// gem, the flash and his victory dance (under 2 s); a tally not yet full ends on the screen blinking once.
const AT_MONITOR: Spot = { x: 56, lift: 0 }

const SAVE_START: readonly Beat[] = [
  { name: 'walk', pose: 'run', ms: 700, to: AT_MONITOR },
  { name: 'press', pose: 'press', ms: 400, to: AT_MONITOR },
]

const SAVE_END: Record<'full' | 'short', Beat> = {
  full: { name: 'gem', pose: 'dance', ms: 1800, to: AT_MONITOR },
  short: { name: 'blink', pose: 'idle', ms: 500, to: AT_MONITOR },
}

export const SAVE_FROM: Spot = { x: 14, lift: 0 }

/** The save: the same walk and press, then the ending the tally earns. */
export const saveScene = (full: boolean): Scene => ({
  start: SAVE_FROM,
  legs: [...SAVE_START, SAVE_END[full ? 'full' : 'short']],
  rest: 'idle',
})
