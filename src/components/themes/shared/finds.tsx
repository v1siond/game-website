'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { addFind, countIn, NO_FINDS, type FindCount, type Finds } from '@/lib/finds'

// The find counter any world can carry: things a visitor finds while reading (a level reached, an item
// picked up), counted per group against the total the world passes. A finder calls `find(id, group)`
// from `useFind()`, which never changes, so finding re-renders only the counter, which reads
// `useFindCount(group)` from its own context. `full` is the world drawn in its final state (reduced
// motion, a preview): every find counts as found. `useRolling` climbs a shown number to a new one.
// The state itself is the pure reducer in src/lib/finds.ts.

type Find = (id: string, group: string) => void

interface FindState {
  finds: Finds
  totals: Readonly<Record<string, number>>
  full: boolean
}

const FindContext = createContext<Find | null>(null)
const FindStateContext = createContext<FindState | null>(null)

const NO_TOTALS: Readonly<Record<string, number>> = {}

// Outside a FindProvider a find is lost; in development that is a mistake worth a loud stop.
function outsideProvider(hook: string): void {
  if (process.env.NODE_ENV === 'development') throw new Error(`${hook} must be called inside a FindProvider`)
}

const ignoreFind: Find = () => undefined

const findReducer = (finds: Finds, { id, group }: { id: string; group: string }): Finds => addFind(finds, id, group)

interface FindProviderProps {
  /** How many finds each group holds, for a counter that shows found of total. */
  totals?: Readonly<Record<string, number>>
  full?: boolean
  children: ReactNode
}

export function FindProvider({ totals = NO_TOTALS, full = false, children }: FindProviderProps) {
  const [finds, dispatch] = useReducer(findReducer, NO_FINDS)
  const find = useCallback<Find>((id, group) => dispatch({ id, group }), [])
  const state = useMemo(() => ({ finds, totals, full }), [finds, totals, full])

  return (
    <FindContext.Provider value={find}>
      <FindStateContext.Provider value={state}>{children}</FindStateContext.Provider>
    </FindContext.Provider>
  )
}

/** `find(id, group)`: counts `id` as found in `group`, once however often it is called. */
export function useFind(): Find {
  const find = useContext(FindContext)
  if (find) return find
  outsideProvider('useFind')
  return ignoreFind
}

/** Found against total in one group. */
export function useFindCount(group: string): FindCount {
  const state = useContext(FindStateContext)
  if (state) return countIn(state.finds, group, state.totals[group], state.full)
  outsideProvider('useFindCount')
  return countIn(NO_FINDS, group)
}

const ROLL_MS = 700

/** The number to show while a counter climbs to `target`: one state write a frame for the roll only,
 *  straight to the target under reduced motion. */
export function useRolling(target: number, ms = ROLL_MS): number {
  const [shown, setShown] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const start = from.current
    if (start === target) return
    if (prefersReducedMotion()) {
      from.current = target
      setShown(target)
      return
    }
    const began = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / ms)
      const value = Math.round(start + (target - start) * (1 - (1 - t) ** 3))
      from.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, ms])

  return shown
}
