'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince, headingId } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { Panel, SectionHeader, TechCloud } from './cards'
import { HangingJobs } from './ropes'
import { SpiderProjects } from './spider'
import { BandSigns, VentureSigns } from './signs'
import { GravityRecord } from './gravity'

// Each profession's sections, and only those, each with its own mechanic of the black forest: the
// System Engineer's jobs hang on ropes, his projects lie under the spider's webbing, his ventures are
// lit signs on the rooftops; the Musician's bands are rooftop signs under an ember sky; the Martial
// Artist's record sits in the gravity room. About and the Tech Stack are the plain panels between.

function Block({ title, wide = false, children }: { title: string; wide?: boolean; children: ReactNode }) {
  const id = headingId('silhouette', title)
  return (
    <section className="relative px-4 py-10 sm:px-6" aria-labelledby={id}>
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <SectionHeader id={id} title={title.toLowerCase()} />
        {children}
      </div>
    </section>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <Block title={titles.about}>
          <Panel>
            <p className="text-sm leading-relaxed text-[color:var(--sh-muted)]">{professionalSummary.bio}</p>
          </Panel>
        </Block>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <Block title={titles.workExperience} wide>
          <HangingJobs jobs={sections.jobs} />
        </Block>
      )}

      <FadeInScene>
        <Block title={titles.techStack}>
          <Panel>
            <TechCloud categories={sections.techStack} />
          </Panel>
        </Block>
      </FadeInScene>

      <Block title={titles.featuredWork} wide>
        <SpiderProjects projects={sections.projects} />
      </Block>

      {sections.companies.length > 0 && (
        <Block title={titles.ventures} wide>
          <VentureSigns companies={sections.companies} />
        </Block>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <Block title={titles.bands} wide>
      <p className="mb-6 text-center text-sm text-[color:var(--sh-text)]">{drumsSince(musician, years)}</p>
      <BandSigns bands={bands} />
      <p className="mt-6 text-center text-sm italic text-[color:var(--sh-muted)]">{musician.line}</p>
    </Block>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()

  return (
    <Block title={titles.muayThai} wide>
      <GravityRecord martialArts={sections.martialArts} />
    </Block>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
