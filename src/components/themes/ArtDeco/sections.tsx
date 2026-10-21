'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { LevelScene } from '@/components/scroll/stage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtDecoChevron, ArtDecoFan, ArtDecoSunburst, GoldFrame } from './frames'
import { BandCard, CARD_TITLE, CompanyCard, ExperienceCard, ProjectCard, TechCloud } from './cards'
import { SceneItem, Strip } from './scenes'

// The picked profession's sections. About, Tech Stack and Ventures fade in; Work Experience, Projects,
// Bands and the Muay Thai record are levels he crosses, each entry arriving as part of the level.

const LEAD = 'text-center text-base text-[#e8e0d0]'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <GoldFrame title="About">
          <p className={`leading-relaxed ${LEAD}`}>{professionalSummary.bio}</p>
        </GoldFrame>
      </FadeInScene>

      <ArtDecoSunburst />

      {sections.jobs.length > 0 && (
        <LevelScene>
          <Strip profession="engineer" zone="record" />
          <GoldFrame title="Work Experience">
            <ul className="space-y-6">
              {sections.jobs.map((entry) => (
                <li key={entry.id}>
                  <SceneItem kind="bulkhead">
                    <ExperienceCard entry={entry} />
                  </SceneItem>
                </li>
              ))}
            </ul>
          </GoldFrame>
        </LevelScene>
      )}

      <ArtDecoChevron />

      <FadeInScene>
        <GoldFrame title="Tech Stack">
          <TechCloud categories={sections.techStack} />
        </GoldFrame>
      </FadeInScene>

      <ArtDecoFan />

      <LevelScene>
        <Strip profession="engineer" zone="work" />
        <GoldFrame title="Projects">
          <ProjectList
            projects={sections.projects}
            className="grid gap-6 md:grid-cols-2"
            renderProject={(slot) => (
              <SceneItem kind="poster">
                <ProjectCard {...slot} />
              </SceneItem>
            )}
          />
        </GoldFrame>
      </LevelScene>

      <ArtDecoSunburst />

      <FadeInScene>
        <GoldFrame title="Ventures">
          <ul className="grid gap-5 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyCard company={company} />
              </li>
            ))}
          </ul>
        </GoldFrame>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtDecoSunburst />
      <LevelScene>
        <Strip profession="drummer" zone="record" />
        <GoldFrame title="Bands">
          <p className={`mb-5 ${LEAD}`}>
            Drums since {musician.since}, {musician.yearsPlaying} years
          </p>
          <BandList
            bands={bands}
            className="grid gap-6 md:grid-cols-2"
            renderBand={(slot) => (
              <SceneItem kind="poster">
                <BandCard {...slot} />
              </SceneItem>
            )}
          />
          <p className="mt-5 text-center text-sm italic text-[#D4AF37]">{musician.line}</p>
        </GoldFrame>
      </LevelScene>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtDecoSunburst />
      <LevelScene>
        <Strip profession="fighter" zone="record" />
        <GoldFrame title="Muay Thai">
          <h3 className={`mb-6 text-center text-xl ${CARD_TITLE}`}>{martialArts.primary.title}</h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-4 mb-6',
              fact: 'p-4 border border-[#D4AF37]/50 bg-[#0d1f2d]/80',
              term: 'text-sm tracking-[0.2em] uppercase text-[#D4AF37]',
              value: 'text-sm mt-1 text-[#F5E6C8]',
              achievements: 'space-y-4',
              achievement: 'text-sm text-[#F5E6C8]',
            }}
            renderAchievement={(achievement) => (
              <SceneItem kind="poster">
                <p className="flex items-start gap-2 border border-[#D4AF37]/30 bg-[#05101a]/80 p-3">
                  <span className="text-[#D4AF37]" aria-hidden="true">
                    {'>'}
                  </span>
                  <span>{achievement}</span>
                </p>
              </SceneItem>
            )}
          />
        </GoldFrame>
      </LevelScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
