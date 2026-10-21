'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { Stage } from './stage'
import { Chambers } from './chambers'
import { Codex } from './codex'
import { Boons } from './boons'
import { Keepsakes } from './keepsakes'
import { Portraits } from './portraits'
import { Prophecies } from './prophecies'
import u from './underworld.module.css'

// The picked profession's sections, each a stage in the descent: About in the great hall, the chambers
// and the codex in the teal brick vaults, the boons and the keepsakes over the magma, the portraits and
// the arena in the green fields. The last gate of the red temple closes the page (gate.tsx).

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Stage title={titles.about} zone="hall">
        <div className={`max-w-3xl p-6 ${u.panel} ${u.reveal}`}>
          <p className="text-lg leading-relaxed">{professionalSummary.bio}</p>
        </div>
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={titles.workExperience} zone="depths">
          <Chambers jobs={sections.jobs} />
        </Stage>
      )}

      {sections.techStack.length > 0 && (
        <Stage title={titles.techStack} zone="depths">
          <Codex categories={sections.techStack} />
        </Stage>
      )}

      {sections.projects.length > 0 && (
        <Stage title={titles.projects} zone="magma">
          <Boons projects={sections.projects} />
        </Stage>
      )}

      {sections.companies.length > 0 && (
        <Stage title={titles.ventures} zone="magma">
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
