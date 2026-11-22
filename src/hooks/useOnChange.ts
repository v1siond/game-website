'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLatest } from '@/hooks/useLatest'

// Reacts to a value changing after the first render: `run(value)` is called from an effect on each change,
// never for the value the component mounted with (a profession picked, not the one the page opened on).
// The call is an effect, so it can start a replay or a state change of its own; `timing: 'layout'` calls it
// before the browser paints the change (a cover that must hide the new room from its first frame), the
// default after it. The latest `run` is called, so it need not be stable.

type Timing = 'passive' | 'layout'

const EFFECT: Record<Timing, typeof useEffect> = { passive: useEffect, layout: useLayoutEffect }

export interface OnChangeOptions {
  timing?: Timing
}

export function useOnChange<T>(value: T, run: (value: T) => void, { timing = 'passive' }: OnChangeOptions = {}): void {
  const seen = useRef(value)
  // Declared first, so the latest run is written before either timing's effect of that commit reads it.
  const runRef = useLatest(run)

  EFFECT[timing](() => {
    if (seen.current === value) return
    seen.current = value
    runRef.current(value)
  }, [value])
}
