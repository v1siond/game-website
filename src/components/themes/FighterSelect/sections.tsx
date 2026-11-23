'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import type { SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_COLUMN_LIST, MASONRY_ITEM } from '@/lib/cv/masonry'
import { drumsSince } from '@/lib/cv/sectionText'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MoveCard, ProjectCard, SPARK_LINES, ServiceCard, VentureCard } from './cards'
import { HitCard } from './combo'
import { BandStage, ResultRecord, RoundEntry } from './rounds'
import { FlightMap, FlightStop } from './flight'
import look from './world.module.css'

// What each section's arcade screen shows over its scene (theatre.tsx), every field from the shared lists
// and the card view models. The cards a scene counts, one beat of its bout each, sit inside
// [data-stage-items]:
// - Work Experience: the plane flies the world map from job to job as each round scrolls in (./flight);
//   each job is still a round of the match (./rounds), in masonry.
// - Projects: the cards take hits under the pointer (./combo).
// - Bands: the cards follow the pointer like the crowd's cheer.
// - Muay Thai: the result screen.

const LEAD = 'text-base leading-relaxed'

// His education and languages under the highlights, each label in the gold display face.
const GOLD_FACTS: AboutFactsLook = {
  list: 'space-y-1',
  fact: 'text-sm text-white',
  term: `inline uppercase text-[color:var(--fs-gold)] ${look.display}`,
  value: 'inline',
  termEnd: ': ',
}

export const CARDS: SectionFrames = {
  about: function AboutCards({ slot }) {
    const { cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <>
        <p className={`max-w-prose ${LEAD}`}>{slot.bio}</p>
        <div className="mt-6 max-w-prose">
          <div data-stage-items="">
            <MarkedLines items={highlights} label={cards.keyAchievements} look={SPARK_LINES} />
          </div>
          <AboutFacts look={GOLD_FACTS} />
        </div>
      </>
    )
  },
  work: function WorkCards({ slot: { jobs } }) {
    return (
      <FlightMap jobs={jobs}>
        <ul data-stage-items="" className={MASONRY_COLUMN_LIST}>
          {jobs.map((entry, index) => (
            <li key={entry.id} className={MASONRY_ITEM}>
              <FlightStop index={index}>
                <RoundEntry entry={entry} round={jobs.length - index} />
              </FlightStop>
            </li>
          ))}
        </ul>
      </FlightMap>
    )
  },
  tech: function TechCards({ slot }) {
    return (
      <ul data-stage-items="" className={MASONRY_COLUMN_LIST}>
        {slot.categories.map((category) => (
          <li key={category.id} className={MASONRY_ITEM}>
            <MoveCard category={category} />
          </li>
        ))}
      </ul>
    )
  },
  services: function ServiceCards({ slot }) {
    return (
      <ul data-stage-items="" className={MASONRY_COLUMN_LIST}>
        {slot.services.map((service) => (
          <li key={service.id} className={MASONRY_ITEM}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    )
  },
  projects: function ProjectCards({ slot }) {
    return (
      <div data-stage-items="">
        <ProjectList
          projects={slot.projects}
          className={MASONRY_COLUMN_LIST}
          itemClassName={MASONRY_ITEM}
          renderProject={(project) => (
            <HitCard>
              <ProjectCard {...project} />
            </HitCard>
          )}
        />
      </div>
    )
  },
  ventures: function VentureCards({ slot }) {
    return (
      <ul data-stage-items="" className="grid gap-6 md:grid-cols-2">
        {slot.companies.map((company) => (
          <li key={company.id}>
            <VentureCard company={company} />
          </li>
        ))}
      </ul>
    )
  },
  bands: function BandCards({ slot: { musician, bands } }) {
    const labels = useLabels()
    return (
      <>
        <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
        <div data-stage-items="">
          <BandList
            bands={bands}
            className={MASONRY_COLUMN_LIST}
            itemClassName={MASONRY_ITEM}
            renderBand={(band) => (
              <div data-band="">
                <BandStage {...band} />
              </div>
            )}
          />
        </div>
        <p className="mt-6 text-sm italic text-[color:var(--fs-gold)]">{musician.line}</p>
      </>
    )
  },
  muayThai: function MuayThaiCards({ slot }) {
    return (
      <div data-stage-items="">
        <ResultRecord martialArts={slot.martialArts} />
      </div>
    )
  },
}
