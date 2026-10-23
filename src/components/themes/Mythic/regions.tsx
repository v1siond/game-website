'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
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
import u from './underworld.module.css'

// The picked profession's sections, each a stage in the descent: About in the great hall, the chambers
// and the codex in the teal brick vaults, the services on plain parchment after them, the volcano erupting over the boons and the keepsakes in the
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
        <Stage title={titles.workExperience} zone="storm">
          <Trials jobs={sections.jobs} />
        </Stage>
      )}

      {sections.techStack.length > 0 && (
        <Stage title={titles.techStack} zone="storm">
          <Climb categories={sections.techStack} />
        </Stage>
      )}

      {sections.services.length > 0 && (
        <Stage title={titles.services} zone="storm">
          <FadeInScene>
            <ul className={MASONRY_LIST}>
              {sections.services.map((service) => (
                <li key={service.id} className={`${MASONRY_ITEM} p-5 ${u.parchment}`}>
                  <h3 className={`border-b-2 border-[var(--myth-gold-deep)] pb-2 text-lg ${u.display}`}>{service.title}</h3>
                  <p className="mt-3 text-base leading-relaxed">{service.line}</p>
                </li>
              ))}
            </ul>
          </FadeInScene>
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
    <Stage title={titles.bands} zone="rhodes">
      <Portraits musician={sections.musician} bands={sections.bands} />
    </Stage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const titles = useLabels().sections

  return (
    <Stage title={titles.muayThai} zone="rhodes">
      <Prophecies martialArts={sections.martialArts} />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
