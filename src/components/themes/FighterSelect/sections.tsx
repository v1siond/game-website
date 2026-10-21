'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArcadePanel } from './frames'
import { HitSpark } from './badges'
import { BandCard, ExperienceCard, MoveList, ProjectCard, VentureCard } from './cards'
import { ClashSeparator, LightningLine, RoundWins } from './separators'
import { SceneItem, Strip } from './scenes'
import look from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Projects,
// Bands and the Muay Thai record are stages he crosses, each entry arriving as part of the match.

const LEAD = 'text-base leading-relaxed'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <ArcadePanel accent="cyan" title="About" id="about-heading">
          <p className={LEAD}>{professionalSummary.bio}</p>
        </ArcadePanel>
      </FadeInScene>

      <ClashSeparator />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <ArcadePanel accent="p1" title="Work Experience" id="experience-heading">
            <ul className="space-y-6">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="challenger">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </ArcadePanel>
        </LevelScene>
      )}

      <LightningLine />

      <FadeInScene>
        <ArcadePanel accent="cyan" title="Tech Stack" id="tech-stack-heading">
          <MoveList categories={sections.techStack} />
        </ArcadePanel>
      </FadeInScene>

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <ArcadePanel accent="gold" title="Projects" id="projects-heading">
          <ProjectList
            projects={sections.projects}
            className="grid gap-6 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="portrait">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </ArcadePanel>
      </LevelScene>

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
  const { musician, bands } = sections

  return (
    <>
      <LightningLine />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <ArcadePanel accent="p2" title="Bands" id="bands-heading">
          <p className={`mb-6 ${LEAD}`}>
            {drumsSince(musician)}
          </p>
          <BandList
            bands={bands}
            className="grid gap-6 md:grid-cols-3"
            renderBand={(slot) => (
              <SceneItem kind="portrait">
                <BandCard {...slot} />
              </SceneItem>
            )}
          />
          <p className="mt-6 text-sm italic text-[color:var(--fs-gold)]">{musician.line}</p>
        </ArcadePanel>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <RoundWins />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <ArcadePanel accent="p2" title="Muay Thai" id="muay-thai-heading">
          <h3 className={`mb-6 text-xl uppercase ${look.display} ${look.roundCall}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-4 mb-6',
              fact: 'px-4 py-3 border-l-4 border-[color:var(--fs-orange)] bg-[#ff8a1f]/10',
              term: `text-sm uppercase text-[color:var(--fs-gold)] ${look.display}`,
              value: 'text-sm mt-1 text-white',
              achievements: 'space-y-3',
              achievement: 'text-sm text-white',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="portrait">
                <p className="flex items-start gap-3 border border-[color:var(--fs-steel)] bg-[color:var(--fs-panel)] p-3">
                  <HitSpark />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </ArcadePanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
