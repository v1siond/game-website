'use client'

import type { ReactNode } from 'react'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { Braindance } from './braindance'
import { Gigs } from './gigs'
import { Radio } from './radio'
import { DistrictStage, FixerContracts, RipperdocRecord, SandevistanStack, ScanAbout } from './life'

// Neon Cyber's sections per profession, each with the merc doing a different thing in it (./life): the
// System Engineer's bio is scanned, the braindance of his work is ridden by him on the playhead
// (./braindance), the tech stack is crossed in one time slow dash, the gigs are breached with him jacked in
// (./gigs) and the ventures are the fixer's contracts on the map; the Musician drums on the radio
// (./radio); the Martial Artist sits in the ripperdoc's chair while each achievement installs. Each
// section hands its district (Japantown, the megabuilding, the Badlands) to the backdrop.

function Block({ children }: { children: ReactNode }) {
  return <div className="relative z-20 mb-10">{children}</div>
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  return (
    <>
      <ScanAbout />

      {sections.jobs.length > 0 && (
        <DistrictStage district="japantown">
          <Block>
            <Braindance jobs={sections.jobs} />
          </Block>
        </DistrictStage>
      )}

      <SandevistanStack techStack={sections.techStack} />

      {sections.projects.length > 0 && (
        <DistrictStage district="megablock">
          <Block>
            <Gigs projects={sections.projects} />
          </Block>
        </DistrictStage>
      )}

      {sections.companies.length > 0 && <FixerContracts companies={sections.companies} />}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  return (
    <DistrictStage district="japantown">
      <Block>
        <Radio musician={sections.musician} bands={sections.bands} />
      </Block>
    </DistrictStage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  return <RipperdocRecord martialArts={sections.martialArts} />
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
