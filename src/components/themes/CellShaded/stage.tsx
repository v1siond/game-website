'use client'

import type { ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { headingId } from '@/components/cv/sectionText'
import type { Zone } from './wasteland'
import cel from './cel.module.css'

// A section's stage: the inked title slab and the section's own scene. useZoneStage marks it data-on
// once, the first time it scrolls into view, and every entrance inside starts off that flag. While the
// stage is in view it hands its zone (the hour of the desert) to the page, which crossfades the fixed
// sky to it.

export const celHeadingId = (title: string) => headingId('cel', title)

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={celHeadingId(title)} className={`mb-8 text-3xl sm:text-4xl ${cel.display}`}>
      <span className={cel.titleSlab}>
        <span>{title}</span>
      </span>
    </h2>
  )
}

export function Stage({ title, zone, children }: { title: string; zone: Zone; children: ReactNode }) {
  const { ref, on } = useZoneStage<Zone>(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={celHeadingId(title)} className={`mb-24 scroll-mt-8 ${cel.stage}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}
