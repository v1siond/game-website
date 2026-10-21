'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince } from '@/components/cv/sectionText'
import { ArcadePanel } from './frames'
import { MoveList, ProjectCard, VentureCard } from './cards'
import { ClashSeparator, LightningLine, RoundWins } from './separators'
import { ComboZone, HitCard } from './combo'
import { BandStage, LockIn, ResultRecord, RoundEntry } from './rounds'

// The picked profession's sections. About, Tech Stack and Ventures fade in. Work Experience is the
// match's rounds, one job a round (./rounds), in masonry. Projects lock into their slots and take hits
// under the pointer, the combo counter climbing (./combo), in masonry. Bands stand on the concert stage,
// each card leaning with the pointer, in masonry. The Muay Thai record is the result screen.

const LEAD = 'text-base leading-relaxed'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { jobs } = sections

  return (
    <>
      <FadeInScene>
        <ArcadePanel accent="cyan" title="About" id="about-heading">
          <p className={LEAD}>{professionalSummary.bio}</p>
        </ArcadePanel>
      </FadeInScene>

      <ClashSeparator />

      {jobs.length > 0 && (
        <ArcadePanel accent="p1" title="Work Experience" id="experience-heading">
          <ul className={MASONRY_LIST}>
            {jobs.map((entry, index) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <RoundEntry entry={entry} round={jobs.length - index} />
              </li>
            ))}
          </ul>
        </ArcadePanel>
      )}

      <LightningLine />

      <FadeInScene>
        <ArcadePanel accent="cyan" title="Tech Stack" id="tech-stack-heading">
          <MoveList categories={sections.techStack} />
        </ArcadePanel>
      </FadeInScene>

      <ArcadePanel accent="gold" title="Projects" id="projects-heading">
        <ComboZone>
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

      <FadeInScene>
        <ArcadePanel accent="cyan" title="Ventures" id="ventures-heading">
          <ul className="grid gap-6 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <VentureCard company={company} />
              </li>
            ))}
          </ul>
        </ArcadePanel>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <>
      <LightningLine />
      <ArcadePanel accent="p2" title="Bands" id="bands-heading">
        <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
        <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandStage {...slot} />} />
        <p className="mt-6 text-sm italic text-[color:var(--fs-gold)]">{musician.line}</p>
      </ArcadePanel>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  return (
    <>
      <RoundWins />
      <ArcadePanel accent="p2" title="Muay Thai" id="muay-thai-heading">
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
