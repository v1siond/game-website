'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { Labels } from '@/lib/cv/labels'
import { PaperPanel } from './panels'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MARK_LIST, ServiceNotes, TechCloud } from './cards'
import { MapFiles } from './files'
import { AttacheCase } from './case'
import { TraderWares } from './trader'
import { SuitDoors } from './keys'
import { HerbRecovery } from './condition'
import { RoomWindow } from './stage'
import type { Zone } from './scripts'

// The picked profession's sections, each one of the genre's own screens: Work Experience is the house map
// and its files (./files), Projects the attache case (./case), Ventures the trader's wares (./trader), Bands
// the suit key doors (./keys), the Muay Thai record the herb recovery (./condition). About and Tech Stack
// are papers found on the desk and fade in, and so are the Services, typed notes in the same room as the
// Tech Stack. Each is a window onto its room of the house behind the page (RoomWindow, ./stage): the study,
// the corridor, the armoury, the back door, the trader, the suit door, the gym. The shared section plan
// picks which a profession shows and in which order.

interface RoomProps {
  zone: Zone
  titleKey: keyof Labels['sections']
  // The papers found on the desk fade in; the genre's own screens stand as they are.
  fade?: boolean
  children: ReactNode
}

// A section as a window onto its room, its paper panel titled from the labels.
function Room({ zone, titleKey, fade = false, children }: RoomProps) {
  const { sections: titles } = useLabels()
  const panel = <PaperPanel title={titles[titleKey]}>{children}</PaperPanel>
  return <RoomWindow zone={zone}>{fade ? <FadeInScene>{panel}</FadeInScene> : panel}</RoomWindow>
}

// His education and languages typed under the bio on the same paper, each label in brass.
const PAPER_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-2',
  fact: '',
  term: 'text-sm uppercase text-[color:var(--sh-brass-text)]',
  value: 'text-sm text-[color:var(--sh-cream)]',
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <Room zone="about" titleKey="about" fade>
        <p className="max-w-prose text-base leading-relaxed text-[color:var(--sh-cream)]">{slot.bio}</p>
        <AboutFacts look={PAPER_FACTS} />
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...MARK_LIST, list: 'mt-4 space-y-1' }} />
      </Room>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <Room zone="experience" titleKey="workExperience">
        <MapFiles jobs={slot.jobs} />
      </Room>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <Room zone="tech" titleKey="techStack" fade>
        <TechCloud categories={slot.categories} />
      </Room>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <Room zone="tech" titleKey="services" fade>
        <ServiceNotes services={slot.services} />
      </Room>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Room zone="projects" titleKey="projects">
        <AttacheCase projects={slot.projects} />
      </Room>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Room zone="ventures" titleKey="ventures">
        <TraderWares companies={slot.companies} />
      </Room>
    )
  },
  bands: function BandsFrame({ slot }) {
    return (
      <Room zone="bands" titleKey="bands">
        <SuitDoors musician={slot.musician} bands={slot.bands} />
      </Room>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return (
      <Room zone="gym" titleKey="muayThai">
        <HerbRecovery martialArts={slot.martialArts} />
      </Room>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
