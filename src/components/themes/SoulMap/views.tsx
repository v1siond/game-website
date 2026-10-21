'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince, headingId } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import { AreaTitle, Panel, TechSlots } from './menu'
import { LiftDescent } from './descent'
import { ItemProjects } from './items'
import { FloorMessages } from './messages'
import { SummonSigns } from './summons'
import { FogArena } from './arena'

// Each profession's sections, each with its own mechanic of the bonfire world: the System Engineer's
// jobs are the lift ride down (./descent), his projects lie about as items to pick up (./items), his
// ventures are messages on the floor (./messages); the Musician's bands are summon signs (./summons); the
// Martial Artist's record is the bout behind the fog wall (./arena). About and the Tech Stack are the
// game's plain menu panels between them.

function Block({ title, wide = false, children }: { title: string; wide?: boolean; children: ReactNode }) {
  const id = headingId('soul', title)
  return (
    <section className="relative px-4 py-12 sm:px-6" aria-labelledby={id}>
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <AreaTitle id={id} title={title} className="mb-6" />
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
            <p className="text-base leading-relaxed text-[color:var(--soul-text)]">{professionalSummary.bio}</p>
          </Panel>
        </Block>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <Block title={titles.workExperience} wide>
          <LiftDescent jobs={sections.jobs} />
        </Block>
      )}

      <FadeInScene>
        <Block title={titles.techStack} wide>
          <Panel>
            <TechSlots categories={sections.techStack} />
          </Panel>
        </Block>
      </FadeInScene>

      <Block title={titles.featuredWork} wide>
        <ItemProjects projects={sections.projects} />
      </Block>

      {sections.companies.length > 0 && (
        <Block title={titles.ventures} wide>
          <FloorMessages companies={sections.companies} />
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
      <p className="text-center text-base text-[color:var(--soul-glow)]">{drumsSince(musician, years)}</p>
      <SummonSigns bands={bands} />
      <p className="mt-6 text-center text-sm italic text-[color:var(--soul-text-soft)]">{musician.line}</p>
    </Block>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()

  return (
    <Block title={titles.muayThai} wide>
      <FogArena martialArts={sections.martialArts} />
    </Block>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
