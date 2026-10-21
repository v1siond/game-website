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
import { ComicPanel, SectionBanner, SpeechBubble } from './panels'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechStackCloud } from './cards'
import { SceneItem, Strip } from './scenes'
import world from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Featured
// Work, Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.

const LEAD = `text-center text-base font-bold ${world.copy}`

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <SpeechBubble label="About">
          <p className={`text-base leading-relaxed ${world.copy}`}>{professionalSummary.bio}</p>
        </SpeechBubble>
      </FadeInScene>

      <SectionBreak kind="burst" />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <ComicPanel title="Work Experience" accent="orange">
            <ul className="space-y-8">
              {sections.jobs.map((entry, index) => (
                <li key={entry.id}>
                  <SceneItem kind="slam">
                    <ExperienceCard entry={entry} index={index} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </ComicPanel>
        </LevelScene>
      )}

      <SectionBreak kind="streaks" />

      <FadeInScene>
        <ComicPanel title="Tech Stack" accent="sky">
          <TechStackCloud categories={sections.techStack} />
        </ComicPanel>
      </FadeInScene>

      <SectionBreak kind="burst" />

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <SectionBanner accent="sun">Featured Work</SectionBanner>
        <ProjectList
          projects={sections.projects}
          className="grid gap-8 md:grid-cols-2"
          renderProject={(slot) => (
            <SceneItem kind="swipe">
              <ProjectCard {...slot} index={sections.projects.indexOf(slot.project)} />
            </SceneItem>
          )}
        />
      </LevelScene>

      <SectionBreak kind="streaks" />

      <FadeInScene>
        <SectionBanner accent="magenta">Ventures</SectionBanner>
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
      <SectionBreak kind="burst" />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <SectionBanner accent="magenta">Bands</SectionBanner>
        <p className={`mb-6 ${LEAD}`}>
          {drumsSince(musician)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-6 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="swipe">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className={`mt-6 ${LEAD}`}>{musician.line}</p>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <SectionBreak kind="burst" />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <ComicPanel title="Muay Thai" accent="orange">
          <h3 className="mb-4 text-xl tracking-wide">{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: `grid sm:grid-cols-2 gap-3 mb-5 ${world.copy}`,
              fact: `p-3 bg-white border-[3px] border-[#141414] ${world.drop}`,
              term: 'text-sm font-black tracking-wider uppercase text-[#141414]',
              value: 'text-sm mt-1 text-[#141414]',
              achievements: `space-y-3 ${world.copy}`,
              achievement: 'text-sm font-bold text-[#141414]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="slam">
                <p className={`flex items-start gap-2 p-3 ${world.card}`}>
                  <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rotate-45 bg-[#e2362c]" aria-hidden="true" />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </ComicPanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
