'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import type { Service } from '@/lib/cv/content'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
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
// section hands its district (Japantown, the megabuilding, the Badlands) to the backdrop. The shared section
// plan picks which a profession shows and in which order.

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

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return <ScanAbout bio={slot.bio} />
  },
  work: function WorkFrame({ slot }) {
    return (
      <DistrictStage district="japantown">
        <Block>
          <Braindance jobs={slot.jobs} />
        </Block>
      </DistrictStage>
    )
  },
  tech: function TechFrame({ slot }) {
    return <SandevistanStack techStack={slot.categories} />
  },
  services: function ServicesFrame({ slot }) {
    return <Services services={slot.services} />
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <DistrictStage district="megablock">
        <Block>
          <Gigs projects={slot.projects} />
        </Block>
      </DistrictStage>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return <FixerContracts companies={slot.companies} />
  },
  bands: function BandsFrame({ slot }) {
    return (
      <DistrictStage district="japantown">
        <Block>
          <Radio musician={slot.musician} bands={slot.bands} />
        </Block>
      </DistrictStage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return <RipperdocRecord martialArts={slot.martialArts} />
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
