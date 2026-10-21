'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import shade from './shade.module.css'

// The world's one transition, the death cut of a silhouette platformer: the screen drops to black at
// once, holds, and the scene fades back in with him respawned. A lever pull and the sprung trap call
// cut(); the change they make (a new profession, the trap reset) runs while the screen is black.
// Reduced motion makes the change with no cut.

type CutPhase = 'clear' | 'black' | 'fade'

const HOLD_MS = 280
const FADE_MS = 620

const PHASE_LOOK: Record<CutPhase, string> = {
  clear: 'opacity-0',
  black: 'opacity-100',
  fade: `opacity-0 ${shade.cutFade}`,
}

type Cut = (atBlack?: () => void) => void

const CutContext = createContext<Cut>((atBlack) => atBlack?.())

export const useCut = () => useContext(CutContext)

export function CutProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<CutPhase>('clear')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const cut = useCallback<Cut>((atBlack) => {
    if (prefersReducedMotion()) {
      atBlack?.()
      return
    }
    timers.current.forEach((timer) => window.clearTimeout(timer))
    setPhase('black')
    atBlack?.()
    timers.current = [
      window.setTimeout(() => setPhase('fade'), HOLD_MS),
      window.setTimeout(() => setPhase('clear'), HOLD_MS + FADE_MS),
    ]
  }, [])

  return (
    <CutContext.Provider value={cut}>
      {children}
      <div className={`pointer-events-none fixed inset-0 z-[70] bg-[color:var(--sh-black)] ${PHASE_LOOK[phase]}`} aria-hidden="true" />
    </CutContext.Provider>
  )
}
