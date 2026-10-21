'use client'

import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useCVData } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { PhosphorFrame, RustedPanel, ShelterPanel, WornDocumentPanel } from './panels'
import { RocketArt, ShelterArt, SkylineArt } from './art'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackTerminal } from './cards'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import { Lane, SceneItem } from './scenes'
import { drumsSince } from '@/components/cv/sectionText'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Projects, Bands and the Muay Thai record are shelter levels he crosses, each entry arriving as part of
// the level.

export const SECTION_WRAP = 'relative z-20 py-6 px-4 md:px-6'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <WornDocumentPanel title="About">
              <p className="font-mono text-base leading-relaxed text-atomic-phosphor">
                {professionalSummary.bio}
              </p>
            </WornDocumentPanel>
          </div>
        </div>
      </FadeInScene>

      <ShelterArt />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <div className={SECTION_WRAP}>
            <div className="max-w-4xl mx-auto">
              <Lane profession="engineer" zone="record" />
              <RustedPanel title="Work Experience">
                <ul className="space-y-4 pl-2">
                  {sections.jobs.map((entry) => (
                    <li key={entry.id}>
                      <SceneItem kind="file">
                        <ExperienceCard entry={entry} />
                      </SceneItem>
                    </li>
                  ))}
                </ul>
              </RustedPanel>
            </div>
          </div>
        </LevelScene>
      )}

      <SkylineArt />

      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <PhosphorFrame title="Tech Stack">
              <TechStackTerminal categories={sections.techStack} />
            </PhosphorFrame>
          </div>
        </div>
      </FadeInScene>

      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="engineer" zone="work" />
            <RustedPanel title="Projects">
              <ProjectList
                projects={sections.projects}
                className="grid md:grid-cols-2 gap-4"
                renderProject={(slot) => (
                  <SceneItem kind="screen">
                    <ProjectCard {...slot} />
                  </SceneItem>
                )}
              />
            </RustedPanel>
          </div>
        </div>
      </LevelScene>

      <RocketArt />

      <FadeInScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <ShelterPanel title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </ShelterPanel>
          </div>
        </div>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <RocketArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="drummer" zone="record" />
            <RustedPanel title="Bands">
              <p className="mb-4 font-mono text-base text-atomic-phosphor">
                {drumsSince(musician)}
              </p>
              <BandList
                bands={bands}
                className="grid md:grid-cols-3 gap-4"
                renderBand={(slot) => (
                  <SceneItem kind="screen">
                    <BandCard {...slot} />
                  </SceneItem>
                )}
              />
              <p className="mt-4 font-mono text-sm italic text-atomic-amber">
                {musician.line}
              </p>
            </RustedPanel>
          </div>
        </div>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <SkylineArt />
      <LevelScene>
        <div className={SECTION_WRAP}>
          <div className="max-w-4xl mx-auto">
            <Lane profession="fighter" zone="record" />
            <PhosphorFrame title="Muay Thai">
              <h3 className="mb-4 font-mono text-lg font-bold uppercase tracking-wide text-atomic-yellow">
                {martialArts.primary.title}
              </h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid md:grid-cols-2 gap-3 mb-5 font-mono',
                  fact: 'p-3 border border-atomic-phosphor/30 bg-atomic-phosphor/5',
                  term: 'text-sm tracking-wider uppercase text-atomic-yellow',
                  value: 'text-sm mt-1 text-atomic-phosphor',
                  achievements: 'space-y-2 pl-2 font-mono',
                  achievement: 'text-sm text-atomic-phosphor',
                }}
                renderAchievement={(achievement) => (
                  <SceneItem kind="file">
                    <p className="flex items-start gap-2 border border-atomic-phosphor/30 bg-atomic-ink p-2">
                      <span className="text-atomic-amber" aria-hidden="true">
                        +
                      </span>
                      <span>{achievement}</span>
                    </p>
                  </SceneItem>
                )}
              />
            </PhosphorFrame>
          </div>
        </div>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
