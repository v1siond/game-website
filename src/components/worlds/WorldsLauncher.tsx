'use client'

import type { CSSProperties } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { useWorldsNudge } from '@/hooks/useWorldsNudge'
import { launcherColors } from '@/lib/worlds/nudge'
import type { ThemeColors } from '@/themes/themes'
import WorldsHint from './WorldsHint'

/** The custom properties worlds-nudge.css paints the launcher and the hint from. */
export function launcherVars(colors: ThemeColors): CSSProperties {
  const { text, body, fill, edge } = launcherColors(colors)
  return { '--wl-text': text, '--wl-body': body, '--wl-fill': fill, '--wl-edge': edge } as CSSProperties
}

/**
 * WorldsLauncher, top right in every world: names itself with the world count ("17 worlds", stacked on a
 * phone so it clears the worlds' own top bars) and opens the WorldsModal. Under it, once per visit, the
 * WorldsHint offers "Next world" (see useWorldsNudge for when).
 */
export default function WorldsLauncher() {
  const { openWorlds, isWorldsOpen, isTransitioning } = useWorldTransition()
  const { theme } = useTheme()
  const nudge = useWorldsNudge()

  if (isWorldsOpen || isTransitioning) return null

  const vars = launcherVars(theme.colors)
  return (
    <>
      <button
        type="button"
        onClick={openWorlds}
        aria-label={`${nudge.total} worlds, choose another world`}
        title={`This CV comes in ${nudge.total} worlds`}
        style={vars}
        className="c-worlds-launcher fixed top-2 right-1 z-[150] flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg px-0.5 py-1 leading-none sm:top-4 sm:right-4 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2"
      >
        <span aria-hidden="true" className="hidden text-base leading-none sm:inline">◈</span>
        <span className="text-base font-bold leading-tight sm:text-sm">{nudge.total}</span>
        <span className="text-sm leading-tight tracking-normal sm:tracking-wider">worlds</span>
      </button>
      {nudge.hintOpen && (
        <WorldsHint
          style={vars}
          worldName={theme.name}
          seenCount={nudge.seenCount}
          total={nudge.total}
          onNext={nudge.nextWorld}
          onAll={nudge.allWorlds}
          onClose={nudge.closeHint}
        />
      )}
    </>
  )
}
