'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { headingId } from '@/lib/cv/sectionText'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { TagListLook } from '@/components/cv/TagList'
import u from './underworld.module.css'

// A section in the descent: the gilded title plate over the section's cards, read in a column on the left
// from lg so the section's scene (scenes.tsx, on the shared theatre) plays clear of it on the right; under lg
// the scene plays in a tall gap under the title before the cards come up.
// useZoneStage marks it data-on once, the first time it scrolls into view, and every entrance inside starts
// off that flag. While it is in view it hands its region to the page, which fades the fixed depths
// (depths.tsx) to that region. Under reduced motion the section carries its own scene drawn settled
// (StillStages).

/** The regions the page goes down, top to bottom. */
export type Zone = 'hall' | 'storm' | 'magma' | 'harbour' | 'olympus'

/** The column a section reads in: the whole width on a phone, the left of the screen from lg. */
export const COLUMN = 'lg:mr-auto lg:w-[min(46rem,52vw)]'

/** The scene a section draws settled under reduced motion, by its id; nothing while the theatre plays. */
const StillStagesContext = createContext<(id: string) => ReactNode>(() => null)

export const StillStages = StillStagesContext.Provider

export const mythHeadingId = (title: string) => headingId('myth', title)

/** Lines marked with the blood red diamond the trials give a job's highlights: a job's highlights, a
 *  project's details, the About highlights, under their frost heading. */
export const BLOOD_POINTS: MarkedLinesLook = {
  heading: `mt-4 text-sm text-[var(--myth-frost)] ${u.display}`,
  list: 'mt-2 space-y-1.5',
  line: 'flex gap-2 text-base',
  marker: <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--myth-blood)]" aria-hidden="true" />,
}

/** A card's tags on the ink, ruled in iron: a job's skills, a project's technologies, a venture's services. */
export const IRON_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'border border-[var(--myth-iron)] bg-[var(--myth-ink)] px-2 py-0.5 text-sm',
}

/** A knot cut either side of a title stone: one stave with its branches, wound through a ring of knotwork. */
export function RuneKnot({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${flip ? '-scale-x-100' : ''}`} aria-hidden="true">
      <path d="M12 3 V21 M12 9 L6 4 M12 9 L18 4 M12 15 L7 19" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M4 12 Q4 5 12 5 Q20 5 20 12 Q20 19 12 19 Q4 19 4 12 Z" fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 2" />
    </svg>
  )
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={mythHeadingId(title)} className="mb-8 text-[clamp(1.25rem,0.85rem+1.8vw,1.875rem)]">
      <span className={`${u.plate} ${u.display}`}>
        <RuneKnot />
        <span className="min-w-0">{title}</span>
        <RuneKnot flip />
      </span>
    </h2>
  )
}

export function Stage({ id, title, zone, children }: { id: string; title: string; zone: Zone; children: ReactNode }) {
  const { ref, on } = useZoneStage<Zone>(zone)
  const still = useContext(StillStagesContext)

  return (
    <section ref={ref} data-scene={id} data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className="relative mb-28 scroll-mt-8">
      {still(id)}
      <div className={COLUMN}>
        <SectionTitle title={title} />
        {/* under lg the cards take the whole width, so the section's scene plays and holds in this gap first,
            the title at its top and the floor clear of the cards (the head about 130svh with the title) */}
        <div className="max-lg:min-h-[115svh]" aria-hidden="true" />
        {children}
      </div>
    </section>
  )
}
