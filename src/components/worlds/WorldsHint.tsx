'use client'

import { useEffect, type CSSProperties, type RefObject } from 'react'
import { fillLabel } from '@/lib/cv/labels'
import { countTemplate } from '@/lib/worlds/nudge'
import { useWorldsLabels } from './WorldsLabels'

interface WorldsHintProps {
  cardRef: RefObject<HTMLDivElement | null>
  /** Waiting: rendered hidden and inert, only so useWorldsNudge can measure where it would land. */
  open: boolean
  style: CSSProperties
  worldName: string
  nextName: string
  seenCount: number
  total: number
  onNext: () => void
  onAll: (opener: HTMLElement) => void
  onClose: () => void
}

/**
 * The one time worlds hint, a small card under the launcher that names the next world in the tour and
 * enters it in one press. A non modal dialog: it never takes focus, and closes on its x, Escape or a tap
 * anywhere outside it. Drops in with opacity and a short slide when it opens (worlds-nudge.css), shown at
 * once under reduced motion. When it shows and where: useWorldsNudge.
 */
export default function WorldsHint({ cardRef, open, style, worldName, nextName, seenCount, total, onNext, onAll, onClose }: WorldsHintProps) {
  const labels = useWorldsLabels()
  const seen = Math.max(seenCount, 1)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const onPointer = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, onClose, cardRef])

  return (
    <div
      ref={cardRef}
      data-worlds-hint
      role="dialog"
      aria-labelledby="worlds-hint-title"
      aria-describedby="worlds-hint-body"
      aria-hidden={!open || undefined}
      inert={!open}
      style={style}
      className={`c-worlds-hint fixed top-[var(--wl-hint-top)] left-4 right-4 z-[150] rounded-lg p-3 sm:left-auto sm:w-80 ${open ? 'c-worlds-hint--open' : 'invisible'}`}
    >
      <p id="worlds-hint-title" className="pr-11 pt-1 text-base font-bold leading-tight">
        {fillLabel(labels.hintNextTitle, { world: nextName })}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.hintClose}
        className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center rounded-md text-base"
      >
        ✕
      </button>
      <p id="worlds-hint-body" className="c-worlds-hint__body mb-2 mt-1 text-sm leading-snug">
        {fillLabel(countTemplate(seen, { one: labels.hintBodyOne, many: labels.hintBody }), { world: worldName, seen, total })}
      </p>
      {/* A long world name wraps inside its own button, and on a narrow card the row breaks rather than
          squeeze the label past the button's fill, where it would be the fill colour on the fill. */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onNext} className="c-worlds-hint__primary min-h-11 min-w-36 flex-1 rounded-md px-3 text-sm font-bold text-balance [overflow-wrap:anywhere]">
          {fillLabel(labels.hintEnter, { world: nextName })}
        </button>
        <button
          type="button"
          onClick={(event) => onAll(event.currentTarget)}
          className="c-worlds-hint__secondary min-h-11 min-w-36 flex-1 rounded-md px-3 text-sm text-balance [overflow-wrap:anywhere]"
        >
          {labels.hintAll}
        </button>
      </div>
    </div>
  )
}
