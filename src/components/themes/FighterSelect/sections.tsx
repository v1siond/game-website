'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { drumsSince } from '@/lib/cv/sectionText'
import { ArcadePanel } from './frames'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MoveCard, ProjectCard, SPARK_LINES, ServiceCard, VentureCard } from './cards'
import { ClashSeparator, LightningLine, RoundWins } from './separators'
import { ComboZone, HitCard } from './combo'
import { BandStage, LockIn, ResultRecord, RoundEntry } from './rounds'
import { BlastRow, CarSmash, DeckShow, ParryRow, SparRing, SuperArt } from './scenes'
import { FlightMap, FlightStop } from './flight'
import { UppercutLaunch } from './uppercut'
import living from './living.module.css'
import look from './world.module.css'

// The picked profession's sections, each opened by its own stage moment with him and his sparring
// partner (./scenes), no two alike:
// - About: the bonus stage, he smashes the car apart above his summary and a wheel lands on it.
// - Work Experience: the plane flies the world map from job to job as each round scrolls in (./flight);
//   each job is still a round of the match (./rounds), in masonry.
// - Tech Stack: a ki blast flies across the row for each category and lights its move list card.
// - Services: he walks onto the card grid and his rising uppercut launches the cards up into place
//   (./uppercut).
// - Projects: the super move, its dark flash and cut in, its hits counted on the combo counter; the
//   cards lock in and take hits under the pointer (./combo), in masonry.
// - Ventures: his partner attacks once per venture and each parry lights its card in parry blue.
// - Bands: he plays on the yacht's deck, the crowd cheering when the pointer lands on a band.
// - Muay Thai: the sparring round ends in a K.O. and a Perfect, then the result screen.
// The shared section plan picks which a profession shows and in which order; the art between two
// sections (the VS burst, the lightning line, the round wins) sits in the frame it follows or opens.

const LEAD = 'text-base leading-relaxed'

// A card lit by a blast or a parry keeps its bright rule, and jolts once as it lights.
function Lit({ on, frame, children }: { on: boolean; frame: string; children: ReactNode }) {
  return <div className={`h-full ${on ? `${frame} ${living.lit}` : ''}`}>{children}</div>
}

// His education and languages under the highlights, each label in the gold display face.
const GOLD_FACTS: AboutFactsLook = {
  list: 'space-y-1',
  fact: 'text-sm text-white',
  term: `inline uppercase text-[color:var(--fs-gold)] ${look.display}`,
  value: 'inline',
  termEnd: ': ',
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { sections: titles, cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <>
        <ArcadePanel accent="cyan" title={titles.about} id="about-heading">
          <CarSmash profession="engineer">
            <p className={`mt-6 max-w-prose ${LEAD}`}>{slot.bio}</p>
            <div className="mt-6 max-w-prose">
              <MarkedLines items={highlights} label={cards.keyAchievements} look={SPARK_LINES} />
              <AboutFacts look={GOLD_FACTS} />
            </div>
          </CarSmash>
        </ArcadePanel>
        <ClashSeparator />
      </>
    )
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    const { jobs } = slot
    return (
      <>
        <ArcadePanel accent="p1" title={titles.workExperience} id="experience-heading">
          <FlightMap jobs={jobs}>
            <ul className={MASONRY_LIST}>
              {jobs.map((entry, index) => (
                <li key={entry.id} className={MASONRY_ITEM}>
                  <FlightStop index={index}>
                    <RoundEntry entry={entry} round={jobs.length - index} />
                  </FlightStop>
                </li>
              ))}
            </ul>
          </FlightMap>
        </ArcadePanel>
        <LightningLine />
      </>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <ArcadePanel accent="cyan" title={titles.techStack} id="tech-stack-heading">
        <BlastRow
          profession="engineer"
          items={slot.categories}
          render={(items) => <ul className={MASONRY_LIST}>{items}</ul>}
          renderItem={(category, lit) => (
            <li key={category.id} className={MASONRY_ITEM}>
              <Lit on={lit} frame={living.litFrame}>
                <MoveCard category={category} />
              </Lit>
            </li>
          )}
        />
      </ArcadePanel>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <ArcadePanel accent="p1" title={titles.services} id="services-heading">
        <UppercutLaunch>
          <ul className={MASONRY_LIST}>
            {slot.services.map((service) => (
              <li key={service.id} className={MASONRY_ITEM}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </UppercutLaunch>
      </ArcadePanel>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <>
        <ArcadePanel accent="gold" title={titles.projects} id="projects-heading">
          <ComboZone>
            <SuperArt profession="engineer" count={slot.projects.length} />
            <ProjectList
              projects={slot.projects}
              className={MASONRY_LIST}
              itemClassName={MASONRY_ITEM}
              renderProject={(project) => (
                <LockIn>
                  <HitCard>
                    <ProjectCard {...project} />
                  </HitCard>
                </LockIn>
              )}
            />
          </ComboZone>
        </ArcadePanel>
        <RoundWins />
      </>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <ArcadePanel accent="cyan" title={titles.ventures} id="ventures-heading">
        <ParryRow
          profession="engineer"
          items={slot.companies}
          render={(items) => <ul className="grid gap-6 md:grid-cols-6">{items}</ul>}
          renderItem={(company, lit) => (
            <li key={company.id} className={company.featured ? 'md:col-span-3' : 'md:col-span-2'}>
              <Lit on={lit} frame={living.parriedFrame}>
                <VentureCard company={company} />
              </Lit>
            </li>
          )}
        />
      </ArcadePanel>
    )
  },
  bands: function BandsFrame({ slot }) {
    const labels = useLabels()
    const { musician, bands } = slot
    return (
      <>
        <LightningLine />
        <ArcadePanel accent="p2" title={labels.sections.bands} id="bands-heading">
          <DeckShow>
            <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
            <BandList
              bands={bands}
              className={MASONRY_LIST}
              itemClassName={MASONRY_ITEM}
              renderBand={(band) => (
                <div data-band="">
                  <BandStage {...band} />
                </div>
              )}
            />
          </DeckShow>
          <p className="mt-6 text-sm italic text-[color:var(--fs-gold)]">{musician.line}</p>
        </ArcadePanel>
      </>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <>
        <RoundWins />
        <ArcadePanel accent="p2" title={titles.muayThai} id="muay-thai-heading">
          <SparRing profession="fighter" />
          <ResultRecord martialArts={slot.martialArts} />
        </ArcadePanel>
      </>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
