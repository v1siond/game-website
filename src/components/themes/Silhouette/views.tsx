'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince, headingId } from '@/components/cv/sectionText'
import { SectionHeader } from './cards'
import { ChaseAbout } from './chase'
import { HangingJobs } from './ropes'
import { FloatingCrates } from './crates'
import { TrapLine } from './traps'
import { MillProjects } from './mill'
import { VentureSigns } from './signs'
import { ShockStage } from './stage'
import { GravityRecord } from './gravity'

// Each profession's sections, and only those, each its own set piece on the walk from the dark forest
// to the machine city, so no two look or move alike: the System Engineer's about is a spider chase
// through the thicket, his jobs hang down one rope into a chasm, his tech stack floats as crates in a
// flooded hold, the spider loses a leg in the trap line, his projects lie on a sawmill floor under a
// running saw and his ventures are lit signs over the city; the Musician's bands are plates on an electrified floor stepping in time; the Martial
// Artist's record sits in the gravity room.

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
      <Block title={titles.about}>
        <ChaseAbout bio={professionalSummary.bio} />
      </Block>

      {sections.jobs.length > 0 && (
        <Block title={titles.workExperience} wide>
          <HangingJobs jobs={sections.jobs} />
        </Block>
      )}

      <Block title={titles.techStack} wide>
        <FloatingCrates categories={sections.techStack} />
      </Block>

      <TrapLine />

      <Block title={titles.featuredWork} wide>
        <MillProjects projects={sections.projects} />
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
      <ShockStage bands={bands} />
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
