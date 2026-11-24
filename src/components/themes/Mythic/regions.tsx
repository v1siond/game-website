'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BLOOD_POINTS, Stage } from './stage'
import { Trials } from './trials'
import { Codex } from './codex'
import { Sagas } from './sagas'
import { Votives } from './votives'
import { Portraits } from './portraits'
import { Runestones } from './runestones'
import u from './underworld.module.css'

// The picked profession's sections, each a stretch of the descent: About in the great hall, the jobs on the
// storm deck and the codex over the storm sea, the services on the journal's pages after them, the sagas of
// his deeds and the votive tokens over the magma, the portraits and the runestone of his record under the
// bronze giant. The realm door on the summit closes the page (gate.tsx). The shared section plan picks which a profession shows and in which
// order; each section's scene plays behind it (scenes.tsx).

// His education and languages under the highlights, each label in the frost display face.
const FROST_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'text-base',
  term: `inline text-sm text-[var(--myth-frost)] ${u.display}`,
  value: 'inline',
  termEnd: ': ',
}

// One frame per section of the shared plan, each its stage in the descent.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { sections: titles, cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <Stage id={slot.id} title={titles.about} zone="hall">
        <div className={`max-w-prose p-5 sm:p-6 ${u.panel}`}>
          <p className="whitespace-pre-line text-lg leading-relaxed">{slot.bio}</p>
          <div data-stage-items="">
            <MarkedLines items={highlights} label={cards.keyAchievements} look={BLOOD_POINTS} />
          </div>
          <AboutFacts look={FROST_FACTS} />
        </div>
      </Stage>
    )
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.workExperience} zone="storm">
        <Trials jobs={slot.jobs} />
      </Stage>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.techStack} zone="storm">
        <Codex categories={slot.categories} />
      </Stage>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.services} zone="storm">
        <ul className={MASONRY_LIST} data-stage-items="">
          {slot.services.map((service) => (
            <li key={service.id} className={`${MASONRY_ITEM} p-5 ${u.parchment}`}>
              <h3 className={`border-b-2 border-[var(--myth-iron)] pb-2 text-lg ${u.display}`}>{service.title}</h3>
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
      <Stage id={slot.id} title={titles.projects} zone="magma">
        <Sagas projects={slot.projects} />
      </Stage>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.ventures} zone="magma">
        <Votives companies={slot.companies} />
      </Stage>
    )
  },
  bands: function BandsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.bands} zone="harbour">
        <Portraits musician={slot.musician} bands={slot.bands} />
      </Stage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage id={slot.id} title={titles.muayThai} zone="harbour">
        <Runestones martialArts={slot.martialArts} />
      </Stage>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
