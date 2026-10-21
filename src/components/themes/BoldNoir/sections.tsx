'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { SectionBreak } from './backdrop'
import { Narration, NoirPanel, SectionTitle } from './panels'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackBoard } from './cards'
import { SceneItem, Strip } from './scenes'
import world from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Featured
// Work, Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.

const LEAD = `text-base text-[#d6d3cb] ${world.copy}`

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <Narration label="About">
          <p className={`text-base leading-relaxed ${world.typed}`}>{professionalSummary.bio}</p>
        </Narration>
      </FadeInScene>

      <SectionBreak kind="lamp" />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <NoirPanel title="Work Experience">
            <ul className="space-y-8">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="panel">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </NoirPanel>
        </LevelScene>
      )}

      <SectionBreak kind="blinds" />

      <FadeInScene>
        <NoirPanel title="Tech Stack">
          <TechStackBoard categories={sections.techStack} />
        </NoirPanel>
      </FadeInScene>

      <SectionBreak kind="lamp" />

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <SectionTitle>Featured Work</SectionTitle>
        <ProjectList
          projects={sections.projects}
          className="grid gap-8 md:grid-cols-2"
          renderProject={(slot) => (
            <SceneItem kind="photo">
              <ProjectCard {...slot} />
            </SceneItem>
          )}
        />
      </LevelScene>

      <SectionBreak kind="blinds" />

      <FadeInScene>
        <SectionTitle>Ventures</SectionTitle>
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

  return (
    <>
      <SectionBreak kind="lamp" />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <SectionTitle>Bands</SectionTitle>
        <p className={`mb-6 ${LEAD}`}>
          {drumsSince(musician)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-6 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="photo">
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

  return (
    <>
      <SectionBreak kind="blinds" />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <NoirPanel title="Muay Thai">
          <h3 className="mb-4 text-2xl tracking-wide">{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: `mb-5 grid gap-3 sm:grid-cols-2 ${world.copy}`,
              fact: 'border-l-4 border-[#ff0033] bg-[#0a0a0a] px-4 py-3',
              term: `text-sm font-bold uppercase tracking-widest text-[#a3a3a3] ${world.typed}`,
              value: 'mt-1 text-sm text-[#f2efe6]',
              achievements: `space-y-3 ${world.copy}`,
              achievement: 'text-sm text-[#f2efe6]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="panel">
                <p className={`flex items-start gap-2 p-3 ${world.card}`}>
                  <span className="mt-1.5 block h-2 w-2 flex-shrink-0 bg-[#ff0033]" aria-hidden="true" />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </NoirPanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
