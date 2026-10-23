'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { Detective, type DetectiveMotion } from './detective'
import { NOIR } from './palette'
import e from './evidence.module.css'

// Two sections the detective lays down himself, the way the noir crime game builds and closes a case:
// - Statement (about): he walks in from the left, tears the page from his notebook and slaps it down;
//   the speech box flies from his hand, lands with a slap and shakes.
// - Case closed (services): he walks in from the right, brings the rubber stamp down on the dim case
//   slabs; they punch down under it, the red ring flashes and fades, and they come up full.
//
// Pattern: the shared usePoseSequence plays walk, act and leave once the section is in view
// (useSectionTrigger, so it plays once); every beat ends on the figure wrapper's own animationend, so
// nothing is timed in React. The section's reaction is one CSS keyframe from the act on that ends at
// the section's own resting place and look (evidence.module.css). Timing: walk 480 ms, act 620 ms (the
// slap lands 350 ms in, the stamp 300 ms in), leave 520 ms. Reduced motion: no figure, the section rests
// in place from the start.

type Beat = 'walk' | 'act' | 'leave' | 'gone' | 'still'

const ENTRANCE: readonly Beat[] = ['walk', 'act', 'leave']

const MOTION: Record<Beat, DetectiveMotion> = { walk: 'walk', act: 'act', leave: 'walk', gone: 'still', still: 'still' }

interface CaseMoveProps {
  children: ReactNode
  /** Where he works from: the statement from the left, the stamp from the right. */
  side: 'left' | 'right'
  /** The section's reaction, a class of evidence.module.css. */
  reaction: string
  prop?: ReactNode
}

function CaseMove({ children, side, reaction, prop }: CaseMoveProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'gone', still: 'still' })
  const shown = pose === 'walk' || pose === 'act' || pose === 'leave'

  return (
    <div ref={ref} className={`relative ${e.stage}`} data-on={triggered || undefined} data-beat={pose} data-side={side}>
      <div className={`relative ${reaction}`}>
        {children}
        {prop}
      </div>
      {triggered && shown && (
        <div className={`pointer-events-none absolute bottom-0 z-30 h-32 w-20 ${side === 'left' ? 'left-0' : 'right-0'} ${e.figure}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
          <Detective profession="engineer" motion={MOTION[pose]} className={`h-full w-full ${e.facing}`} />
        </div>
      )}
    </div>
  )
}

/** About: the statement slapped down from his notebook. */
export function SlappedStatement({ children }: { children: ReactNode }) {
  return (
    <CaseMove side="left" reaction={e.slap}>
      {children}
    </CaseMove>
  )
}

// The rubber stamp's red ring over the slabs, flashed as it lands and gone after.
const STAMP_RING = (
  <svg viewBox="0 0 120 60" className={`pointer-events-none absolute right-6 top-4 h-24 w-48 ${e.ring}`} aria-hidden="true" focusable="false">
    <rect x="4" y="4" width="112" height="52" rx="6" fill="none" stroke={NOIR.red} strokeWidth="5" />
    <rect x="12" y="12" width="96" height="36" rx="3" fill="none" stroke={NOIR.red} strokeWidth="2" />
  </svg>
)

/** Services: the case closed stamp brought down on the slabs. */
export function StampedCase({ children }: { children: ReactNode }) {
  return (
    <CaseMove side="right" reaction={e.stamp} prop={STAMP_RING}>
      {children}
    </CaseMove>
  )
}
