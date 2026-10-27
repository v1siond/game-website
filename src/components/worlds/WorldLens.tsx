'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import Image from 'next/image'
import { matchesMedia } from '@/hooks/useMediaQuery'
import { fillLabel } from '@/lib/cv/labels'
import { STILL_HEIGHT, lensFocus, lensStill, type LensWidth } from '@/lib/worlds/lens'
import { useWorldsLabels } from './WorldsLabels'

/**
 * How the lens was opened: a mouse over the launcher ('hover'), the keyboard's focus ('focus'), a finger
 * still holding the launcher ('hold'), or that finger lifted ('held'). The keyboard and the lifted finger
 * get the "Go to <name>" button; a mouse clicks inside the lens.
 */
export type LensMode = 'hover' | 'focus' | 'hold' | 'held'

// A press held this long on a touch screen opens the lens instead of the picker.
const HOLD_MS = 450

// The mouse may cross the small gap from the launcher to the lens without closing it.
const LEAVE_GRACE_MS = 160

// The launcher's own layout switch (sm, 640 px): above it the stills taken at 1440, below it those at 390.
const WIDE_QUERY = '(min-width: 640px)'

// Where the capture saved the centre of his figure in each still (scripts/capture-world-previews.mjs).
const FOCUS_URL = '/world-previews/focus.json'

const SHOWS_GO: Record<LensMode, boolean> = { hover: false, focus: true, hold: false, held: true }

// Read once per page view, on the first opening, and shared by every later one. An unreadable file reads as
// null, and lensFocus then centres on the middle of the hero.
let focusRead: Promise<unknown> | null = null
const readFocus = (): Promise<unknown> => {
  focusRead ??= fetch(FOCUS_URL)
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null)
  return focusRead
}

export interface LensTrigger {
  mode: LensMode | null
  close: () => void
  /** Spread on the launcher button. */
  buttonProps: {
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => void
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
    onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void
    onFocus: (event: FocusEvent<HTMLButtonElement>) => void
  }
  /** Spread on the element holding the launcher and the lens. */
  groupProps: {
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => void
    onBlur: (event: FocusEvent<HTMLDivElement>) => void
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  }
  /** True once, for the click that ends a press and hold, so that click does not open the picker. */
  takeHeldClick: () => boolean
}

/**
 * The launcher's ways into the lens: a mouse over it, the keyboard's focus on it, or a press held on a touch
 * screen. A tap or a click still opens the picker (the launcher's own onClick). Escape, the focus leaving
 * the launcher and the lens, the mouse leaving them, or a tap elsewhere close it.
 */
export function useLensTrigger(enabled: boolean, button: RefObject<HTMLButtonElement | null>): LensTrigger {
  const [mode, setMode] = useState<LensMode | null>(null)
  const holdTimer = useRef(0)
  const leaveTimer = useRef(0)
  const heldClick = useRef(false)
  // Escape gives the focus back to the launcher; that one focus must not open the lens again.
  const dismissed = useRef(false)

  const close = useCallback(() => {
    window.clearTimeout(holdTimer.current)
    window.clearTimeout(leaveTimer.current)
    setMode(null)
  }, [])

  useEffect(() => {
    if (!enabled) close()
  }, [enabled, close])

  useEffect(() => () => {
    window.clearTimeout(holdTimer.current)
    window.clearTimeout(leaveTimer.current)
  }, [])

  // After a press and hold, a tap anywhere but the launcher and the lens closes it.
  useEffect(() => {
    if (mode !== 'held') return
    const onDown = (event: globalThis.PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('[data-worlds-lens-group]')) return
      close()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [mode, close])

  const open = (next: LensMode) => {
    if (!enabled) return
    window.clearTimeout(leaveTimer.current)
    setMode(next)
  }

  const buttonProps: LensTrigger['buttonProps'] = {
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') open('hover')
    },
    onPointerDown: (event) => {
      if (event.pointerType === 'mouse') return
      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(() => {
        heldClick.current = true
        open('hold')
      }, HOLD_MS)
    },
    onPointerUp: () => {
      window.clearTimeout(holdTimer.current)
      setMode((current) => (current === 'hold' ? 'held' : current))
    },
    onPointerCancel: () => {
      window.clearTimeout(holdTimer.current)
      setMode((current) => (current === 'hold' ? 'held' : current))
    },
    onContextMenu: (event) => {
      if (heldClick.current) event.preventDefault()
    },
    onFocus: (event) => {
      if (dismissed.current) {
        dismissed.current = false
        return
      }
      if (event.currentTarget.matches(':focus-visible')) open('focus')
    },
  }

  const groupProps: LensTrigger['groupProps'] = {
    onPointerLeave: (event) => {
      if (event.pointerType !== 'mouse') return
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = window.setTimeout(() => setMode((current) => (current === 'hover' ? null : current)), LEAVE_GRACE_MS)
    },
    onBlur: (event) => {
      const next = event.relatedTarget
      if (next instanceof Node && event.currentTarget.contains(next)) return
      setMode((current) => (current === 'focus' || current === 'held' ? null : current))
    },
    onKeyDown: (event) => {
      if (event.key !== 'Escape' || mode === null) return
      event.stopPropagation()
      close()
      if (document.activeElement === button.current) return
      dismissed.current = true
      button.current?.focus()
    },
  }

  const takeHeldClick = () => {
    if (!heldClick.current) return false
    heldClick.current = false
    return true
  }

  return { mode, close, buttonProps, groupProps, takeHeldClick }
}

interface WorldLensProps {
  mode: LensMode
  nextId: string
  nextName: string
  onGo: () => void
  style: CSSProperties
}

/**
 * The round lens under the launcher onto a still of the next world's hero, centred on his figure, with the
 * world's name inside its lower edge. A click inside goes there through the portal; the keyboard and a
 * lifted finger get a "Go to <name>" button. The still (and the figure centres) load on the first opening
 * only, never with the page.
 */
export default function WorldLens({ mode, nextId, nextName, onGo, style }: WorldLensProps) {
  const labels = useWorldsLabels()
  // The lens mounts only on an opening, in the browser, so the width is read once and the right still loads first.
  const [wide] = useState(() => matchesMedia(WIDE_QUERY))
  const [focusMap, setFocusMap] = useState<unknown>(null)

  useEffect(() => {
    let live = true
    readFocus().then((read) => {
      if (live) setFocusMap(read)
    })
    return () => {
      live = false
    }
  }, [])

  const width: LensWidth = wide ? 1440 : 390
  const point = lensFocus(focusMap, nextId, width)
  const stillVars = { '--lens-x': point.x, '--lens-y': point.y } as CSSProperties
  return (
    <div
      role="group"
      aria-label={fillLabel(labels.lensAria, { name: nextName })}
      style={style}
      className="c-world-lens fixed inset-x-0 top-[66px] z-[149] mx-auto aspect-square w-[220px] sm:left-auto sm:right-4 sm:top-[72px] sm:mx-0 sm:w-[260px]"
    >
      <div aria-hidden="true" onClick={onGo} className="c-world-lens__window absolute inset-0 cursor-pointer overflow-hidden rounded-full">
        <Image
          key={width}
          src={lensStill(nextId, wide)}
          alt=""
          width={width}
          height={STILL_HEIGHT[width]}
          unoptimized
          style={stillVars}
          className="c-world-lens__still absolute left-0 top-0 max-w-none"
        />
      </div>
      <div className="c-world-lens__caption absolute inset-x-0 bottom-3 mx-auto w-[72%] rounded-xl px-2 py-1 text-center">
        {SHOWS_GO[mode] ? (
          <button type="button" onClick={onGo} className="c-world-lens__go grid min-h-11 w-full place-items-center rounded-lg px-2 text-[15px] font-bold leading-tight">
            {fillLabel(labels.lensGo, { name: nextName })}
          </button>
        ) : (
          <span aria-hidden="true" className="block text-[15px] font-bold leading-tight">
            {fillLabel(labels.lensCaption, { name: nextName })}
          </span>
        )}
      </div>
    </div>
  )
}
