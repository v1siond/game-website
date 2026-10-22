'use client'

import { ReactNode } from 'react'
import type { SectionTriggerOptions } from '@/hooks/useSectionTrigger'

/**
 * Continuous in-view signal for the combat stages, read through the shared useSectionTrigger.
 * triggerOnce false toggles `inView` back off when the stage scrolls out, so the fixed combat
 * layer fades away as the user scrolls past a section instead of staying pinned to the corner.
 */
export const COMBAT_IN_VIEW: SectionTriggerOptions = {
  threshold: 0,
  rootMargin: '-30% 0px -30% 0px',
  triggerOnce: false,
}

/**
 * The transition for a pose change that moves and fades: transform and opacity only, so the
 * browser composites it instead of recalculating every animatable property.
 */
export function moveAndFade(timing: string): string {
  return `transform ${timing}, opacity ${timing}`
}

/**
 * FixedCombatLayer, pins the knight/bug combat to the viewport so only the section
 * CONTENT scrolls. `fixed inset-0` makes this a full-viewport box, so any child with
 * `left/right/bottom` percentages resolves against the viewport (knight ~15-20% from a
 * side, ~15-20% from the bottom). Fades out when the section leaves view. The reveals
 * live directly under <main> (no transformed ancestor), so `fixed` is genuinely
 * viewport-relative here.
 *
 * Below lg (phones and tablets) the column is all text, so a full size fight pinned at 15-20% from
 * the bottom lands on titles and buttons mid screen. There the whole layer shrinks from the bottom edge and slides
 * down onto it: the fighters keep their places relative to each other but fight on the floor of
 * the screen, a band of under a tenth of its height that a line reaches only on its way up.
 */
export function FixedCombatLayer({ inView, children }: { inView: boolean; children: ReactNode }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 origin-bottom translate-y-[8%] scale-[0.45] lg:translate-y-0 lg:scale-100"
      style={{ opacity: inView ? 1 : 0, transition: 'opacity 350ms ease-out' }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
