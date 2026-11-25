'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BLOOD_POINTS, Stage } from './stage'
import { Trials } from './trials'
import { Codex } from './codex'
import { Labours } from './labours'
import { Votives } from './votives'
import { Portraits } from './portraits'
import { Prophecies } from './prophecies'
import u from './underworld.module.css'

// The picked profession's sections, each a stretch of the run in the games' order: About in burning Athens,
// the jobs in the desert of the chained Titan, the codex in the architect's temple, the services at the last
// duel with the war god, his labours in the harbour under the bronze giant, the votive tokens on the island of
// the stone steeds, the portraits in the bog, and the prophecies fulfilled by the great chasm. The gate on the
// mountain of the gods closes the page (gate.tsx). The shared section plan picks which a profession shows and
// in which order; each section's scene plays beside it (scenes.tsx).

// His education and languages under the highlights, each label in the gold display face.
const GOLD_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'text-base',
  term: `inline text-sm text-[var(--myth-gold)] ${u.display}`,
  value: 'inline',
  termEnd: ': ',
}

// One frame per section of the shared plan, each its stage in the descent.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { sections: titles, cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <Stage id={slot.id} title={titles.about}>
        <div className={`max-w-prose p-5 sm:p-6 ${u.panel}`}>
          <p className="whitespace-pre-line text-lg leading-relaxed">{slot.bio}</p>
          <div data-stage-items="">
            <MarkedLines items={highlights} label={cards.keyAchievements} look={BLOOD_POINTS} />
          </div>
          <AboutFacts look={GOLD_FACTS} />
        </div>
      </Stage>
    )
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.workExperience}>
        <Trials jobs={slot.jobs} />
      </Stage>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.techStack}>
        <Codex categories={slot.categories} />
      </Stage>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.services}>
        <ul className={MASONRY_LIST} data-stage-items="">
          {slot.services.map((service) => (
            <li key={service.id} className={`${MASONRY_ITEM} p-5 ${u.parchment}`}>
              <h3 className={`border-b-2 border-[var(--myth-gold-deep)] pb-2 text-lg ${u.display}`}>{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed">{service.line}</p>
            </li>
          ))}
        </ul>
      </Stage>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.projects}>
        <Labours projects={slot.projects} />
      </Stage>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.ventures}>
        <Votives companies={slot.companies} />
      </Stage>
    )
  },
  bands: function BandsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.bands}>
        <Portraits musician={slot.musician} bands={slot.bands} />
      </Stage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.muayThai}>
        <Prophecies martialArts={slot.martialArts} />
      </Stage>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
