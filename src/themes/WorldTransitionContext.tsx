'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { useTheme } from './ThemeContext'
import { getThemeById } from './themes'
import WorldPortal, { PORTAL_VARIANTS, type PortalVariant } from '@/components/worlds/WorldPortal'

const COVER_MS = 720
const REVEAL_MS = 620

interface WorldTransitionContextType {
  /** Animate a portal, then load the world, scroll to top, and persist the choice. */
  selectWorld: (id: string) => void
  isTransitioning: boolean
}

const WorldTransitionContext = createContext<WorldTransitionContextType | undefined>(undefined)

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export function WorldTransitionProvider({ children }: { children: ReactNode }) {
  const { theme, setThemeById } = useTheme()
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle')
  const [variant, setVariant] = useState<PortalVariant>('vortex')
  const [destId, setDestId] = useState<string | null>(null)
  const timers = useRef<number[]>([])
  // "Shuffle bag": draw all 4 variants once before any repeats, and never repeat
  // back-to-back across bag refills. Keeps successive transitions feeling distinct.
  const bag = useRef<PortalVariant[]>([])
  const lastVariant = useRef<PortalVariant | null>(null)

  useEffect(() => {
    const t = timers.current
    return () => t.forEach((id) => clearTimeout(id))
  }, [])

  const selectWorld = useCallback(
    (id: string) => {
      if (id === theme.id) return // already in this world

      // Reduced-motion (or non-DOM env): swap instantly, no portal.
      if (prefersReducedMotion()) {
        setThemeById(id)
        if (typeof window !== 'undefined') window.scrollTo(0, 0)
        return
      }

      // Refill the bag with a fresh shuffled deck of all 4 when empty.
      if (bag.current.length === 0) {
        const deck = [...PORTAL_VARIANTS]
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }
        // Avoid an immediate repeat at the bag boundary.
        if (deck[0] === lastVariant.current && deck.length > 1) {
          ;[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]]
        }
        bag.current = deck
      }
      const next = bag.current.shift()!
      lastVariant.current = next
      setVariant(next)
      setDestId(id)
      setPhase('cover')

      // At the cover peak the screen is fully obscured — swap the world + jump to top.
      const t1 = window.setTimeout(() => {
        setThemeById(id)
        window.scrollTo(0, 0)
        setPhase('reveal')

        const t2 = window.setTimeout(() => {
          setPhase('idle')
          setDestId(null)
        }, REVEAL_MS)
        timers.current.push(t2)
      }, COVER_MS)
      timers.current.push(t1)
    },
    [theme.id, setThemeById]
  )

  const destTheme = destId ? getThemeById(destId) : theme

  return (
    <WorldTransitionContext.Provider value={{ selectWorld, isTransitioning: phase !== 'idle' }}>
      {children}
      {phase !== 'idle' && (
        <WorldPortal
          variant={variant}
          phase={phase}
          accent={destTheme.colors.accent}
          secondary={destTheme.colors.secondary}
          background={destTheme.colors.background}
          worldName={destTheme.name}
          coverMs={COVER_MS}
          revealMs={REVEAL_MS}
        />
      )}
    </WorldTransitionContext.Provider>
  )
}

export function useWorldTransition(): WorldTransitionContextType {
  const ctx = useContext(WorldTransitionContext)
  if (!ctx) {
    throw new Error('useWorldTransition must be used within a WorldTransitionProvider')
  }
  return ctx
}
