'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { PathBreak } from './art'
import { MapPanel, OpenSection } from './panels'
import { BandCard, CompanyCard, ExperienceCard, Marker, ProjectCard, TechStack } from './cards'
import { SceneItem, Strip } from './scenes'
import world from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Featured
// Work, Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.

const LEAD = 'text-base text-[var(--soul-text-soft)]'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <MapPanel title={titles.about}>
          <p className={`leading-relaxed ${LEAD}`}>{professionalSummary.bio}</p>
        </MapPanel>
      </FadeInScene>

      <PathBreak />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <OpenSection title={titles.workExperience}>
            <ul className="space-y-6">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="room">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </OpenSection>
        </LevelScene>
      )}

      <PathBreak />

      <FadeInScene>
        <MapPanel title={titles.techStack}>
          <TechStack categories={sections.techStack} />
        </MapPanel>
      </FadeInScene>

      <PathBreak />

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <OpenSection title={titles.featuredWork}>
          <ProjectList
            projects={sections.projects}
            className="grid gap-6 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="find">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </OpenSection>
      </LevelScene>

      <PathBreak />

      <FadeInScene>
        <OpenSection title={titles.ventures}>
          <ul className="grid gap-4 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyCard company={company} />
              </li>
            ))}
          </ul>
        </OpenSection>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <>
      <PathBreak />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <OpenSection title={titles.bands}>
          <p className={`mb-6 ${LEAD}`}>
            {drumsSince(musician, years)}
          </p>
          <BandList
            bands={bands}
            className="grid gap-6 md:grid-cols-3"
            renderBand={(slot) => (
              <SceneItem kind="find">
                <BandCard {...slot} />
              </SceneItem>
            )}
          />
          <p className={`mt-6 italic ${LEAD}`}>{musician.line}</p>
        </OpenSection>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { sections: titles } = useLabels()

  return (
    <>
      <PathBreak />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <MapPanel title={titles.muayThai}>
          <h3 className={`mb-4 text-lg uppercase text-[var(--soul-text)] ${world.lettering}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-5 grid gap-3 sm:grid-cols-2',
              fact: `p-3 ${world.card}`,
              term: `text-sm uppercase text-[var(--soul-lantern)] ${world.lettering}`,
              value: 'mt-1 text-sm text-[var(--soul-text)]',
              achievements: 'space-y-3',
              achievement: 'text-sm text-[var(--soul-text-soft)]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="room">
                <p className={`flex items-start gap-2 p-3 ${world.card}`}>
                  <Marker color="bg-[var(--soul-ember)]" />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </MapPanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
