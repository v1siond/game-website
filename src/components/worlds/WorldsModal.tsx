'use client'

import { useEffect } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import WorldsGrid from './WorldsGrid'

/**
 * WorldsModal — the "Enter Another World" picker, lifted OUT of the page content flow
 * into a modal. Opened by the theme-selector launcher, closed by the ✕, the backdrop, or
 * Escape. The grid inside styles itself from the current theme, so it keeps its look. */
export default function WorldsModal() {
  const { isWorldsOpen, closeWorlds } = useWorldTransition()
  const { theme } = useTheme()

  // close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isWorldsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWorlds()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isWorldsOpen, closeWorlds])

  if (!isWorldsOpen) return null

  const c = theme.colors
  return (
    <div
      className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="worlds-modal-heading"
    >
      <div
        className="fixed inset-0"
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
        onClick={closeWorlds}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-6xl my-auto rounded-xl"
        style={{
          background: c.background,
          border: `1px solid ${c.accent}55`,
          boxShadow: `0 24px 90px rgba(0,0,0,0.6), 0 0 44px ${c.accent}22`,
        }}
      >
        <button
          onClick={closeWorlds}
          aria-label="Close world picker"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2"
          style={{ color: c.accent, border: `1px solid ${c.accent}55`, background: `${c.background}cc` }}
        >
          ✕
        </button>

        <div className="p-5 md:p-8">
          <h2
            id="worlds-modal-heading"
            className="text-xl md:text-2xl tracking-[0.15em] text-center mb-2"
            style={{ color: c.accent }}
          >
            Enter Another World
          </h2>
          <p className="text-sm text-center mb-6 opacity-70" style={{ color: c.secondary }}>
            Step through to a different version of this realm
          </p>
          <WorldsGrid />
        </div>
      </div>
    </div>
  )
}
