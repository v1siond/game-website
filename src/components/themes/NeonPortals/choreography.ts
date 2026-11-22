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

/** A place on a stage: x in % of its width, lift in % of its height over the ground. */
export interface Spot {
  x: number
  lift: number
}

export interface Beat {
  name: string
  pose: Pose
  ms: number
  /** Where he is when the beat ends; the beat moves him there from where the last one ended. */
  to: Spot
}

export interface Scene {
  start: Spot
  beats: readonly Beat[]
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

export const sceneMs = (scene: Scene): number => scene.beats.reduce((total, beat) => total + beat.ms, 0)

/** When a beat starts, counted from the start of the scene. */
export function beatStart(scene: Scene, name: string): number {
  const index = scene.beats.findIndex((beat) => beat.name === name)
  return scene.beats.slice(0, Math.max(0, index)).reduce((total, beat) => total + beat.ms, 0)
}

export const restSpot = (scene: Scene): Spot => scene.beats.at(-1)?.to ?? scene.start

/** The motion of step `index`: the beat playing, or the held rest once every beat has played. */
export function motionAt(scene: Scene, index: number): Motion {
  const beat = scene.beats[index]
  const rest = restSpot(scene)
  if (!beat) return { pose: scene.rest, from: rest, to: rest, ms: 0 }
  const from = index === 0 ? scene.start : scene.beats[index - 1].to
  return { pose: beat.pose, from, to: beat.to, ms: beat.ms }
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
const AT_PLUNGER: Spot = { x: 38, lift: 0 }

export const COUNT_BOX: Scene = {
  start: { x: 8, lift: 0 },
  beats: [
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
  beats: [{ name: 'spin', pose: 'spin', ms: breakAt(Math.max(0, count - 1), count) + BREAK_MS, to: { x: 94, lift: 0 } }],
  rest: 'idle',
})

// Muay Thai: the carved mask comes one step toward him per achievement; the game stacks three mask boxes,
// so a fourth achievement adds no step.
const MASK_STEP_MAX = 3

export const maskSteps = (achievements: number): number => Math.min(MASK_STEP_MAX, achievements)
