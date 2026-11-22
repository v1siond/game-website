'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { aboutBlock } from '@/lib/cv/cvView'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Profession } from '@/lib/cv/professions'
import { ServiceCards, TechCloud } from './cards'
import { PropagandaBanners } from './ventures'
import { BrassPanel, Chamber } from './plaque'
import { DiaryShelf } from './diary'
import { ResearchBoard } from './camera'
import { MarqueeRow } from './marquee'
import { TheatreStage } from './stage'
import { PoweredRoom } from './power'
import { GlassTunnel } from './tunnel'
import { HackedShutter } from './hack'
import { GuardianStreet } from './guardian'
import { SparkedMarquees, Telekinesis } from './arrivals'

// The picked profession's sections, each a chamber one level deeper in the city (the plaque's gauge
// reads the depth), and in each he or the city does something different: he powers the dark about room
// with the bolt, listens to the job diaries, walks the tech stack's glass tunnel, reads the services on
// the same level of the city (its gauge keeps the tech stack's depth), hacks the pipes that
// lift the projects shutter, pulls the cords that drop the ventures' propaganda banners; the guardian
// pair walks behind the band marquees; he fights on the theatre stage for the Muay Thai record. Two
// sections he acts on himself (./arrivals): he lifts the services into place with the plasmid, and his
// drum strike sparks the band marquees on. The shared section plan picks which a profession shows and in
// which order.

/** How deep each section's chamber sits; a profession's first chamber is depth 0. */
const DEPTH: Record<SectionId, number> = {
  about: 0,
  work: 1,
  tech: 2,
  services: 2,
  projects: 3,
  ventures: 4,
  bands: 0,
  muayThai: 0,
}

interface LevelProps {
  slot: SectionSlot
  // The short sections fade in; the ones with a scene of their own stand as they are.
  fade?: boolean
  children: ReactNode
}

// A section as its chamber, titled from the labels at its depth.
function Level({ slot, fade = false, children }: LevelProps) {
  const { sections: titles } = useLabels()
  const chamber = (
    <Chamber title={titles[slot.titleKey]} depth={DEPTH[slot.id]}>
      {children}
    </Chamber>
  )
  if (!fade) return chamber
  return <FadeInScene>{chamber}</FadeInScene>
}

// The About highlights on the brass panel, each behind a gold diamond.
const GOLD_DIAMONDS: MarkedLinesLook = {
  list: 'mx-auto mt-5 max-w-prose space-y-2',
  line: 'flex items-start gap-2 text-sm text-[color:var(--deco-cream)]',
  marker: (
    <svg viewBox="0 0 10 10" className="mt-1 h-3 w-3 flex-shrink-0 text-[color:var(--deco-gold)]" aria-hidden="true" focusable="false">
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  ),
}

// One line of the About plate's facts, the label in the gold capitals; an empty fact leaves no line.
function AboutFact({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="uppercase tracking-[0.15em] text-[color:var(--deco-gold-bright-text)]">{label}</dt>
      <dd className="text-[color:var(--deco-mist)]">{value}</dd>
    </div>
  )
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { cards, about } = useLabels()
    const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
    return (
      <Level slot={slot} fade>
        <PoweredRoom>
          <BrassPanel>
            <p className="mx-auto max-w-prose text-base leading-relaxed text-[color:var(--deco-cream)]">{slot.bio}</p>
            <MarkedLines items={highlights} label={cards.keyAchievements} look={GOLD_DIAMONDS} />
            <dl className="mx-auto mt-5 max-w-prose space-y-1 text-sm">
              <AboutFact label={about.education} value={education} />
              <AboutFact label={about.languages} value={languages} />
            </dl>
          </BrassPanel>
        </PoweredRoom>
      </Level>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <Level slot={slot}>
        <DiaryShelf jobs={slot.jobs} />
      </Level>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <Level slot={slot} fade>
        <GlassTunnel>
          <TechCloud categories={slot.categories} />
        </GlassTunnel>
      </Level>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <Level slot={slot} fade>
        <Telekinesis>
          <ServiceCards services={slot.services} />
        </Telekinesis>
      </Level>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Level slot={slot}>
        <HackedShutter>{(opened) => <ResearchBoard projects={slot.projects} arrived={opened} />}</HackedShutter>
      </Level>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Level slot={slot} fade>
        <PropagandaBanners companies={slot.companies} />
      </Level>
    )
  },
  bands: function BandsFrame({ slot }) {
    return (
      <Level slot={slot}>
        <GuardianStreet>
          <SparkedMarquees>
            <MarqueeRow bands={slot.bands} musician={slot.musician} />
          </SparkedMarquees>
        </GuardianStreet>
      </Level>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const { martialArts } = slot
    return (
      <Level slot={slot}>
        <h3 className="mb-8 text-center text-xl tracking-[0.1em] text-[color:var(--deco-gold-bright)] [font-family:var(--deco-display)]">{martialArts.primary.title}</h3>
        <TheatreStage martialArts={martialArts} />
      </Level>
    )
  },
}

// The chambers stand 5rem apart.
export const SECTION_VIEWS = sectionViews(FRAMES, 'space-y-20')

/** How deep the closing posts chamber sits after each profession's own chambers. */
export const POSTS_DEPTH: Record<Profession, number> = {
  engineer: 5,
  drummer: 1,
  fighter: 1,
}
