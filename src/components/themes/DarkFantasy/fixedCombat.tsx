'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { SectionTriggerOptions } from '@/hooks/useSectionTrigger'
import battle from './battle.module.css'

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
 * The one stacking order of a combat stage, read by the fixed fighters and by each reveal's content: the
 * fighters above the room's fixed backdrop layers (z-[1] to z-[8]) and under the section content and the
 * footer (z-20), so panel text always draws over them.
 */
export const COMBAT_Z = { fighters: 'z-10', content: 'z-20' } as const

/** How far the combat layer shrinks below lg, read by a fighter drawn outside it at the same size. */
export const COMBAT_PHONE_SCALE = 0.45

/**
 * The floor every fighter in the combat layer stands on: its height above the screen's bottom, set on the
 * layer as --ground, and the class a fighter's wrapper takes to stand on it.
 */
const GROUND_HEIGHT = '15%'
export const COMBAT_GROUND = 'bottom-[var(--ground)]'

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
 * down by exactly its shrunk ground height, so the ground lands on the screen's bottom edge: the fighters keep
 * their places relative to each other, their feet stay on the screen, and they fight on its floor, under the
 * last line of the page.
 */
export function FixedCombatLayer({ inView, shake = false, children }: { inView: boolean; shake?: boolean; children: ReactNode }) {
  // `shake` plays the battle's screen shake on an outer viewport box of its own: a transform on any ancestor
  // would turn this fixed layer into a box of that ancestor and throw the fighters out of their corners, and on
  // the layer itself it would be shrunk with it below lg.
  return (
    <div className={`pointer-events-none fixed inset-0 ${COMBAT_Z.fighters} ${shake ? battle.shaking : ''}`} aria-hidden="true">
      <div
        className="pointer-events-none fixed inset-0 origin-bottom translate-y-[calc(var(--phone-scale)*var(--ground))] scale-[var(--phone-scale)] lg:translate-y-0 lg:scale-100"
        style={{ '--phone-scale': COMBAT_PHONE_SCALE, '--ground': GROUND_HEIGHT, opacity: inView ? 1 : 0, transition: 'opacity 350ms ease-out' } as CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}
