'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { headingId } from '@/lib/cv/sectionText'
import type { SectionId } from '@/lib/cv/sectionPlan'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { TagListLook } from '@/components/cv/TagList'
import u from './underworld.module.css'

// A section of the run: the carved title plate over the section's cards. From lg the sections take turns: the
// first after the hero reads in a column on the left with its scene (scenes.tsx, on the shared theatre) on
// the right, the next the other way round, up to the contact; under lg the scene plays in a tall gap under the
// title before the cards come up.
// useZoneStage marks it data-on once, the first time it scrolls into view, and every entrance inside starts
// off that flag. While it is in view it hands its place to the page, which fades the fixed depths (depths.tsx)
// to that place. Under reduced motion the section carries its own scene drawn settled (StillStages).

/** The places of the run, in the order the page walks them: the first Greek war god game, then the second. */
export type Zone = 'sea' | 'athens' | 'desert' | 'temple' | 'storm' | 'rhodes' | 'sky' | 'bog' | 'chasm' | 'olympus'

/** The place each part of the page stands in: the storm sea of the first game to the mountain of the gods. */
export const ZONE_OF: Record<SectionId | 'hero' | 'contact', Zone> = {
  hero: 'sea',
  about: 'athens',
  work: 'desert',
  tech: 'temple',
  services: 'storm',
  projects: 'rhodes',
  ventures: 'sky',
  bands: 'bog',
  muayThai: 'chasm',
  contact: 'olympus',
}

/** The side a scene plays on from lg; its section's cards read on the other. */
export type Side = 'right' | 'left'

/** Each part's scene side on the page being read (scenes.tsx scenesOf), handed down from the theme. */
const SidesContext = createContext<Partial<Record<SectionId | 'contact', Side>>>({})

export const SceneSides = SidesContext.Provider

/** The column a section's title and cards read in: the whole width on a phone; from lg the half away from its
 *  scene, a scene on the right putting the cards on the left. */
const COLUMN: Record<Side, string> = {
  right: 'lg:mr-auto lg:w-[min(42rem,46vw)]',
  left: 'lg:ml-auto lg:w-[min(42rem,46vw)]',
}

/**
 * The room a section keeps from lg so no card ever crosses a scene: its title starts a screen below its top,
 * where the shared theatre has its stage whole (src/lib/scroll/stage.ts HANDOVER, whole when the section's top
 * reaches the screen's top), so the next section's cards, which read on the side the scene before them plays
 * on, only come up once that scene has gone; and a quarter screen under it, so its last card has left the
 * screen when the next scene starts to play (PLAY_FROM, a quarter screen before the top). The scene plays
 * alone at the start of its section and ends beside its own cards (its play runs to 0.95 of a screen past
 * the top).
 */
export const HANDOVER_ROOM = 'lg:mb-[25svh] lg:pt-[100svh]'

/** The column of the part `id` on the page being read. */
export function useColumn(id: SectionId | 'contact'): string {
  return COLUMN[useContext(SidesContext)[id] ?? 'right']
}

/** The scene a section draws settled under reduced motion, by its id; nothing while the theatre plays. */
const StillStagesContext = createContext<(id: string) => ReactNode>(() => null)

export const StillStages = StillStagesContext.Provider

export const mythHeadingId = (title: string) => headingId('myth', title)

/** Lines marked with the blood red diamond: a job's highlights, a project's details, the About highlights,
 *  under their gold heading. */
export const BLOOD_POINTS: MarkedLinesLook = {
  heading: `mt-4 text-sm text-[var(--myth-gold)] ${u.display}`,
  list: 'mt-2 space-y-1.5',
  line: 'flex gap-2 text-base',
  marker: <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--myth-blood)]" aria-hidden="true" />,
}

/** A card's tags on the ink, ruled in bronze: a job's skills, a project's technologies, a venture's services. */
export const IRON_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'border border-[var(--myth-gold-deep)] bg-[var(--myth-ink)] px-2 py-0.5 text-sm',
}

/** The key pattern cut either side of a title stone: a Greek meander in a bronze square. */
export function Meander({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${flip ? '-scale-x-100' : ''}`} aria-hidden="true">
      <path d="M3 21 V3 H21 V17 H7 V7 H17 V13 H11" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
    </svg>
  )
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={mythHeadingId(title)} className="mb-8 text-[clamp(1.25rem,0.85rem+1.8vw,1.875rem)]">
      <span className={`${u.plate} ${u.display}`}>
        <Meander />
        <span className="min-w-0">{title}</span>
        <Meander flip />
      </span>
    </h2>
  )
}

export function Stage({ id, title, children }: { id: SectionId; title: string; children: ReactNode }) {
  const { ref, on } = useZoneStage<Zone>(ZONE_OF[id])
  const still = useContext(StillStagesContext)
  const column = useColumn(id)

  return (
    <section ref={ref} data-scene={id} data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className={`relative mb-28 scroll-mt-8 ${HANDOVER_ROOM}`}>
      {still(id)}
      <div className={column}>
        <SectionTitle title={title} />
        {/* under lg the cards take the whole width, so the section's scene plays and holds in this gap first,
            the title at its top and the floor clear of the cards (the head about 130svh with the title) */}
        <div className="max-lg:min-h-[115svh]" aria-hidden="true" />
        {children}
      </div>
    </section>
  )
}
