'use client'

import { useState } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { DoorBreak, SaveRoomBreak } from './art'
import { BandCard, CompanyCard, ExperienceCard, Mark, ProjectFile, TechCloud } from './cards'
import { PaperPanel } from './panels'
import { SceneItem, Strip } from './scenes'
import look from './world.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Projects,
// Bands and the Muay Thai record are rooms he crosses, each entry arriving as part of the room. The
// save room and the door transition sit between them.

const LEAD = 'text-base leading-relaxed text-[color:var(--sh-cream)]'

function useOpenFiles() {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set())
  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  return { isOpen: (id: string) => open.has(id), toggle }
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()
  const files = useOpenFiles()

  return (
    <>
      <FadeInScene>
        <PaperPanel title={titles.about}>
          <p className={LEAD}>{professionalSummary.bio}</p>
        </PaperPanel>
      </FadeInScene>

      <SaveRoomBreak />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <PaperPanel title={titles.workExperience}>
            <ul className="space-y-4">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="document">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </PaperPanel>
        </LevelScene>
      )}

      <DoorBreak />

      <FadeInScene>
        <PaperPanel title={titles.techStack}>
          <TechCloud categories={sections.techStack} />
        </PaperPanel>
      </FadeInScene>

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <PaperPanel title={titles.projects}>
          <ProjectList
            projects={sections.projects}
            className="grid gap-4 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="item">
                <ProjectFile slot={slot} isOpen={files.isOpen(slot.project.id)} onToggle={() => files.toggle(slot.project.id)} />
              </SceneItem>
            )}
          />
        </PaperPanel>
      </LevelScene>

      <SaveRoomBreak />

      <FadeInScene>
        <PaperPanel title={titles.ventures}>
          <ul className="grid gap-4 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyCard company={company} />
              </li>
            ))}
          </ul>
        </PaperPanel>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections
  const { sections: titles, years } = useLabels()

  return (
    <>
      <DoorBreak />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <PaperPanel title={titles.bands}>
          <p className={`mb-4 ${LEAD}`}>
            {drumsSince(musician, years)}
          </p>
          <BandList
            bands={bands}
            className="grid gap-4 md:grid-cols-3"
            renderBand={(slot) => (
              <SceneItem kind="item">
                <BandCard {...slot} />
              </SceneItem>
            )}
          />
          <p className="mt-4 text-sm italic text-[color:var(--sh-cream)]">{musician.line}</p>
        </PaperPanel>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { sections: titles } = useLabels()

  return (
    <>
      <DoorBreak />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <PaperPanel title={titles.muayThai}>
          <h3 className={`mb-4 text-base text-[color:var(--sh-flame)] ${look.typed}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'mb-4 grid gap-3 sm:grid-cols-2',
              fact: 'border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] p-3',
              term: `text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`,
              value: 'mt-1 text-sm text-[color:var(--sh-cream)]',
              achievements: 'space-y-2',
              achievement: 'text-sm text-[color:var(--sh-cream)]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="item">
                <p className={`flex items-start gap-2 p-3 ${look.file}`}>
                  <Mark />
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </PaperPanel>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
