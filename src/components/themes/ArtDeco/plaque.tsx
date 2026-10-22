'use client'

import type { CSSProperties, ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { DepthZone } from './backdrop'
import { DECO_COLORS as C } from './palette'
import plaque from './plaque.module.css'

// Every section is a chamber one level deeper in the city. Its title hangs on a stepped ziggurat plaque
// in gold neon, and the depth gauge beside it swings its needle further round for each chamber down
// (depth 0 is the first chamber), so scrolling the page reads as going down through the city. The plaque
// hands the city zone to the page's backdrop while it is in view.
//
// Pattern: CSS off the chamber's own section trigger: the plaque's steps rise one after another and the
// needle swings to its --depth angle once. Reduced motion: the plaque and the needle at rest.

const GAUGE_TICKS = Array.from({ length: 9 }, (_, i) => -120 + i * 30)

function DepthGauge() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 flex-shrink-0" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="22" fill={C.abyss} stroke={C.brassMid} strokeWidth="3" />
      {GAUGE_TICKS.map((angle) => (
        <path key={angle} d="M24 5 V9" stroke={C.gold} strokeWidth="1.5" transform={`rotate(${angle} 24 24)`} />
      ))}
      <g className={plaque.needle}>
        <path d="M24 24 L24 8" stroke={C.spark} strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="24" cy="24" r="3" fill={C.gold} />
    </svg>
  )
}

/** A titled section of the city: the ziggurat plaque with the depth gauge, then its content. */
export function Chamber({ title, depth, children }: { title: string; depth: number; children: ReactNode }) {
  const id = headingId('deco', title)
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={id} className="relative" style={{ '--depth': depth } as CSSProperties}>
      <DepthZone zone="city" className="mb-8 flex flex-col items-center">
        <div className="relative flex flex-col items-center" aria-hidden="true">
          {[1, 2, 3].map((step) => (
            <span key={step} className={`block border-2 border-b-0 ${plaque.step}`} style={{ '--s': step } as CSSProperties} />
          ))}
        </div>
        <div className={`relative flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-10 ${plaque.board}`}>
          <DepthGauge />
          <h2 id={id} className={`text-lg uppercase tracking-[0.15em] min-[375px]:text-xl sm:text-2xl sm:tracking-[0.3em] ${plaque.title}`}>
            {title}
          </h2>
        </div>
      </DepthZone>
      {children}
    </section>
  )
}

/** The brass panel short sections (about, the tech stack, ventures, posts) sit in. */
export function BrassPanel({ children }: { children: ReactNode }) {
  return <div className={`relative p-5 sm:p-8 ${plaque.panel}`}>{children}</div>
}
