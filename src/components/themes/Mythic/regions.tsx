'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { Stage } from './stage'
import { Trials } from './trials'
import { ChainHaul } from './chains'
import { ChestHeave } from './chest'
import { BladeThrow } from './hurl'
import { Climb } from './climb'
import { Boons } from './boons'
import { Volcano } from './volcano'
import { Keepsakes } from './keepsakes'
import { Portraits } from './portraits'
import { Prophecies } from './prophecies'

// The picked profession's sections, each a stage in the descent: About in the great hall, the chambers
// and the codex in the teal brick vaults, the volcano erupting over the boons and the keepsakes in the
// magma, the portraits and the arena in the green fields. The last gate of the red temple closes the page (gate.tsx).

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Stage title={titles.about} zone="hall">
        <ChainHaul>
          <p className="text-lg leading-relaxed">{professionalSummary.bio}</p>
        </ChainHaul>
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={titles.workExperience} zone="depths">
          <Trials jobs={sections.jobs} />
        </Stage>
      )}

      {sections.techStack.length > 0 && (
        <Stage title={titles.techStack} zone="depths">
          <Climb categories={sections.techStack} />
        </Stage>
      )}

      {sections.projects.length > 0 && (
        <Stage title={titles.projects} zone="magma">
          <Volcano />
          <ChestHeave />
          <Boons projects={sections.projects} />
        </Stage>
      )}

      {sections.companies.length > 0 && (
        <Stage title={titles.ventures} zone="magma">
          <BladeThrow />
          <Keepsakes companies={sections.companies} />
        </Stage>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const titles = useLabels().sections

  return (
    <Stage title={titles.bands} zone="fields">
      <Portraits musician={sections.musician} bands={sections.bands} />
    </Stage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const titles = useLabels().sections

  return (
    <Stage title={titles.muayThai} zone="fields">
      <Prophecies martialArts={sections.martialArts} />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
