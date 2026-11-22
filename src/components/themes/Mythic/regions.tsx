'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { aboutBlock } from '@/lib/cv/cvView'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { BloodPoints, Stage } from './stage'
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
import { CyclopsStomp, GorgonGaze } from './wrath'
import u from './underworld.module.css'

// The picked profession's sections, each a stage in the descent: About in the great hall, the chambers
// and the codex in the teal brick vaults, the services on plain parchment after them, the volcano erupting over the boons and the keepsakes in the
// magma, the portraits and the arena in the green fields. The last gate of the red temple closes the page (gate.tsx).
// The shared section plan picks which a profession shows and in which order.

// One frame per section of the shared plan, each its stage in the descent.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { sections: titles, cards, about } = useLabels()
    const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
    return (
      <Stage title={titles.about} zone="hall">
        <ChainHaul>
          <p className="max-w-prose text-lg leading-relaxed">{slot.bio}</p>
          <div className="max-w-prose">
            <BloodPoints title={cards.keyAchievements} items={highlights} />
            {education && (
              <p className="mt-4 text-base">
                <span className={`text-sm text-[var(--myth-gold)] ${u.display}`}>{about.education}: </span>
                {education}
              </p>
            )}
            {languages && (
              <p className="mt-1 text-base">
                <span className={`text-sm text-[var(--myth-gold)] ${u.display}`}>{about.languages}: </span>
                {languages}
              </p>
            )}
          </div>
        </ChainHaul>
      </Stage>
    )
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.workExperience} zone="storm">
        <Trials jobs={slot.jobs} />
      </Stage>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.techStack} zone="storm">
        <Climb categories={slot.categories} />
      </Stage>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.services} zone="storm">
        <FadeInScene>
          <GorgonGaze>
            <ul className={MASONRY_LIST}>
              {slot.services.map((service) => (
                <li key={service.id} className={`${MASONRY_ITEM} p-5 ${u.parchment}`}>
                  <h3 className={`border-b-2 border-[var(--myth-gold-deep)] pb-2 text-lg ${u.display}`}>{service.title}</h3>
                  <p className="mt-3 text-base leading-relaxed">{service.line}</p>
                </li>
              ))}
            </ul>
          </GorgonGaze>
        </FadeInScene>
      </Stage>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.projects} zone="magma">
        <Volcano />
        <ChestHeave />
        <Boons projects={slot.projects} />
      </Stage>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.ventures} zone="magma">
        <BladeThrow />
        <Keepsakes companies={slot.companies} />
      </Stage>
    )
  },
  bands: function BandsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.bands} zone="rhodes">
        <CyclopsStomp>
          <Portraits musician={slot.musician} bands={slot.bands} />
        </CyclopsStomp>
      </Stage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles.muayThai} zone="rhodes">
        <Prophecies martialArts={slot.martialArts} />
      </Stage>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
