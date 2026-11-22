'use client'

import { useEffect, useState } from 'react'

// A scene that plays as a chain of timed steps: once `on`, the first step starts after `firstMs`, and each
// step then holds for its own duration before the next one starts, up to the last, which stays. The
// returned index is -1 before the first step. Under `reduced` the scene is settled: the last step from the
// start and no timer. Each step is timed from the commit of the one before, so a chain of steps never
// drifts ahead of what is on screen. `durations` must keep its identity between renders (a module
// constant or a memo): a new array restarts the step playing.

export interface TimedStepsOptions {
  on: boolean
  reduced: boolean
  /** The wait before the first step, from the moment `on` turns true. */
  firstMs: number
}

export function useTimedSteps(durations: readonly number[], { on, reduced, firstMs }: TimedStepsOptions): number {
  const [step, setStep] = useState(-1)
  const last = durations.length - 1

  useEffect(() => {
    if (reduced || !on || step >= last) return
    const timer = window.setTimeout(() => setStep((at) => at + 1), step < 0 ? firstMs : durations[step])
    return () => window.clearTimeout(timer)
  }, [on, step, last, durations, reduced, firstMs])

  if (reduced) return last
  return step
}
