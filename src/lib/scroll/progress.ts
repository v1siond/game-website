// Pure math behind the scroll scenes: how far a section's scene has played, and the once only state
// machine (idle, playing, done). No DOM here, so the hook stays a thin adapter.

export type ScenePhase = 'idle' | 'playing' | 'done'

export interface SceneState {
  phase: ScenePhase
  progress: number
}

// Where the scene starts and ends, as fractions of the viewport height measured from its top:
// the scene starts when the section's top crosses `start` and is complete when it crosses `end`.
export interface SceneLines {
  start?: number
  end?: number
}

export const SCENE_IDLE: SceneState = { phase: 'idle', progress: 0 }
export const SCENE_DONE: SceneState = { phase: 'done', progress: 1 }

const DEFAULT_START = 1
const DEFAULT_END = 0.5

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function sectionProgress(
  sectionTop: number,
  viewportHeight: number,
  { start = DEFAULT_START, end = DEFAULT_END }: SceneLines = {},
): number {
  const startLine = viewportHeight * start
  const travel = startLine - viewportHeight * end
  if (travel <= 0) return 1
  return clamp01((startLine - sectionTop) / travel)
}

// A finished scene never plays again: once done it ignores scrolling back.
export function advanceScene(state: SceneState, rawProgress: number): SceneState {
  if (state.phase === 'done') return state
  const progress = clamp01(rawProgress)
  if (progress >= 1) return SCENE_DONE
  return { phase: 'playing', progress }
}

// One frame's work for many scenes: a layout read, then a style write that uses it.
export interface FrameTask<Reading> {
  read: () => Reading
  write: (reading: Reading) => void
}

// Every read runs before any write, so a frame forces layout once instead of once per scene (a write
// between two reads invalidates the layout the next read needs). The tasks are copied first, so a
// write that releases a scene from a live Set neither skips nor repeats another scene this frame.
export function readThenWrite<Reading>(tasks: Iterable<FrameTask<Reading>>): void {
  const readings = Array.from(tasks, (task) => [task, task.read()] as const)
  readings.forEach(([task, reading]) => task.write(reading))
}

// A travel scene stretches one scene over a section's whole height. It starts as the section's top
// crosses TRAVEL_START and ends a third of a screen (ARRIVE_EARLY) before the section leaves, so the
// last entry is read with the scene finished; a short section still travels MIN_TRAVEL.
const TRAVEL_START = 0.85
const ARRIVE_EARLY = 0.35
const MIN_TRAVEL = 0.3

const roundLine = (value: number) => Math.round(value * 100) / 100

/** Scene lines that stretch one scene over a section's whole height, in viewport fractions. */
export function travelLines(sectionHeight: number, viewportHeight: number): SceneLines {
  if (viewportHeight <= 0) return { start: TRAVEL_START, end: roundLine(TRAVEL_START - MIN_TRAVEL) }
  const travel = Math.max(MIN_TRAVEL, sectionHeight / viewportHeight - ARRIVE_EARLY)
  return { start: TRAVEL_START, end: roundLine(TRAVEL_START - travel) }
}
