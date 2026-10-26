'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { useWorldsNudge } from '@/hooks/useWorldsNudge'
import { fillLabel } from '@/lib/cv/labels'
import { launcherColors } from '@/lib/worlds/nudge'
import { getThemeById, type ThemeColors } from '@/themes/themes'
import WorldsHint from './WorldsHint'
import { useWorldsLabels } from './WorldsLabels'

/** The custom properties worlds-nudge.css paints the launcher, the hint and the picker from. */
export function launcherVars(colors: ThemeColors): CSSProperties {
  const { text, body, fill, edge } = launcherColors(colors)
  return { '--wl-text': text, '--wl-body': body, '--wl-fill': fill, '--wl-edge': edge } as CSSProperties
}

/**
 * WorldsLauncher, top right in every world: names itself with the world count ("17 worlds", stacked on a
 * phone so it clears the worlds' own top bars) and opens the WorldsModal. Under it, once per visit, the
 * WorldsHint names the next world in the tour (see useWorldsNudge for when and where). While the picker is
 * open or a world is loading it stays mounted but hidden and inert, so the focus can come back to it, or to
 * the control that opened the picker, when the picker closes.
 */
export default function WorldsLauncher() {
  const { openWorlds, isWorldsOpen, isTransitioning, worldsOpener } = useWorldTransition()
  const { theme } = useTheme()
  const labels = useWorldsLabels()
  const nudge = useWorldsNudge()
  const button = useRef<HTMLButtonElement>(null)
  const pickerWasOpen = useRef(false)
  const hidden = isWorldsOpen || isTransitioning

  useEffect(() => {
    if (isWorldsOpen) pickerWasOpen.current = true
    if (hidden || !pickerWasOpen.current) return
    pickerWasOpen.current = false
    const opener = worldsOpener.current
    const target = opener?.isConnected ? opener : button.current
    target?.focus()
  }, [isWorldsOpen, hidden, worldsOpener])

  const vars = launcherVars(theme.colors)
  const [beforeCount, afterCount] = labels.launcher.split('{count}')
  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={(event) => openWorlds(event.currentTarget)}
        aria-label={fillLabel(labels.launcherAria, { count: nudge.total })}
        title={fillLabel(labels.launcherTitle, { count: nudge.total })}
        inert={hidden}
        style={vars}
        className={`c-worlds-launcher fixed top-2 right-1 z-[150] flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg px-0.5 py-1 leading-none sm:top-4 sm:right-4 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2 ${hidden ? 'invisible' : ''}`}
      >
        <span aria-hidden="true" className="hidden text-base leading-none sm:inline">◈</span>
        {beforeCount.trim() && <span className="text-sm leading-tight tracking-normal sm:tracking-wider">{beforeCount.trim()}</span>}
        <span className="text-base font-bold leading-tight sm:text-sm">{nudge.total}</span>
        <span className="text-sm leading-tight tracking-normal sm:tracking-wider">{afterCount?.trim()}</span>
      </button>
      {nudge.hint !== 'closed' && (
        <WorldsHint
          cardRef={nudge.hintRef}
          open={nudge.hint === 'open'}
          style={vars}
          worldName={theme.name}
          nextName={getThemeById(nudge.nextId).name}
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
