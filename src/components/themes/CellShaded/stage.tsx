'use client'

import type { ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { headingId } from '@/lib/cv/sectionText'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { TagListLook } from '@/components/cv/TagList'
import type { Zone } from './wasteland'
import cel from './cel.module.css'

// A section's stage: the inked title slab and the section's own scene. useZoneStage marks it data-on
// once, the first time it scrolls into view, and every entrance inside starts off that flag. While the
// stage is in view it hands its zone (the hour of the desert) to the page, which crossfades the fixed
// sky to it. A scene that starts off the flag itself takes it through a render function as children.

export const celHeadingId = (title: string) => headingId('cel', title)

/** Lines marked with the orange diamond the bounty notices give a job's highlights, under their inked
 *  heading: a job's highlights, a project's details, the About highlights. */
export const ORANGE_POINTS: MarkedLinesLook = {
  heading: `mt-4 text-base ${cel.display} [-webkit-text-stroke:0]`,
  list: 'mt-2 space-y-1.5',
  line: 'flex gap-2 text-base',
  marker: <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--cel-orange)]" aria-hidden="true" />,
}

/** A card's inked tags: a job's skills and a venture's services on white, a project's tools on sun. */
export const INKED_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'border-2 border-[var(--cel-ink)] bg-[var(--cel-white)] px-2 py-0.5 text-sm font-bold',
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={celHeadingId(title)} className={`mb-8 text-3xl sm:text-4xl ${cel.display}`}>
      <span className={cel.titleSlab}>
        <span>{title}</span>
      </span>
    </h2>
  )
}

interface StageProps {
  title: string
  zone: Zone
  children: ReactNode | ((on: boolean) => ReactNode)
}

export function Stage({ title, zone, children }: StageProps) {
  const { ref, on } = useZoneStage<Zone>(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={celHeadingId(title)} className={`mb-24 scroll-mt-8 ${cel.stage}`}>
      <SectionTitle title={title} />
      {typeof children === 'function' ? children(on) : children}
    </section>
  )
}
