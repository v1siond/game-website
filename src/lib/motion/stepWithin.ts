// The length of each of `count` equal steps that follow a `fixed` lead in, so the whole run ends by
// `budget` (all in ms): the step as asked while every step fits, else the share of what is left, rounded
// down so the last step never lands late. A scene that grows with its items (a beat per card) keeps its
// pace for a short list and plays faster for a long one, always inside the budget (BD29, 5 s).

/** The longest a scene's story may run from its trigger (BD29). */
export const STORY_MS = 5000

export interface StepBudget {
  step: number
  count: number
  fixed: number
  budget: number
}

export function stepWithin({ step, count, fixed, budget }: StepBudget): number {
  if (count <= 0) return step
  const share = Math.floor((budget - fixed) / count)
  return Math.max(0, Math.min(step, share))
}
