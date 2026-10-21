'use client'

import type { ReactNode } from 'react'
import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import { TrailPanel } from './panels'
import { BandFind, CampCard, ExplorerPack, JourneyEntry, ProjectFind } from './cards'
import { JOURNAL_SERIF } from './palette'
import { Lane, SceneItem } from './scenes'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Projects, Bands and the Muay Thai record are trail levels he travels, each entry arriving as part of
// the level.

function Leg({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">{children}</div>
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <Leg>
          <TrailPanel title="About" tone="journal">
            <p className="text-base leading-relaxed">{professionalSummary.bio}</p>
          </TrailPanel>
        </Leg>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Leg>
            <Lane profession="engineer" zone="record" />
            <TrailPanel title="Work Experience" tone="journal">
              <ul className="space-y-4 pl-5">
                {sections.jobs.map((entry) => (
                  <li key={entry.id}>
                    <SceneItem kind="stop">
                      <JourneyEntry entry={entry} />
                    </SceneItem>
                  </li>
                ))}
              </ul>
            </TrailPanel>
          </Leg>
        </LevelScene>
      )}

      <FadeInScene>
        <Leg>
          <TrailPanel title="Tech Stack" tone="journal">
            <ExplorerPack categories={sections.techStack} />
          </TrailPanel>
        </Leg>
      </FadeInScene>

      <LevelScene>
        <Leg>
          <Lane profession="engineer" zone="work" />
          <TrailPanel title="Projects" tone="canopy">
            <ProjectList
              projects={sections.projects}
              className="grid gap-4 md:grid-cols-2"
              renderProject={(slot) => (
                <SceneItem kind="find">
                  <ProjectFind {...slot} />
                </SceneItem>
              )}
            />
          </TrailPanel>
        </Leg>
      </LevelScene>

      <FadeInScene>
        <Leg>
          <TrailPanel title="Ventures" tone="canopy">
            <div className="grid gap-4 md:grid-cols-3">
              {sections.companies.map((company) => (
                <CampCard key={company.id} company={company} />
              ))}
            </div>
          </TrailPanel>
        </Leg>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <LevelScene>
      <Leg>
        <Lane profession="drummer" zone="record" />
        <TrailPanel title="Bands" tone="canopy">
          <p className="mb-4 text-base">
            Drums since {musician.since}, {musician.yearsPlaying} years
          </p>
          <BandList
            bands={bands}
            className="grid gap-4 md:grid-cols-3"
            renderBand={(slot) => (
              <SceneItem kind="find">
                <BandFind {...slot} />
              </SceneItem>
            )}
          />
          <p className="mt-4 text-sm italic text-[color:var(--ap-gold)]">{musician.line}</p>
        </TrailPanel>
      </Leg>
    </LevelScene>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <LevelScene>
      <Leg>
        <Lane profession="fighter" zone="record" />
        <TrailPanel title="Muay Thai" tone="canopy">
          <h3 className={`mb-4 text-lg font-bold text-[color:var(--ap-gold)] ${JOURNAL_SERIF}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-5 grid gap-3 md:grid-cols-2',
              fact: 'rounded-sm border border-[color:var(--ap-moss)] bg-[color:var(--ap-night)] p-3',
              term: 'text-sm font-bold uppercase tracking-wider text-[color:var(--ap-gold)]',
              value: 'mt-1 text-sm text-[color:var(--ap-parchment)]',
              achievements: 'space-y-3 pl-5',
              achievement: 'text-sm',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="stop">
                <p className="rounded-sm border-l-4 border-[color:var(--ap-route)] bg-[color:var(--ap-page)] p-3 text-[color:var(--ap-ink)]">
                  {achievement}
                </p>
              </SceneItem>
            )}
          />
        </TrailPanel>
      </Leg>
    </LevelScene>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
