'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Labels } from '@/lib/cv/labels'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { drumsSince, headingId } from '@/lib/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { SectionHeader } from './cards'
import { ChaseAbout } from './chase'
import { HangingJobs } from './ropes'
import { FloatingCrates } from './crates'
import { TrapLine } from './traps'
import { MillProjects } from './mill'
import { VentureSigns } from './signs'
import { ShockStage } from './stage'
import { GravityRecord } from './gravity'
import world from './world.module.css'

// Each profession's sections, and only those, each its own set piece on the walk from the dark forest
// to the machine city, so no two look or move alike: the System Engineer's about is a spider chase
// through the thicket, his jobs hang down one rope into a chasm, his tech stack floats as crates in a
// flooded hold, his services stand as plain slabs under a fade, the spider loses a leg in the trap
// line, his projects lie on a sawmill floor under a
// running saw and his ventures are lit signs over the city; the Musician's bands are plates on an electrified floor stepping in time; the Martial
// Artist's record sits in the gravity room. The shared section plan picks which a profession shows and in
// which order.

// A section titled from the labels by its key.
function Block({ titleKey, wide = false, children }: { titleKey: keyof Labels['sections']; wide?: boolean; children: ReactNode }) {
  const { sections } = useLabels()
  const title = sections[titleKey]
  const id = headingId('silhouette', title)
  return (
    <section className="relative px-4 py-10 sm:px-6" aria-labelledby={id}>
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <SectionHeader id={id} title={title} />
        {children}
      </div>
    </section>
  )
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order. The
// trap line closes the services, so it sits in their frame; the projects keep the Featured Work title.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return (
      <Block titleKey="about">
        <ChaseAbout bio={slot.bio} />
      </Block>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <Block titleKey="workExperience" wide>
        <HangingJobs jobs={slot.jobs} />
      </Block>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <Block titleKey="techStack" wide>
        <FloatingCrates categories={slot.categories} />
      </Block>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <>
        <Block titleKey="services" wide>
          <FadeInScene>
            <ul className={MASONRY_LIST}>
              {slot.services.map((service) => (
                <li key={service.id} className={`${MASONRY_ITEM} border-l-4 border-[color:var(--sh-black)] p-4 ${world.card}`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--sh-text)]">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-muted-text)]">{service.line}</p>
                </li>
              ))}
            </ul>
          </FadeInScene>
        </Block>
        <TrapLine />
      </>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Block titleKey="featuredWork" wide>
        <MillProjects projects={slot.projects} />
      </Block>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Block titleKey="ventures" wide>
        <VentureSigns companies={slot.companies} />
      </Block>
    )
  },
  bands: function BandsFrame({ slot }) {
    const { years } = useLabels()
    return (
      <Block titleKey="bands" wide>
        <p className="mb-6 text-center text-sm text-[color:var(--sh-text)]">{drumsSince(slot.musician, years)}</p>
        <ShockStage bands={slot.bands} />
        <p className="mt-6 text-center text-sm italic text-[color:var(--sh-muted-text)]">{slot.musician.line}</p>
      </Block>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return (
      <Block titleKey="muayThai" wide>
        <GravityRecord martialArts={slot.martialArts} />
      </Block>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
