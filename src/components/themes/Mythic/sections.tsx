'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { SectionBreak } from './art'
import { Inscription, MarblePanel, SectionTitle } from './panels'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackBoard } from './cards'
import { SceneItem, Strip } from './scenes'
import world from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Featured
// Work, Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.
// A line of text outside a marble slab sits on a black plaque, so it reads on the sky and on the sea.

const LEAD = `inline-block px-3 py-1 text-base ${world.plaque}`

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <>
      <FadeInScene>
        <Inscription label={titles.about}>
          <p className="text-base leading-relaxed text-[color:var(--myth-ink)]">{professionalSummary.bio}</p>
        </Inscription>
      </FadeInScene>

      <SectionBreak kind="key" />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <MarblePanel title={titles.workExperience}>
            <ul className="space-y-8">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="stele">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </MarblePanel>
        </LevelScene>
      )}

      <SectionBreak kind="wave" />

      <FadeInScene>
        <MarblePanel title={titles.techStack}>
          <TechStackBoard categories={sections.techStack} />
        </MarblePanel>
      </FadeInScene>

      <SectionBreak kind="key" />

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <SectionTitle>{titles.featuredWork}</SectionTitle>
        <ProjectList
          projects={sections.projects}
          className="grid gap-8 md:grid-cols-2"
          renderProject={(slot) => (
            <SceneItem kind="frieze">
              <ProjectCard {...slot} />
            </SceneItem>
          )}
        />
      </LevelScene>

      <SectionBreak kind="wave" />

      <FadeInScene>
        <SectionTitle>{titles.ventures}</SectionTitle>
        <ul className="grid gap-6 md:grid-cols-3">
          {sections.companies.map((company) => (
            <li key={company.id}>
              <CompanyCard company={company} />
            </li>
          ))}
        </ul>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <>
      <SectionBreak kind="key" />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <SectionTitle>{titles.bands}</SectionTitle>
        <p className={`mb-6 ${LEAD}`}>
          {drumsSince(musician, years)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-6 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="frieze">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className={`mt-6 italic ${LEAD}`}>{musician.line}</p>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { sections: titles } = useLabels()

  return (
    <>
      <SectionBreak kind="wave" />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <MarblePanel title={titles.muayThai}>
          <h3 className={`mb-4 text-xl ${world.carved}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-5 grid gap-3 sm:grid-cols-2',
              fact: `px-4 py-3 ${world.block}`,
              term: `text-sm text-[color:var(--myth-aegean)] ${world.carved}`,
              value: 'mt-1 text-sm text-[color:var(--myth-ink)]',
              achievements: 'space-y-3',
              achievement: 'text-sm text-[color:var(--myth-ink)]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="stele">
                <p className={`flex items-start gap-2 p-3 ${world.block}`}>
                  <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rotate-45 bg-[var(--myth-terracotta)]" aria-hidden="true" />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </MarblePanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
