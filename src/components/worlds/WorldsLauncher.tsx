'use client'

import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import Image from 'next/image'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { useWorldsNudge } from '@/hooks/useWorldsNudge'
import { fillLabel } from '@/lib/cv/labels'
import { launcherColors } from '@/lib/worlds/nudge'
import { portraitOf, type LauncherFace } from '@/lib/worlds/lens'
import { getThemeById, type ThemeColors } from '@/themes/themes'
import WorldsHint from './WorldsHint'
import WorldLens, { useLensTrigger } from './WorldLens'
import { useWorldsLabels } from './WorldsLabels'

/** The custom properties worlds-nudge.css paints the launcher, the hint and the picker from. */
export function launcherVars(colors: ThemeColors): CSSProperties {
  const { text, body, fill, edge } = launcherColors(colors)
  return { '--wl-text': text, '--wl-body': body, '--wl-fill': fill, '--wl-edge': edge } as CSSProperties
}

// The face class per launcher face: the turn plays its CSS moment once, the face rests.
const FACE_CLASS: Record<Exclude<LauncherFace, 'count'>, string> = {
  turn: 'c-worlds-face c-worlds-face--turn',
  face: 'c-worlds-face',
}

/** Him in the next world: his portrait, and the world's name beside it from 640 px up. */
function NextFace({ face, nextId, nextName }: { face: Exclude<LauncherFace, 'count'>; nextId: string; nextName: string }) {
  return (
    <>
      <span aria-hidden="true" className={`${FACE_CLASS[face]} flex items-center gap-2`}>
        <Image src={portraitOf(nextId)} alt="" width={40} height={40} unoptimized className="c-worlds-face__portrait h-[var(--wl-face-size)] w-[var(--wl-face-size)] flex-none rounded-full object-cover object-[50%_18%]" />
        <span className="hidden max-w-[8.5rem] text-left text-sm font-bold leading-[1.05] sm:inline">{nextName}</span>
      </span>
      {face === 'turn' && (
        <span aria-hidden="true" className="c-worlds-face-wide absolute right-0 top-0 flex h-full w-[172px] items-center gap-2 rounded-lg pl-1 pr-2 sm:hidden">
          <Image src={portraitOf(nextId)} alt="" width={40} height={40} unoptimized className="c-worlds-face__portrait h-[var(--wl-face-size)] w-[var(--wl-face-size)] flex-none rounded-full object-cover object-[50%_18%]" />
          <span className="text-left text-[15px] font-bold leading-[1.1]">{nextName}</span>
        </span>
      )}
    </>
  )
}

/** The world count, "17 worlds", stacked on a phone. */
function CountFace({ template, total }: { template: string; total: number }) {
  const [beforeCount, afterCount] = template.split('{count}')
  return (
    <>
      <span aria-hidden="true" className="hidden text-base leading-none sm:inline">◈</span>
      {beforeCount.trim() && <span className="text-sm leading-tight tracking-normal sm:tracking-wider">{beforeCount.trim()}</span>}
      <span className="text-base font-bold leading-tight sm:text-sm">{total}</span>
      <span className="text-sm leading-tight tracking-normal sm:tracking-wider">{afterCount?.trim()}</span>
    </>
  )
}

/**
 * WorldsLauncher, top right in every world: names itself with the world count ("17 worlds", stacked on a
 * phone so it clears the worlds' own top bars) and opens the WorldsModal. Under it, once per visit, the
 * WorldsHint names the next world in the tour (see useWorldsNudge for when and where). Once the hero has
 * left the screen its face shows him in that next world (turned over once per visit), and a hover, the
 * keyboard's focus or a press held on a phone opens the WorldLens onto that world's hero. Neither on a CV page. While the picker is
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
  const lens = useLensTrigger(nudge.lensAllowed && !hidden, button)
  const nextName = getThemeById(nudge.nextId).name

  useEffect(() => {
    if (isWorldsOpen) pickerWasOpen.current = true
    if (hidden || !pickerWasOpen.current) return
    pickerWasOpen.current = false
    const opener = worldsOpener.current
    const target = opener?.isConnected ? opener : button.current
    target?.focus()
  }, [isWorldsOpen, hidden, worldsOpener])

  const open = (event: MouseEvent<HTMLButtonElement>) => {
    if (lens.takeHeldClick()) return
    lens.close()
    openWorlds(event.currentTarget)
  }

  const vars = launcherVars(theme.colors)
  const turned = nudge.face !== 'count'
  const label = turned ? fillLabel(labels.faceAria, { name: nextName, count: nudge.total }) : fillLabel(labels.launcherAria, { count: nudge.total })
  return (
    <>
      <div data-worlds-lens-group="" {...lens.groupProps}>
        <button
          ref={button}
          data-worlds-launcher=""
          type="button"
          onClick={open}
          {...lens.buttonProps}
          aria-label={label}
          title={fillLabel(labels.launcherTitle, { count: nudge.total })}
          inert={hidden}
          style={vars}
          className={`c-worlds-launcher fixed top-[var(--wl-launcher-top)] right-1 z-[150] flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg px-0.5 py-[var(--wl-launcher-pad-y)] leading-none sm:right-4 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 ${hidden ? 'invisible' : ''}`}
        >
          {nudge.face === 'count' ? (
            <CountFace template={labels.launcher} total={nudge.total} />
          ) : (
            <NextFace face={nudge.face} nextId={nudge.nextId} nextName={nextName} />
          )}
        </button>
        {lens.mode && <WorldLens mode={lens.mode} nextId={nudge.nextId} nextName={nextName} onGo={nudge.nextWorld} style={vars} />}
      </div>
      {nudge.hint !== 'closed' && (
        <WorldsHint
          cardRef={nudge.hintRef}
          open={nudge.hint === 'open'}
          style={vars}
          worldName={theme.name}
          nextName={nextName}
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
