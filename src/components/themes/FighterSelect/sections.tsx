'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince } from '@/components/cv/sectionText'
import { ArcadePanel } from './frames'
import { MoveCard, ProjectCard, VentureCard } from './cards'
import { ClashSeparator, LightningLine, RoundWins } from './separators'
import { ComboZone, HitCard } from './combo'
import { BandStage, LockIn, ResultRecord, RoundEntry } from './rounds'
import { BlastRow, CarSmash, DeckShow, ParryRow, SparRing, SuperArt } from './scenes'
import { FlightMap, FlightStop } from './flight'
import living from './living.module.css'

// The picked profession's sections, each opened by its own stage moment with him and his sparring
// partner (./scenes), no two alike:
// - About: the bonus stage, he smashes the car apart above his summary.
// - Work Experience: the plane flies the world map from job to job as each round scrolls in (./flight);
//   each job is still a round of the match (./rounds), in masonry.
// - Tech Stack: a ki blast flies across the row for each category and lights its move list card.
// - Projects: the super move, its dark flash and cut in, its hits counted on the combo counter; the
//   cards lock in and take hits under the pointer (./combo), in masonry.
// - Ventures: his partner attacks once per venture and each parry lights its card in parry blue.
// - Bands: he plays on the yacht's deck, the crowd cheering when the pointer lands on a band.
// - Muay Thai: the sparring round ends in a K.O. and a Perfect, then the result screen.

const LEAD = 'text-base leading-relaxed'

// A card lit by a blast or a parry keeps its bright rule, and jolts once as it lights.
function Lit({ on, frame, children }: { on: boolean; frame: string; children: ReactNode }) {
  return <div className={`h-full ${on ? `${frame} ${living.lit}` : ''}`}>{children}</div>
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections
  const { jobs } = sections

  return (
    <>
      <ArcadePanel accent="cyan" title={titles.about} id="about-heading">
        <CarSmash profession="engineer" />
        <p className={`mt-6 ${LEAD}`}>{professionalSummary.bio}</p>
      </ArcadePanel>

      <ClashSeparator />

      {jobs.length > 0 && (
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
      )}

      <LightningLine />

      <ArcadePanel accent="cyan" title={titles.techStack} id="tech-stack-heading">
        <BlastRow
          profession="engineer"
          items={sections.techStack}
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

      <ArcadePanel accent="gold" title={titles.projects} id="projects-heading">
        <ComboZone>
          <SuperArt profession="engineer" count={sections.projects.length} />
          <ProjectList
            projects={sections.projects}
            className={MASONRY_LIST}
            itemClassName={MASONRY_ITEM}
            renderProject={(slot) => (
              <LockIn>
                <HitCard>
                  <ProjectCard {...slot} />
                </HitCard>
              </LockIn>
            )}
          />
        </ComboZone>
      </ArcadePanel>

      <RoundWins />

      <ArcadePanel accent="cyan" title={titles.ventures} id="ventures-heading">
        <ParryRow
          profession="engineer"
          items={sections.companies}
          render={(items) => <ul className="grid gap-6 md:grid-cols-3">{items}</ul>}
          renderItem={(company, lit) => (
            <li key={company.id}>
              <Lit on={lit} frame={living.parriedFrame}>
                <VentureCard company={company} />
              </Lit>
            </li>
          )}
        />
      </ArcadePanel>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <>
      <LightningLine />
      <ArcadePanel accent="p2" title={labels.sections.bands} id="bands-heading">
        <DeckShow>
          {(cheer) => (
            <>
              <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
              <BandList
                bands={bands}
                className={MASONRY_LIST}
                itemClassName={MASONRY_ITEM}
                renderBand={(slot) => (
                  <div onPointerEnter={() => cheer(true)} onPointerLeave={() => cheer(false)} onFocus={() => cheer(true)} onBlur={() => cheer(false)}>
                    <BandStage {...slot} />
                  </div>
                )}
              />
            </>
          )}
        </DeckShow>
        <p className="mt-6 text-sm italic text-[color:var(--fs-gold)]">{musician.line}</p>
      </ArcadePanel>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const titles = useLabels().sections

  return (
    <>
      <RoundWins />
      <ArcadePanel accent="p2" title={titles.muayThai} id="muay-thai-heading">
        <SparRing profession="fighter" />
        <ResultRecord martialArts={sections.martialArts} />
      </ArcadePanel>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
