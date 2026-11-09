'use client'

import { useEffect, useMemo, useRef, type KeyboardEvent } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useWorldTransition } from '@/themes/WorldTransitionContext'
import { loadSeenWorlds } from '@/hooks/useWorldsNudge'
import { fillLabel } from '@/lib/cv/labels'
import { TOUR_ORDER, countTemplate, markSeen, orderForPicker } from '@/lib/worlds/nudge'
import WorldsGrid from './WorldsGrid'
import { launcherVars } from './WorldsLauncher'
import { useWorldsLabels } from './WorldsLabels'

// Every control the dialog holds, for keeping Tab and Shift Tab inside it.
const TAB_STOPS = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/**
 * WorldsModal, the "Enter Another World" picker, lifted out of the page content flow into a modal. It
 * remembers what the visitor has seen: the seen count and a dot per world under the title, the next unseen
 * world first as the wide up next card, then the unseen, the seen and the current world (orderForPicker).
 * Opened by the launcher or the hint; closed by the x, the backdrop, Escape or a pick. On open the focus
 * goes to the up next Enter button (the title when every world was seen) and Tab stays inside; on close
 * WorldsLauncher moves it back to the opener. Painted from launcherVars, the launcher's AAA tokens.
 */
export default function WorldsModal() {
  const { isWorldsOpen, closeWorlds } = useWorldTransition()
  const { theme } = useTheme()
  const labels = useWorldsLabels()
  const panel = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  // Read once per opening, so the order holds still while the picker is open.
  const seen = useMemo(() => (isWorldsOpen ? markSeen(loadSeenWorlds(), theme.id) : []), [isWorldsOpen, theme.id])

  // close on Escape + lock body scroll while open
  useEffect(() => {
    if (!isWorldsOpen) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeWorlds()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isWorldsOpen, closeWorlds])

  useEffect(() => {
    if (!isWorldsOpen) return
    const upNext = panel.current?.querySelector<HTMLElement>('[data-picker-upnext] button')
    ;(upNext ?? heading.current)?.focus()
  }, [isWorldsOpen])

  if (!isWorldsOpen) return null

  const keepFocusInside = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panel.current) return
    const stops = Array.from(panel.current.querySelectorAll<HTMLElement>(TAB_STOPS))
    const first = stops[0]
    const last = stops[stops.length - 1]
    const active = document.activeElement
    const inside = panel.current.contains(active)
    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault()
      last?.focus()
      return
    }
    if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault()
      first?.focus()
    }
  }

  const total = TOUR_ORDER.length
  return (
    <div
      className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="worlds-modal-heading"
      onKeyDown={keepFocusInside}
    >
      <div className="c-worlds-backdrop fixed inset-0" onClick={closeWorlds} aria-hidden="true" />
      <div ref={panel} style={launcherVars(theme.colors)} className="c-worlds-picker relative w-full max-w-6xl my-auto rounded-xl">
        <button
          type="button"
          onClick={closeWorlds}
          aria-label={labels.pickerClose}
          className="c-worlds-picker__close absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-md text-lg"
        >
          ✕
        </button>

        <div className="p-5 md:p-8">
          <h2
            ref={heading}
            id="worlds-modal-heading"
            tabIndex={-1}
            className="c-worlds-picker__title px-10 lg:px-0 text-xl md:text-2xl tracking-[0.15em] text-center mb-2"
          >
            {labels.pickerTitle}
          </h2>
          <p className="c-worlds-picker__title text-base text-center">
            {fillLabel(countTemplate(seen.length, { one: labels.pickerProgressOne, many: labels.pickerProgress }), { seen: seen.length, total })}
          </p>
          <div aria-hidden="true" className="mt-2 mb-4 flex flex-wrap justify-center gap-1.5">
            {TOUR_ORDER.map((id, index) => (
              <i key={id} className={`c-worlds-pip ${index < seen.length ? 'c-worlds-pip--on' : ''}`} />
            ))}
          </div>
          <WorldsGrid order={orderForPicker(theme.id, seen)} />
        </div>
      </div>
    </div>
  )
}
