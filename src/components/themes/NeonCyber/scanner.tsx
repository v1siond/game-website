'use client'

import { useEffect, type ReactNode, type RefObject } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// The optics scanner. Scan mode is one flag on the world's root (data-scan): the page behind the cards
// dims under a yellow raster, every card that can be scanned shows a dashed outline in its key colour,
// and the card under the pointer or the keyboard focus locks a reticle and shows its tag (its kind and
// one fact). The colour key follows the source: gold for work, green for what can be breached, blue for
// what can be used, red for the fight record. While the mode is on, every running loop in the world
// plays at a fifth of its speed, the way time slows while the optics scan.

export type TagKind = 'job' | 'project' | 'use' | 'record'

const SLOW_RATE = 0.2

/** Slows every animation under the root while scan mode is on, and restores them when it goes off. */
export function useTimeSlow(rootRef: RefObject<HTMLElement | null>, scanning: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof root.getAnimations !== 'function') return
    const rate = scanning ? SLOW_RATE : 1
    root.getAnimations({ subtree: true }).forEach((animation) => {
      animation.playbackRate = rate
    })
  }, [rootRef, scanning])
}

export function ScanToggle({ scanning, onToggle }: { scanning: boolean; onToggle: () => void }) {
  const { cyber } = useLabels()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        aria-pressed={scanning}
        onClick={onToggle}
        className={`${world.cut} inline-flex min-h-[44px] items-center gap-2 border border-[color:var(--neon-hud)] px-4 text-sm uppercase tracking-[0.2em] ${
          scanning ? world.scanOn : 'text-[color:var(--neon-hud)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_12%,transparent)]'
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" focusable="false">
          <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" fill="none" stroke="currentColor" strokeWidth={1.6} />
          <circle cx={8} cy={8} r={2} fill="currentColor" />
        </svg>
        {scanning ? cyber.scanStop : cyber.scan}
      </button>
      <p className="text-sm text-[color:var(--neon-ash)]" aria-live="polite">
        {scanning ? cyber.scanHint : ''}
      </p>
    </div>
  )
}

/** The dimming raster of scan mode, one fixed layer between the city and the cards. */
export function ScanVeil() {
  return <div className={world.scanVeil} aria-hidden="true" />
}

interface ScannableProps {
  kind: TagKind
  // The tag's first word: the section the card belongs to (a section title label).
  title: string
  // The one fact the tag reads out: the years, the company, the role.
  fact: string
  children: ReactNode
  className?: string
}

/** A card the scanner can lock onto. The tag repeats what the card already says, so it is hidden from
 *  assistive technology. */
export function Scannable({ kind, title, fact, children, className = '' }: ScannableProps) {
  return (
    <div className={`${world.scannable} ${className}`} data-tag={kind}>
      {children}
      <span className={world.reticle} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={`${world.tag} text-sm uppercase tracking-wider`} aria-hidden="true">
        <span>{title}</span>
        <span>{fact}</span>
      </span>
    </div>
  )
}
