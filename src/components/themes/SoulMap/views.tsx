'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince, headingId } from '@/components/cv/sectionText'
import type { SectionsOf } from '@/lib/cv/cvView'
import { AreaTitle, MenuPanel, TechSlots } from './menu'
import { FogGate } from './gate'
import { LiftDescent } from './descent'
import { ItemProjects } from './items'
import { FloorMessages } from './messages'
import { SunStages } from './stage'
import { FogArena } from './arena'

// Each profession's sections, each with its own event of the bonfire world: the System Engineer walks
// out of a fog gate into About (./gate), his jobs are the lift ride down past bloodstains that replay his
// ghost (./descent), his projects are summon signs his phantom rises out of (./items), his ventures are
// messages a spirit of him kneels and writes (./messages); the Musician's bands play in a shaft of sun
// (./stage); the Martial Artist's record is the bout behind the fog wall, its boss dropping in (./arena).
// The Tech Stack stays the game's plain menu screen, fading open when reached (./menu).

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
      <Block title={titles.about}>
        <FogGate>
          <MenuPanel>
            <p className="text-base leading-relaxed text-[color:var(--soul-text)]">{professionalSummary.bio}</p>
          </MenuPanel>
        </FogGate>
      </Block>

      {sections.jobs.length > 0 && (
        <Block title={titles.workExperience} wide>
          <LiftDescent jobs={sections.jobs} />
        </Block>
      )}

      <Block title={titles.techStack} wide>
        <MenuPanel>
          <TechSlots categories={sections.techStack} />
        </MenuPanel>
      </Block>

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
      <SunStages bands={bands} />
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
