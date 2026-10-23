'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { Service } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { Braindance } from './braindance'
import { Gigs } from './gigs'
import { Radio } from './radio'
import { HudPanel } from './hud'
import { JackIn } from './jackin'
import { DistrictStage, FixerContracts, RipperdocRecord, SandevistanStack, ScanAbout } from './life'

// Neon Cyber's sections per profession, each with the merc doing a different thing in it (./life): the
// System Engineer's bio is scanned, the braindance of his work is ridden by him on the playhead
// (./braindance), the tech stack is crossed in one time slow dash, the gigs are breached with him jacked in
// (./gigs) and the ventures are the fixer's contracts on the map, cut loose by his mantis blades; the
// services panel boots from the cable he jacks into it (./jackin); the Musician drums on the radio
// (./radio); the Martial Artist sits in the ripperdoc's chair while each achievement installs. Each
// section hands its district (Japantown, the megabuilding, the Badlands) to the backdrop.

function Block({ children }: { children: ReactNode }) {
  return <div className="relative z-20 mb-10">{children}</div>
}

function Services({ services }: { services: Service[] }) {
  const { sections } = useLabels()

  return (
    <Block>
      <JackIn>
        <HudPanel title={sections.services}>
          <ul className={MASONRY_LIST}>
            {services.map((service) => (
              <li key={service.id} className={`${MASONRY_ITEM} border-l-2 border-[color:var(--neon-hack)] pl-3`}>
                <h3 className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">{service.title}</h3>
                <p className="text-base leading-relaxed text-[color:var(--neon-ice)]">{service.line}</p>
              </li>
            ))}
          </ul>
        </HudPanel>
      </JackIn>
    </Block>
  )
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

      {sections.services.length > 0 && <Services services={sections.services} />}

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
