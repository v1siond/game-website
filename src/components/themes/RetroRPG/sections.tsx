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
import { BandCard, CompanyCard, ExperienceCard, ItemBag, ProjectCard } from './cards'
import { SectionHeader, Window } from './panels'
import { PIXEL } from './palette'
import { Lane, SceneItem } from './scenes'
import { drumsSince } from '@/components/cv/sectionText'

// Each profession's sections, and only those. About, Tech Stack and Ventures fade in; Experience,
// Featured Work, Bands and the Muay Thai record are overworld levels he crosses, each entry arriving as
// part of the level.

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="px-4 py-8 sm:px-6" aria-label={label}>
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <Block label="About">
          <SectionHeader title="About" />
          <Window>
            <p className="text-sm leading-relaxed text-[color:var(--rpg-text)]">{professionalSummary.bio}</p>
          </Window>
        </Block>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Block label="Work experience">
            <Lane profession="engineer" zone="record" />
            <SectionHeader title="Work experience" />
            <ul className="space-y-4">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="dialogue">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </Block>
        </LevelScene>
      )}

      <FadeInScene>
        <Block label="Tech stack">
          <SectionHeader title="Tech stack" />
          <Window>
            <ItemBag categories={sections.techStack} />
          </Window>
        </Block>
      </FadeInScene>

      <LevelScene>
        <Block label="Projects">
          <Lane profession="engineer" zone="work" />
          <SectionHeader title="Featured work" />
          <ProjectList
            projects={sections.projects}
            className="grid gap-4 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="menu">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </Block>
      </LevelScene>

      <FadeInScene>
        <Block label="Ventures">
          <SectionHeader title="Ventures" />
          <div className="grid gap-4 md:grid-cols-3">
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

  return (
    <LevelScene>
      <Block label="Bands">
        <Lane profession="drummer" zone="record" />
        <SectionHeader title="Bands" />
        <p className="mb-4 text-sm text-[color:var(--rpg-text)]">
          {drumsSince(musician)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-4 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="menu">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className="mt-4 text-sm text-[color:var(--rpg-muted)]">{musician.line}</p>
      </Block>
    </LevelScene>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <LevelScene>
      <Block label="Muay Thai">
        <Lane profession="fighter" zone="record" />
        <SectionHeader title="Muay Thai" />
        <Window>
          <h3 className={`mb-4 text-sm uppercase tracking-wide text-[color:var(--rpg-gold)] ${PIXEL}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-4 grid gap-3 sm:grid-cols-2',
              fact: 'border-2 border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] p-3',
              term: 'text-sm uppercase tracking-widest text-[color:var(--rpg-gold)]',
              value: 'mt-2 text-sm leading-relaxed text-[color:var(--rpg-text)]',
              achievements: 'space-y-3',
              achievement: 'text-sm text-[color:var(--rpg-green)]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="dialogue">
                <p className="flex items-start gap-2 border-2 border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] p-2">
                  <span className="text-[color:var(--rpg-gold)]" aria-hidden="true">
                    ★
                  </span>
                  {achievement}
                </p>
              </SceneItem>
            )}
          />
        </Window>
      </Block>
    </LevelScene>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
