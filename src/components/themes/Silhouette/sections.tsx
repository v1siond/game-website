'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import { BandCard, CompanyCard, ExperienceCard, Panel, ProjectCard, SectionHeader, TechCloud } from './cards'
import { Lane, SceneItem } from './scenes'
import { drumsSince } from '@/components/cv/sectionText'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Featured Work, Bands and the Muay Thai record are silhouette levels he walks, each entry arriving as
// part of the level.

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="px-4 py-8 sm:px-6" aria-label={label}>
      <div className="mx-auto max-w-2xl">{children}</div>
    </section>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <Block label={titles.about}>
          <SectionHeader title={titles.about.toLowerCase()} />
          <Panel>
            <p className="text-sm leading-relaxed text-[color:var(--sh-muted)]">{professionalSummary.bio}</p>
          </Panel>
        </Block>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Block label={titles.workExperience}>
            <Lane profession="engineer" zone="record" />
            <SectionHeader title={titles.workExperience.toLowerCase()} />
            <ul className="space-y-3">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="fog">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </Block>
        </LevelScene>
      )}

      <FadeInScene>
        <Block label={titles.techStack}>
          <SectionHeader title={titles.techStack.toLowerCase()} />
          <Panel>
            <TechCloud categories={sections.techStack} />
          </Panel>
        </Block>
      </FadeInScene>

      <LevelScene>
        <Block label={titles.projects}>
          <Lane profession="engineer" zone="work" />
          <SectionHeader title={titles.featuredWork.toLowerCase()} />
          <ProjectList
            projects={sections.projects}
            className="grid gap-4 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="light">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </Block>
      </LevelScene>

      <FadeInScene>
        <Block label={titles.ventures}>
          <SectionHeader title={titles.ventures.toLowerCase()} />
          <div className="grid gap-3 md:grid-cols-3">
            {sections.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </Block>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <LevelScene>
      <Block label={titles.bands}>
        <Lane profession="drummer" zone="record" />
        <SectionHeader title={titles.bands.toLowerCase()} />
        <p className="mb-4 text-center text-sm text-[color:var(--sh-muted)]">
          {drumsSince(musician, years)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-3 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="light">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className="mt-4 text-center text-sm italic text-[color:var(--sh-muted)]">{musician.line}</p>
      </Block>
    </LevelScene>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { sections: titles } = useLabels()

  return (
    <LevelScene>
      <Block label={titles.muayThai}>
        <Lane profession="fighter" zone="record" />
        <SectionHeader title={titles.muayThai.toLowerCase()} />
        <Panel>
          <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-heading)]">{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-4 grid gap-3 sm:grid-cols-2',
              fact: 'border-l-2 border-[color:var(--sh-black)] bg-[color:var(--sh-panel)] p-3',
              term: 'text-sm uppercase tracking-[0.25em] text-[color:var(--sh-dim)]',
              value: 'mt-1 text-sm text-[color:var(--sh-text)]',
              achievements: 'space-y-2',
              achievement: 'text-sm text-[color:var(--sh-muted)]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="fog">
                <p className="flex items-start gap-1.5 border-l-2 border-[color:var(--sh-rim)] bg-[color:var(--sh-night)] p-2">
                  <span className="text-[color:var(--sh-dim)]" aria-hidden="true">
                    -
                  </span>
                  {achievement}
                </p>
              </SceneItem>
            )}
          />
        </Panel>
      </Block>
    </LevelScene>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
