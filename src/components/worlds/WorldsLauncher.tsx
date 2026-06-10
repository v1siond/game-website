'use client'

import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'

/**
 * WorldsLauncher — the re-added "theme selector". A small floating button (bottom-left,
 * so it clears the Dark Fantasy knight in the bottom-right) that opens the WorldsModal.
 * Styled from the current theme so it fits whichever world you're in. */
export default function WorldsLauncher() {
  const { openWorlds, isWorldsOpen, isTransitioning } = useWorldTransition()
  const { theme } = useTheme()

  if (isWorldsOpen || isTransitioning) return null

  const c = theme.colors
  return (
    <button
      onClick={openWorlds}
      aria-label="Choose another world"
      className="fixed bottom-5 left-5 z-[150] inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm tracking-wider transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
      style={{
        color: c.accent,
        background: `${c.background}e6`,
        border: `1px solid ${c.accent}66`,
        boxShadow: `0 6px 24px rgba(0,0,0,0.45), 0 0 16px ${c.accent}22`,
        backdropFilter: 'blur(6px)',
      }}
    >
      <span aria-hidden="true" className="text-base leading-none">◈</span>
      <span className="hidden sm:inline">Worlds</span>
    </button>
  )
}
