'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { BandCard, ChamberPanel, ExperienceCard, ProjectCard, TechCategoryList, VentureCard } from './cards'
import { LevelScene } from '@/components/scroll/stage'
import { Lane, SceneItem } from './scenes'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Experience, Projects, Bands
// and the Muay Thai record are levels he crosses, each entry arriving as part of the level.

function EngineerChambers({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <ChamberPanel title="About">
          <p className="text-sm leading-relaxed text-[#edebe4]">{professionalSummary.bio}</p>
        </ChamberPanel>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Lane profession="engineer" zone="record" />
          <ChamberPanel title="Work Experience">
            <ul className="space-y-4 pl-2">
              {sections.jobs.map((entry, i) => (
                <li key={entry.id}>
                  <SceneItem kind="portal">
                    <ExperienceCard entry={entry} index={i} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </ChamberPanel>
        </LevelScene>
      )}

      <FadeInScene>
        <ChamberPanel title="Tech Stack">
          <TechCategoryList categories={sections.techStack} />
        </ChamberPanel>
      </FadeInScene>

      <LevelScene>
        <Lane profession="engineer" zone="work" />
        <ChamberPanel title="Projects">
          <ProjectList
            projects={sections.projects}
            className="grid gap-4 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="tear">
                <ProjectCard slot={slot} index={sections.projects.indexOf(slot.project)} />
              </SceneItem>
            )}
          />
        </ChamberPanel>
      </LevelScene>

      <FadeInScene>
        <ChamberPanel title="Ventures">
          <ul className="grid gap-4 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <VentureCard company={company} />
              </li>
            ))}
          </ul>
        </ChamberPanel>
      </FadeInScene>
    </>
  )
}

function MusicianChambers({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <LevelScene>
      <Lane profession="drummer" zone="record" />
      <ChamberPanel title="Bands">
        <p className="mb-4 text-sm text-[#edebe4]">
          {drumsSince(musician)}
        </p>
        <BandList
          bands={bands}
          className="grid gap-4 md:grid-cols-3"
          renderBand={(slot) => (
            <SceneItem kind="tear">
              <BandCard {...slot} />
            </SceneItem>
          )}
        />
        <p className="mt-4 text-sm italic text-[#00a2ff]">{musician.line}</p>
      </ChamberPanel>
    </LevelScene>
  )
}

function MartialArtistChambers({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <LevelScene>
      <Lane profession="fighter" zone="record" />
      <ChamberPanel title="Muay Thai">
        <h3 className="mb-4 text-base uppercase tracking-wider text-[#ff9a00]">{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-6',
            fact: 'p-3 border border-[#00a2ff]/30 bg-[#00a2ff]/5',
            term: 'text-sm tracking-wider uppercase text-[#00a2ff]',
            value: 'text-sm mt-1 text-[#edebe4]',
            achievements: 'space-y-3 pl-2',
            achievement: 'text-sm text-[#edebe4]',
          }}
          renderAchievement={(achievement) => (
            <SceneItem kind="portal">
              <p className="flex items-start gap-2 bg-[#12111c] p-3">
                <span className="text-[#ff9a00]" aria-hidden="true">
                  &gt;
                </span>
                {achievement}
              </p>
            </SceneItem>
          )}
        />
      </ChamberPanel>
    </LevelScene>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerChambers,
  drummer: MusicianChambers,
  fighter: MartialArtistChambers,
}
