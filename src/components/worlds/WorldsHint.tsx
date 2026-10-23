'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

interface WorldsHintProps {
  style: CSSProperties
  worldName: string
  seenCount: number
  total: number
  onNext: () => void
  onAll: () => void
  onClose: () => void
}

/**
 * The one time worlds hint, a small card under the launcher. A non modal dialog: it never takes focus,
 * and closes on its x, Escape or a tap anywhere outside it. Drops in with opacity and a short slide
 * (worlds-nudge.css), shown at once under reduced motion. When it shows: useWorldsNudge.
 */
export default function WorldsHint({ style, worldName, seenCount, total, onNext, onAll, onClose }: WorldsHintProps) {
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const onPointer = (event: PointerEvent) => {
      if (!card.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [onClose])

  return (
    <div
      ref={card}
      role="dialog"
      aria-labelledby="worlds-hint-title"
      aria-describedby="worlds-hint-body"
      style={style}
      className="c-worlds-hint fixed top-[60px] left-4 right-4 z-[150] rounded-lg p-3 sm:top-[72px] sm:left-auto sm:w-80"
    >
      <p id="worlds-hint-title" className="pr-11 pt-1 text-base font-bold leading-tight">
        This CV has {total} worlds
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close the worlds hint"
        className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center rounded-md text-base"
      >
        ✕
      </button>
      <p id="worlds-hint-body" className="c-worlds-hint__body mb-2 mt-1 text-sm leading-snug">
        You are in {worldName}. Seen {Math.max(seenCount, 1)} of {total}.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onNext} className="c-worlds-hint__primary min-h-11 flex-1 rounded-md px-3 text-sm font-bold">
          Next world
        </button>
        <button type="button" onClick={onAll} className="c-worlds-hint__secondary min-h-11 flex-1 rounded-md px-3 text-sm">
          All worlds
        </button>
      </div>
    </div>
  )
}
