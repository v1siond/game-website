'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { PaperPanel } from './panels'
import { TechCloud } from './cards'
import { MapFiles } from './files'
import { AttacheCase } from './case'
import { TraderWares } from './trader'
import { SuitDoors } from './keys'
import { HerbRecovery } from './condition'

// The picked profession's sections, each one of the genre's own screens: Work Experience is the house map
// and its files (./files), Projects the attache case (./case), Ventures the trader's coat (./trader), Bands
// the suit key doors (./keys), the Muay Thai record the herb recovery (./condition). About and Tech Stack
// are papers found on the desk and fade in.

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <PaperPanel title={titles.about}>
          <p className="text-base leading-relaxed text-[color:var(--sh-cream)]">{professionalSummary.bio}</p>
        </PaperPanel>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <PaperPanel title={titles.workExperience}>
          <MapFiles jobs={sections.jobs} />
        </PaperPanel>
      )}

      <FadeInScene>
        <PaperPanel title={titles.techStack}>
          <TechCloud categories={sections.techStack} />
        </PaperPanel>
      </FadeInScene>

      {sections.projects.length > 0 && (
        <PaperPanel title={titles.projects}>
          <AttacheCase projects={sections.projects} />
        </PaperPanel>
      )}

      {sections.companies.length > 0 && (
        <PaperPanel title={titles.ventures}>
          <TraderWares companies={sections.companies} />
        </PaperPanel>
      )}
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { sections: titles } = useLabels()

  return (
    <PaperPanel title={titles.bands}>
      <SuitDoors musician={sections.musician} bands={sections.bands} />
    </PaperPanel>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()

  return (
    <PaperPanel title={titles.muayThai}>
      <HerbRecovery martialArts={sections.martialArts} />
    </PaperPanel>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
